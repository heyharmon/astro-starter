# Handoff: Build the 5 theme branches on top of the Maplewood base

## Context you need

This repo is the **Maplewood Early Learning** daycare/preschool **theme-base**: one neutral, content-complete base site (`maplewood-base` branch) holding all pages, layouts, components, content, and a CSS **token contract**. The product model: **every client site = the Maplewood base (pages/layouts/content) + ONE of five themes**, whichever is the closest-fit visual starting point, then customized for that client.

Your job: build the **five theme branches** — `theme/hearth`, `theme/beacon`, `theme/jubilee`, `theme/grove`, `theme/atelier` — each forked from `maplewood-base` and re-skinned by changing **ONLY (1) token values, (2) fonts, (3) per-component presentation**. Content, routing, and component prop APIs never change.

Read first: `CLAUDE.md`; the memory file `~/.claude/projects/-Users-ryanharmon-Documents-Code-astro-starter/memory/maplewood-theme-base.md`; and the base token contract `src/styles/global.css` (the thing you swap).

### Source of truth per theme

`~/Downloads/small-seats-demos/<name>/` (all five present):
- **`design.md`** — canonical spec: §2 colors/re-brand rule, §3 typography, §4 shape/depth (radius, shadow, outline specifics), §5 per-component presentation, §7 sanctioned copy overrides, do/don'ts. **Read this fully before touching a theme.**
- **`theme.css`** — the demo's actual `:root` token values + bespoke component CSS. Lift values from here.
- **`index/programs/about/contact.html`** — visual reference. Match spirit, not pixels.

### The five themes (identity + best-fit client)

| Theme | Identity | Display / Body font | Best-fit client |
|---|---|---|---|
| **Hearth** | Warm, literary, editorial; sage + clay on cream; organic blobs, soft shadows | Newsreader / Mulish | Nurturing, boutique, "second home" warmth |
| **Beacon** | Academic, structured, crisp; navy + azure + amber; hairline grids, numbered, tabular, small radii | Space Grotesk / IBM Plex Sans | Established, transparent, "well-run modern school" |
| **Jubilee** | Playful, bold, joyful; coral/yellow/blue/green + ink outlines + hard offset "sticker" shadows; full pills | Fredoka / Nunito Sans | Fun, energetic, younger/vibrant brand |
| **Grove** | Clean, organic, editorial; forest green + bright leaf; oversized type, row/list layouts, big whitespace | Hanken Grotesk (one family, weight 800) | Premium, wellness, grown-up-natural |
| **Atelier** | Refined, minimalist, quiet-luxury; charcoal + muted clay; hairlines only, near-square radii, small-caps, asymmetric | Instrument Serif / Albert Sans | Design-forward, premium, restraint |

## Environment state — READ BEFORE BRANCHING

- **Branch:** `maplewood-base`, HEAD `72c3e91`.
- **The base just received an Impeccable design pass and those improvements are UNCOMMITTED** (modified: `global.css`, `design-tokens.json`, `index.astro`, `FeatureGrid`, `FounderNote`, `PageHero`, `ProgramCard`, `StatBand`, `Testimonials`, `ValueGrid`; new untracked `PRODUCT.md`). **Commit the base first** (confirm with the user) so every theme branch forks from the finished base. Do not branch off a dirty tree.
- No dev server running — `npm run dev` (port 4321 or next free; check the log).
- `npm run healthcheck` passes (6 routes: `/ /about /programs /enrollment /contact /styleguide`).
- Token contract is richer than the original handoff: colors + fonts in Tailwind `@theme`; in `:root` → `--step--1..--step-4` (~1.28 ratio), `--radius`/`--radius-lg`/`--radius-pill`, `--shadow`/`--shadow-soft`, `--space-section`/`--space-section-sm`/`--space-section-lg`, `--ease-out`/`--dur`/`--dur-reveal`, `--maxw`/`--gutter`, `--outline`/`--pop`, plus `--color-error`. Mirrored in `src/data/design-tokens.json`.
- Impeccable is installed + committed at `.claude/skills/impeccable/`; you may use `/impeccable critique|polish <surface>` to QA a theme, but each `design.md` is the primary driver.

## Per-theme token VALUES (quick-start)

Overwrite **values only** in `global.css` (and mirror to `design-tokens.json`). Names never change. See each `design.md` §3–§4 for type-scale clamp tweaks, shadow/outline specifics, and weight/italic rules.

| token | Hearth | Beacon | Jubilee | Grove | Atelier |
|---|---|---|---|---|---|
| `--color-bg` | `#F7F1E6` | `#FFFFFF` | `#FFFDF5` | `#F4F1E8` | `#F1EDE6` |
| `--color-surface` | `#FFFDF8` | `#F4F6FB` | `#FFFFFF` | `#FCFBF6` | `#FBF9F5` |
| `--color-surface-2` | `#EFE6D5` | `#EEF2FA` | `#FFF1D6` | `#E9E4D5` | `#E5DFD4` |
| `--color-ink` | `#2E2A22` | `#11203B` | `#20223D` | `#1B241C` | `#28251F` |
| `--color-ink-soft` | `#6B6354` | `#586480` | `#5C5F7E` | `#5A6258` | `#847E73` |
| `--color-primary` | `#6E7E58` | `#1B3A6B` | `#FF6B5B` | `#1F4D38` | `#28251F` |
| `--color-primary-d` | `#51603F` | `#11203B` | `#E84B3C` | `#143527` | `#16140F` |
| `--color-accent` | `#C5714B` | `#2563EB` | `#FFC93C` | `#9FC131` | `#A9846A` |
| `--color-accent-2` | `#D8A24A` | `#F5A623` | `#41C28A` | `#C5683B` | `#6E7B73` |
| `--color-line` | `#DED2BC` | `#DCE3F0` | `#20223D` | `#D8D2C2` | `#D6CFC2` |
| `--radius` | `18px` | `10px` | `18px` | `8px` | `4px` |
| `--radius-lg` | `32px` | `16px` | `28px` | `20px` | `6px` |
| `--radius-pill` | `999px` | `8px` | `999px` | `999px` | `2px` |
| `--font-display` | Newsreader | Space Grotesk | Fredoka | Hanken Grotesk | Instrument Serif |
| `--font-body` | Mulish | IBM Plex Sans | Nunito Sans | Hanken Grotesk | Albert Sans |

- `--color-blue` / `--color-green`: keep aliased to `--color-accent` **except Jubilee**, which uses `--color-blue: #3DA9FC`, `--color-green: #41C28A` (rotated across cards/sections).
- **Jubilee** also repoints (not renames) the outliers: `--outline: 2.5px solid var(--color-ink)`, `--pop: 5px 5px 0 var(--color-ink)` (hard offset "sticker" shadow, no blur). **Atelier** repoints `--outline` to a 1px hairline and flattens shadows. **Grove** bumps the `--step-4` clamp larger (oversized type). Confirm exact values in each `design.md` §4.
- Keep `--space-section*`, `--ease-*`, `--dur*`, `--color-error` at base defaults unless a `design.md` calls for a change.

## What I want you to do, in order

0. **Confirm `maplewood-base` is committed and clean** (commit the pending Impeccable improvements first if the user approves). Then, per theme:
1. `git checkout maplewood-base && git checkout -b theme/<name>`
2. Read `~/Downloads/small-seats-demos/<name>/design.md` in full; skim its `theme.css` and HTML pages.
3. **Tokens** — overwrite values in `src/styles/global.css` (`@theme` colors/fonts + `:root` radius/shadow/clamps/outline/pop) from the table + `design.md`. Mirror into `src/data/design-tokens.json`.
4. **Fonts** — add the two Google Fonts `<link>` tags in `src/components/Head.astro` (there's a commented placeholder block showing exactly where) and repoint `--font-display` / `--font-body`. All nine fonts are on Google Fonts. Project convention is Google Fonts `<link>`, not `@fontsource`.
5. **Presentation** — apply each component's `design.md` §5 treatment by editing component scoped `<style>` and markup only. This includes the layout-pattern differences and signature moves: Hearth's italic accent word + organic blob frames; Beacon's numbered section markers + tabular schedule + bordered grids; Jubilee's sticker shadows + 4-color rotation via `:nth-child` + outlined pills; Grove's oversized headings + program/feature **rows** (not cards) + animated underlines; Atelier's hairline-divided rows + small-caps tracked labels + Roman-numeral indices + underline-only form fields. **Never** edit props, `site-content.json`, page composition, or routing.
6. **Verify** (below), iterate against the `design.md` do/don'ts, then propose a commit on the theme branch.

Build one theme at a time so each can be reviewed. The branches are independent (no shared state), so order is free — **start with Hearth** (most complete spec; it's the role model the base was derived from).

## Verification (per theme branch)

- `npm run healthcheck` green.
- **Content unchanged:** `git diff maplewood-base -- src/data/site-content.json` is empty (the only allowed exception: sanctioned per-theme label/headline overrides from `design.md` §7 — e.g. Jubilee may rename the four programs to *Tiny Sprouts / Busy Bees / Curious Cubs / Bright Sparks*). Same for `nav.json`/`footer.json`.
- **Tokens only:** grep components/pages for hard-coded hex/font/px → none (sanctioned exception: `#fff` in `color-mix()` on dark bands).
- **Visual QA** via **playwright-cli only** (CLAUDE.md forbids Playwright MCP), all 6 routes at **1440 + 375** (spot-check 768), with `sleep ≥1.2s` after `goto` (scroll-reveal 700ms safety timeout). `/styleguide` shows every token + component on one page — fastest first check. Compare against `~/Downloads/small-seats-demos/<name>/*.html`.
  ```bash
  npm run dev   # note port
  playwright-cli open http://localhost:<PORT>/styleguide
  playwright-cli resize 1440 900 && sleep 1.2
  playwright-cli screenshot --full-page --filename=/tmp/<name>-styleguide.png
  ```
- Acceptance (original §9): all routes build, no overflow at 1440/768/375; every color/font/radius from a token; fonts load; placeholders intact; contact form validates + shows success; `aria-current` on active nav; `prefers-reduced-motion` honored.

## Gotchas

- **Scroll-reveal:** `BaseLayout` adds `.reveal`→`.in` to `.section > .wrap > *` (honors reduced-motion). `sleep ≥1.2s` before screenshots or below-fold = blank.
- **Astro scoped-style:** a class passed into a child component can't be targeted from the parent's scoped `<style>`; use `.parent :global(.x)`. Existing components follow this.
- **Tailwind 4:** scoped component styles are unlayered, so they override the `@layer components` globals reliably. `@theme` colors/fonts double as utilities (`bg-surface`, `font-display`).
- Contact form is **React** (`ContactForm.jsx`, `client:idle`). Mobile nav + FAQ use no-JS `<details>`. `playwright-cli` writes a gitignored `.playwright-cli/`.

## Constraints

- **Never** change `src/data/site-content.json` (beyond §7 label overrides), page composition, routing, or component prop APIs. If a theme seems to need a content/structure change, stop — that belongs on `maplewood-base`, not a theme branch.
- **Never** introduce new token NAMES — values only (Jubilee/Atelier reuse `--outline`/`--pop`).
- No hard-coded hex/font/px in components.
- **Do not commit without explicit approval.** One branch per theme; never merge a theme into `maplewood-base` or `main`.
- Use TodoWrite to track the 5 themes; verify each before reporting done.

## When you're done (per theme)

- `healthcheck` green; screenshots at 1440 + 375 for all 6 routes; the empty `site-content.json` diff confirmed.
- A concise summary: token values changed, fonts added, and the per-component presentation moves applied, with the demo screenshot comparison.
- Propose a commit on `theme/<name>` (do not commit without approval).
- After all five: update the memory file to mark the theme branches built.
