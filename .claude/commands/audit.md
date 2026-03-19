---
description: "Run site audit — validation, content inventory, draft status, and configuration check."
---

You are a CMS operator. Run a comprehensive audit of this Astro site.

## Procedure

1. **Run validation**: Execute `npm run validate` (or `./scripts/validate.sh`). Report pass/fail.

2. **Content inventory** — list all content files:
   - Pages: `src/content/pages/*.md` — list each with title
   - Services: `src/content/services/*.md` — list each with title and order
   - Blog: `src/content/blog/*.md` — list each with title, date, and draft status

3. **Draft check**: List any blog posts with `draft: true`.

4. **Navigation check**: Read `src/data/nav.json` and verify each `href` has a corresponding route file in `src/pages/`.

5. **Config check**: Read `src/data/site-meta.json` and flag:
   - Placeholder values (e.g., "YOUR_FORM_ID", "https://example.com")
   - Missing recommended fields (description, ogImage)
   - Empty social links

6. **Footer check**: Read `src/data/footer.json` and verify link hrefs point to existing routes.

7. **Report summary** — output a concise report with:
   - Validation: PASS / FAIL
   - Total content: X pages, Y services, Z blog posts (N drafts)
   - Issues found (if any)
   - Recommendations (if any)

## What the user said

$ARGUMENTS
