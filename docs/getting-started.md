# Getting Started

## What This Is

An Astro 5 static site managed entirely by Claude agents. No CMS dashboard — you tell Claude what you want in natural language, and specialist agents handle content, design, SEO, images, and development.

## Prerequisites

- Node.js 20+
- npm
- A Claude-compatible editor (Cursor with Claude Code)

## Setup

```bash
git clone <repo-url>
cd astro-starter
npm install
```

## Running the Dev Server

```bash
npm run dev      # http://localhost:4321
npm run build    # Build to dist/
npm run healthcheck # JSON checks + full build
```

## How to Use

Open the project in Cursor. Talk to Claude. Examples:

| What you want | What you say |
|---------------|-------------|
| New page | "Add a team page with bios for three people" |
| Edit content | "Change the homepage headline to 'Build Something Great'" |
| Change design | "Make the accent color teal instead of indigo" |
| Blog post | "Write a blog post about web design trends in 2026" |
| SEO audit | "Audit the SEO across all pages" |

Claude reads `CLAUDE.md` to understand the project, routes your request to the right specialist agent, and executes it. You review the result and iterate.

## Next Steps

- [Project Structure](project-structure.md) — understand the directory layout
- [Agent System](agent-system.md) — how the specialist agents work
