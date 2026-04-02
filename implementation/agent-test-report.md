# Agent Test Report — Four-Agent Architecture

**Date:** 2026-03-31
**Branch:** claude/setup-cms-operator-1Ww24
**Agents tested:** content, seo, design, dev

---

## Test Scenarios

| # | Agent | Scenario | Description |
|---|-------|----------|-------------|
| 1 | Content | Create page | "Create a Pricing page with three tiers: Starter ($49/mo), Pro ($149/mo), and Enterprise (custom). Add it to the navigation." |
| 2 | Content | Edit content (rebrand) | "Rewrite the About page. We're now Paraloom, an AI visibility intelligence platform. Update the body content to reflect our new identity." |
| 3 | SEO | Full audit | "Audit all pages on the site for SEO issues and fix anything you find. Check titles, descriptions, character limits, and missing metadata." |
| 4 | Design | Color palette swap | "Switch the site to a warm color palette. Replace the neutral grays with warm stone tones and change the accent color from indigo to amber." |
| 5 | Dev | Add integration | "Add an XML sitemap to the site. Use the official Astro sitemap integration." |

---

## Results Comparison

| # | Agent | Scenario | Baseline | Post-Improvement | Delta |
|---|-------|----------|----------|-----------------|-------|
| 1 | Content | Create page | NEEDS IMPROVEMENT | GOOD | +1 |
| 2 | Content | Edit content (rebrand) | NEEDS IMPROVEMENT | EXCELLENT | +2 |
| 3 | SEO | Full audit | NEEDS IMPROVEMENT | GOOD | +1 |
| 4 | Design | Color palette swap | GOOD | GOOD | — |
| 5 | Dev | Add integration | GOOD | EXCELLENT | +1 |

**Overall: 3 improvements, 2 maintained. Zero regressions.**

---

## Baseline Test Findings (Round 1)

### Cross-cutting issues
- `npm run validate` missing in worktrees — every agent hit this with no fallback
- No file verification step — agents trusted documented paths blindly
- Documentation/code drift on config file names caused failures

### Per-agent issues

**Content Agent (NEEDS IMPROVEMENT x2):**
- Rebrand scenario: strict "don't touch frontmatter" rule produced incoherent page (hero said "small team doing big work", body talked about AI visibility)
- Skill duplicated SITE_GUIDE.md procedures verbatim — drift risk
- "Match existing tone" instruction too vague
- No fallback when validate script missing

**SEO Agent (NEEDS IMPROVEMENT):**
- Services collection missing from ownership table
- Rendered title length not accounted for ("Title | Site Name" suffix ignored)
- Audit checklist too shallow: 5 items, missing placeholder URL detection, duplicate description check, heading hierarchy, social link validation
- No fallback when validate script missing

**Design Agent (GOOD):**
- Token vs component distinction worked perfectly
- Accent scale undocumented in agent definition
- No verification step for hardcoded hex colors bypassing theme
- No check for unused tokens after changes

**Dev Agent (GOOD):**
- No procedure for adding an integration (common task)
- `site` property in astro.config undocumented — critical for sitemap/RSS
- Architecture notes otherwise helpful

---

## Improvements Implemented

### P0 — Cross-cutting (all agents)
1. **Validate fallback:** All agents now say "Run `npm run validate`. If unavailable, fall back to `npm run build`."
2. **File verification habit:** All agents now include "verify actual filenames before editing" in Before Every Task steps.

### P1 — Content Agent
3. **Rebrand awareness rule:** Frontmatter rule softened from "never touch" to "preserve by default, but update proactively when body changes make frontmatter incoherent (rebrand, new product, new mission)."
4. **Skill deduplication:** Skills now reference SITE_GUIDE.md for procedures instead of duplicating them. Skills add interactive behavior (confirm slug, ask about nav, check coherence).
5. **Tone calibration specificity:** Changed from "read neighboring files" to "read 1-2 other files in the same content collection."

### P1 — SEO Agent
6. **Services in ownership table:** Added `src/content/services/*.md` with `title`, `description` as owned fields.
7. **Rendered title length:** New rule: "Calculate rendered length: raw title + ' | ' + site name. Must be under 60 characters."
8. **Expanded audit checklist:** 9 steps (up from 5): added rendered title check, duplicate descriptions, placeholder URL detection, social link validation, heading hierarchy, alt text verification.

### P1 — Design Agent
9. **Accent scale documented:** "Current Design System" section now lists accent colors alongside neutrals.
10. **Token coverage verification:** New rule: grep for hardcoded hex values before swapping tokens.
11. **Unused token check:** New rule: grep for usage after changing tokens, report if unreferenced.
12. **Palette guidance:** Added standard Tailwind palette names for choosing replacement values.

### P2 — Dev Agent
13. **`site` property documented:** Architecture note explains that `site` in astro.config.mjs is required by sitemap/RSS integrations.
14. **Integration procedure:** New "Adding an Astro Integration" section with 5-step procedure.

---

## Post-Improvement Test Findings (Round 2)

### What improved

**Content Agent — Create page (NEEDS IMPROVEMENT -> GOOD):**
- File verification step caught data directory mismatch — prevented failure
- Validate fallback worked seamlessly
- Skill deduplication reduced redundancy while adding useful guidance (read existing pages, copy route pattern from existing files)
- Remaining gap: nav update references in skill still mention `nav.json` specifically

**Content Agent — Edit content (NEEDS IMPROVEMENT -> EXCELLENT):**
- Rebrand awareness rule was the standout fix — agent proactively updated title, description, headline, subheadline alongside body
- All 7 evaluation criteria passed
- Final page fully coherent: body, hero, and metadata all aligned
- Tone calibration produced content matching existing voice

**SEO Agent — Full audit (NEEDS IMPROVEMENT -> GOOD):**
- Services collection properly audited
- Rendered title check correctly calculated "Title | Site Name" suffix
- Placeholder URL and social link checks both triggered
- Duplicate description check confirmed uniqueness
- Remaining gap: no brand-consistency check for descriptions, no detection of Head.astro home page title mismatch

**Design Agent — Color palette swap (GOOD -> GOOD):**
- Token coverage grep found zero hardcoded values — confirmed token-only change is safe
- Unused token check flagged that no components reference accent tokens
- Palette guidance helped choose stone/amber values
- 7/8 criteria passed; only failure: accent scale documented but didn't exist in worktree's CSS (worktree base issue, not agent issue)

**Dev Agent — Add integration (GOOD -> EXCELLENT):**
- "Adding an Astro Integration" procedure was a direct match — guided all 5 steps
- `site` property architecture note prevented guaranteed build failure
- File verification caught data directory mismatch
- All 7 evaluation criteria passed

### What still needs work

1. **SITE_GUIDE.md and skill file paths are stale when worktrees diverge.** The "verify file structure" safeguard catches this, but fixing the documentation would eliminate the friction entirely.
2. **Design agent: no guidance on wiring accent tokens into components.** The agent correctly detects unused accent tokens but has no procedure for suggesting where to integrate them (buttons, focus rings, link hovers).
3. **SEO agent: no brand-consistency check.** The audit checklist doesn't prompt checking whether descriptions align with the current brand identity.
4. **Content create-page skill: nav procedure still hardcodes `nav.json` path** instead of instructing "read the nav config (verify filename first)."

---

## Scoring Criteria

Each test evaluates 7-8 criteria on PASS/FAIL:

| Rating | Criteria Passing |
|--------|-----------------|
| EXCELLENT | All criteria pass, agent handles edge cases well |
| GOOD | 6-7 criteria pass, minor gaps that don't block task completion |
| NEEDS IMPROVEMENT | 4-5 criteria pass, material gaps that could cause task failure |
| POOR | <4 criteria pass, fundamental issues preventing task completion |

---

## How to Re-Run This Test

1. Ensure you're on a branch with the agent definitions in `.claude/agents/`
2. For each scenario in the table above, launch an agent in an isolated worktree:
   ```
   Agent(isolation: "worktree", prompt: "<scenario prompt + evaluation criteria>")
   ```
3. Each agent should:
   - Read the agent definition file
   - Follow its instructions exactly
   - Execute the task
   - Run validation
   - Evaluate against the 7 criteria listed per test
4. Compare results against this report's scores to measure improvement/regression
5. Update this report with the new results

---

## Architecture Strengths (Keep)

- **Ownership boundaries** — universally praised as clear and effective across all tests
- **Token vs component distinction** (Design) — "the single most useful rule"
- **SITE_GUIDE.md reference mandate** — provides procedural context to all agents
- **File verification step** — caught real issues in every test where docs diverged
- **Validate fallback** — seamlessly handled missing script in every test
- **Rebrand awareness rule** (Content) — correctly triggered proactive frontmatter updates
- **Integration procedure** (Dev) — direct match for common dev task
- **Rendered title calculation** (SEO) — prevented silently oversized titles
