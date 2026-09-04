# Design System & UI/UX Standards

This rule codifies production-grade frontend design principles to eliminate "AI slop" and vibe-coded defaults, grounded in typography, whitespace, color restraint, modern components, and competitive domain analysis.

---

## 1. Core Thesis: What Distinguishes High-End Design from AI Slop

The gap between amateur AI-generated interfaces and polished, bespoke frontends is **typography, spacing, color restraint, and domain-informed layout**, not merely having component blocks.

AI templates and "vibe-coded" frontends look generic because they rely on defaults:
- Default system fonts and uncalibrated line heights
- Default cramped paddings and margins
- Default blue/indigo buttons with heavy arbitrary dropshadows
- Five competing colors applied confidently without visual hierarchy
- Generic SaaS boilerplate (cards with identical borders, gradient washes, numbered markers on non-sequential content, arrows `→` appended to every button)

---

## 2. The Golden Rules of Frontend Aesthetics

### A. Typography: Intentional & Expressive
- **Select deliberate typefaces**: Never leave typography to unstyled defaults. Standardize on intentional font families from Google Fonts / font systems:
  - Sans-Serif: `Inter`, `Plus Jakarta Sans`, `Geist Sans`, `Outfit`
  - Display/Editorial (when justified): `Cabinet Grotesk`, `Instrument Serif`, `Newsreader`
  - Monospace (data, code, badges): `Geist Mono`, `JetBrains Mono`
- **Typographic Scale & Contrast**:
  - Build hierarchy through weight (`font-normal`, `font-medium`, `font-semibold`) and contrast, rather than erratic font-size jumping.
  - Set readable line lengths: limit body paragraphs to `< 75-80` characters (`max-w-prose` or `max-w-2xl`).
  - Tune line-height: `leading-relaxed` for reading, `leading-tight` for large display headings.
- **Avoid AI Tells**:
  - No random single-word color highlights in headings (e.g. "Build *[crazy-colored]* websites").
  - No indiscriminate ALL-CAPS tracked eyebrows above every single paragraph.

### B. Spacing & Whitespace: "Double Whatever Padding You Have"
- **Generous Whitespace**: Give layouts ample breathing room. Add more whitespace than feels comfortable at first glance.
- **Section Rhythm**: Use spacious padding for sections (e.g., `py-16 md:py-24 lg:py-32`).
- **Component Padding**: Avoid cramped containers. Use `p-6` or `p-8` for feature cards, not `p-3` or `p-4`.
- **Rhythmic Gaps**: Standardize layout grids with structured gaps (`gap-8`, `gap-12`).

### C. Color Discipline: Extreme Restraint
- **60-30-10 Rule**:
  - **60% Base / Background**: Clean neutral background (e.g., crisp `#FFFFFF` or obsidian `#09090B` / `#0A0A0A`).
  - **30% Structural / Text**: High-contrast text (`#0F172A` / `#F8FAFC`), subtle borders (`border-border` / `border-neutral-200/80` or `border-neutral-800`), muted secondary text (`text-muted-foreground`).
  - **10% Brand Accent**: Exactly **one** primary brand color for critical CTAs and active states.
- **Rule of Thumb**: Vibe-coded UIs look bad because they use five colors without purpose. Restraint conveys confidence and craft.

### D. Component Architecture: shadcn/ui & Headless Primitives
- **Default to `shadcn/ui`**: Use accessible, unstyled Radix UI primitives styled with Tailwind CSS.
- **Copy-and-Own Model**: Inspect, customize, and refine components in `components/ui/` rather than treating external UI kits as black boxes.
- **Modern Polish**: Flat or subtle borders (`border border-border/60`), crisp 1px hair-lines, ultra-subtle ring shadows (`shadow-sm`), and intentional border-radii (`rounded-lg` or `rounded-xl`). Avoid dated 2015-era glossy gradients and fuzzy drop-shadows.

---

## 3. Domain Context & Competitive Analysis ("Steal Like an Artist")

- **Domain-Specific Visual Language**:
  - A B2B SaaS platform requires density, clarity, data visualization, and sober neutrals.
  - An eCommerce store requires high-impact product imagery, clear pricing, and conversion-focused friction reduction.
  - A developer tool demands high information density, keyboard navigation, and monospace precision.
- **Competitive Analysis**:
  - Top category leaders invest millions of dollars and thousands of hours in A/B testing layouts, typography, and flows.
  - Do not invent non-standard UX patterns for standard user flows. Learn from and adopt proven structural conventions of industry benchmarks (e.g., Apple, Linear, Stripe, Vercel).

---

## 4. Installed Skills Reference

When working on UI and frontend implementations, activate and leverage the installed agent skills in `.agents/skills/`:
1. `frontend-design`: Crafting distinctive visual identity, anti-slop guidelines, typography, and aesthetic restraint.
2. `web-design-guidelines`: Vercel design system standards, component patterns, and UX best practices.
3. `apple-design`: Minimalism, high craft, subtle depth, and tactile polish.
4. `emil-design-eng`: Fluid motion, micro-interactions, layout transitions, and interactive delight.
5. `design-taste-frontend`: Elite visual direction and frontend polish.
