# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2026-07-02] — Performance & contact form

### Changed
- Converted all 71 site photos from oversized PNG/JPEG to WebP (max 1920w, quality 78, stripped metadata) and repointed every reference. Images directory dropped ~125 MB → 9.9 MB (~92%); homepage image payload ~15.7 MB → ~1.05 MB.
- Hero slideshow now preloads only the first (LCP) image and defers slides 2–3 to `requestIdleCallback` instead of loading all three up front. Added `loading="lazy"` to the below-fold expertise and let's-talk background images.
- OG image is now an 88 KB 1200×630 JPG (`og-default.jpg`), kept raster for social scrapers.

### Fixed
- Contact form now posts to the Basin endpoint (`usebasin.com/f/2778b289d634`) instead of the Formspree placeholder; verified end-to-end.

## [2026-07-02] — Allied Construction replica

Near-pixel replica of the Allied Construction reference site, built the Astro way with all assets stored locally.

### Added
- Design foundation: `data-theme="Dark"|"Neutral"` (default = light) section system driving `.theme-*` utilities; Syne (display) + Albert Sans (body); black/white/grey palette with teal logo accent. Mirrored in `src/data/design-tokens.json`.
- Homepage (`/`): centered hero crossfade slideshow, featured projects, stats, testimonial, Leaflet locations map, expertise, and CTA.
- Top-level pages: `/projects`, `/services`, `/team`, `/contact` (left-aligned heroes; shared `PageHero`). Contact form via `ContactForm.jsx` (Formspree).
- `projects` content collection + `projects/[...slug].astro` template. Seven project detail pages (black-desert, apex-meadows, the-edwin, tech-ridge, the-oasis, fort-pierce, zonos-hangar) with hero, stats, about, and gallery. Listing and homepage cards link to each.
- `services` content collection + `services/[...slug].astro` template. Four service detail pages (general-contracting, pre-construction, construction-management, owner-representation) with hero, intro, alternating feature blocks, optional steps list, why-us block, and closing CTA. `/services` tiles link to each.
- Styleguide (`/styleguide`, noindex) rewritten to reflect the real Allied design system: palette, theme bands, typography, buttons, and component patterns.

### Removed
- Starter demo pages `/about`, `/blog` (+ `blog/[...slug]`), and `/islands`, plus the unused `pages` and `posts` content collections and their entries.

### Deployed
- Live on Vercel project `allied-construction` at https://builtbyallied.com (apex; www redirects to apex). `src/data/site-meta.json` `url` set to the production domain.

### Notes
- `construction-management`'s reference accordion ("Turning plans into reality") is rendered as a static steps list (no interactive island).
- `src/data/site-meta.json` `formspreeId` is still a placeholder (`YOUR_FORM_ID`) — the contact form won't submit until the real Formspree form ID is set.
