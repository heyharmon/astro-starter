# Astro Starter — Claude Code CMS Operator

## Project Identity

- **Site**: Acme Studio (configurable in `src/data/site-meta.json`)
- **Framework**: Astro 5 with static output
- **Styling**: Tailwind CSS 4 (utility classes, configured in `src/styles/global.css`)
- **Interactive**: Vue 3 (used only for `ContactForm.vue`)
- **Content**: Astro Content Collections with Zod schemas

## Architecture Rules

1. **Content lives in `src/content/`** — never hardcode text into `.astro` page files
2. **Schemas are in `src/content.config.ts`** — if you add a frontmatter field, update the schema first
3. **Config lives in `src/data/`** — `nav.json` (navigation), `footer.json` (footer links), `site-meta.json` (identity, SEO, social)
4. **Styles live in `src/styles/global.css`** — Tailwind theme, base styles, prose styling
5. **`.astro` for static, `.vue` for interactive** — only add Vue components when client-side JS is required
6. **Static output** — no SSR, no server. Everything pre-renders at build time

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Build static site to dist/
npm run preview      # Preview built site
npm run validate     # Run full validation (config + build)
```

## Operations Reference

Read **SITE_GUIDE.md** for the full CMS operations manual — content schemas, step-by-step procedures, styling reference, SEO conventions, and validation checklist.

## Validation

Run `./scripts/validate.sh` (or `npm run validate`) after every content or config change. Do not consider a task complete until validation passes.
