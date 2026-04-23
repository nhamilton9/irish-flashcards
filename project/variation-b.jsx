// variation-b.jsx — "Atlantic Dusk" — evening, teal & gold, manuscript feel
// Different layout personality: dark mode, illuminated initials, more editorial

const B = {
  vellum: "#efe7d1",
  vellum2: "#e5dbbf",
  ink: "#1a2230",
  inkSoft: "#3a4557",
  tealDeep: "#0f3a3a",
  teal: "#1d5a58",
  tealSoft: "#5a8a86",
  gold: "#c28f2c",
  goldSoft: "#e3b85c",
  rust: "#a43e20",
  plum: "#4a2340",
  night: "#0f1520",
  nightCard: "#1a2230",
};

function VarB_Shell({ children, dark = false }) {
  return (
    <div className={dark ? "" : "paper-b"} style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      color: dark ? B.vellum : B.ink,
      fontFamily: "'Karla', sans-serif",
      background: dark ? B.night : undefined,
      position: "relative", overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

function VarB_Header({ left, center, right, dark = false }) {
  const borderC = dark ? "rgba(239,231,209,0.1)" : "rgba(26,34,48,0.1)";
  return (
    <div style={{
      padding: "56px 20px 14px",
      flexShrink: 0,
      borderBottom: `1px solid ${borderC}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ width: 60 }}>{left}</div>
      <div style={{ flex: 1, textAlign: "center" }}>{center}</div>
      <div style={{ width: 60, textAlign: "right" }}>{right}</div>
    </div>
  );
}

function VarB_Home({ stats, state, onStart, onShowList }) {
  const streak = state.streak.count;
  const circ = 2 * Math.PI * 52;
  return (
    <VarB_Shell>
      <VarB_Header
        center={
          <div>
            <div style={{ fontSize: 9, color: B.tealSoft, letterSpacing: 3, textTransform: "uppercase" }}>
              Leabhar na bhFocal
            </div>
            <div className="uncial" style={{ fontSize: 17, color: B.tealDeep, marginTop: 2 }}>
              1000
            </div>
          </div>
        }
        right={
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, fontSize: 11, color: B.rust, fontWeight: 700 }}>
            <span>{streak}</span>
            <span className="flicker">◈</span>
          </div>
        }
      />

      {/* Illuminated hero */}
      <div style={{ padding: "18px 24px 6px" }}>
        <div style={{
          background: B.tealDeep,
          borderRadius: 20,
          padding: "18px 18px 20px",
          color: B.vellum,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* gold fleck decoration */}
          <div style={{
            position: "absolute", top: -20, right: -20, width: 100, height: 100,
            borderRadius: "50%", border: `1px solid ${B.gold}`, opacity: 0.2,
          }} />
          <div style={{
            position: "absolute", top: -10, right: -10, width: 80, height: 80,
            borderRadius: "50%", border: `1px solid ${B.gold}`, opacity: 0.3,
          }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
            {/* Illuminated initial */}
            <div style={{
              width: 84, height: 84, flexShrink: 0,
              borderRadius: 10,
              background: B.vellum,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
            }}>
              <div style={{
                position: "absolute", inset: 4,
                border: `1.5px solid ${B.gold}`, borderRadius: 6,
              }} />
              <div className="uncial" style={{
                fontSize: 48, color: B.tealDeep, lineHeight: 1,
                marginTop: -4,
              }}>
                Ɓ
              </div>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 36, fontWeight: 500, lineHeight: 1, color: B.vellum }}>
                {stats.pct}<span style={{ color: B.goldSoft, fontSize: 20 }}>%</span>
              </div>
              <div style={{ fontSize: 10, color: B.goldSoft, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
                ar eolas · known
              </div>
              {/* thin progress line */}
              <div style={{ marginTop: 10, width: 140, height: 2, background: "rgba(239,231,209,0.15)" }}>
                <div style={{ width: `${stats.pct}%`, height: "100%", background: B.goldSoft, transition: "width 0.4s" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: "12px 24px 4px", display: "flex", gap: 8 }}>
        <StatCardB n={stats.seen} label="seen" irishLabel="feicthe" />
        <StatCardB n={stats.learning} label="learning" irishLabel="ag foghlaim" accent={B.gold} />
        <StatCardB n={stats.known} label="known" irishLabel="eolach" accent={B.teal} />
      </div>

      {/* Actions */}
      <div style={{ padding: "16px 24px 8px" }}>
        <div style={{ fontSize: 9, color: B.tealSoft, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
          Seisiún · Session
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[10, 20, 50].map(n => (
            <button key={n} className="btn" onClick={() => onStart("flashcard", n)} style={{
              background: "transparent",
              border: `1px solid ${B.inkSoft}22`,
              borderRadius: 10, padding: "10px 0",
              color: B.ink, cursor: "pointer",
            }}>
              <div className="serif" style={{ fontSize: 22, color: B.tealDeep }}>{n}</div>
              <div style={{ fontSize: 8, color: B.tealSoft, letterSpacing: 1, textTransform: "uppercase" }}>flashcards</div>
            </button>
          ))}
        </div>
        <button className="btn" onClick={() => onStart("quiz-ga-en", 20)} style={quizBtnB}>
          <span className="serif" style={{ fontSize: 14 }}>Gaeilge <span style={{ color: B.gold }}>→</span> English</span>
          <span style={{ fontSize: 10, color: B.tealSoft }}>20 ceist</span>
        </button>
        <button className="btn" onClick={() => onStart("quiz-en-ga", 20)} style={quizBtnB}>
          <span className="serif" style={{ fontSize: 14 }}>English <span style={{ color: B.gold }}>→</span> Gaeilge</span>
          <span style={{ fontSize: 10, color: B.tealSoft }}>20 ceist</span>
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {/* Footer strip - word of the day */}
      <div style={{
        margin: "0 24px 30px",
        padding: "12px 14px",
        background: B.vellum2,
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer",
      }} className="btn" onClick={onShowList}>
        <div style={{
          width: 34, height: 34, borderRadius: 6,
          background: B.tealDeep, color: B.goldSoft,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
        }}>☰</div>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 14, color: B.ink }}>Gach focal</div>
          <div style={{ fontSize: 10, color: B.inkSoft }}>Browse · all 1,000 words</div>
        </div>
        <span style={{ color: B.tealSoft }}>›</span>
      </div>
    </VarB_Shell>
  );
}

function StatCardB({ n, label, irishLabel, accent = B.inkSoft }) {
  return (
    <div style={{
      flex: 1, padding: "10px 0 10px 12px",
      borderLeft: `2px solid ${accent}`,
    }}>
      <div className="serif" style={{ fontSize: 24, color: B.ink, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 9, color: B.inkSoft, marginTop: 3 }}>{irishLabel}</div>
      <div style={{ fontSize: 8, color: B.tealSoft, letterSpacing: 1, textTransform: "uppercase", marginTop: 1 }}>{label}</div>
    </div>
  );
}

const quizBtnB = {
  width: "100%",
  background: "transparent",
  border: `1px solid ${B.inkSoft}22`,
  borderRadius: 10, padding: "12px 16px",
  marginBottom: 6,
  cursor: "pointer",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  fontFamily: "'Karla', sans-serif",
  color: B.ink,
};

// Flashcard — dark theme, card-like manuscript feel
function VarB_Flashcard({ deck, onFinish, onBack, state, rateWord }) {
  const [idx, setIdx] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [rated, setRated] = React.useState([]);
  const card = deck[idx];

  const rate = (rating) => {
    rateWord(card.n, rating);
    const nextRated = [...rated, { ...card, rating }];
    setRated(nextRated);
    if (idx + 1 >= deck.length) {
      setTimeout(() => onFinish(nextRated), 120);
    } else {
      setFlipped(false);
      setTimeout(() => setIdx(idx + 1), 120);
    }
  };
  if (!card) return null;

  return (
    <VarB_Shell dark>
      {/* header */}
      <div style={{ padding: "56px 22px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn" onClick={onBack} style={{ background: "none", border: "none", color: B.goldSoft, fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {deck.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 18 : 5, height: 3, borderRadius: 2,
              background: i < idx ? B.goldSoft : i === idx ? B.gold : "rgba(239,231,209,0.2)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        <span style={{ fontSize: 10, color: B.tealSoft, fontVariantNumeric: "tabular-nums", width: 24, textAlign: "right" }}>{idx + 1}/{deck.length}</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 24px" }}>
        <div className="flip-card" style={{ width: "100%", height: 380 }}>
          <div className={`flip-inner ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
            {/* FRONT — vellum */}
            <div className="flip-face" style={{
              background: B.vellum,
              color: B.ink,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              padding: "28px 22px",
              cursor: "pointer",
              border: `6px double ${B.gold}`,
              borderRadius: 14,
            }}>
              <div style={{ position: "absolute", top: 12, left: 14, fontSize: 9, color: B.tealSoft, letterSpacing: 1.5, textTransform: "uppercase" }}>
                No. {card.n}
              </div>
              <div style={{ position: "absolute", top: 12, right: 14, fontSize: 9, color: B.tealSoft, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {masteryLabel(card.w.m)}
              </div>
              <div className="uncial" style={{
                fontSize: Math.min(60, 720 / Math.max(6, card.ga.length)),
                color: B.tealDeep, textAlign: "center",
                lineHeight: 1.05,
              }}>
                {card.ga}
              </div>
              <div style={{
                marginTop: 18,
                width: 40, height: 1, background: B.gold,
              }} />
              <div style={{ marginTop: 12, fontSize: 10, color: B.tealSoft, letterSpacing: 2, textTransform: "uppercase" }}>
                tap chun casadh
              </div>
            </div>

            {/* BACK — teal */}
            <div className="flip-face flip-back" style={{
              background: B.tealDeep,
              color: B.vellum,
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              padding: "28px 22px",
              border: `6px double ${B.gold}`,
              borderRadius: 14,
            }}>
              <div style={{ position: "absolute", top: 12, left: 14, fontSize: 9, color: B.goldSoft, letterSpacing: 1.5, textTransform: "uppercase" }}>
                English
              </div>
              <div className="serif" style={{
                fontSize: 34, fontWeight: 500, textAlign: "center",
                color: B.vellum, lineHeight: 1.2,
              }}>
                {card.en}
              </div>
              <div style={{ marginTop: 18, width: 40, height: 1, background: B.goldSoft }} />
              <div className="serif" style={{
                marginTop: 14, fontSize: 13,
                color: B.goldSoft, fontStyle: "italic",
                textAlign: "center",
              }}>
                “{examplePlaceholder(card.ga)}”
              </div>
              <div style={{ marginTop: 6, fontSize: 8, color: B.tealSoft, letterSpacing: 2, textTransform: "uppercase" }}>
                sampla
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "6px 24px 30px" }}>
        {!flipped ? (
          <div style={{ textAlign: "center", fontSize: 10, color: B.tealSoft, letterSpacing: 2, textTransform: "uppercase", paddingTop: 10 }}>
            Reveal to rate · nocht chun rátáil
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { k: "again", label: "Arís", en: "Again", c: B.rust },
              { k: "hard", label: "Deacair", en: "Hard", c: B.gold },
              { k: "easy", label: "Éasca", en: "Easy", c: B.teal },
            ].map(b => (
              <button key={b.k} className="btn" onClick={() => rate(b.k)} style={{
                background: "transparent",
                border: `1.5px solid ${b.c}`,
                color: b.c, borderRadius: 10, padding: "10px 0",
                cursor: "pointer", fontFamily: "'Karla', sans-serif",
              }}>
                <div className="serif" style={{ fontSize: 15, fontWeight: 500 }}>{b.label}</div>
                <div style={{ fontSize: 9, opacity: 0.7, letterSpacing: 1, textTransform: "uppercase" }}>{b.en}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </VarB_Shell>
  );
}

// Quiz B — manuscript-style editorial
function VarB_Quiz({ deck, dir, onFinish, onBack, rateWord }) {
  const [idx, setIdx] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [phase, setPhase] = React.useState("input");
  const [rated, setRated] = React.useState([]);
  const card = deck[idx];
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (phase === "input") setTimeout(() => inputRef.current?.focus(), 50); }, [idx, phase]);
  if (!card) return null;

  const prompt = dir === "ga-en" ? card.ga : card.en;
  const expected = dir === "ga-en" ? card.en : card.ga;

  const submit = (e) => {
    e?.preventDefault();
    if (!answer.trim()) return;
    const ok = dir === "ga-en" ? matchEnglish(answer, card.en) : matchIrish(answer, card.ga);
    rateWord(card.n, ok ? "correct" : "wrong");
    setPhase(ok ? "correct" : "wrong");
    setRated([...rated, { ...card, rating: ok ? "correct" : "wrong", answer }]);
  };
  const next = () => {
    if (idx + 1 >= deck.length) onFinish(rated);
    else { setIdx(idx + 1); setAnswer(""); setPhase("input"); }
  };
  const color = phase === "correct" ? B.teal : phase === "wrong" ? B.rust : B.gold;

  return (
    <VarB_Shell>
      <div style={{ padding: "56px 22px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn" onClick={onBack} style={{ background: "none", border: "none", color: B.tealDeep, fontSize: 20, cursor: "pointer" }}>←</button>
        <div style={{ fontSize: 9, color: B.tealSoft, letterSpacing: 2, textTransform: "uppercase" }}>
          {dir === "ga-en" ? "GA → EN" : "EN → GA"}
        </div>
        <span style={{ fontSize: 10, color: B.tealSoft, fontVariantNumeric: "tabular-nums" }}>{idx + 1}/{deck.length}</span>
      </div>
      {/* progress ticks */}
      <div style={{ padding: "0 22px", display: "flex", gap: 2 }}>
        {deck.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, background: i < idx ? B.teal : "rgba(26,34,48,0.1)" }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: "32px 28px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 9, color: B.tealSoft, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>
          {dir === "ga-en" ? "Aistriúchán Béarla" : "Aistriúchán Gaeilge"}
        </div>

        <div style={{ textAlign: "center", position: "relative", marginBottom: 32 }}>
          <div style={{
            position: "absolute", left: "50%", top: -8, transform: "translateX(-50%)",
            width: 30, height: 1, background: B.gold,
          }} />
          <div className={dir === "ga-en" ? "uncial" : "serif"} style={{
            fontSize: dir === "ga-en" ? 48 : 44,
            fontWeight: 500,
            color: B.tealDeep,
            lineHeight: 1.1, letterSpacing: dir === "ga-en" ? 1 : 0,
          }}>
            {prompt}
          </div>
          <div style={{
            position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)",
            width: 30, height: 1, background: B.gold,
          }} />
        </div>

        <form onSubmit={submit} className={phase === "wrong" ? "shake" : ""}>
          <input
            ref={inputRef}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={phase !== "input"}
            placeholder="do fhreagra…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${color}`,
              padding: "10px 4px 10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, color: B.ink,
              textAlign: "center", outline: "none",
            }}
            autoComplete="off" autoCorrect="off" spellCheck="false"
          />
        </form>

        {phase === "correct" && (
          <div style={{ marginTop: 22, textAlign: "center", color: B.teal }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>✓ Ceart go leor</div>
          </div>
        )}
        {phase === "wrong" && (
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: B.rust, letterSpacing: 2, textTransform: "uppercase" }}>ba é · it was</div>
            <div className="serif" style={{ fontSize: 22, color: B.ink, marginTop: 4, fontStyle: "italic" }}>{expected}</div>
          </div>
        )}
      </div>

      <div style={{ padding: "0 24px 30px" }}>
        {phase === "input" ? (
          <button className="btn" onClick={submit} disabled={!answer.trim()} style={{
            width: "100%", background: B.tealDeep, color: B.vellum,
            border: "none", borderRadius: 10, padding: "14px 0",
            fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
            cursor: "pointer", opacity: answer.trim() ? 1 : 0.4,
            fontFamily: "'Karla', sans-serif",
          }}>Seiceáil</button>
        ) : (
          <button className="btn" onClick={next} style={{
            width: "100%",
            background: phase === "correct" ? B.teal : B.plum,
            color: B.vellum, border: "none", borderRadius: 10,
            padding: "14px 0", fontSize: 13, fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
            fontFamily: "'Karla', sans-serif",
          }}>
            {idx + 1 >= deck.length ? "Críoch" : "Ar aghaidh →"}
          </button>
        )}
      </div>
    </VarB_Shell>
  );
}

function VarB_Results({ rated, onHome, onAgain }) {
  const correct = rated.filter(r => r.rating === "correct" || r.rating === "easy" || r.rating === "hard").length;
  const pct = Math.round((correct / rated.length) * 100);
  return (
    <VarB_Shell dark>
      <div style={{ padding: "70px 28px 20px", textAlign: "center" }}>
        <div className="uncial" style={{ fontSize: 28, color: B.goldSoft, letterSpacing: 2 }}>
          Maith thú!
        </div>
        <div className="serif" style={{ fontSize: 14, color: B.tealSoft, fontStyle: "italic", marginTop: 2 }}>
          Well done.
        </div>
      </div>

      <div style={{ padding: "0 28px" }}>
        <div style={{
          background: B.tealDeep, borderRadius: 16,
          padding: "22px 20px",
          border: `1px solid ${B.gold}`,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 9, color: B.goldSoft, letterSpacing: 3, textTransform: "uppercase" }}>Scór</div>
          <div className="serif" style={{ fontSize: 68, color: B.vellum, lineHeight: 1, fontWeight: 500, marginTop: 4 }}>
            {pct}<span style={{ color: B.goldSoft, fontSize: 26 }}>%</span>
          </div>
          <div style={{ fontSize: 11, color: B.tealSoft, marginTop: 6 }}>
            {correct}/{rated.length} ceart · correct
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 28px 8px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 9, color: B.tealSoft, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
          Athbhreithniú
        </div>
        {rated.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", borderBottom: `1px solid rgba(239,231,209,0.08)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 4, height: 14, borderRadius: 1,
                background: r.rating === "wrong" || r.rating === "again" ? B.rust :
                  r.rating === "hard" ? B.gold : B.teal,
              }} />
              <span className="serif" style={{ fontSize: 17, color: B.vellum }}>{r.ga}</span>
            </div>
            <span style={{ fontSize: 12, color: B.tealSoft, fontStyle: "italic" }}>{r.en}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 28px 30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <button className="btn" onClick={onHome} style={{
          background: "transparent", border: `1px solid ${B.tealSoft}`,
          color: B.vellum, borderRadius: 10, padding: "13px 0",
          fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
        }}>Abhaile</button>
        <button className="btn" onClick={onAgain} style={{
          background: B.gold, border: "none", color: B.ink,
          borderRadius: 10, padding: "13px 0", fontWeight: 700,
          fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
        }}>Arís</button>
      </div>
    </VarB_Shell>
  );
}

function VarB_List({ state, onBack }) {
  const [range, setRange] = React.useState(0);
  const slice = window.IRISH_WORDS.slice(range * 100, range * 100 + 100);
  return (
    <VarB_Shell>
      <VarB_Header
        left={<button className="btn" onClick={onBack} style={{ background: "none", border: "none", color: B.tealDeep, fontSize: 20, cursor: "pointer", padding: 0 }}>←</button>}
        center={<div className="uncial" style={{ fontSize: 16, color: B.tealDeep }}>Leabhar</div>}
      />
      <div style={{ padding: "10px 20px 6px", display: "flex", gap: 3, overflowX: "auto" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <button key={i} className="btn" onClick={() => setRange(i)} style={{
            flexShrink: 0, padding: "5px 9px", fontSize: 10,
            border: `1px solid ${range === i ? B.tealDeep : "transparent"}`,
            borderRadius: 4,
            background: range === i ? B.tealDeep : "transparent",
            color: range === i ? B.vellum : B.inkSoft, cursor: "pointer",
            fontFamily: "'Karla', sans-serif",
          }}>
            {i * 100 + 1}–{(i + 1) * 100}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 30px" }}>
        {slice.map(([n, ga, en]) => {
          const m = state.words[n]?.m || 0;
          const bar = m === 3 ? B.gold : m === 2 ? B.teal : m === 1 ? B.goldSoft : "transparent";
          return (
            <div key={n} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 0", borderBottom: `1px solid rgba(26,34,48,0.08)`,
            }}>
              <span style={{ width: 3, alignSelf: "stretch", background: bar, borderRadius: 2 }} />
              <span style={{ fontSize: 9, color: B.tealSoft, width: 26, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                {n}
              </span>
              <span className="serif" style={{ fontSize: 17, color: B.ink, flex: 1 }}>{ga}</span>
              <span style={{ fontSize: 11, color: B.inkSoft, fontStyle: "italic", maxWidth: 140, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{en}</span>
            </div>
          );
        })}
      </div>
    </VarB_Shell>
  );
}

function VariationB() {
  const { state, rateWord, completeSession } = useStore();
  const [screen, setScreen] = React.useState("home");
  const [mode, setMode] = React.useState(null);
  const [deck, setDeck] = React.useState([]);
  const [rated, setRated] = React.useState([]);
  const stats = computeStats(state);

  const onStart = (m, size) => {
    const d = buildDeck(state, size);
    setDeck(d); setMode(m);
    setScreen(m === "flashcard" ? "flashcard" : m);
    setRated([]);
  };
  const onFinish = (r) => { setRated(r); completeSession(); setScreen("results"); };

  if (screen === "home") return <VarB_Home stats={stats} state={state} onStart={onStart} onShowList={() => setScreen("list")} />;
  if (screen === "list") return <VarB_List state={state} onBack={() => setScreen("home")} />;
  if (screen === "flashcard") return <VarB_Flashcard deck={deck} state={state} rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "quiz-ga-en") return <VarB_Quiz deck={deck} dir="ga-en" rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "quiz-en-ga") return <VarB_Quiz deck={deck} dir="en-ga" rateWord={rateWord} onFinish={onFinish} onBack={() => setScreen("home")} />;
  if (screen === "results") return <VarB_Results rated={rated} onHome={() => setScreen("home")} onAgain={() => onStart(mode, deck.length)} />;
  return null;
}

Object.assign(window, { VariationB });
