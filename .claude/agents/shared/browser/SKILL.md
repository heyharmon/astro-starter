---
name: browser
description: >
  Shared browser skill for all agents. Provides standardized procedures for
  navigating websites, taking screenshots, extracting content, comparing pages,
  and managing the dev server. Uses playwright-cli as the primary driver.
  All browser-based actions MUST use this skill — do not use Playwright MCP,
  Claude browser, or ad-hoc browser commands directly.
---

# Browser Skill

Standardized browser operations for any agent. This is a **shared skill** — all agents MUST use these procedures for any browser-based action. Do not implement browser interactions inline in other skills or ad-hoc in agent responses.

## Tool: playwright-cli

All browser operations use `playwright-cli`, a CLI tool designed for coding agents. It runs via Bash, keeps a persistent browser session, and outputs page snapshots after each command.

### First-time setup

If `playwright-cli` is not installed:

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

### Session management

playwright-cli maintains a persistent browser session. The browser stays open between commands. You do not need to open/close for each operation.

```bash
playwright-cli open [url]       # open browser, optionally navigate
playwright-cli close            # close the page (not the browser)
playwright-cli close-all        # close all browser sessions
```

---

## Operations

### Navigate to a URL

```bash
playwright-cli open <url>
# or if browser is already open:
playwright-cli goto <url>
```

Wait for dynamic content if needed:
```bash
playwright-cli screenshot  # forces a page load wait
```

### Take a Screenshot

```bash
# Screenshot the current page
playwright-cli screenshot

# Screenshot with a specific filename
playwright-cli screenshot --filename=homepage-desktop.png

# Screenshot a specific element
playwright-cli screenshot e15
```

Screenshots are saved to `.playwright-cli/` by default. Use `--filename` to save to a specific path.

**Standard viewport widths:**

| Name | Width | When to use |
|------|-------|-------------|
| Desktop | 1280 | Default for all comparisons and verification |
| Mobile | 375 | Responsive checks, mobile verification |
| Tablet | 768 | Optional intermediate check |

To change viewport, close and reopen at a different size, or use `eval` to resize:
```bash
playwright-cli eval "await page.setViewportSize({ width: 375, height: 812 })"
playwright-cli screenshot --filename=homepage-mobile.png
playwright-cli eval "await page.setViewportSize({ width: 1280, height: 720 })"
```

**For full-page captures**, scroll and take multiple screenshots:
```bash
playwright-cli screenshot --filename=section-1-hero.png
playwright-cli mousewheel 0 800
playwright-cli screenshot --filename=section-2-features.png
playwright-cli mousewheel 0 800
playwright-cli screenshot --filename=section-3-cta.png
```

### Get a Page Snapshot

Get a text representation of the page with element references (useful for finding elements to click, inspect, or extract):

```bash
playwright-cli snapshot
```

The snapshot includes element refs (e.g., `e15`, `e22`) that can be used in subsequent commands.

### Extract Page Content

Get structured information from a page:

```bash
# Heading hierarchy
playwright-cli eval "JSON.stringify([...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({ tag: h.tagName, text: h.textContent.trim() })))"

# All images
playwright-cli eval "JSON.stringify([...document.querySelectorAll('img')].map(i => ({ src: i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight })))"

# Meta tags
playwright-cli eval "JSON.stringify({ title: document.title, description: document.querySelector('meta[name=description]')?.content, ogImage: document.querySelector('meta[property=\"og:image\"]')?.content })"

# Navigation links
playwright-cli eval "JSON.stringify([...document.querySelectorAll('nav a')].map(a => ({ text: a.textContent.trim(), href: a.href })))"
```

### Inspect DOM Elements

Extract exact CSS values from rendered elements:

```bash
# Computed styles for a specific element
playwright-cli eval "const s = getComputedStyle(document.querySelector('<selector>')); JSON.stringify({ color: s.color, fontSize: s.fontSize, fontFamily: s.fontFamily, backgroundColor: s.backgroundColor, padding: s.padding, margin: s.margin })"

# CSS custom properties (design tokens)
playwright-cli eval "const s = getComputedStyle(document.documentElement); const vars = {}; for (let i = 0; i < s.length; i++) { if (s[i].startsWith('--')) vars[s[i]] = s.getPropertyValue(s[i]).trim(); } JSON.stringify(vars, null, 2)"
```

### Interact with Page Elements

```bash
playwright-cli click e15              # click element by ref
playwright-cli click "#submit-btn"    # click by CSS selector
playwright-cli hover e22              # hover (for hover state screenshots)
playwright-cli type "search query"    # type into focused element
playwright-cli fill e15 "value"       # fill a form field
playwright-cli press Enter            # press a key
```

---

## Compound Procedures

These combine multiple operations for common workflows.

### Screenshot the Dev Server

Take screenshots of pages on the local Astro dev server.

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev &
   sleep 3
   curl -s -o /dev/null -w "%{http_code}" http://localhost:4321 || sleep 3
   ```

2. **Navigate and screenshot:**
   ```bash
   playwright-cli open http://localhost:4321/<path>
   playwright-cli screenshot --filename=<page>-desktop.png
   ```

3. **Mobile screenshot (if needed):**
   ```bash
   playwright-cli eval "await page.setViewportSize({ width: 375, height: 812 })"
   playwright-cli screenshot --filename=<page>-mobile.png
   playwright-cli eval "await page.setViewportSize({ width: 1280, height: 720 })"
   ```

4. **When finished with ALL browser work**, stop the dev server:
   ```bash
   kill %1 2>/dev/null || true
   playwright-cli close
   ```

   Only stop the server after all screenshots/comparisons are done — don't start and stop it between each screenshot.

### Compare Two Pages

Visually compare a reference page against our page, section by section.

1. **Screenshot the reference page:**
   ```bash
   playwright-cli open <reference-url>
   playwright-cli screenshot --filename=ref-section-1.png
   playwright-cli mousewheel 0 800
   playwright-cli screenshot --filename=ref-section-2.png
   # Continue scrolling and capturing each section
   ```

2. **Screenshot our page** (on dev server):
   ```bash
   playwright-cli goto http://localhost:4321/<path>
   playwright-cli screenshot --filename=ours-section-1.png
   playwright-cli mousewheel 0 800
   playwright-cli screenshot --filename=ours-section-2.png
   ```

3. **Compare section by section.** For each section, check:

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
   - Good: "reference hero has a dark gradient overlay over a full-bleed image with white text; ours has a flat white background with dark text"

5. **Classify each difference** by which agent owns the fix:
   - **Design agent:** color tokens, typography, spacing, Tailwind classes
   - **Dev agent:** HTML structure, new sections, grid layouts, component logic
   - **Content agent:** text copy, headlines, descriptions
   - **Images agent:** sourcing and placing images

### Verify a Deployed URL

Check a live deployment after a deploy:

```bash
playwright-cli open <deployed-url>
playwright-cli screenshot --filename=deploy-verify-desktop.png
playwright-cli eval "await page.setViewportSize({ width: 375, height: 812 })"
playwright-cli screenshot --filename=deploy-verify-mobile.png
```

Check for broken images, layout issues, and correct content.

---

## Rules

- **All browser actions go through this skill.** Do not use Playwright MCP tools (`mcp__playwright__*`), Claude browser (`mcp__claude-in-chrome__*`), or ad-hoc browser commands. Always use `playwright-cli` via Bash.
- **Don't start the dev server unless you need it.** External URLs don't require a dev server.
- **Don't leave the dev server running.** Always `kill %1` after finishing all browser work in a task.
- **Take screenshots at standard widths.** 1280px for desktop, 375px for mobile. Don't use arbitrary widths.
- **Scroll for full-page captures.** A single viewport screenshot misses below-the-fold content.
- **Don't guess values from screenshots.** Use `playwright-cli eval` to extract exact computed styles, colors, sizes, and spacing.
- **Close the browser session when done** with `playwright-cli close` after your final screenshot/interaction.
