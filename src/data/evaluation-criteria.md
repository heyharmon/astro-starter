# Evaluation Criteria

Grading rubric used by the orchestrator after each page cohort. The evaluator screenshots each page at desktop (1280px) and mobile (375px), reads the page source and design-tokens.json, then scores each criterion.

**Passing threshold:** No criterion scores below 3. Average across all criteria is above 3.5.

---

## Visual Grading (1–5 scale)

### Token Compliance
Do new components use design tokens from `design-tokens.json` (Tailwind classes like `text-white/60`, `bg-neutral-800`), or do they introduce ad-hoc hex values and arbitrary classes (e.g., `text-[#a3a3a3]`, `bg-[#1a1a1a]`)?
- **5** — All styles reference established tokens
- **3** — A few arbitrary values but mostly on-system
- **1** — Significant use of hardcoded values that bypass the design system

### Visual Consistency
Does this page feel like the same site as other pages? Same color mood, typography hierarchy, spacing density, visual weight?
- **5** — Indistinguishable from established pages in visual feel
- **3** — Generally consistent but one or two elements feel off
- **1** — Looks like a different site

### Hierarchy & Readability
Is the content scannable? Clear heading levels (h1 > h2 > h3), adequate whitespace, logical visual flow from top to bottom?
- **5** — Clear visual hierarchy, easy to scan, well-paced
- **3** — Readable but some sections feel crowded or headings compete
- **1** — Confusing structure, walls of text, unclear hierarchy

### Responsive Behavior
Screenshot at both 1280px and 375px. Nothing overflows, overlaps, or collapses. Text remains readable. Touch targets are adequate at mobile width.
- **5** — Clean at both breakpoints, no issues
- **3** — Minor issues (awkward wrapping, tight spacing) but usable
- **1** — Broken layout, overlapping elements, unreadable text at mobile

### Brand Coherence
Does the page reinforce the established aesthetic from the style tile? Does it feel like it belongs to this brand?
- **5** — Unmistakably the same brand
- **3** — On-brand but generic, could be any business
- **1** — Feels disconnected from the established aesthetic

---

## Content Grading (1–5 scale)

### Tone Consistency
Does this page sound like the same brand as other pages? Consistent voice, formality level, and personality?
- **5** — Same voice, seamless across pages
- **3** — Generally consistent but a few lines feel off-brand
- **1** — Reads like a different writer or company

### SEO Alignment
Does the body copy support the meta title and description? Do the headings contain relevant keywords? Is there a logical content structure for search engines?
- **5** — Copy reinforces meta tags, headings are keyword-rich, structure is logical
- **3** — Loosely aligned but some disconnect between copy and metadata
- **1** — Body copy contradicts or ignores the meta description

### Readability
Short paragraphs (2–4 sentences), scannable structure, no walls of text, appropriate use of headings and lists?
- **5** — Highly scannable, well-structured, concise
- **3** — Mostly readable but some long paragraphs or dense sections
- **1** — Walls of text, no structure, hard to scan

### Specificity
Does the copy contain concrete details relevant to the business, or is it generic filler? Would the business owner recognize their company in this text?
- **5** — Specific, concrete, clearly about this business
- **3** — Mix of specific and generic language
- **1** — Could describe any company in any industry

---

## Uncanny Valley Check (Pass / Fail)

These are binary checks for common AI-generated website artifacts. Any failure should be flagged for correction.

### Layout Variety
**FAIL** if every page follows the exact same section-heading-cards-CTA rhythm. Real websites vary their section types and pacing.

### Image Authenticity
**FAIL** if images feel like "random stock photo" — e.g., a generic handshake photo on a welding company's about page. Placeholder images are acceptable during building; mismatched stock photos are not.

### Content Specificity
**FAIL** if the copy reads like a template with blanks filled in. "We are committed to excellence in [industry]" is a fail.

### Visual Asymmetry
**FAIL** if the page is perfectly symmetric grids all the way down with no visual tension, rhythm breaks, or focal points. Some asymmetry creates visual interest.

### Section Economy
**FAIL** if there are more than 6 sections on a single page without clear justification. Fewer sections done well beats more sections done adequately.
