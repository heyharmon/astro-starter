---
name: section-replicator
description: >
  Replicate a website section (hero, feature grid, CTA, navbar, footer, etc.)
  from a reference URL or screenshot. Produces Astro-compatible HTML + Tailwind CSS.
  Fully autonomous — no human input required during execution.
---

# Section Replicator

Replicate a specific section from a reference website as Astro-compatible HTML + Tailwind CSS. This skill is fully autonomous — it handles visual analysis, style extraction, code generation, and verification without human intervention.

**Output: HTML + Tailwind CSS in `.astro` files. No React, Vue, or other frameworks.**

## Required Inputs

The orchestrator or user provides:
- **Reference URL** — the live page containing the section to replicate
- **Which section** — description of which section to replicate (e.g., "the hero section", "the pricing cards grid", "the footer")

Optional:
- **Target file** — where to place the output (e.g., `src/pages/index.astro`, or a new component file)
- **Adaptation notes** — any modifications (e.g., "use our color tokens instead of theirs", "change the headline text")

## Procedure

### Phase 1: Analyze the Reference

Use the **Browser skill** (`.claude/agents/shared/browser/SKILL.md`) for all browser operations.

1. **Navigate to the reference URL** and take a full-page screenshot to locate the target section.

2. **Screenshot the target section** specifically. Scroll to it and capture it at desktop width (1280px).

3. **Extract the section's HTML structure:**
   ```bash
   playwright-cli eval "document.querySelector('<best-guess-selector>').outerHTML"
   ```
   Try selectors like `section`, `[class*='hero']`, `header`, `footer`, `main > section:nth-child(N)`, or inspect the snapshot to find the right container:
   ```bash
   playwright-cli snapshot
   ```

4. **Extract computed styles** for key elements in the section:
   ```bash
   playwright-cli eval "
     const section = document.querySelector('<selector>');
     const els = section.querySelectorAll('*');
     const styles = {};
     for (const el of [...els].slice(0, 30)) {
       const s = getComputedStyle(el);
       const tag = el.tagName.toLowerCase();
       const cls = el.className?.toString().slice(0, 50) || '';
       styles[tag + '.' + cls.slice(0, 20)] = {
         display: s.display, flexDirection: s.flexDirection,
         justifyContent: s.justifyContent, alignItems: s.alignItems, gap: s.gap,
         padding: s.padding, margin: s.margin,
         fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily,
         lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, color: s.color,
         backgroundColor: s.backgroundColor, borderRadius: s.borderRadius,
         maxWidth: s.maxWidth, width: s.width
       };
     }
     JSON.stringify(styles, null, 2);
   "
   ```

5. **Extract CSS custom properties** (design tokens) from the reference site:
   ```bash
   playwright-cli eval "
     const s = getComputedStyle(document.documentElement);
     const vars = {};
     for (let i = 0; i < s.length; i++) {
       if (s[i].startsWith('--')) vars[s[i]] = s.getPropertyValue(s[i]).trim();
     }
     JSON.stringify(vars, null, 2);
   "
   ```

6. **Extract images** used in the section:
   ```bash
   playwright-cli eval "
     const section = document.querySelector('<selector>');
     JSON.stringify([...section.querySelectorAll('img')].map(i => ({
       src: i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight
     })));
   "
   ```

7. **Check hover states** on interactive elements (buttons, cards, links):
   ```bash
   playwright-cli hover <element-ref>
   playwright-cli screenshot --filename=hover-state.png
   ```

### Phase 2: Build the Section

8. **Read our design system** before writing code:
   - `src/styles/global.css` — current theme tokens
   - `src/data/design-tokens.json` — component patterns and token mappings

9. **Map reference styles to our Tailwind tokens.** Prefer our existing tokens over arbitrary values:
   - Reference `#4f46e5` → our `indigo-600` (if it matches)
   - Reference `16px` padding → our `p-4` (if close enough)
   - Only use arbitrary values (`text-[17px]`, `bg-[#1a1b23]`) when no Tailwind class is close

10. **Write the HTML + Tailwind.** Follow this order:
    1. Outer container and layout (flex/grid)
    2. Typography (headings, body, labels)
    3. Colors (backgrounds, text, accents)
    4. Spacing (padding, margins, gaps)
    5. Effects (shadows, borders, radius)
    6. Hover/interaction states (Tailwind `hover:` classes or CSS transitions)

11. **Handle images:**
    - Use placeholder SVGs from `public/images/placeholders/` for now
    - Note which images need to be sourced (this is the Images agent's job)
    - Preserve the correct aspect ratios from the reference

12. **Handle fonts:**
    - If the reference uses a different font, note it but use our current `--font-sans` / `--font-serif`
    - If a font change is needed, flag it for the Design agent

### Phase 3: Verify

13. **Place the code** in the target file.

14. **Build and verify:**
    ```bash
    npm run build
    ```

15. **Visual comparison.** Use the browser skill to:
    - Screenshot our implementation on the dev server
    - Screenshot the reference section again
    - Compare side by side

16. **Iterate.** If there are visible differences:
    - Fix layout and spacing issues first (highest visual impact)
    - Then typography
    - Then colors and effects
    - Re-screenshot and compare
    - Up to 3 iterations

17. **Report results:**
    - What was built and where the code lives
    - Screenshot of the result
    - Remaining gaps (e.g., "needs real images", "font doesn't match — flag for Design agent")
    - Any structural decisions made (e.g., "used a 3-column grid instead of the reference's 4-column because our content has 3 items")

## Tailwind Arbitrary Values

Use when no standard Tailwind class matches:

```html
<!-- Exact sizing -->
<div class="w-[347px] h-[52px] p-[18px] gap-[14px]">

<!-- Exact colors -->
<div class="bg-[#1a1b23] text-[#f5f5f7] border-[#2a2b33]">

<!-- Exact typography -->
<p class="text-[17px] leading-[1.4] tracking-[0.02em] font-[450]">

<!-- Exact effects -->
<div class="rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
```

**Shadow syntax:** Use underscores for spaces within shadow values:
```html
<div class="shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
```

**When to use custom CSS instead of arbitrary values:**
- Multi-stop gradients
- Multiple layered shadows
- Complex keyframe animations
- Pseudo-element content (`::before`, `::after`)
- `clip-path` shapes

## Rules

- **Astro-compatible HTML only.** No React JSX, no Vue templates, no framework-specific syntax.
- **Tailwind first, arbitrary values second, custom CSS last.** Prefer standard Tailwind classes. Use arbitrary values for precision. Resort to custom CSS only for things Tailwind can't express.
- **Respect our design system.** Read `design-tokens.json` and prefer our established tokens over the reference's exact values. The goal is a section that looks like the reference but feels native to our site.
- **Don't hardcode content.** If the section will be used on a real page, text should come from content collections or be marked with comments like `<!-- Content agent: replace with client copy -->`.
- **Flag cross-agent work.** Note what other agents need to do (Images agent for real photos, Design agent for font changes, Content agent for copy).

$ARGUMENTS
