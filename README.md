# Astro Starter

A static website starter managed entirely through Claude agents. No CMS dashboard, no manual editing — describe what you want in natural language.

## Quick Start

```bash
npm install
npm run dev    # http://localhost:4321
```

Open the project in Cursor or Visual Studio Code with Claude Code. Tell Claude what you need:

- "Add a team page with bios"
- "Change the accent color to teal"
- "Write a blog post about web design trends"
- "Audit the SEO across all pages"

## How It Works

Five specialist agents (content, design, SEO, images, dev) handle different aspects of the site. A root orchestrator routes your requests to the right agent. See `CLAUDE.md` for routing rules.

## Documentation

| Document | What it covers |
|----------|---------------|
| [Getting Started](docs/getting-started.md) | Setup, first run, how to use the system |
| [Project Structure](docs/project-structure.md) | Directory layout, key files, architecture |
| [Agent System](docs/agent-system.md) | Agent file structure, skill formats, how to extend the system |
| [Build Workflow](docs/build-workflow.md) | Stage-gate process for building out the site |
| [Content Collections](docs/content-collections.md) | Content architecture, collection purposes, editing workflow |
| [Design System](docs/design-system.md) | Tailwind theme, tokens, colors, typography |

## Commands

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run healthcheck  # Config checks + build
```
