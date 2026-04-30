# Handoff: Nathan's feedback round — Irish Flashcards

## Overview
This package contains a revised design direction for the **Na Mílte Focal** (Thousand Words) Irish flashcard app, after a review round with Nathan. The changes touch the **Home**, **Session Setup**, and **Flashcard** screens, plus add a new capability (editable example sentences).

The underlying flow is unchanged — Home → Setup → Flashcard / Quiz → Results. Only the items Nathan flagged have been revised.

## About the Design Files
The HTML/JSX files in this bundle are **design references** — a working React-in-HTML prototype that shows the intended look and behaviour. They are not meant to be copied into production as-is.

Your task is to **recreate these changes in the target codebase using its existing patterns** — whatever component library, styling approach, and state management the real app uses. Lift exact values (hex codes, paddings, copy, logic) from the prototype; don't lift the scaffolding (`VarA_Shell`, `LayoutCtx`, the Tweaks panel, etc.) — those are prototype plumbing.

## Fidelity
**High-fidelity.** Colors, spacing, typography, and interaction details are final. Recreate pixel-accurately using the codebase's existing primitives.

---

## Changes in this round

Each item below corresponds to a comment Nathan left on the last preview.

### 1. Flashcard back — editable example sentence
**What changed:** The example sentence on the card back (previously hardcoded `"— {ga} {ga}? — {ga}."`) is now user-editable per word. Tapping it swaps in a `<textarea>`; Enter commits, Esc cancels, blur commits.

**Where to look:** `variation-a.jsx` in `VarA_Flashcard` (search for `editingEx`).

**Storage contract:**
- Key: `irish-flashcards-examples-v1`
- Value: JSON object `{ [wordNumber: string]: string }`
- Writes happen on commit; empty strings delete the entry so the placeholder returns.
- Helpers `loadExamples()` / `saveExample(n, text)` in `engine.jsx` show the minimal interface. Replicate whatever shape your real persistence layer wants.

**UX rules:**
- Clicking the example must NOT flip the card (stop propagation).
- When a custom example exists, the label reads "sampla — tap to edit". When empty, "sampla — tap to add your own".
- The textarea inherits the italic serif (`Cormorant Garamond`) and parchment color so the edit state doesn't jar.

### 2. Flashcard rating buttons — Ireland flag palette
**What changed:** The three rating buttons (Don't know / Hard / Easy) are now colored like the Irish tricolour:

| Button | Background | Text | Position |
|---|---|---|---|
| Don't know (Níl a fhios) | `#FF883E` (orange) | `#f4efe4` (parchment) | left |
| Hard (Deacair) | `#ffffff` (white) | `#1e1b14` (ink); `1.5px solid #8a8577` border | centre |
| Easy (Éasca) | `#169B62` (green) | `#f4efe4` (parchment) | right |

Note the **reversed order** vs. the previous design — Don't know is now on the left (flag reads left→right: green–white–orange, buttons read orange–white–green when you scan from the first rating option to the last). Nathan's comment was "green white and orange"; the green/orange positions map to semantic severity (Easy=green, Don't know=orange), with white in the middle for Hard.

Border-radius 12, padding 10px 0, centred two-line label (Irish above in lower-weight, English below at `fontWeight: 700`).

### 3. Flashcard doesn't shift on flip
**What changed:** The card used to vertically center, so flipping it (revealing the rating buttons) bumped everything upward. Now the rating row is **always rendered below the card**, with `visibility: hidden` when unflipped. Layout space is reserved regardless of flip state.

**Structure:**
```
<section flex column align-center justify-center>
  <flip-card height=320|420 />
  <rating-row hidden?>   <!-- always mounted, just invisible -->
</section>
<hint-footer>            <!-- only shows "tap to reveal" when unflipped -->
```

### 4. Rating buttons directly under card
**What changed:** Previously the rating row sat in its own footer section with its own padding, separated by whitespace. Now it's a sibling of the card *inside the same flex container*, with `marginTop: 10` — visually tight to the card.

### 5. Setup screen — Start button copy
**What changed:** Button now reads `Tosaigh · Start` with no number. (Was `Tosaigh · Start 20 focal`.)

### 6. Setup screen — balance
**What changed:** Removed the bottom-pinned Start button; the Start button is now rendered **inline, right under the Range card**. Size card margin-bottom reduced to 8px (was 14); Range card padding reduced from `18px 20px` → `16px 18px`; Range card margin-bottom reduced to 14; top padding of the scroll container trimmed. Net effect: the three stacks (Size / Range / Start) sit in a single balanced column with minimal gaps instead of a tall gap before the Start button.

### 7. Setup screen — broader range options
**What changed:** Below the 5×2 grid of 100-bands, added a **second row** of three pills:

- `1–500`  (`rangeKey = "h1"`)
- `501–1000`  (`rangeKey = "h2"`)
- `Uile · All`  (`rangeKey = "all"`)

They use the same `rangePill(active)` style as the 100-bands. State moved from a numeric `band` to a string `rangeKey`; range computation lives in a `useMemo` that maps the key to `{start, end, label}`.

The "X/Y feicthe · X/Y eolach" counter at the bottom of the card uses `bandStats.total` instead of the hardcoded `100` so the "Uile · All" view correctly shows "N/1000".

### 8. Home — breathing room between ring and Start Session
**What changed:** The phone-layout home column now uses `justifyContent: "space-between"` so on taller viewports the progress ring and the Start Session card push apart, rather than both clustering at the top with a dead gap below. On wider layouts the row keeps its existing `flex-start` so nothing changes there.

### 9. Home — Liosta na bhFocal button border
**What changed:** The "Browse all 1,000 words" button border went from `1px solid var(--a-parchment-2)` (nearly invisible against parchment background) to `1.5px solid var(--a-stone-dark)` — darker and thicker so it reads as an interactive surface.

---

## Design Tokens (unchanged — for context)

### Colors — Bog & Stone palette
```
--a-parchment:    #f4efe4
--a-parchment-2:  #ece5d4
--a-moss-deep:    #2f4a2e
--a-moss:         #5b7a3d
--a-moss-soft:    #a6b687
--a-peat:         #6b4423
--a-stone:        #8a8577
--a-stone-dark:   #514d43
--a-ink:          #1e1b14
--a-rust:         #b8562f
--a-gold:         #c49a3f
```

### Ireland flag (new)
```
--flag-green:   #169B62
--flag-white:   #ffffff
--flag-orange:  #FF883E
```

### Typography (unchanged)
- `Cormorant Garamond` — Irish words, display serif, example sentences (italic)
- `Karla` — UI labels, buttons, body
- `Uncial Antiqua` — screen titles ("Cártaí", "Na Mílte Focal") at 18px mobile / 22px desktop
- `JetBrains Mono` — available but unused on these screens

### Radii & borders
- Cards: `borderRadius: 18`
- Buttons: `borderRadius: 12`
- List-button: `borderRadius: 14`, `border: 1.5px solid var(--a-stone-dark)`
- Card shadow: `0 8px 20px rgba(30, 27, 20, 0.08), 0 1px 0 var(--a-parchment-2)`

---

## State & Persistence

### New (this round)
**Custom examples** — `localStorage["irish-flashcards-examples-v1"] = {[n]: string}`

### Existing (unchanged)
**Main SRS state** — `localStorage["irish-flashcards-v1"]` with shape:
```ts
{
  words: { [n: number]: { m: 0|1|2|3, seen, correct, lastSeen, dueIn } },
  streak: { count, last },
  prefs: { theme },
  lastSessionAt: string | null,
}
```

Mastery levels: 0 = New (Nua), 1 = Learning (Ag foghlaim), 2 = Known (Eolach), 3 = Mastered (Máistreacht).

---

## Files in this bundle

- `variation-a.jsx` — the full prototype of the winning direction (use as the primary reference for every screen)
- `engine.jsx` — SRS logic, `loadExamples` / `saveExample`, fuzzy matching (`matchEnglish`, `matchIrish`), `buildDeck`, `computeStats`
- `styles.css` — design-token CSS variables and shared keyframes/classes (paper texture, flip-card 3D, slider styling)
- `words.js` — the top-1000 frequency list as `window.IRISH_WORDS = [[n, ga, en], ...]`
- `Irish Flashcards.html` — the prototype host page. Ignore the `DesignCanvas` / `PhoneFrame` / `DesktopFrame` / `TweaksPanel` wrappers; those are prototype-only.

## What to ignore when porting
- `design-canvas.jsx`, `ios-frame.jsx`, `tweaks-panel.jsx` — prototype chrome only
- The `LayoutCtx` / `useT()` / `TweaksCtx` plumbing in `variation-a.jsx` — use your real responsive/theme system instead
- The "variation B" file (Atlantic Dusk) — archived, not shipping
