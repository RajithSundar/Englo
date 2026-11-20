# DESIGN.md: Greyscale

The visual language of **Englo**, on every screen: the landing page, Learn, Problems, sign-in, both workspaces and the modals. It follows opencode.ai at Karthik's request and replaces the earlier "Vantablack + Neon" system.

---

## 1. Thesis

A practice tool should get out of the way. No colour, no glow, no glass: a near-black page, white headings, grey reading text, hairlines, square corners. Weight, size and words carry every distinction a colour used to.

- **Dark (default):** a near-black ground (about #0c0c0c), panels one grey step lighter, white ink, grey body.
- **Light:** the same structure on near-white.
- **One hue, one meaning.** The former accent tokens resolve to the ink, so the one primary control on a screen is an ink-filled block. The only colour is green (`done`), used for one thing: the solved mark, a green circle with a white tick (`SolvedBadge`). Easy, Medium and Hard, and pass and fail, are read as words.

---

## 2. Where it lives

- `src/styles/console.css` holds the tokens and the scoped base rules, with the Hallmark stamp at the top. The name is left over from Hallmark's Console theme, which this replaced.
- `<html>` carries `data-theme="console"`, `class="theme-console"` and `data-mode` (`dark` or `light`), which the store keeps in step with the theme toggle (`src/store/usePlatformStore.ts`).
- `src/index.css` maps the tokens to Tailwind (`@theme inline`) and holds the shared components and the React Flow canvas styles.

## 3. Tokens

Components use the token utilities and never raw colour values.

| Token | Use |
|---|---|
| `paper`, `paper-2`, `paper-3` | page ground, raised panel, inset surface |
| `ink`, `ink-2`, `muted` | headings and primary text, strong body, reading text |
| `rule`, `rule-2` | hairlines, control borders |
| `accent`, `accent-hi`, `accent-ink` | the ink fill of the primary control, its hover, the text on it |
| `cool`, `ok`, `bad`, `warn` (+ `-soft`) | kept for the code's sake; all greys |
| `done`, `done-ink` | the solved mark: green circle, white tick |
| `scrim` | modal backdrop |

All radius tokens resolve to 0. Contrast: body text is 5.8:1 or better in both modes.

## 4. Type

- **Headings and the wordmark:** Atkinson Hyperlegible Mono, weight 400, slight negative tracking.
- **Reading text and controls:** Host Grotesk 400 and 500.
- **Code, figures, readings:** the mono (`.measured`, `font-mono`).

## 5. Components

- `.btn` (grey panel), `.btn-primary` (ink fill), `.btn-quiet`, `.btn-icon`: square, 36px in the app, 44px on the public pages (`.c-btn`, `.c-btn--primary`).
- `.seg` / `.c-seg`: the chosen option one grey step up with a hairline.
- `.chip`: a word inside a hairline.
- `.glass` / `.glass-strong`: now just a raised panel and a hairline.
- The Learn page's level control is a real range input (`.c-range`) with a button for each stop.
- One filled primary per screen. Focus is a 2px ink outline, instant.

## 6. Motion

State changes only, at 120 to 220ms on colour and transform. No loops other than the loading spinner, nothing animates width or height, and every animation stops under reduced motion. The landing page's 3D workspace and its scroll peel stay by request.
