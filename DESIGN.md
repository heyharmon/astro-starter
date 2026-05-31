# Design

Visual system for **Maplewood Early Learning** — the neutral theme-base. This documents the base; each theme branch (Hearth, Beacon, Jubilee, Grove, Atelier) overrides token *values*, the font `<link>`, and per-component presentation, never the token *names*, component APIs, or content. Source of truth: [`src/styles/global.css`](src/styles/global.css), mirrored in [`src/data/design-tokens.json`](src/data/design-tokens.json).

## Theme

A clean, true-neutral grayscale on white. The base intentionally carries **no brand color identity** — it is a structural canvas. Warmth and personality are introduced by each theme through accent color, typeface, and imagery, not by a default warm-tinted background. The base reads as calm, confident, and unhurried, which suits an anxious parent deciding who to trust with their child; the structure does the reassuring before any color arrives.

## Color

True-neutral ramp (equal RGB channels), tuned so labels and body text meet WCAG AA on the base before any theme tints them.

| Token | Value | Role |
|-------|-------|------|
| `--color-bg` | `#ffffff` | page background |
| `--color-surface` | `#f5f5f5` | cards / raised |
| `--color-surface-2` | `#ebebeb` | sunk / alternating section panel |
| `--color-ink` | `#1a1a1a` | primary text / headings (16.9:1 on bg) |
| `--color-ink-soft` | `#565656` | secondary / body text (7.0:1 on bg) |
| `--color-primary` | `#2e2e2e` | brand / primary buttons |
| `--color-primary-d` | `#111111` | dark bands (footer, testimonials, CTA), hovers |
| `--color-accent` | `#585858` | labels / eyebrow / accent word (7.0:1 on bg) |
| `--color-accent-2` | `#a3a3a3` | decorative (dots), on-dark eyebrow |
| `--color-line` | `#e4e4e4` | hairlines / borders |
| `--color-error` | `#b42318` | inline / form error text |
| `--color-blue`, `--color-green` | `#585858` | safe aliases for Jubilee's rotating hues |

Sanctioned exception: `#fff` inside `color-mix()` on the dark bands (footer, testimonials, banner CTA). No other hard-coded colors in components.

## Typography

**One neutral system family** on the base (`ui-sans-serif, system-ui, …` on both `--font-display` and `--font-body`). Hierarchy is carried by size + weight + tracking contrast, not by a second face — a single committed family beats a timid display/body pair. Theme branches repoint `--font-display`/`--font-body` via a font `<link>` in `Head.astro` to introduce a display face.

- **Fluid scale** (`--step--1` … `--step-4`), ~1.28 ratio, `clamp()` for headings. h1 = step-4 (max 5.5rem), h2 = step-3, h3 = step-1, body = step-0.
- **Tracking tightens with size**: h1 −0.035em, h2 −0.03em, h3 −0.015em (display sizes carry the hierarchy, so they commit).
- Headings weight 600, body 400, labels 700. Body line-height 1.65; `text-wrap: balance` on headings, `pretty` on prose.
- The `.accent` seam (italic emphasis word inside a headline) is the per-theme color hook; neutral on the base.

## Spacing & Layout

- Container `--maxw` 1200px, fluid `--gutter` `clamp(1.25rem, 4vw, 3rem)`.
- **Section rhythm as tokens** so cadence can vary: `--space-section` (default), `--space-section-sm` (`.section--tight`, for stacked related sections), `--space-section-lg` (`.section--lg`, before a major shift).
- Composition is deliberately **varied**, not one module repeated: asymmetric splits (FeatureGrid heading + reasons list), an editorial two-column PageHero, the section heading folded into the grid as its first tile (ValueGrid manifesto), alternating image rows (ProgramRow), a vertical timeline (Schedule), a de-carded quote wall on a dark band (Testimonials), and trust stats divided by hairlines (StatBand). The eyebrow kicker is used selectively (it is a themeable primitive), not above every section.

## Components

Token-driven, presentation-swappable. Buttons (`primary` / `ghost` / `invert`), `.eyebrow`, `.lead`, `.accent`, `.card`, `.tag`, `.ph` image placeholders (the seam for real `astro:assets` imagery), sticky header, dark footer. Cards use full borders / hairline dividers / leading numerals — never side-stripe accents. Forms are fully token-driven with visible focus rings. See `design-tokens.json` `componentPatterns` for the full list.

## Motion

Ease-out only (`--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)`), no bounce. Durations `--dur` (0.25s hover) and `--dur-reveal` (0.7s entrances).

- **First-load choreography** on the home hero (copy rises in sequence, framed image settles, stat badge pops) — the one orchestrated page-load.
- **Scroll reveals tailored to content**: framed media *settles* (`.reveal-media`, rise + slight scale) while text *rises* (`.reveal`); `[data-stagger]` grids reveal their items in sequence (`.reveal-soft`). Driven by the IntersectionObserver in `BaseLayout.astro`, with a 700ms safety timeout so content is never gated on the reveal.
- **Micro-interactions**: hover-lift on interactive cards (`.lift`), media zoom in framed cards, button lift + shadow, FAQ summary hover, input focus ring.
- Every animation has a `prefers-reduced-motion: reduce` fallback (instant / no transform). Content is fully visible without JS.

## Accessibility

WCAG 2.1 AA. AA-contrast neutral ramp; global `:focus-visible` ring; skip-to-content link; `scroll-margin-top` for anchors under the sticky header; labeled form fields with `aria-live` status; semantic heading order; descriptive placeholder `alt`; native `<details>` for FAQ and mobile nav; reduced-motion honored throughout.
