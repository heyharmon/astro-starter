# Design Evaluation Improvements

Based on [Anthropic's "Harness Design for Long-Running Apps"](https://www.anthropic.com/engineering/harness-design-long-running-apps) article, lessons from testing the "replicate eaglepointwelding.com" workflow, and steelman/red-team analysis of the full plan.

## Core Insights

1. Agents are bad at judging their own subjective output — separating generator from evaluator and using browser-based visual verification improves quality.
2. One-shot website replication is the wrong workflow — it builds too much before getting feedback, making rework expensive and quality unpredictable.
3. Visual capture (screenshots) must happen before any agent work — text extraction alone misses layout, imagery, and visual weight.
4. Style must be established before structure, and content drafted before layout — doing everything simultaneously is where both agencies and agents get stuck.
5. The design system is never fully "locked" — new pages introduce new component patterns that require design input as they're built.

---

## Phase 1: Visual Tooling (DONE)

### 1a. Visual Feedback Loop for Design Agent — DONE

Added `mcp__playwright__*` to design agent's tool list. Added step 8 "Visual verification" to `update-styles.md` — agent starts dev server, screenshots at desktop + mobile, reviews, iterates up to 3 times.

### 1b. Reference Visual Capture at Orchestration Level — DONE

Added "Reference-Based Work" routing rule to `CLAUDE.md`. Root orchestrator must screenshot reference sites with Playwright AND extract text with WebFetch before delegating to agents.

### 1c. Design Reference Comparison Skill — DONE

Created `match-reference.md` — comparison-driven design skill where the agent screenshots both reference and own site, lists specific differences, and iterates on changes.

### 1d. Playwright `--isolated` Flag — DONE

Fixed Playwright MCP config in both `.claude/plugins/.../playwright/.mcp.json` and `~/.claude.json` to use `--isolated`, preventing browser profile lock conflicts between sessions.

---

## Phase 2: Stage-Gate Workflow for Site Building – DONE

The "replicate a site" or "build a site" workflow should NOT be a single orchestrated run. It should be a multi-stage process with human review between stages.

### 2a. Style Tile Page + Design Tokens – DONE

**Problem:** The first test applied the right colors to the wrong structure. Tokens alone don't make a design system — component patterns do. And the design system can't be fully locked before page building because new pages introduce new layout components.

**Solution:** A dedicated style tile page (`/style-tile`) that presents the design system visually, backed by a machine-readable `design-tokens.json`.

**The style tile includes two layers:**

**Layer 1 — Atomic tokens (established in style stage, stable):**
- Color palette swatches (backgrounds, text, accent, borders)
- Typography samples (h1–h3, body, small/muted text, links)
- Button variants (primary, secondary, ghost/outline)
- Form input styling
- Border, radius, and shadow treatments

**Layer 2 — Component patterns (established in style stage, extended during page building):**
- Card treatments (bordered, filled, with/without images)
- Sample hero section (full-bleed image with overlay + text)
- Section layout patterns (1-col centered, 2-col split, grid)
- CTA band/banner
- Nav and footer preview

**The `design-tokens.json` file:**
- Generated alongside the visual style tile
- Contains all atomic tokens (colors, fonts, spacing, radii) as structured data
- Agents reference this file as the source of truth for the approved design system
- The design agent updates this file when new component patterns are added during page building

**Key principle: the design system is NOT locked after the style stage.** Atomic tokens (colors, fonts) are stable after approval, but component patterns grow as pages are built. The design agent is looped in during each page cohort to style new section types and update the style tile with new patterns. This prevents the "page 3 problem" where a testimonial carousel or pricing table has no design guidance.

**Placeholder images:** The style tile and starter template include generic placeholder images (like lorem ipsum for visuals) at standard aspect ratios (16:9 hero, 1:1 thumbnail, 3:4 portrait). These placeholders appear wherever a real image hasn't been sourced yet. A placeholder image is better than no image — it preserves layout integrity and gives the human a sense of composition.

**Implementation:**
- Dev agent creates the style tile page template (one-time, part of the starter)
- Design agent gets a new skill for applying a reference aesthetic to the style tile
- Style tile imports from `global.css` tokens — it's a living document, not a mockup
- `design-tokens.json` is generated and maintained alongside the visual page

### 2b. Content Drafting Stage – DONE

**Problem:** When copy and layout are created simultaneously, you end up with generic placeholder text baked into page structures. Content should exist before it's placed into layouts.

**Solution:** After the style is approved and sitemap is set, the content agent drafts all page copy in markdown — no layout, no styling, just the words. The orchestrator presents the drafts to the human for review.

This step does not require hard human approval to proceed, but having it as a distinct stage means:
- The content agent calibrates tone/voice across all pages before any are built
- The human can redirect messaging early ("we don't do residential work, remove that")
- Page building becomes assembly of approved copy into approved design, not invention of both simultaneously
- Copy quality is higher because the content agent focuses on writing, not on fitting words into layout slots

### 2c. Sitemap Approval Gate – DONE

**Problem:** The test agent built 10 pages without asking. The human had no input on which pages would exist or how content would be organized.

**Solution:** After the style is approved, the orchestrator proposes a sitemap based on the reference site and asks the human to approve, modify, or reject it before any pages are built.

**Format:**
```
Proposed sitemap based on [reference]:
- / (Homepage) — hero, services overview, projects preview, about teaser, CTA
- /about — company story, owner bio
- /services — service cards with descriptions
- /projects — project gallery grid
- /contact — contact form

Navigation: Home | Services | Projects | About | Contact

Approve this sitemap, or tell me what to change?
```

### 2d. Cohort-Based Page Building – DONE

**Problem:** Building all pages at once means no feedback loop during creation. Too many pages to review at once. If page 2 reveals a style issue, pages 3–10 are already wrong.

**Solution:** Build pages in small cohorts (2–3 pages), with human review after each.

**Sequence:**
1. Homepage first (always — it sets the standard)
2. Human reviews homepage — feedback may trigger style or content adjustments
3. Next cohort (e.g., About + Services) — pages that share patterns
4. Human reviews — adjustments are cheap because only 3 pages exist
5. Continue until all approved pages are built

**Per cohort, agents are called in this order:**
1. **Dev agent** — structural layout (new sections, grids, HTML)
2. **Content agent** — places drafted copy into the layout
3. **Design agent** — styles any new component patterns introduced by this cohort, updates style tile
4. **Image agent** — sources and places images for this cohort
5. **Evaluation** — screenshots at desktop AND mobile, compares against style tile and reference, grades quality, reports to human

**Benefits:**
- New component patterns get designed as they appear (no "page 3 problem")
- Style issues caught early, before they propagate
- Each cohort informs the next
- Human stays in control of scope and quality

### 2e. Evaluation + Grading After Each Cohort – DONE

After each cohort, run evaluation with explicit grading criteria:

**Visual grading:**
- **Token compliance** — do new components use design tokens, not ad-hoc values?
- **Visual consistency** — does this cohort's pages feel like the same site as previous cohorts?
- **Hierarchy & readability** — is content scannable? Clear typography hierarchy?
- **Responsive behavior** — screenshot at desktop (1280px) AND mobile (375px). Nothing overflows, overlaps, or collapses.
- **Brand coherence** — does the page reinforce the established aesthetic?

**Content grading:**
- **Tone consistency** — does this page sound like the other pages?
- **SEO alignment** — does body copy support the meta description?
- **Readability** — paragraphs are short and scannable?

**Uncanny valley check:**
- Are there telltale AI artifacts? Evenly-spaced symmetric layouts, generic stock photo feel, same section-heading-cards-CTA rhythm on every page?
- Would this page pass the "would a real business put this on their site" test?
- Fewer sections done well beats more sections done adequately.

---

## Phase 3: Specialist Agents & Capabilities

### 3a. Image Sourcing Specialist Agent

**Problem:** Every page in the test needed placeholder images. Image sourcing is curatorial work — brand, mood, aspect ratios, visual consistency. Stock photos for a specific welder's shop look generic. Real sites need real photos.

**Solution:** A dedicated image sourcing agent with:
- **Stock photo sourcing** — Unsplash, Pexels, with brand-aware queries
- **AI image generation** — custom illustrations, backgrounds, imagery that doesn't exist in stock
- **Reference site image pulling** — if the reference site exists, the agent can download and use images from it (with appropriate attribution/licensing consideration)
- **Quality standards** — minimum resolution, correct aspect ratios per placement, consistent visual style
- **Placement context** — hero background (wide, atmospheric) vs card thumbnail (square, focused) vs portrait (headshot)

**Integration:** Called after each page cohort. Human approves image selections before placement.

### 3b. Content Quality Review

Lightweight content review step — a fresh agent context reads the rendered page and flags tone inconsistencies, readability issues, or copy that contradicts SEO metadata.

### 3c. Design Audit Skill (CMS Mode)

**Problem (from red team):** Over months of CMS updates, one-off changes ("make this heading bigger," "change this button to red") degrade the design system without anyone noticing.

**Solution:** A periodic design audit skill that scans all `.astro` files for class divergence from established patterns in `design-tokens.json` and SITE_GUIDE.md. Flags drift: "You now have 4 different button styles across 12 pages."

---

## Phase 4: Backlog

Items identified but not prioritized for near-term work:

- **Deployment integration** — Netlify/Vercel integration for preview deploys and production releases
- **Git-based preview workflow** — every change to a branch, deploy preview before merge to production
- **Accessibility (WCAG compliance)** — assign agent ownership for alt text, color contrast, focus management, keyboard navigation, screen reader testing
- **Rollback mechanism** — semantic validation beyond build checks (typos, wrong phone numbers, deleted content)

---

## Full Workflow Vision

```
1. STYLE STAGE
   - Orchestrator screenshots reference site (Playwright + WebFetch)
   - Design agent applies aesthetic to style tile page
   - Generates design-tokens.json (atomic tokens + initial component patterns)
   - Style tile includes placeholder images at standard aspect ratios
   - Human reviews → iterates until approved
   - Atomic tokens are stable; component patterns will grow

2. SITEMAP STAGE
   - Orchestrator proposes sitemap based on reference
   - Human approves/modifies page list and navigation
   - Content agent sets up nav.json and site-meta.json

3. CONTENT DRAFTING
   - Content agent drafts all page copy in markdown (no layout)
   - Orchestrator presents drafts to human for review
   - Human can redirect messaging, adjust tone, remove/add sections
   - Not a hard gate — but a distinct step for better outcomes

4. PAGE BUILDING (per cohort)
   - Cohort 1: Homepage
     - Dev agent: structural layout (sections, grids, hero)
     - Content agent: places drafted copy into layout
     - Design agent: styles new component patterns, updates style tile
     - Image agent: sources images (stock, AI, or from reference site)
     - Evaluation: graded review at desktop + mobile, uncanny valley check
     - Human review
   - Cohort 2-N: 2-3 inner pages each
     - Same sequence
     - Design agent extends component patterns as needed
     - Human review between each cohort

5. FINAL REVIEW
   - Full-site visual audit (all pages, desktop + mobile)
   - SEO agent: metadata optimization pass
   - Design audit: token compliance across all pages
   - Human final approval
```

---

## Priority Order

1. ~~Visual feedback loop for design agent~~ — DONE
2. ~~Reference visual capture at orchestration level~~ — DONE
3. ~~Design reference comparison skill~~ — DONE
4. ~~Playwright --isolated fix~~ — DONE
5. Style tile page + design-tokens.json + placeholder images
6. Content drafting stage
7. Stage-gate orchestration in CLAUDE.md (sitemap approval, cohort workflow)
8. Evaluation + grading criteria (including mobile screenshots + uncanny valley check)
9. Image sourcing specialist agent (including reference site image pulling)
10. Design audit skill for CMS mode (drift detection)
11. Content quality review
