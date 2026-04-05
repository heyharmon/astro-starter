# Design System

The design system is implemented through two complementary files:

- **`src/styles/global.css`** — The live CSS. Tailwind 4 theme tokens, base element styles, button utilities, and prose styling.
- **`src/data/design-tokens.json`** — Machine-readable reference. Agents read this to know which Tailwind classes to use without parsing CSS.

Both must stay in sync. When you change one, update the other.

## Tailwind 4 Configuration

Tailwind CSS 4 is configured entirely in `global.css` using `@theme` blocks — there is no `tailwind.config.js` file. The Vite plugin (`@tailwindcss/vite`) handles integration.

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --color-neutral-50: #fafafa;
  /* ... full scale ... */
  --color-indigo-600: #4f46e5;
  /* ... */
}
```

## Color Palette

### Neutral Scale (base template)

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#fafafa` | Alternating section backgrounds |
| `neutral-100` | `#f5f5f5` | Code block backgrounds |
| `neutral-200` | `#e5e5e5` | Borders, dividers, card borders |
| `neutral-300` | `#d4d4d4` | Input borders, ghost button borders |
| `neutral-400` | `#a3a3a3` | Subtle/muted text |
| `neutral-500` | `#737373` | Secondary text, labels |
| `neutral-600` | `#525252` | Body paragraph text |
| `neutral-700` | `#404040` | — |
| `neutral-800` | `#262626` | — |
| `neutral-900` | `#171717` | Primary text, headings |
| `neutral-950` | `#0a0a0a` | — |

### Accent Scale (base template)

The base template uses indigo. Client branches override this with their brand color.

| Token | Hex | Usage |
|-------|-----|-------|
| `indigo-50` | `#eef2ff` | Light accent backgrounds |
| `indigo-600` | `#4f46e5` | Primary buttons, links, accent text |
| `indigo-700` | `#4338ca` | Button hover state |

### How Clients Override Colors

On a client branch, the design agent replaces the accent scale in `global.css` `@theme` and updates `design-tokens.json` accordingly. The neutral scale may also change (e.g., warm grays for a preschool, cool grays for a tech company).

## Typography

### Fonts (base template)

| Role | Font | CSS Variable |
|------|------|-------------|
| Headings + body | Inter | `--font-sans` |
| Code | JetBrains Mono | `--font-mono` |

Fonts are loaded via the `Head.astro` component (Google Fonts links). Client branches can change fonts by updating the `@theme` font variables and the Google Fonts import.

### Heading Hierarchy

| Element | Classes | Line Height |
|---------|---------|-------------|
| `h1` | `font-sans font-semibold tracking-tight text-neutral-900 text-4xl sm:text-5xl` | `1.1` |
| `h2` | `font-sans font-semibold tracking-tight text-neutral-900 text-2xl sm:text-3xl` | `1.15` |
| `h3` | `font-sans font-medium text-neutral-900 text-xl` | `1.2` |

### Body Text

| Element | Classes |
|---------|---------|
| `p` | `leading-relaxed text-neutral-600` |
| Small | `text-sm text-neutral-400` |
| Labels | `text-sm font-medium uppercase tracking-wider text-neutral-500` |

## Layout Conventions

| Pattern | Classes |
|---------|---------|
| Container max width | `max-w-5xl` |
| Container horizontal padding | `px-6` |
| Section vertical padding | `py-24 sm:py-32` |
| Card | `rounded-xl border border-neutral-200 p-8` |
| Grid gap | `gap-8` |

## Buttons

Two button utilities are defined in `global.css`:

### Primary Button (`.btn-primary`)

```css
.btn-primary {
  @apply inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white no-underline transition-colors;
}
.btn-primary:hover {
  @apply bg-indigo-700;
}
```

### Ghost Button (`.btn-ghost`)

```css
.btn-ghost {
  @apply inline-block rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 no-underline transition-colors;
  background: transparent;
}
.btn-ghost:hover {
  @apply border-neutral-900 bg-neutral-900 text-white;
}
```

## Prose Styling

Rendered Markdown content is wrapped in a `.prose` container. The prose system styles headings, paragraphs, lists, blockquotes, code, and links within Markdown-rendered sections.

Key prose rules:
- `h2`: `mt-12 mb-4`
- `h3`: `mt-8 mb-3`
- `p`: `mb-6 text-neutral-600`
- Lists: `pl-6 space-y-2`
- Blockquotes: `border-l-2 border-neutral-300 pl-6 italic`
- Inline code: `bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono`

## Design Tokens JSON

`src/data/design-tokens.json` is the machine-readable companion to `global.css`. Agents read it to determine which Tailwind classes to use without parsing raw CSS.

### Structure

```json
{
  "colors": {
    "background": { "primary": "white", "secondary": "neutral-50" },
    "text": { "primary": "neutral-900", "body": "neutral-600" },
    "accent": { "base": "indigo-600", "hover": "indigo-700" },
    "button": { "primary": { "bg": "indigo-600", "text": "white" } }
  },
  "typography": { "fonts": { "heading": "Inter", "body": "Inter" } },
  "spacing": { "sectionPadding": "py-24 sm:py-32", "containerMax": "max-w-5xl" },
  "effects": { "borderRadius": { "card": "rounded-xl", "button": "rounded-lg" } },
  "componentPatterns": { "hero-text": { "description": "..." } }
}
```

### Component Patterns

The `componentPatterns` section documents recurring layout patterns with descriptions and references to where they appear in the codebase. When building new pages, agents pick from established patterns to maintain visual consistency.

| Pattern | Description |
|---------|-------------|
| `hero-text` | Text-only hero with headline, subheadline, and dual CTA buttons |
| `card-grid` | Grid of bordered cards (3-col lg, 2-col sm) with icon, title, description |
| `cta-centered` | Centered text section with heading, description, and primary button |
| `section-2col` | Two-column grid — text content + image |
| `section-alternating-bg` | Sections alternate between `bg-white` and `bg-neutral-50` |

## Style Tile

The style tile at `/style-tile` (`src/pages/style-tile.astro`) is a development-only page that previews the full design system. It is not included in navigation and has a `noindex` meta tag.

**Layer 1 (Atomic):** Color swatches, typography samples, buttons, form inputs, borders/effects.

**Layer 2 (Component Patterns):** Hero sections, card variants, CTA bands, section layouts, nav/footer previews. This section grows — when building a new page type, add the new pattern to the style tile.

The style tile does not use `BaseLayout` — it renders nav/footer as specimens, not wrappers. It imports `global.css` directly so it reflects live token values.

## Placeholder Images

SVG placeholder images at standard aspect ratios for use before real images are sourced:

| File | Ratio | Use for |
|------|-------|---------|
| `public/images/placeholders/hero-16x9.svg` | 16:9 | Hero backgrounds, CTA bands |
| `public/images/placeholders/square-1x1.svg` | 1:1 | Thumbnails, avatars |
| `public/images/placeholders/portrait-3x4.svg` | 3:4 | Team photos, tall cards |
| `public/images/placeholders/landscape-4x3.svg` | 4:3 | Project images, service cards |

Referenced as `/images/placeholders/hero-16x9.svg` from any page.

## Rules for Modifying the Design System

1. **No inline `<style>` blocks.** All styling goes through Tailwind classes or the `global.css` theme/base/prose system.
2. **Token changes vs. component changes.** Identify whether the user wants a global token change (edit `@theme`) or a component-specific change (edit Tailwind classes in the `.astro` file).
3. **Keep CSS and JSON in sync.** After changing `global.css` tokens, update `design-tokens.json`.
4. **Verify token coverage.** Before changing tokens, check for hardcoded hex values or Tailwind arbitrary values that would bypass the theme.
5. **On `main`, use the neutral starter palette.** Client-specific colors belong on client branches only.
