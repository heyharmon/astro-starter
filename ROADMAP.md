# Studio Harmon — Roadmap

Deferred work and known gaps for the marketing site. Ordered by leverage.
Last updated: 2026-07-01.

## 1. Lead capture

**Done (2026-07-01):** both `/start` and `/book` now POST to a native Vercel
serverless function (`api/submit.js`) that records each submission as a JSON
file in a private Vercel Blob store (`studio-harmon-leads`). No third-party
form service. Includes a honeypot for spam and required-field validation.
Retrieve submissions with `vercel blob list submissions/` (start/ and book/).

Remaining:
- **`/book` is not a real calendar.** It records the requested day/time but
  doesn't check availability or create a calendar event. Wire to a real
  provider (Cal.com, Calendly, or Google Calendar) if you want true booking.
- **No notifications.** Submissions are dashboard/CLI-only. Add email alerts
  (Resend) if you want a push per lead — that adds a third-party provider.
- Remove the now-unused `formspreeId` placeholder from `site-meta.json`.
- Add basic analytics so the funnel is measurable (Vercel Analytics is one
  toggle for this project).

## 2. SEO / GEO foundation

The studio's pitch is "Found on Google — and cited by AI," so its own site
should exemplify it. Currently missing:

- `sitemap.xml` (add `@astrojs/sitemap`) and `robots.txt`.
- JSON-LD structured data (Organization + LocalBusiness for the SLC location).
- Per-page `<title>` / meta descriptions are set, but there is **no OG image** —
  `site-meta.json` points at `/images/og-default.png`, which doesn't exist.
  Create a branded OG image (and ideally per-page variants).

## 3. Content credibility

The work examples and metrics currently read as invented placeholders.
On a site shown to real prospects, fabricated stats are a liability.

- **Work examples** — in progress: replacing with screenshots of real sites
  Ryan has built (URLs to be supplied), with honest names/labels.
- **Metrics** ("5–7 days", "1/10th", "24/7") and the "+212%" style stats —
  confirm these are real/defensible, or reframe (e.g. "days, not months").

## 4. Real imagery

- Founder / studio photo in the `#studio` section is a grey placeholder.
- Once work screenshots land, confirm they look sharp at card sizes
  (feature card ~420px tall, side cards ~198px).

## 5. Ship / ops

- Merge `studio-harmon-site` → `main` (work is committed on the branch only).
- Connect the GitHub repo to Vercel for push-to-deploy instead of manual
  `vercel deploy --prod` from local.
- Broader device QA (the recent polish pass covered iPhone widths; check
  tablet + Android).
