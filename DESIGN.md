# DESIGN.md: Cupertino Precision ("Apple Meets LeetCode")

This document defines the visual language, design token architecture, typography, and tactile interaction rules for **Englo**. It unites LeetCode-grade algorithmic and system design rigor with the optical restraint, clarity, and physical craftsmanship of Apple design.

---

## 1. Aesthetic Thesis & Anti-Slop Protocol

Amateur AI interfaces look generic because they rely on defaults: default blue buttons, crowded cards, random color temperatures, and heavy drop shadows.

Englo embodies **Cupertino Precision**:
- **Atmospheric Clarity**: High-fidelity architectural whites (`#FFFFFF`) layered against warm studio neutrals (`#F5F5F7`, `#FBFBFD`).
- **Color Discipline (60-30-10 Rule)**: Restrained palette dominated by neutrals with a single iconic primary brand accent: Cupertino Blue (`#0071E3`, hover `#0077ED`).
- **Physicality via Optics**: Translucent frosted materials (`backdrop-filter: blur(20px) saturate(180%)`), subtle specular reflections, and soft diffuse ambient shadows (`0 4px 24px rgba(0,0,0,0.04)`).
- **Whitespace Rhythms ("Double Your Padding")**: Expansive negative space that lets logic invariants breathe.

---

## 2. Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-apple-bg` | `#FBFBFD` | Page canvas, soft warm optical background |
| `--color-apple-card` | `#FFFFFF` | Primary content panels, editor canvas, cards |
| `--color-apple-surface` | `#F5F5F7` | Secondary surface trays, inset cards, pill tracks |
| `--color-apple-border` | `#E5E5EA` | 1px and 0.5px hairline boundary dividers |
| `--color-apple-dark` | `#1D1D1F` | Deep typographic ink for high contrast without eye strain |
| `--color-apple-secondary` | `#6E6E73` | Secondary labels, descriptions, and captions |
| `--color-apple-tertiary` | `#86868B` | Metadata, timestamps, line numbers |
| `--color-apple-blue` | `#0071E3` | Primary action pill buttons, active indicators, selection |
| `--color-apple-blue-hover` | `#0077ED` | Interactive hover state for primary buttons |
| `--color-apple-green` | `#34C759` | Verified invariants, passing test cases, Easy difficulty |
| `--color-apple-orange` | `#FF9500` | Practice streak badge, Medium difficulty, warnings |
| `--color-apple-red` | `#FF3B30` | Bug alerts, failed invariants, Hard difficulty |

---

## 3. Typographic System

- **Interface & Display Typography**: `Inter` / `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif`.
  - Display Titles: Large scale (`text-4xl` to `text-7xl`) with tight negative tracking (`-0.035em` to `-0.02em`) and tight leading (`leading-[1.08]`).
  - Body Text: `text-sm` (14px) and `text-base` (16-17px) with comfortable line height (`leading-relaxed`).
  - Uppercase Micro Labels: `text-[10px]` / `text-[11px]` with positive tracking (`+0.04em`) and medium/semibold weight.
- **Monospace Code & Invariants**: `JetBrains Mono` / `ui-monospace, SFMono-Regular, Menlo, monospace`.
  - Used for plain English prose editor, test inputs/outputs, memory maps, complexity badges, and line numbers.

---

## 4. Shapes & Micro-Interactions

- **Continuous Curves (Squircles)**:
  - Base Cards: 16px (`rounded-2xl`), 20px on spotlight modules.
  - Controls & Form Inputs: 10px to 12px (`rounded-xl`).
  - Action Triggers & Filter Chips: Full pill silhouettes (`rounded-full`, `rounded-pill`).
- **Tactile Physics**:
  - `apple-lift`: Subtle scale (`scale-[1.004]`) and micro-lift (`translateY(-2px)`) on hover.
  - Active button presses: Subtle spring compress (`active:scale-[0.97]`).
  - Soundwave & Latency animations: Smooth CSS keyframe pulses simulating continuous telemetry.

---

## 5. Domain Rigor: Apple Meets LeetCode

- **The Problem with Traditional Code**: Punctuation and off-by-one errors distract candidates from communicating core logic under interview pressure.
- **The Englo Solution**:
  - Express algorithms in deterministic plain English prose.
  - Real-time compiler verifies invariants, loop bounds, and asymptotic complexity ($O(N)$).
  - Drag-and-drop distributed systems topology canvas validates read replication, caching layers, and failover scenarios.
