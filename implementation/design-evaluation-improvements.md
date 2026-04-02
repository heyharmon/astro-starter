# Design Evaluation Improvements

Based on [Anthropic's "Harness Design for Long-Running Apps"](https://www.anthropic.com/engineering/harness-design-long-running-apps) article, adapted for our Astro static site CMS workflow.

## Core Insight

Agents are bad at judging their own subjective output. The article found that separating generator from evaluator — and using browser-based visual verification — dramatically improves design quality. Our design agent currently makes changes and describes what changed, but never actually *looks* at the result.

---

## Improvement 1: Visual Feedback Loop for Design Agent — DONE

**What:** Give the design agent browser tools and add a "visual check" step to the `update-styles` skill. After making CSS/token changes, the agent starts the dev server, screenshots the affected page(s), and verifies the result matches intent.

**Changes made:**
- Added `mcp__playwright__*` to design agent's tool list in `.claude/agents/design.md`
- Added step 8 "Visual verification" to `.claude/agents/design/update-styles.md` — agent starts dev server, screenshots at desktop + mobile, reviews, can iterate up to 3 times

**Lesson from testing:** The visual check step works for verifying changes the agent made, but it's not enough when the task is "match this reference site." The agent needs to see the reference too.

---

## Improvement 2: Reference Visual Capture at Orchestration Level — DONE

**What:** When a user provides a reference URL, the root orchestrator must screenshot it with Playwright BEFORE delegating to any agent. `WebFetch` extracts text content (good for copy); Playwright screenshots capture visual design (layout, imagery, spacing, visual weight). Both are needed.

**Changes made:**
- Added "Reference-Based Work" routing rule to `CLAUDE.md` with explicit orchestration sequence
- Root orchestrator now screenshots reference sites and passes visual context to agents

**Why this matters:** In our first test, the orchestrator used `WebFetch` only, which returned text descriptions of colors and section names. The design agent got "dark charcoal, gold accent" but never saw the hero image, the project photography grid, or the visual weight of the layout. Result: correct colors applied to the wrong structure.

---

## Improvement 3: Design Reference Comparison Skill — DONE

**What:** A new skill for the design agent that takes reference screenshots and compares them against the current site, identifying specific visual gaps and iterating to close them.

**Changes made:**
- Created `.claude/agents/design/match-reference.md` — a comparison-driven design skill
- Agent receives reference screenshots from the orchestrator, starts the dev server, screenshots own site, compares side-by-side, and iterates on differences
- Registered in `.claude/agents/design.md` skill table

**Key difference from update-styles:** The `update-styles` skill works from verbal descriptions ("make the accent color gold"). The `match-reference` skill works from visual comparison ("the reference has a full-bleed hero image with gradient overlay; ours has plain text on dark background").

---

## Improvement 4: Separate Evaluator for Multi-Agent Tasks (FUTURE)

**What:** After all agents finish a multi-domain task (e.g., "create a new page with good design"), the root orchestrator spawns a lightweight evaluation pass using browser tools. It screenshots the final result and flags issues before reporting to the user.

**Why:** When content, SEO, and design agents each do their part sequentially, nobody checks the combined result. A final visual + content review catches mismatches between what each agent produced.

---

## Improvement 5: Design Grading Criteria (FUTURE)

**What:** Define explicit evaluation criteria tailored to static site design, used by the visual check step or a future evaluator agent.

Proposed criteria:
- **Visual consistency** — Do changes maintain coherent design tokens site-wide? No orphaned colors or spacing mismatches.
- **Hierarchy & readability** — Is content scannable? Clear typography hierarchy (h1 > h2 > h3)?
- **Responsive behavior** — Does the page look correct at mobile, tablet, and desktop widths?
- **Brand coherence** — Does the change fit the overall site personality?

---

## Improvement 6: Content Quality Review (FUTURE)

**What:** Add a lightweight content review step — a fresh agent context reads the rendered page and flags tone inconsistencies, readability issues, or copy that contradicts SEO metadata.

---

## Improvement 7: Context Reset Protocol for Full Site Builds (FUTURE)

**What:** Formalize the handoff format between agents during multi-domain tasks. Each agent produces a structured summary of what it did, and the next agent gets a clean context with just that summary plus current file state.

---

## Priority Order

1. ~~Visual feedback loop for design agent~~ — DONE
2. ~~Reference visual capture at orchestration level~~ — DONE
3. ~~Design reference comparison skill~~ — DONE
4. Design grading criteria
5. Separate evaluator for multi-agent tasks
6. Content quality review
7. Context reset protocol
