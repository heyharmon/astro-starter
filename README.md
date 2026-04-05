# Astro Starter

A static website starter managed entirely through Claude agents. No CMS dashboard, no manual editing — describe what you want in natural language.

This repo serves as the **base template** for multiple client websites. Each client gets a branch and its own working directory via git worktrees.

## Quick Start

```bash
npm install
npm run dev    # http://localhost:4321
```

Open the project in Cursor with Claude Code. Tell Claude what you need:

- "Add a team page with bios"
- "Change the accent color to teal"
- "Write a blog post about web design trends"
- "Set up a new client called Bob's Plumbing"
- "Deploy Little Campus to Vercel"

## How It Works

Six specialist agents (content, design, SEO, images, dev, deploy) handle different aspects of the site. A root orchestrator routes your requests to the right agent. See `CLAUDE.md` for routing rules.

The same codebase serves multiple client websites via git branches and worktrees. The `main` branch is the shared base; `client/<slug>` branches hold client-specific content, design, and images.

## Documentation

| Document | What it covers |
|----------|---------------|
| [Getting Started](docs/getting-started.md) | Setup, first run, how to use the system |
| [Project Structure](docs/project-structure.md) | Directory layout, key files, architecture |
| [CMS Operations](docs/cms-operations.md) | Creating pages, editing content, managing navigation |
| [Client Management](docs/client-management.md) | Multi-client workflow: branches, worktrees, concepts |
| [Deployment](docs/deployment.md) | Vercel setup, automated deploys, concept previews |
| [Agent System](docs/agent-system.md) | The six agents, routing rules, how they coordinate |
| [Build Workflow](docs/build-workflow.md) | Stage-gate process for building new sites |
| [Content Schemas](docs/content-schemas.md) | Frontmatter fields, Zod validation, content collections |
| [Design System](docs/design-system.md) | Tailwind theme, tokens, colors, typography |

## Commands

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run validate  # Config checks + build
```
