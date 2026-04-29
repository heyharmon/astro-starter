# Site Guide — CMS Quick Reference

Concise reference for agents performing CMS operations. For full documentation, see `docs/`.

---

## Content Schemas

### Pages (`src/content/pages/*.md`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | `<title>` tag and SEO |
| description | string | yes | Meta description |
| headline | string | yes | Hero heading |
| subheadline | string | no | Supporting text below headline |
| featuredImage | `{ src, alt }` | no | Hero image and social sharing |
| draft | boolean | no | Hides from listings (default: `false`) |

### Services (`src/content/services/*.md`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Service name |
| description | string | yes | Short summary |
| icon | string | yes | Emoji or icon character |
| image | `{ src, alt }` | no | Card background image |
| order | number | yes | Sort position |

### Projects (`src/content/projects/*.md`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Project name |
| description | string | yes | Short summary |
| client | string | no | Client name |
| location | string | no | Project location |
| image | `{ src, alt }` | no | Project image |
| order | number | yes | Sort position |
| featured | boolean | no | Show on homepage (default: `false`) |

Full schema details: `docs/content-schemas.md`

---

## Configuration Files

| File | Purpose |
|------|---------|
| `src/data/nav.json` | Navigation links: `[{ label, href, order }]` |
| `src/data/footer.json` | Footer link groups: `[{ section, links: [{ label, href }] }]` |
| `src/data/site-meta.json` | Site name, URL, description, OG image, social links, formspreeId |
| `src/data/client.json` | Client identity, deploy config — see `docs/client-management.md` |
| `src/data/design-tokens.json` | Machine-readable design system — see `docs/design-system.md` |
| `src/data/build-state.json` | Stage-gate progress — see `docs/build-workflow.md` |

---

## Operation Skills

Procedural how-tos live in agent skills (each is self-contained):

| Operation | Skill |
|-----------|-------|
| Create a page | `.claude/agents/content/create-page.md` |
| Edit content | `.claude/agents/content/edit-content.md` |
| Create a blog post | `.claude/agents/content/create-blog-post.md` |
| Update navigation | `.claude/agents/content/update-nav.md` |
| Draft all pages (build flow) | `.claude/agents/content/draft-all-pages.md` |
| Update SEO | `.claude/agents/seo/update-seo.md` |

---

## SEO Rules

- Title renders as "Title | Site Name" — rendered length must be under 60 characters
- Description max 155 characters, unique per page
- OG images: place in `public/images/`, reference as `/images/filename.ext`
- Canonical URLs auto-generated from `site-meta.json` `url` + pathname

---

## Styling Rules

- No inline `<style>` blocks — use Tailwind classes or `global.css`
- Token changes go in `@theme` block; component changes go in `.astro` file classes
- Keep `global.css` and `design-tokens.json` in sync
- On `main`, use neutral starter palette only

Full design system: `docs/design-system.md`

---

## Validation

```bash
npm run validate
```

Checks: JSON validity, required fields, non-empty nav, valid `client.json`, full Astro build. A task is not complete until validation passes.
