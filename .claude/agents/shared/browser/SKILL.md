---
name: browser
description: >
  Shared browser skill for all agents. Provides standardized procedures for
  navigating websites, taking screenshots, extracting content, comparing pages,
  and managing the dev server. Uses Playwright MCP as the primary driver with
  Claude browser (mcp__claude-in-chrome__*) as the fallback.
---

# Browser Skill

Standardized browser operations for any agent that needs to view, screenshot, or interact with web pages. This is a **shared skill** — it lives in `.claude/agents/shared/` and is available to all agents.

## Tool Priority

1. **Playwright MCP** (`mcp__playwright__*`) — Primary. Headless, scriptable, reliable for screenshots and DOM inspection.
2. **Claude Browser** (`mcp__claude-in-chrome__*`) — Fallback. Use when Playwright is unavailable or when you need a real browser session (e.g., sites that block headless browsers, JavaScript-heavy SPAs that need full rendering).

If neither tool is available, fall back to `WebFetch` for content extraction (no screenshots possible).

## Operations

### Screenshot a URL

Take a screenshot of any URL at a specified viewport width.

**Procedure:**

1. Navigate to the URL using Playwright:
   ```
   mcp__playwright__browser_navigate → { url: "<url>" }
   ```

2. Wait for the page to fully load. If the page has lazy-loaded images or animations, wait a few seconds:
   ```
   mcp__playwright__browser_wait → { time: 3 }
   ```

3. Take the screenshot:
   ```
   mcp__playwright__browser_screenshot → { width: 1280, height: 720 }
   ```

**Standard viewport widths:**

| Name | Width | Use for |
|------|-------|---------|
| Desktop | 1280 | Default for all comparisons |
| Mobile | 375 | Responsive checks |
| Tablet | 768 | Optional intermediate check |

**For full-page screenshots:** After the initial viewport screenshot, scroll down and take additional screenshots to capture below-the-fold content:

```
mcp__playwright__browser_scroll → { direction: "down", amount: 800 }
mcp__playwright__browser_screenshot
```

Repeat until you've captured the full page.

### Screenshot the Dev Server

Take a screenshot of a page on the local dev server.

**Procedure:**

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev &
   sleep 3
   ```

2. **Verify it's ready:**
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:4321 || echo "not ready"
   ```
   If not ready, wait and retry (up to 15 seconds).

3. **Navigate and screenshot:**
   ```
   mcp__playwright__browser_navigate → { url: "http://localhost:4321/<path>" }
   mcp__playwright__browser_screenshot → { width: 1280, height: 720 }
   ```

4. **When finished with all browser work**, stop the dev server:
   ```bash
   kill %1 2>/dev/null || true
   ```
   Only stop the server after ALL screenshots/comparisons are done — don't start and stop it between each screenshot.

### Compare Two Pages

Visually compare a reference page against our page, section by section.

**Procedure:**

1. **Screenshot the reference page** at desktop width (1280px). Scroll through and capture each major section (hero, features, CTA, footer, etc.).

2. **Screenshot our page** at the same width on the dev server.

3. **Compare section by section.** For each section, note differences in:

   | Category | What to check |
   |----------|--------------|
   | **Layout** | Section arrangement, grid structure, column count, content width |
   | **Spacing** | Section padding, element gaps, whitespace density |
   | **Typography** | Font size/weight/style, heading hierarchy, text alignment |
   | **Color** | Background colors, text colors, accent usage, gradients/overlays |
   | **Visual weight** | Image-to-text ratio, density, emphasis points |
   | **Components** | Card style, button style, border treatments, shadows |

4. **List differences specifically.** 
   - Bad: "the colors are different"
   - Good: "reference hero has a dark gradient overlay (#000 at 60% opacity) over a full-bleed background image with white text; ours has a flat white background with dark text"

5. **Classify each difference** by which agent owns the fix:
   - **Design agent:** color tokens, typography, spacing, Tailwind classes
   - **Dev agent:** HTML structure, new sections, grid layouts, component logic
   - **Content agent:** text copy, headlines, descriptions
   - **Images agent:** sourcing and placing images

### Extract Page Content

Get the text content and structure from a URL without screenshots.

**Procedure:**

1. **Try Playwright first** for JavaScript-rendered content:
   ```
   mcp__playwright__browser_navigate → { url: "<url>" }
   mcp__playwright__browser_snapshot → (returns accessibility tree / text content)
   ```

2. **Fall back to WebFetch** if Playwright is unavailable:
   ```
   WebFetch → { url: "<url>" }
   ```
   This returns rendered text but may miss JS-rendered content.

3. **Extract and organize:**
   - Page title and meta description
   - Heading hierarchy (H1, H2, H3)
   - Section structure (what content is in each section)
   - Navigation links
   - CTA text and button labels
   - Footer content

### Inspect DOM Elements

Get specific CSS properties or HTML structure from a live page.

**Procedure:**

1. Navigate to the page.

2. Use Playwright to run JavaScript in the page context:
   ```
   mcp__playwright__browser_console → { javascript: "document.querySelector('<selector>').getBoundingClientRect()" }
   ```

3. **Useful extractions:**

   **Get computed styles:**
   ```javascript
   const el = document.querySelector('<selector>');
   const s = getComputedStyle(el);
   JSON.stringify({
     color: s.color,
     fontSize: s.fontSize,
     fontFamily: s.fontFamily,
     backgroundColor: s.backgroundColor,
     padding: s.padding,
     margin: s.margin
   });
   ```

   **Get all CSS custom properties (design tokens):**
   ```javascript
   const s = getComputedStyle(document.documentElement);
   const vars = {};
   for (let i = 0; i < s.length; i++) {
     if (s[i].startsWith('--')) vars[s[i]] = s.getPropertyValue(s[i]).trim();
   }
   JSON.stringify(vars, null, 2);
   ```

   **Get all images on page:**
   ```javascript
   JSON.stringify(
     [...document.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight }))
   );
   ```

   **Get heading hierarchy:**
   ```javascript
   JSON.stringify(
     [...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({ tag: h.tagName, text: h.textContent.trim() }))
   );
   ```

## Fallback Behavior

If Playwright MCP is not available (tools don't include `mcp__playwright__*`):

1. **For screenshots:** Tell the user you cannot take screenshots without Playwright. Suggest they provide screenshots manually or enable the Playwright MCP server.

2. **For content extraction:** Use `WebFetch` to get page text. Note that JS-rendered content may be missing.

3. **For DOM inspection:** Use `WebFetch` and parse the returned HTML. This is less reliable for computed styles but works for structure.

If Claude Browser (`mcp__claude-in-chrome__*`) is available as an alternative:

1. Use it for navigation and visual inspection.
2. It can provide screenshots and interact with pages.
3. It's a real browser, so it handles JS-heavy sites better than headless Playwright in some cases.

## Rules

- **Don't start the dev server unless you need it.** External URLs don't need a dev server.
- **Don't leave the dev server running.** Always `kill %1` after you're done with all browser work.
- **Take screenshots at standard widths.** Use 1280px for desktop, 375px for mobile. Don't use arbitrary widths.
- **Scroll for full-page captures.** A single viewport screenshot misses below-the-fold content.
- **Don't guess at values from screenshots.** Use DOM inspection to extract exact colors, sizes, and spacing. When that's not possible, use the closest standard Tailwind palette value.
