# Build Workflow

When building a new client site (not doing CMS maintenance on an existing one), the project follows a stage-gate process. Each stage must be approved before moving to the next.

## Stages

| # | Stage | What Happens | Gate |
|---|-------|-------------|------|
| 1 | **Style** | Design agent applies reference aesthetic to the style tile. Updates `global.css` tokens and `design-tokens.json`. | Human approves style tile |
| 2 | **Sitemap** | Orchestrator proposes page list + nav structure based on reference or client brief. | Human approves sitemap |
| 3 | **Content Drafts** | Content agent drafts all page copy in `src/content/pages/*.md` with `draft: true`. No layout work yet. | Human reviews copy (soft gate) |
| 4 | **Page Building** | Build pages in cohorts of 2-3. Homepage is always cohort 1. | Human reviews after each cohort |
| 5 | **Final Review** | Full-site visual audit (all pages, desktop + mobile). SEO optimization pass. Design compliance check. | Human final approval |

## Stage 1: Style

The design agent takes a reference URL (or a brief describing the desired aesthetic) and:

1. Screenshots the reference site
2. Extracts colors, typography, spacing patterns
3. Updates `src/styles/global.css` `@theme` block with new tokens
4. Updates `src/data/design-tokens.json` to match
5. Builds the style tile at `/style-tile` to preview the full design system

The style tile shows atomic tokens (colors, typography, buttons) and component patterns (hero, cards, CTAs) using the new design language.

**Gate:** You review the style tile and either approve or request changes.

## Stage 2: Sitemap

Based on the reference site or client brief, the orchestrator proposes:

- Page list (Home, About, Services, Contact, etc.)
- Navigation structure (`nav.json`)
- Content hierarchy (which services, any blog, project showcase, etc.)

**Gate:** You approve the page list or modify it.

## Stage 3: Content Drafts

The content agent creates all page content files with `draft: true`:

- Writes headline, subheadline, and body copy for each page
- Creates service entries if applicable
- Matches tone to the client's industry and brand voice
- Does NOT create route files or do any layout work yet

**Gate:** You review the copy. This is a soft gate — you can iterate on copy during page building too.

## Stage 4: Page Building

Pages are built in cohorts of 2-3. The homepage is always in cohort 1.

### Per-Cohort Sequence

For each cohort, agents execute in this order:

| Step | Agent | What |
|------|-------|------|
| 1 | **Dev** | Structural layout — new sections, grids, HTML in `.astro` route files |
| 2 | **Content** | Places drafted copy into the layout, flips `draft: false` |
| 3 | **Design** | Styles any new component patterns, updates style tile + `design-tokens.json` |
| 4 | **Images** | Sources and places images via the `source-page-images` skill |
| 5 | **Polish** | Design agent runs `polish-page` — section-by-section visual refinement |
| 6 | **Evaluate** | Screenshots at 1280px and 375px, grades against evaluation criteria |
| 7 | **Report** | Presents screenshots, scores, and flagged issues |

**Gate:** You review each cohort before the next one starts.

## Stage 5: Final Review

After all cohorts are built:

1. Full-site visual audit (every page, desktop + mobile)
2. SEO optimization pass (meta titles, descriptions, OG images)
3. Design compliance check (token usage, visual consistency)
4. Fix any flagged issues

**Gate:** Final human approval before deployment.

## State Tracking

Progress is tracked in `src/data/build-state.json`:

```json
{
  "stage": "page-building",
  "completedStages": ["style", "sitemap", "content-drafts"],
  "currentCohort": 1,
  "cohorts": {
    "1": {
      "pages": ["home"],
      "status": "in-progress"
    },
    "2": {
      "pages": ["about", "services"],
      "status": "pending"
    }
  },
  "sitemapApproved": true,
  "styleTileApproved": true,
  "notes": "Client: Acme Corp"
}
```

Agents and the orchestrator read this file at session start to know where the build left off.

**Inference fallback** (if `build-state.json` is missing or reset): The orchestrator can infer state from the codebase:
- `style-tile.astro` has non-default content → style stage done
- `nav.json` has real pages → sitemap done
- Content files have body text → drafts exist

## Evaluation Criteria

The grading rubric at `src/data/evaluation-criteria.md` scores each page on:

### Visual (1-5 scale)
- **Token compliance** — uses design tokens, not hardcoded values
- **Visual consistency** — feels like the same site as other pages
- **Hierarchy & readability** — clear heading levels, adequate whitespace
- **Responsive behavior** — clean at 1280px and 375px
- **Brand coherence** — reinforces the established aesthetic

### Content (1-5 scale)
- **Tone consistency** — same voice across pages
- **SEO alignment** — copy supports meta tags
- **Readability** — short paragraphs, scannable structure
- **Specificity** — concrete details, not generic filler

### Uncanny Valley Check (pass/fail)
- Layout variety (not the same section rhythm on every page)
- Image authenticity (no mismatched stock photos)
- Content specificity (doesn't read like a template)
- Visual asymmetry (some tension, not perfectly symmetric grids)
- Section economy (not too many sections)

**Passing threshold:** No criterion below 3, average above 3.5.
