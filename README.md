# Acme Studio

A static website managed entirely through [Claude Code](https://claude.ai/code). No CMS dashboard, no manual editing — just tell Claude what you want.

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Open the project in Claude Code.

3. Tell Claude what you need. Examples:
   - "Add a new page about our team"
   - "Write a blog post about web design trends"
   - "Change the site name to Apex Digital"
   - "Add a Careers link to the navigation"
   - "Update the homepage headline"

## Slash Commands

Use these for common tasks:

| Command | What it does |
|---------|-------------|
| `/create-page` | Create a new page |
| `/edit-content` | Edit a page, post, or service |
| `/update-seo` | Update titles, descriptions, OG images |
| `/update-nav` | Add, remove, or reorder navigation links |
| `/update-styles` | Change colors, fonts, or layout |
| `/audit` | Run a full site health check |

## Deployment

Push to GitHub and connect to [Vercel](https://vercel.com) (auto-detects Astro), or run `npm run build` and upload the `dist/` folder to any static host.
