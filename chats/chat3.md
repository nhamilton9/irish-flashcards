# App Access Flow

_Started 2026-04-23 10:57 UTC_

---

## User

what way will this work when I select hard or don't know? How will I access this app?

## Assistant

I'll take a look at the current Irish Flashcards design to answer your questions about the interaction flow and how you'd access the app.

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

Here's how it works currently, plus how you'd use this as a desktop app:

## What happens when you tap Hard / Don't know

Under the hood (in the SRS engine):

- **Don't know (Again)** → word mastery resets to **0 (New)**, `dueIn = 0` → it comes back **in the same session** and keeps reappearing until you get it
- **Hard** → mastery bumps up one step (max "Learning"), `dueIn = 1 day` → shows again **tomorrow**
- **Easy** → mastery climbs toward "Known"/"Mastered", `dueIn = 3 or 7 days` → spaced out longer
- **Correct** (typed answer correct) → similar to Easy but slightly shorter intervals (2 or 5 days)

All progress is saved to `localStorage` under `irish-flashcards-v1`, so your streak, mastery per word, and last-session date persist between visits.

**A few things that are mocked but not wired up end-to-end yet** — worth knowing before you rely on it:
- The "session complete" screen isn't in this prototype — after the last card it currently just... ends. Needs a summary screen (X learned, Y to review tomorrow, streak +1).
- Cards you hit "Don't know" on should re-enter the queue before the session ends. That requeue logic isn't in `buildDeck` yet — deck is built once upfront.
- No way to pick session size (10/20/50) or range (1–100, 101–200, etc.) from the UI yet, even though the engine supports it.

Want me to add those?

## How you'd access this as a desktop app

Right now this is an **HTML prototype** — it runs in a browser, not a real installed app. A few paths to "desktop app":

1. **Bookmark the web version** — simplest. Deploy the HTML + JS to any static host (Netlify, GitHub Pages, Vercel) and pin it as a tab or install it as a PWA (add a manifest + service worker → "Install app" in Chrome/Safari → it gets its own dock icon and window).
2. **Wrap it in Electron or Tauri** — gives you a real `.app` / `.exe` you double-click. Tauri is lighter (~3 MB vs Electron's ~100 MB).
3. **Keep it as an iPhone mockup** — the current design is framed as an iOS app (390×810 phone frame). If the real target is iPhone, the "desktop app" framing might be a mismatch worth clarifying.

A couple questions before I change anything:

1. **Is the real target desktop, mobile, or both?** The current mockup is iPhone-shaped — if you want desktop, the layout should breathe into a wider window (keyboard shortcuts for 1/2/3 = Again/Hard/Easy, bigger type, sidebar with stats).
2. **Should I build the missing pieces** — session-complete summary, Again-requeue, session-size + range picker — into the existing prototype?
3. **Do you want me to set up a PWA manifest** so you can "install" it from the browser with one click, or go further and wrap it in Tauri for a true `.app`?

## User

1. both 2. Yes add those. What about incorrect?b3. Is there a cost associated with that?

## Assistant

Good questions. Let me answer #3 first, then plan #1 and #2.

## 3. Cost

- **PWA (bookmark-as-app)** → **Free.** Host the HTML on Netlify/Vercel/GitHub Pages free tier, click "Install" in Chrome/Safari, it lives in your dock. No cost, no account needed beyond the host.
- **Tauri / Electron wrapper** → **Free to build and run.** You'd just need a Mac to build the `.app` and a Windows machine to build the `.exe`. The only cost is if you want to *distribute* it without scary "unidentified developer" warnings: Apple Developer Program is $99/year, Windows code signing is ~$200–400/year. For personal use on your own machine, $0 — you just click through the warning once.
- **Domain** (optional) → ~$12/year if you want `namiltefocal.com` instead of `namiltefocal.netlify.app`.

**Recommendation:** start with PWA. If you outgrow it, Tauri-wrap later — same HTML, no rewrite.

## What about "Incorrect"?

Great catch. In typing mode (Variation B, or if we add it to A), the flow is:
- **Correct typed answer** → treated like "Easy-lite" (mastery +1, shows again in 2–5 days)
- **Incorrect typed answer** → treated like **"Again"** (mastery resets to 0, shows again this session)

So **Incorrect = Don't know**. But there's a nuance I think is worth adding: when you type something *close* (a typo, or you typed "bring" when the answer was "give / bring / take"), it should count as correct. The current `matchEnglish` already handles the slash-alternatives, but doesn't forgive typos. Want me to add fuzzy matching (1-char typo tolerance)?

Also — should incorrect answers give you a **"try again"** before being marked wrong, or is one-shot the right call? (Anki does one-shot; Duolingo gives you retries.)

## Plan for #1 + #2

Let me confirm scope before I build:

**Desktop layout (#1):**
- Responsive: phone mockup below ~700px, desktop layout above — same logic, wider canvas, card centered, stats sidebar visible
- Keyboard shortcuts: `1` = Don't know, `2` = Hard, `3` = Easy, `Space` = flip card, `Enter` = submit typed answer
- Both views in the design canvas so you can compare

**Missing pieces (#2):**
- **Session-complete summary screen** — "You reviewed 20 words. 6 learned, 3 to review tomorrow. Streak: 4 days 🔥" (or whatever tone fits Bog & Stone — probably no emoji)
- **Again-requeue** — cards you miss come back later in the same session until you get them right at least once
- **Session setup screen** — pick size (10/20/50) + range (words 1–100, 101–200, etc.) before starting
- **Home screen** — shows streak, % known, "Start session" button, maybe "Review due today (N)"

**Question before I start:** do you want me to put all this into the **existing Variation A (Bog & Stone)** only, or build it for both A and B? I'd recommend A only — you already picked it as the winner, and maintaining two full flows doubles the work.

Reply with:
1. A only, or both?
2. Fuzzy match typos: yes/no?
3. Retries on incorrect: one-shot, or one retry?
4. Any emoji/tone preference for the summary screen?

## User

1. A only 2. Yes, but highlight the right answer 3. one-shot 4. No

## Assistant

Got it. Building now.

_[tool: update_todos]_

Let me first read the existing Variation A and styles to match the vocabulary.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

I have a full picture now. Let me rewrite variation-a.jsx with all the requested features. I'll snip earlier context then build.

_[tool: snip]_

First, let me extend the engine with fuzzy matching and a session-complete helper, then rebuild variation-a with the new flows.

_[tool: str_replace_edit]_

_[tool: snip]_

Now the main rewrite. I'll replace variation-a.jsx with the new flow: home → session setup (size + range) → flashcard (with Again-requeue) or quiz (fuzzy + highlight) → results. Plus desktop layout, keyboard shortcuts.

_[tool: write_file]_

_[tool: snip]_

Now I need to update the main HTML to host both a phone-frame artboard and a desktop artboard so you can see both layouts side-by-side.

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Done. Here's what changed:

**Session flow**
- New **Setup screen** — pick size (5–100, with 10/20/50 presets) and which 100-word band before each session
- **Again-requeue** — cards you don't know come back 3–4 cards later, and again, until you get them (but SRS only counts the first rating so mastery isn't double-bumped)
- **Session-complete summary** — percent, Learned / To review / Day streak counters, plus per-word review list
- **Fuzzy typo tolerance** (1 char for words ≥5 letters) with a "close enough" note when it kicks in
- **Highlight correct answer on miss** — character-level green/rust diff against what you typed, plus "also:" line showing other accepted glosses

**Desktop**
- Responsive layout kicks in at ≥720px: bigger type, side-by-side home, 560px card cap, 960px content width
- Keyboard: `Space`/`Enter` flip, `1` Don't know, `2` Hard, `3` Easy, `↵` check/next in quiz
- Added a desktop artboard (1200×780) alongside the phone in the canvas

**Still mocked**
- Streak day count only updates on session complete (no backfill for today-already-studied nuance beyond what the engine had)
- Range picker is 100-word bands only — no "only words I'm learning" or "due today" filter yet. Want that?

