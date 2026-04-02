# Design Evaluation Improvements

Based on [Anthropic's "Harness Design for Long-Running Apps"](https://www.anthropic.com/engineering/harness-design-long-running-apps) article, adapted for our Astro static site CMS workflow.

## Core Insight

Agents are bad at judging their own subjective output. The article found that separating generator from evaluator — and using browser-based visual verification — dramatically improves design quality. Our design agent currently makes changes and describes what changed, but never actually *looks* at the result.

---

## Improvement 1: Visual Feedback Loop for Design Agent (DOING NOW)

**What:** Give the design agent browser tools and add a "visual check" step to the `update-styles` skill. After making CSS/token changes, the agent starts the dev server, screenshots the affected page(s), and verifies the result matches intent.

**Why:** The design agent currently validates only that the build compiles (`npm run validate`). It has zero visual verification. This is like a designer editing CSS with their monitor off.

**Changes required:**
- Add Playwright browser tools to the design agent's tool list
- Add a visual verification step to `update-styles.md` after the validate step
- The agent screenshots the page, checks visual coherence, and iterates if something looks off

---

## Improvement 2: Separate Evaluator for Multi-Agent Tasks (FUTURE)

**What:** After all agents finish a multi-domain task (e.g., "create a new page with good design"), the root orchestrator spawns a lightweight evaluation pass using browser tools. It screenshots the final result and flags issues before reporting to the user.

**Why:** When content, SEO, and design agents each do their part sequentially, nobody checks the combined result. A final visual + content review catches mismatches between what each agent produced.

**Implementation idea:** A new evaluation skill or a simple orchestrator-level check that runs after multi-agent workflows complete.

---

## Improvement 3: Design Grading Criteria (FUTURE)

**What:** Define explicit evaluation criteria tailored to static site design, used by the visual check step or a future evaluator agent.

Proposed criteria:
- **Visual consistency** — Do changes maintain coherent design tokens site-wide? No orphaned colors or spacing mismatches.
- **Hierarchy & readability** — Is content scannable? Clear typography hierarchy (h1 > h2 > h3)?
- **Responsive behavior** — Does the page look correct at mobile, tablet, and desktop widths?
- **Brand coherence** — Does the change fit the overall site personality?

**Why:** Without explicit criteria, evaluation is "does this look okay?" which is too vague. Named criteria give the evaluator (or evaluation step) something concrete to check against.

---

## Improvement 4: Content Quality Review (FUTURE)

**What:** Add a lightweight content review step — a fresh agent context reads the rendered page and flags tone inconsistencies, readability issues, or copy that contradicts SEO metadata.

**Why:** The content agent has the same self-evaluation bias as the design agent. Pages can end up with mismatched tones, marketing fluff, or body copy that doesn't support the meta description.

---

## Improvement 5: Context Reset Protocol for Full Site Builds (FUTURE)

**What:** Formalize the handoff format between agents during multi-domain tasks. Each agent produces a structured summary of what it did, and the next agent gets a clean context with just that summary plus current file state.

**Why:** The article found context resets with structured handoffs beat compaction for sustained quality on long tasks. Our agent architecture already gives each agent a fresh context, but the handoff between them (what the orchestrator tells the next agent) could be more structured.

---

## Priority Order

1. Visual feedback loop for design agent (highest ROI, smallest change)
2. Design grading criteria (gives the visual check teeth)
3. Separate evaluator for multi-agent tasks
4. Content quality review
5. Context reset protocol
