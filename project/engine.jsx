// engine.jsx — shared state, SRS logic, session engine
// Exposes: useStore(), SESSION_SIZES, buildDeck(), normalizeAnswer()

const STORAGE_KEY = "irish-flashcards-v1";
const SESSION_SIZES = [10, 20, 50];

// --- helpers ---
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  const A = new Date(a), B = new Date(b);
  return Math.round((B - A) / 86400000);
}

// Normalize for answer comparison: strip accents, lowercase, collapse spaces
function normalizeAnswer(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance — small, iterative implementation for typo tolerance
function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

// Fuzzy: 1 typo allowed for words >=4 letters, 0 for short words
function fuzzyMatch(typed, target) {
  if (!typed || !target) return false;
  if (typed === target) return true;
  const tol = target.length >= 5 ? 1 : 0;
  return editDistance(typed, target) <= tol;
}

// Check if a typed answer matches ANY of the slashed alternatives in a gloss
function matchEnglish(typed, gloss) {
  const t = normalizeAnswer(typed);
  if (!t) return false;
  // gloss like "give / bring" -> ["give", "bring"]
  const alts = gloss.split("/").map(a =>
    normalizeAnswer(a.replace(/\([^)]*\)/g, "")) // strip parenthetical hints
  ).filter(Boolean);
  return alts.some(a =>
    fuzzyMatch(t, a) ||
    fuzzyMatch(t, `to ${a}`) ||
    fuzzyMatch(`to ${t}`, a)
  );
}
function matchIrish(typed, irish) {
  return fuzzyMatch(normalizeAnswer(typed), normalizeAnswer(irish));
}

const DEFAULT_STATE = {
  words: {}, // n -> { m: 0|1|2|3 (new/learning/known/mastered), seen: n, correct: n, lastSeen: iso, dueIn: days }
  streak: { count: 0, last: null }, // last studied date
  prefs: { theme: "a" }, // a or b (not currently used globally, each variation is independent)
  lastSessionAt: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed, words: parsed.words || {} };
  } catch (e) {
    return { ...DEFAULT_STATE };
  }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
}

// SRS: easy / hard / again — updates mastery & dueIn
function applyRating(word, rating) {
  const w = word || { m: 0, seen: 0, correct: 0, dueIn: 0 };
  const next = { ...w };
  next.seen = (w.seen || 0) + 1;
  next.lastSeen = todayISO();
  if (rating === "again") {
    next.m = 0;
    next.dueIn = 0;
  } else if (rating === "hard") {
    next.correct = (w.correct || 0) + 1;
    next.m = Math.min(2, (w.m || 0) + (w.m === 0 ? 1 : 0));
    next.dueIn = 1;
  } else if (rating === "easy") {
    next.correct = (w.correct || 0) + 1;
    next.m = Math.min(3, (w.m || 0) + 1);
    next.dueIn = w.m >= 2 ? 7 : 3;
  } else if (rating === "correct") {
    next.correct = (w.correct || 0) + 1;
    next.m = Math.min(3, (w.m || 0) + 1);
    next.dueIn = w.m >= 2 ? 5 : 2;
  } else if (rating === "wrong") {
    next.m = 0;
    next.dueIn = 0;
  }
  return next;
}

function masteryLabel(m) {
  return ["Nua", "Ag foghlaim", "Eolach", "Máistreacht"][m || 0];
}
function masteryLabelEn(m) {
  return ["New", "Learning", "Known", "Mastered"][m || 0];
}

// --- Deck building ---
// strategy: 'mix' weights unknown/learning/due.
function buildDeck(state, size, rangeStart = 0, rangeEnd = 1000) {
  const words = window.IRISH_WORDS.filter(([n]) => n > rangeStart && n <= rangeEnd);
  const scored = words.map(([n, ga, en]) => {
    const w = state.words[n] || { m: 0, seen: 0, correct: 0, dueIn: 0 };
    // priority: higher = more likely to include
    let p = 0;
    if (!w.seen) p += 3;               // new words first (but we want some learning in the mix)
    if (w.m === 1) p += 4;             // learning = highest priority
    if (w.m === 2) p += 1;             // known — occasional review
    if (w.m === 3) p += 0.2;           // mastered — rare
    p += Math.random() * 0.5;          // jitter so same-priority order varies
    return { n, ga, en, w, p };
  });
  scored.sort((a, b) => b.p - a.p);
  return scored.slice(0, size);
}

// Shared React store hook
function useStore() {
  const [state, setState] = React.useState(() => loadState());
  const update = React.useCallback((fn) => {
    setState(prev => {
      const next = fn(prev);
      saveState(next);
      return next;
    });
  }, []);
  // update after a session — handles streak
  const completeSession = React.useCallback(() => {
    update(prev => {
      const today = todayISO();
      const last = prev.streak.last;
      let count = prev.streak.count;
      if (last === today) {
        // already studied today, no change
      } else if (last && daysBetween(last, today) === 1) {
        count = count + 1;
      } else {
        count = 1;
      }
      return { ...prev, streak: { count, last: today }, lastSessionAt: today };
    });
  }, [update]);
  const rateWord = React.useCallback((n, rating) => {
    update(prev => {
      const cur = prev.words[n];
      const next = applyRating(cur, rating);
      return { ...prev, words: { ...prev.words, [n]: next } };
    });
  }, [update]);
  const resetAll = React.useCallback(() => {
    update(() => ({ ...DEFAULT_STATE }));
  }, [update]);
  return { state, rateWord, completeSession, resetAll, update };
}

// Stats from state
function computeStats(state) {
  let n = 0, learning = 0, known = 0, mastered = 0;
  for (const v of Object.values(state.words)) {
    n++;
    if (v.m === 1) learning++;
    else if (v.m === 2) known++;
    else if (v.m === 3) mastered++;
  }
  return {
    seen: n,
    learning,
    known: known + mastered,   // "known" for % display combines known + mastered
    mastered,
    total: 1000,
    pct: Math.round(((known + mastered) / 1000) * 100),
  };
}

// Example sentence placeholder — keeps it honest & simple
function examplePlaceholder(ga) {
  return `— ${ga} ${ga}? — ${ga}.`;
}

Object.assign(window, {
  SESSION_SIZES,
  buildDeck,
  normalizeAnswer,
  matchEnglish,
  matchIrish,
  useStore,
  computeStats,
  masteryLabel,
  masteryLabelEn,
  examplePlaceholder,
  todayISO,
});
