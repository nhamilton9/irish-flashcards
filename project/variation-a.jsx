// variation-a.jsx — "Bog & Stone" — daylight, mossy greens, parchment
// Screens: Home · Setup · Flashcard · Quiz · Results · List
// Works in phone frame and at desktop widths (detects container via ResizeObserver).

const A = {
  parchment: "#f4efe4",
  parchment2: "#ece5d4",
  mossDeep: "#2f4a2e",
  moss: "#5b7a3d",
  mossSoft: "#a6b687",
  peat: "#6b4423",
  peatSoft: "#b69372",
  stone: "#8a8577",
  stoneDark: "#514d43",
  ink: "#1e1b14",
  rust: "#b8562f",
  gold: "#c49a3f",
};

// --- layout context ---------------------------------------------------------
// The component renders inside either a 390-wide phone frame OR a full desktop
// viewport. We measure the shell and broadcast a "wide" flag through context.
const LayoutCtx = React.createContext({ wide: false, width: 390 });

function VarA_Shell({ children, footer }) {
  const ref = React.useRef(null);
  const [layout, setLayout] = React.useState({ wide: false, width: 390 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setLayout({ wide: w >= 720, width: w });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <LayoutCtx.Provider value={layout}>
      <div ref={ref} className="paper-a phone-scroll" style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        color: A.ink, fontFamily: "'Karla', sans-serif",
        position: "relative", overflow: "hidden",
      }}>
        {children}
        {footer}
      </div>
    </LayoutCtx.Provider>
  );
}

// Top status-bar spacer + header
function VarA_Header({ title, subtitle, streak, onBack, right }) {
  const { wide } = React.useContext(LayoutCtx);
  const padTop = wide ? 28 : 56;
  return (
    <div style={{ padding: `${padTop}px 22px 12px`, flexShrink: 0, maxWidth: 960, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: subtitle ? 10 : 0 }}>
        {onBack ? (
          <button className="btn" onClick={onBack} style={{
            background: "none", border: "none", padding: 4, color: A.stoneDark, fontSize: 22, lineHeight: 1, cursor: "pointer",
          }}>←</button>
        ) : <div style={{ width: 28 }} />}
        <div className="uncial" style={{ fontSize: wide ? 22 : 18, color: A.mossDeep, letterSpacing: 1 }}>
          {title}
        </div>
        <div style={{ minWidth: 28, display: "flex", justifyContent: "flex-end" }}>
          {right ?? (streak != null && (
            <div className="flicker" style={{
              display: "flex", alignItems: "center", gap: 3,
              fontSize: 11, color: A.rust, fontWeight: 600,
            }}>
              <span style={{ fontSize: 13 }}>◉</span>{streak}
            </div>
          ))}
        </div>
      </div>
      {subtitle && (
        <div className="serif" style={{ fontSize: 13, color: A.stoneDark, fontStyle: "italic", textAlign: "center" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// Grammar helper: correct Irish pluralisation after numerals
function focalForm(n) {
  if (n === 1) return "focal";
  if (n >= 2 && n <= 6) return "fhocal";
  if (n >= 7 && n <= 10) return "bhfocal";
  return "focal";
}

// Range label e.g. "1–100" (always 1-indexed display)
function rangeLabel(start, end) { return `${start + 1}–${end}`; }

// --- HOME -------------------------------------------------------------------
function VarA_Home({ stats, state, onOpenSetup, onShowList }) {
  const { wide } = React.useContext(LayoutCtx);
  const streak = state.streak.count;
  return (
    <VarA_Shell>
      <VarA_Header title="Na Mílte Focal" subtitle="The Thousand Words" streak={streak} />

      <div style={{
        flex: 1, display: "flex", flexDirection: wide ? "row" : "column",
        gap: wide ? 32 : 0, padding: wide ? "8px 32px 32px" : "0",
        maxWidth: 960, width: "100%", margin: "0 auto", boxSizing: "border-box",
        alignItems: wide ? "flex-start" : "stretch",
        justifyContent: wide ? "flex-start" : "space-between",
      }}>
        {/* Progress ring + stats */}
        <div style={{ padding: wide ? 0 : "8px 24px 16px", textAlign: "center", flex: wide ? "0 0 320px" : "none" }}>
          <div style={{ position: "relative", width: wide ? 220 : 160, height: wide ? 220 : 160, margin: "4px auto 12px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${A.stone}`, opacity: 0.25 }} />
            <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: `1px solid ${A.mossDeep}`, opacity: 0.15 }} />
            <div style={{
              position: "absolute", inset: 16, borderRadius: "50%",
              background: `conic-gradient(${A.moss} ${stats.pct * 3.6}deg, ${A.parchment2} 0)`,
              WebkitMask: "radial-gradient(circle, transparent 57%, black 58%)",
              mask: "radial-gradient(circle, transparent 57%, black 58%)",
            }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="serif" style={{ fontSize: wide ? 68 : 48, lineHeight: 1, color: A.mossDeep, fontWeight: 500 }}>
                {stats.pct}<span style={{ fontSize: wide ? 28 : 20, color: A.stone }}>%</span>
              </div>
              <div style={{ fontSize: wide ? 10 : 9, color: A.stone, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 3 }}>
                ar eolas
              </div>
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 11, color: A.stoneDark, marginBottom: 4 }}>
            <StatDivA n={stats.seen} irish="feicthe" english="Seen" />
            <div style={{ width: 1, background: A.stone, opacity: 0.25 }} />
            <StatDivA n={stats.learning} irish="ag foghlaim" english="Learning" />
            <div style={{ width: 1, background: A.stone, opacity: 0.25 }} />
            <StatDivA n={stats.known} irish="eolach" english="Known" />
          </div>
        </div>

        {/* Main actions */}
        <div style={{ padding: wide ? 0 : "4px 22px", flex: 1, width: "100%" }}>
          <div style={{
            background: "#fff", border: `1px solid ${A.parchment2}`,
            borderRadius: 18, padding: "18px 20px", marginBottom: 10,
            boxShadow: `0 1px 0 ${A.parchment2}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
              <span className="uncial" style={{ fontSize: 15, color: A.mossDeep }}>Tosaigh Seisiún</span>
              <span style={{ fontSize: 10, color: A.stone, letterSpacing: 1, textTransform: "uppercase" }}>Start a session</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn" onClick={() => onOpenSetup("flashcard")} style={stackedBtnA(true)}>
                <span>
                  <span className="serif" style={{ fontSize: 16 }}>Cártaí</span>
                  <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 8, letterSpacing: 1, textTransform: "uppercase" }}>Flashcards</span>
                </span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>›</span>
              </button>
              <button className="btn" onClick={() => onOpenSetup("quiz-ga-en")} style={stackedBtnA(false)}>
                <span className="serif" style={{ fontSize: 15, color: A.ink }}>
                  Gaeilge <span style={{ color: A.moss }}>→</span> English
                </span>
                <span style={{ fontSize: 10, color: A.stone, letterSpacing: 1, textTransform: "uppercase" }}>Ceist</span>
              </button>
              <button className="btn" onClick={() => onOpenSetup("quiz-en-ga")} style={stackedBtnA(false)}>
                <span className="serif" style={{ fontSize: 15, color: A.ink }}>
                  English <span style={{ color: A.moss }}>→</span> Gaeilge
                </span>
                <span style={{ fontSize: 10, color: A.stone, letterSpacing: 1, textTransform: "uppercase" }}>Ceist</span>
              </button>
            </div>
          </div>

          <button className="btn" onClick={onShowList} style={{
            width: "100%", background: "transparent",
            border: `1.5px solid ${A.stoneDark}`,
            borderRadius: 14, padding: "14px 18px",
            textAlign: "left", cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div className="serif" style={{ fontSize: 16, color: A.ink }}>Liosta na bhFocal</div>
              <div style={{ fontSize: 10, color: A.stone, marginTop: 2 }}>Browse all 1,000 words</div>
            </div>
            <span style={{ color: A.stone }}>›</span>
          </button>
        </div>
      </div>
    </VarA_Shell>
  );
}

function StatDivA({ n, irish, english }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div className="serif" style={{ fontSize: 22, color: A.ink, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 10, color: A.stoneDark, fontStyle: "italic", marginTop: 3 }}>{irish}</div>
      <div style={{ fontSize: 8, color: A.stone, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 1 }}>{english}</div>
    </div>
  );
}

const stackedBtnA = (primary) => ({
  width: "100%",
  display: "flex", alignItems: "center", justifyContent: "space-between",
  background: primary ? A.mossDeep : A.parchment,
  border: primary ? "none" : `1px solid ${A.parchment2}`,
  color: primary ? A.parchment : A.ink,
  borderRadius: 12, padding: "14px 18px",
  fontFamily: "'Karla', sans-serif", fontWeight: 500,
  cursor: "pointer", textAlign: "left",
});

// --- SETUP ------------------------------------------------------------------
// Pick size + range before starting. Range = 100-word bands plus broader groupings.
function VarA_Setup({ mode, state, onStart, onBack }) {
  const [size, setSize] = React.useState(20);
  // rangeKey: "b0".."b9" for 100-bands; "h1","h2" halves; "all" everything
  const [rangeKey, setRangeKey] = React.useState("b0");

  const { start, end, label } = React.useMemo(() => {
    if (rangeKey === "all") return { start: 0, end: 1000, label: "1–1000" };
    if (rangeKey === "h1")  return { start: 0, end: 500,  label: "1–500" };
    if (rangeKey === "h2")  return { start: 500, end: 1000, label: "501–1000" };
    const i = parseInt(rangeKey.slice(1), 10);
    return { start: i * 100, end: i * 100 + 100, label: `${i * 100 + 1}–${(i + 1) * 100}` };
  }, [rangeKey]);

  const bandStats = React.useMemo(() => {
    let seen = 0, known = 0;
    for (let n = start + 1; n <= end; n++) {
      const w = state.words[n];
      if (w?.seen) seen++;
      if ((w?.m || 0) >= 2) known++;
    }
    return { seen, known, total: end - start };
  }, [state, start, end]);

  const modeLabel = mode === "flashcard" ? "Cártaí" :
    mode === "quiz-ga-en" ? "GA → EN" : "EN → GA";
  const modeEn = mode === "flashcard" ? "Flashcards" : "Quiz";

  return (
    <VarA_Shell>
      <VarA_Header title={modeLabel} subtitle={modeEn} onBack={onBack} />

      <div style={{ flex: 1, overflowY: "auto", padding: "4px 22px 16px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Session size */}
        <div style={{ background: "#fff", border: `1px solid ${A.parchment2}`, borderRadius: 18, padding: "16px 18px", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <span className="serif" style={{ fontSize: 34, color: A.mossDeep, fontWeight: 500, lineHeight: 1 }}>{size}</span>
              <span className="serif" style={{ fontSize: 15, color: A.stoneDark, fontStyle: "italic", marginLeft: 8 }}>{focalForm(size)}</span>
            </div>
            <span style={{ fontSize: 10, color: A.stone, letterSpacing: 1, textTransform: "uppercase" }}>Méid · Size</span>
          </div>
          <input
            type="range" min={5} max={100} step={5}
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            className="focal-slider"
            style={{ width: "100%", accentColor: A.mossDeep }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[10, 20, 50].map(n => (
              <button key={n} className="btn" onClick={() => setSize(n)} style={{
                flex: 1, padding: "7px 0",
                background: size === n ? A.parchment2 : "transparent",
                border: `1px solid ${A.parchment2}`, borderRadius: 8,
                fontFamily: "'Karla', sans-serif", fontSize: 12, color: A.stoneDark, cursor: "pointer",
                fontWeight: size === n ? 600 : 400,
              }}>{n}</button>
            ))}
          </div>
        </div>

        {/* Range picker — 100-bands + broader groupings */}
        <div style={{ background: "#fff", border: `1px solid ${A.parchment2}`, borderRadius: 18, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="serif" style={{ fontSize: 18, color: A.mossDeep, fontWeight: 500 }}>
              Raon {label}
            </span>
            <span style={{ fontSize: 10, color: A.stone, letterSpacing: 1, textTransform: "uppercase" }}>Range</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5, marginBottom: 6 }}>
            {Array.from({ length: 10 }, (_, i) => {
              const k = `b${i}`;
              return (
                <button key={k} className="btn" onClick={() => setRangeKey(k)} style={rangePill(rangeKey === k)}>
                  {i * 100 + 1}–{(i + 1) * 100}
                </button>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
            <button className="btn" onClick={() => setRangeKey("h1")} style={rangePill(rangeKey === "h1")}>1–500</button>
            <button className="btn" onClick={() => setRangeKey("h2")} style={rangePill(rangeKey === "h2")}>501–1000</button>
            <button className="btn" onClick={() => setRangeKey("all")} style={rangePill(rangeKey === "all")}>Uile · All</button>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${A.parchment2}`,
            display: "flex", justifyContent: "space-between", fontSize: 11, color: A.stoneDark }}>
            <span><b style={{ color: A.ink }}>{bandStats.seen}</b>/{bandStats.total} feicthe</span>
            <span><b style={{ color: A.moss }}>{bandStats.known}</b>/{bandStats.total} eolach</span>
          </div>
        </div>

        {/* Start button — inline under Range card for balanced spacing */}
        <button className="btn" onClick={() => onStart(mode, size, start, end)} style={{
          width: "100%", background: A.mossDeep, color: A.parchment, border: "none",
          borderRadius: 12, padding: "15px 0",
          fontFamily: "'Karla', sans-serif", fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>
          Tosaigh · Start
        </button>
      </div>
    </VarA_Shell>
  );
}

const rangePill = (active) => ({
  padding: "10px 0",
  background: active ? A.mossDeep : "transparent",
  border: active ? "none" : `1px solid ${A.parchment2}`,
  borderRadius: 8, cursor: "pointer",
  color: active ? A.parchment : A.stoneDark,
  fontFamily: "'Karla', sans-serif", fontSize: 11,
  fontWeight: active ? 600 : 500,
  fontVariantNumeric: "tabular-nums",
});

// --- FLASHCARD session ------------------------------------------------------
// Uses a queue we can push to on "Again" — re-appears later in same session.
const IFLAG = { green: "#169B62", white: "#ffffff", orange: "#FF883E" };

const rateBtnFlag = (bg, color, bordered) => ({
  background: bg, color, border: bordered ? `1.5px solid ${A.stone}` : "none",
  borderRadius: 12, padding: "10px 0", cursor: "pointer",
  fontFamily: "'Karla', sans-serif",
});

function VarA_Flashcard({ initialDeck, onFinish, onBack, state, rateWord }) {
  const [queue, setQueue] = React.useState(() => initialDeck.map(c => ({ ...c })));
  const [pos, setPos] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [rated, setRated] = React.useState([]);
  const ratedNs = React.useRef(new Set());
  const { wide } = React.useContext(LayoutCtx);
  const examples = React.useRef(loadExamples());
  const [editingEx, setEditingEx] = React.useState(false);
  const [exDraft, setExDraft] = React.useState("");

  const card = queue[pos];
  const totalUnique = initialDeck.length;
  const doneCount = ratedNs.current.size;
  const progress = (doneCount / totalUnique) * 100;

  const rate = React.useCallback((rating) => {
    if (!card) return;
    // Only persist to SRS and log the FIRST rating per unique card,
    // so a requeued card's second pass doesn't double-count.
    const firstTime = !ratedNs.current.has(card.n);
    if (firstTime) {
      rateWord(card.n, rating);
      ratedNs.current.add(card.n);
      setRated(prev => [...prev, { ...card, rating }]);
    }

    let nextQueue = queue;
    if (rating === "again") {
      // Requeue at least 3 cards later, but not past end.
      const insertAt = Math.min(queue.length, pos + 3 + Math.floor(Math.random() * 2));
      nextQueue = [...queue.slice(0, pos + 1), ...queue.slice(pos + 1, insertAt), { ...card }, ...queue.slice(insertAt)];
      setQueue(nextQueue);
    }

    const nextPos = pos + 1;
    if (nextPos >= nextQueue.length) {
      setTimeout(() => onFinish([...rated, ...(firstTime ? [{ ...card, rating }] : [])]), 150);
    } else {
      setFlipped(false);
      setTimeout(() => setPos(nextPos), 150);
    }
  }, [card, queue, pos, rated, rateWord, onFinish]);

  // Keyboard: Space/Enter = flip, 1 = Don't know, 2 = Hard, 3 = Easy
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped(f => !f); }
      else if (flipped && e.key === "1") rate("again");
      else if (flipped && e.key === "2") rate("hard");
      else if (flipped && e.key === "3") rate("easy");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, rate]);

  if (!card) return null;
  const cardHeight = wide ? 420 : 320;
  const frontSize = wide ? 72 : 52;

  const customEx = examples.current[card.n];
  const displayedEx = customEx || examplePlaceholder(card.ga);
  const commitEx = () => {
    saveExample(card.n, exDraft);
    examples.current = loadExamples();
    setEditingEx(false);
  };

  return (
    <VarA_Shell>
      <VarA_Header title=”Cártaí” onBack={onBack}
        right={<span style={{ fontSize: 11, color: A.stone, fontVariantNumeric: “tabular-nums” }}>
          {doneCount}/{totalUnique}
        </span>} />
      <div style={{ padding: “0 22px”, maxWidth: 640, width: “100%”, margin: “0 auto”, boxSizing: “border-box” }}>
        <div style={{ height: 2, background: A.parchment2, borderRadius: 2, overflow: “hidden” }}>
          <div style={{ height: “100%”, width: `${progress}%`, background: A.moss, transition: “width 0.3s” }} />
        </div>
      </div>

      {/* Card + rating in one stable flex column — rating row always mounted so card never jumps */}
      <div style={{ flex: 1, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, padding: “16px 24px 18px”, minHeight: 0 }}>
        <div className=”flip-card” style={{ width: “100%”, maxWidth: 560, height: cardHeight }}>
          <div className={`flip-inner ${flipped ? “flipped” : “”}`} onClick={() => !editingEx && setFlipped(!flipped)}>
            {/* FRONT */}
            <div className=”flip-face” style={{
              background: “#fff”, border: `1px solid ${A.parchment2}`,
              boxShadow: `0 8px 20px rgba(30, 27, 20, 0.08), 0 1px 0 ${A.parchment2}`,
              padding: “30px 24px”, cursor: “pointer”,
            }}>
              <div style={{ position: “absolute”, top: 14, left: 14, fontSize: 10, color: A.stone, letterSpacing: 1.5, textTransform: “uppercase” }}>
                #{card.n} · {masteryLabel(card.w.m)}
              </div>
              <div style={{ position: “absolute”, top: 14, right: 14, color: A.mossSoft, opacity: 0.5 }}>
                <div className=”knot-corner” />
              </div>
              <div className=”serif” style={{
                fontSize: frontSize, fontWeight: 500, color: A.ink,
                textAlign: “center”, lineHeight: 1.1,
                fontStyle: card.ga.length > 10 ? “normal” : “italic”,
              }}>
                {card.ga}
              </div>
              <div style={{ marginTop: 22, fontSize: 11, color: A.stone, letterSpacing: 2, textTransform: “uppercase” }}>
                tap chun casadh · tap to flip
              </div>
            </div>

            {/* BACK */}
            <div className=”flip-face flip-back” style={{
              background: A.mossDeep, color: A.parchment,
              boxShadow: `0 8px 20px rgba(30, 27, 20, 0.15)`,
              padding: “30px 24px”,
            }}>
              <div style={{ position: “absolute”, top: 14, left: 14, fontSize: 10, color: A.mossSoft, letterSpacing: 1.5, textTransform: “uppercase” }}>
                English
              </div>
              <div className=”serif” style={{
                fontSize: wide ? 40 : 32, fontWeight: 400, textAlign: “center”, lineHeight: 1.2, color: A.parchment,
              }}>
                {card.en}
              </div>

              {/* Editable example sentence */}
              <div style={{
                marginTop: 22, padding: “12px 16px”, width: “calc(100% - 48px)”,
                borderTop: `1px solid rgba(246, 239, 228, 0.15)`,
                borderBottom: `1px solid rgba(246, 239, 228, 0.15)`,
                fontSize: 13, fontStyle: “italic”, color: A.mossSoft, textAlign: “center”,
                fontFamily: “'Cormorant Garamond', serif”, boxSizing: “border-box”,
              }} onClick={(e) => e.stopPropagation()}>
                {editingEx ? (
                  <div>
                    <textarea
                      autoFocus
                      value={exDraft}
                      onChange={(e) => setExDraft(e.target.value)}
                      onBlur={commitEx}
                      onKeyDown={(e) => {
                        if (e.key === “Enter” && !e.shiftKey) { e.preventDefault(); commitEx(); }
                        else if (e.key === “Escape”) { setEditingEx(false); }
                      }}
                      placeholder={examplePlaceholder(card.ga)}
                      style={{
                        width: “100%”, background: “rgba(246, 239, 228, 0.1)”,
                        border: `1px solid rgba(246, 239, 228, 0.3)`, borderRadius: 6,
                        color: A.parchment, padding: “6px 8px”,
                        fontFamily: “'Cormorant Garamond', serif”, fontSize: 14,
                        fontStyle: “italic”, textAlign: “center”, outline: “none”,
                        resize: “none”, minHeight: 40, boxSizing: “border-box”,
                      }}
                    />
                    <div style={{ fontSize: 8, marginTop: 4, letterSpacing: 1, textTransform: “uppercase”, fontStyle: “normal”, opacity: 0.7 }}>
                      ↵ save · esc cancel
                    </div>
                  </div>
                ) : (
                  <div onClick={() => { setExDraft(customEx || “”); setEditingEx(true); }} style={{ cursor: “text” }}>
                    “{displayedEx}”
                    <div style={{ fontSize: 9, marginTop: 4, letterSpacing: 1, textTransform: “uppercase”, fontStyle: “normal” }}>
                      sampla — {customEx ? “tap to edit” : “tap to add your own”}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rating row — always present; invisible when unflipped so layout stays stable */}
        <div style={{ width: “100%”, maxWidth: 560, marginTop: 10, visibility: flipped ? “visible” : “hidden” }}>
          <div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr 1fr”, gap: 7 }}>
            <button className=”btn” onClick={() => rate(“again”)} style={rateBtnFlag(IFLAG.orange, A.parchment)}>
              <div style={{ fontSize: 10, opacity: 0.85 }}>Níl a fhios {wide && <span style={{ opacity: 0.7 }}>· 1</span>}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Don't know</div>
            </button>
            <button className=”btn” onClick={() => rate(“hard”)} style={rateBtnFlag(IFLAG.white, A.ink, true)}>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Deacair {wide && <span style={{ opacity: 0.6 }}>· 2</span>}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Hard</div>
            </button>
            <button className=”btn” onClick={() => rate(“easy”)} style={rateBtnFlag(IFLAG.green, A.parchment)}>
              <div style={{ fontSize: 10, opacity: 0.85 }}>Éasca {wide && <span style={{ opacity: 0.7 }}>· 3</span>}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Easy</div>
            </button>
          </div>
        </div>
      </div>

      {/* Hint footer */}
      <div style={{ padding: “0 22px 22px”, flexShrink: 0, maxWidth: 640, width: “100%”, margin: “0 auto”, boxSizing: “border-box”, textAlign: “center”, fontSize: 11, color: A.stone }}>
        {!flipped && <span>Nocht an freagra chun é a rátáil · {wide ? “Space to flip” : “tap to reveal”}</span>}
      </div>
    </VarA_Shell>
  );
}

// --- QUIZ session (typing, one-shot, highlight correct on miss) -------------
// Renders the user's typed answer with per-character diff when wrong.
function DiffLine({ typed, expected }) {
  // Character-level diff using LCS-ish approach: we just show expected and
  // colour matches green / mismatches rust.
  const out = [];
  const eN = expected.length, tN = typed.length;
  // Simple alignment: iterate over expected; check against same index of typed.
  for (let i = 0; i < eN; i++) {
    const ec = expected[i];
    const tc = typed[i] ?? "";
    const match = tc.toLowerCase() === ec.toLowerCase();
    out.push(
      <span key={i} style={{
        color: match ? A.moss : A.rust,
        textDecoration: match ? "none" : "underline",
        textDecorationColor: A.rust,
        fontWeight: match ? 500 : 600,
      }}>{ec}</span>
    );
  }
  return <span>{out}</span>;
}

function VarA_Quiz({ initialDeck, dir, onFinish, onBack, rateWord }) {
  const [idx, setIdx] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [phase, setPhase] = React.useState("input"); // input | correct | wrong
  const [rated, setRated] = React.useState([]);
  const card = initialDeck[idx];
  const inputRef = React.useRef(null);
  const nextBtnRef = React.useRef(null);
  const { wide } = React.useContext(LayoutCtx);

  React.useEffect(() => {
    if (phase === "input") setTimeout(() => inputRef.current?.focus(), 50);
    else setTimeout(() => nextBtnRef.current?.focus(), 50);
  }, [idx, phase]);

  if (!card) return null;
  const promptWord = dir === "ga-en" ? card.ga : card.en;
  // For en→ga we highlight against the Irish form; for ga→en against the
  // FIRST listed alternative (shortest / canonical).
  const expected = dir === "ga-en"
    ? card.en.split("/")[0].replace(/\([^)]*\)/g, "").trim()
    : card.ga;

  const submit = (e) => {
    e?.preventDefault();
    if (phase !== "input") return;
    if (!answer.trim()) return;
    const ok = dir === "ga-en" ? matchEnglish(answer, card.en) : matchIrish(answer, card.ga);
    if (ok) {
      rateWord(card.n, "correct");
      setPhase("correct");
      setRated([...rated, { ...card, rating: "correct", answer }]);
    } else {
      rateWord(card.n, "wrong");
      setPhase("wrong");
      setRated([...rated, { ...card, rating: "wrong", answer }]);
    }
  };
  const next = () => {
    if (idx + 1 >= initialDeck.length) {
      onFinish(rated);
    } else {
      setIdx(idx + 1);
      setAnswer("");
      setPhase("input");
    }
  };

  return (
    <VarA_Shell>
      <VarA_Header title={dir === "ga-en" ? "Ceist · GA→EN" : "Ceist · EN→GA"} onBack={onBack}
        right={<span style={{ fontSize: 11, color: A.stone, fontVariantNumeric: "tabular-nums" }}>{idx + 1}/{initialDeck.length}</span>} />
      <div style={{ padding: "0 22px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ height: 2, background: A.parchment2, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(idx / initialDeck.length) * 100}%`, background: A.moss, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "30px 26px 20px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", fontSize: 10, color: A.stone, letterSpacing: 2, textTransform: "uppercase", marginBottom: 18 }}>
          {dir === "ga-en" ? "Aistrigh go Béarla · translate to English" : "Aistrigh go Gaeilge · translate to Irish"}
        </div>
        <div className="serif" style={{
          textAlign: "center", fontSize: wide ? 72 : 52, fontWeight: 500, color: A.ink,
          lineHeight: 1.1, marginBottom: 26,
        }}>
          {promptWord}
        </div>

        <form onSubmit={submit} className={phase === "wrong" ? "shake" : ""}>
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={phase !== "input"}
            placeholder="…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#fff",
              border: `1.5px solid ${phase === "correct" ? A.moss : phase === "wrong" ? A.rust : A.parchment2}`,
              borderRadius: 12, padding: "14px 16px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: wide ? 26 : 22, color: A.ink,
              textAlign: "center", outline: "none",
            }}
            autoComplete="off" autoCorrect="off" spellCheck="false"
          />
        </form>

        {phase === "correct" && (
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: A.moss, fontWeight: 600 }}>✓ Tá an ceart agat</div>
            <div className="serif" style={{ fontSize: 18, color: A.ink, marginTop: 6, fontStyle: "italic" }}>
              {dir === "ga-en" ? card.en : card.ga}
            </div>
            {normalizeAnswer(answer) !== normalizeAnswer(expected) && (
              <div style={{ fontSize: 10, color: A.stone, marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>
                close enough
              </div>
            )}
          </div>
        )}
        {phase === "wrong" && (
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: A.rust, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
              Ní hea — the answer is
            </div>
            <div className="serif" style={{ fontSize: wide ? 32 : 26, marginTop: 2, fontWeight: 600, lineHeight: 1.2 }}>
              <DiffLine typed={answer} expected={expected} />
            </div>
            {dir === "ga-en" && card.en.includes("/") && (
              <div style={{ fontSize: 11, color: A.stoneDark, fontStyle: "italic", marginTop: 6 }}>
                also: {card.en}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ padding: "0 22px 28px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {phase === "input" ? (
          <button className="btn" onClick={submit} style={{
            width: "100%", background: A.mossDeep, color: A.parchment,
            border: "none", borderRadius: 12, padding: "14px 0",
            fontSize: 14, fontFamily: "'Karla', sans-serif", fontWeight: 600,
            cursor: "pointer", opacity: answer.trim() ? 1 : 0.4,
          }} disabled={!answer.trim()}>
            Seiceáil · Check {wide && <span style={{ opacity: 0.55, marginLeft: 8 }}>↵</span>}
          </button>
        ) : (
          <button ref={nextBtnRef} className="btn" onClick={next} style={{
            width: "100%", background: phase === "correct" ? A.moss : A.peat, color: A.parchment,
            border: "none", borderRadius: 12, padding: "14px 0",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            {idx + 1 >= initialDeck.length ? "Críoch · Finish" : "Ar aghaidh · Next"}
            {wide && <span style={{ opacity: 0.55, marginLeft: 8 }}>↵</span>}
          </button>
        )}
      </div>
    </VarA_Shell>
  );
}

// --- RESULTS / session-complete summary -------------------------------------
function VarA_Results({ rated, streakInfo, onHome, onAgain }) {
  const { wide } = React.useContext(LayoutCtx);
  const correct = rated.filter(r => r.rating === "correct" || r.rating === "easy" || r.rating === "hard").length;
  const learned = rated.filter(r => r.rating === "easy" || r.rating === "correct").length;
  const toReview = rated.filter(r => r.rating === "hard" || r.rating === "again" || r.rating === "wrong").length;
  const pct = rated.length ? Math.round((correct / rated.length) * 100) : 0;

  return (
    <VarA_Shell>
      <VarA_Header title="Críoch" subtitle="Session complete" />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 12px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", padding: "0 6px 12px" }}>
          <div className="uncial" style={{ fontSize: wide ? 32 : 26, color: A.mossDeep, margin: "10px 0 4px" }}>
            Maith thú!
          </div>
          <div className="serif" style={{ fontSize: 14, color: A.stoneDark, fontStyle: "italic", marginBottom: 18 }}>
            Well done.
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: "22px 16px 18px", border: `1px solid ${A.parchment2}` }}>
            <div className="serif" style={{ fontSize: wide ? 88 : 72, color: A.moss, lineHeight: 1, fontWeight: 500 }}>
              {pct}<span style={{ fontSize: wide ? 36 : 28, color: A.stone }}>%</span>
            </div>
            <div style={{ fontSize: 11, color: A.stone, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
              {correct} de {rated.length} ceart
            </div>

            {/* Breakdown */}
            <div style={{ display: "flex", marginTop: 18, paddingTop: 14, borderTop: `1px solid ${A.parchment2}`, gap: 4 }}>
              <SummaryBit n={learned} irish="foghlamtha" english="Learned" color={A.moss} />
              <div style={{ width: 1, background: A.parchment2 }} />
              <SummaryBit n={toReview} irish="le hathbhreithniú" english="To review" color={A.peat} />
              <div style={{ width: 1, background: A.parchment2 }} />
              <SummaryBit n={streakInfo.count} irish="lá as a chéile" english="Day streak" color={A.rust} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: A.stone, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, marginTop: 8 }}>
          Athbhreithniú · Review
        </div>
        {rated.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: `1px solid ${A.parchment2}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                background: r.rating === "wrong" || r.rating === "again" ? A.rust :
                  r.rating === "hard" ? A.peat : A.moss,
              }} />
              <span className="serif" style={{ fontSize: 17, color: A.ink }}>{r.ga}</span>
            </div>
            <span style={{ fontSize: 12, color: A.stone, fontStyle: "italic", textAlign: "right", marginLeft: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.en}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 22px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        <button className="btn" onClick={onHome} style={{
          background: "transparent", border: `1px solid ${A.parchment2}`,
          color: A.ink, borderRadius: 12, padding: "13px 0",
          fontFamily: "'Karla', sans-serif", fontSize: 13, cursor: "pointer",
        }}>Abhaile · Home</button>
        <button className="btn" onClick={onAgain} style={{
          background: A.mossDeep, border: "none",
          color: A.parchment, borderRadius: 12, padding: "13px 0",
          fontFamily: "'Karla', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>Arís · Again</button>
      </div>
    </VarA_Shell>
  );
}

function SummaryBit({ n, irish, english, color }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div className="serif" style={{ fontSize: 28, color, fontWeight: 500, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 9, color: A.stoneDark, fontStyle: "italic", marginTop: 4 }}>{irish}</div>
      <div style={{ fontSize: 8, color: A.stone, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 1 }}>{english}</div>
    </div>
  );
}

// --- WORD LIST --------------------------------------------------------------
function VarA_List({ state, onBack }) {
  const [range, setRange] = React.useState(0);
  const slice = window.IRISH_WORDS.slice(range * 100, range * 100 + 100);
  const stripRef = React.useRef(null);
  const tabRefs = React.useRef([]);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    const strip = stripRef.current;
    const tab = tabRefs.current[range];
    if (!strip || !tab) return;
    const padding = 24;
    const tabLeft = tab.offsetLeft;
    const tabRight = tabLeft + tab.offsetWidth;
    const viewLeft = strip.scrollLeft;
    const viewRight = viewLeft + strip.clientWidth;
    if (tabRight + padding > viewRight) {
      strip.scrollTo({ left: tabRight + padding - strip.clientWidth, behavior: "smooth" });
    } else if (tabLeft - padding < viewLeft) {
      strip.scrollTo({ left: Math.max(0, tabLeft - padding), behavior: "smooth" });
    }
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [range]);

  const onListScroll = (e) => {
    const el = e.currentTarget;
    if (range >= 9) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
      setRange(r => Math.min(9, r + 1));
    }
  };

  return (
    <VarA_Shell>
      <VarA_Header title="Liosta" onBack={onBack} />
      <div ref={stripRef} style={{ padding: "0 18px 8px", display: "flex", gap: 4, overflowX: "auto", scrollBehavior: "smooth", maxWidth: 960, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <button key={i} ref={(el) => (tabRefs.current[i] = el)} className="btn" onClick={() => setRange(i)} style={{
            flexShrink: 0, padding: "5px 10px", fontSize: 10,
            border: "none", borderRadius: 3,
            background: range === i ? A.mossDeep : "transparent",
            color: range === i ? A.parchment : A.stone, cursor: "pointer",
            fontFamily: "'Karla', sans-serif", fontWeight: range === i ? 600 : 400,
          }}>
            {i * 100 + 1}–{(i + 1) * 100}
          </button>
        ))}
      </div>
      <div ref={listRef} onScroll={onListScroll} style={{ flex: 1, overflowY: "auto", padding: "0 22px 28px", maxWidth: 640, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {slice.map(([n, ga, en]) => {
          const m = state.words[n]?.m || 0;
          const color = m === 3 ? A.gold : m === 2 ? A.moss : m === 1 ? A.peat : A.stone;
          return (
            <div key={n} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: `1px solid ${A.parchment2}`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: A.stone, width: 28, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                {n}
              </span>
              <span className="serif" style={{ fontSize: 16, color: A.ink, flex: 1, fontWeight: 500 }}>{ga}</span>
              <span style={{ fontSize: 11, color: A.stoneDark, fontStyle: "italic", maxWidth: 220, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{en}</span>
            </div>
          );
        })}
      </div>
    </VarA_Shell>
  );
}

// --- ROOT -------------------------------------------------------------------
function VariationA() {
  const { state, rateWord, completeSession } = useStore();
  const [screen, setScreen] = React.useState("home"); // home | setup | flashcard | quiz-ga-en | quiz-en-ga | results | list
  const [mode, setMode] = React.useState("flashcard");
  const [setupMode, setSetupMode] = React.useState(null);
  const [deck, setDeck] = React.useState([]);
  const [range, setRange] = React.useState({ start: 0, end: 1000 });
  const [rated, setRated] = React.useState([]);

  const stats = computeStats(state);

  const openSetup = (m) => { setSetupMode(m); setScreen("setup"); };
  const onStart = (m, size, start = 0, end = 1000) => {
    const d = buildDeck(state, size, start, end);
    setDeck(d);
    setMode(m);
    setRange({ start, end });
    setScreen(m === "flashcard" ? "flashcard" : m === "quiz-ga-en" ? "quiz-ga-en" : "quiz-en-ga");
    setRated([]);
  };
  const onFinish = (r) => {
    setRated(r);
    completeSession();
    setScreen("results");
  };

  if (screen === "home") return <VarA_Home stats={stats} state={state} onOpenSetup={openSetup} onShowList={() => setScreen("list")} />;
  if (screen === "setup") return <VarA_Setup mode={setupMode} state={state} onStart={onStart} onBack={() => setScreen("home")} />;
  if (screen === "list") return <VarA_List state={state} onBack={() => setScreen("home")} />;
  if (screen === "flashcard") return <VarA_Flashcard initialDeck={deck} state={state} rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "quiz-ga-en") return <VarA_Quiz initialDeck={deck} dir="ga-en" rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "quiz-en-ga") return <VarA_Quiz initialDeck={deck} dir="en-ga" rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "results") return <VarA_Results rated={rated} streakInfo={state.streak} onHome={() => setScreen("home")} onAgain={() => onStart(mode, deck.length, range.start, range.end)} />;
  return null;
}

Object.assign(window, { VariationA });
