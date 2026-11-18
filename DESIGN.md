# DESIGN.md: Vantablack + Neon

The visual language of **Englo**. It replaces the earlier "Cupertino Precision" document, which no longer matched the code.

---

## 1. Thesis

Englo is a serious practice tool for people who think in steps rather than syntax. The interface should feel like a precise instrument: quiet, dark, with light used only where it means something.

- **Dark (default):** a pure black ground. Panels are pitch-black glass that show only through a lit top edge and a 1px hairline, never through a lighter fill.
- **Light:** the same structure as white glass on a pale ground.
- **One accent:** neon blue. It marks the primary action, the selected or current item, and focus. Glow belongs only to those.
- **Calm by default:** one primary action per region, details in collapsible panels, no decorative motion that loops forever, no invented figures.

---

## 2. Tokens

All colours are CSS variables in `src/index.css`, defined for light under `:root` and for dark under `.dark`, and exposed to Tailwind through `@theme inline`. Components use the token utilities and never raw hex or Tailwind palette colours. Because the tokens flip with the theme, components need no `dark:` colour variants.

| Token | Use |
|---|---|
| `paper`, `paper-2`, `paper-3` | page ground, raised surface, inset or hover surface |
| `ink`, `ink-2`, `muted` | headings, body text, secondary text |
| `rule`, `rule-2` | hairlines, control borders |
| `accent`, `accent-hi`, `accent-ink`, `accent-soft` | neon blue, its hover, text on it, its tint |
| `cool` | what the checker read (technique, complexity) |
| `ok`, `bad`, `warn` (+ `-soft`) | pass, fail, caution; Easy, Hard, Medium |
| `scrim` | modal backdrop |
| `shadow-card`, `shadow-glow-1/2/3` | panel depth, neon glow by strength |

Dark neon is `oklch(78% 0.17 232)` (about `#00C8FF`). Light accent is a deeper blue so text on white keeps 4.5:1 contrast.

---

## 3. Type

- **Host Grotesk** for everything people read: headings (medium weight, tight negative tracking), body (14–16px), labels and buttons.
- **Atkinson Hyperlegible Mono** only for code, the candidate's plain-English answer, inputs and outputs, and complexity readings.
- Labels are sentence case. Tracked ALL-CAPS micro labels are not used.

---

## 4. Components

These are shared classes in `src/index.css`:

- `.glass` and `.glass-strong`: panels, menus, modals and the top bar.
- `.btn-primary`: the one filled neon pill per region.
- `.btn`: outline pill.
- `.btn-quiet`: text button.
- `.btn-icon`: round icon button.
- `.seg` and `.seg-item`: segmented control; the selected item takes a neon tint and glow.
- `.chip`, `.chip-easy`, `.chip-medium`, `.chip-hard`, `.chip-accent`: small labels.
- `.field`: text input.
- `.label`: sentence-case caption.
- `.marker`: the 40×3px glowing bar above a section heading.
- `.kbd`: keyboard hint.

Radii are 12px for cards, 8px or a full pill for controls, and 6px for chips. Focus is a 2px neon outline that appears instantly.

---

## 5. The landing page

The landing page is one scroll-driven scene.

1. **Hero:** a single primary action ("Start with Two Sum") and one secondary link.
2. **The idea:** a short chapter on how Englo works.
3. **The breakdown:** a 3D model of the workspace turns to an exploded angle. Its layers then lift off one at a time (logic review, tests, technique, editor, problem), each with a callout describing what that part really does.
4. **The rest of the page:** system design, the problem list, a collapsed note on how answers are checked and its limits, and a closing call to action.

The 3D model is hand-built (`IDEModel3D.tsx`). `SplineIDE.tsx` can load a Spline scene in its place from `VITE_SPLINE_IDE_SCENE`, driving an `IDE` group and `Layer-0` to `Layer-5` from the same scroll values.

---

## 6. Honesty rules

- Show only what the product does. Do not add invented percentiles, acceptance rates, user counts or "proofs".
- Evaluation is feedback from Gemini (when configured) or a local rule-based checker. It is never presented as a formal proof.
