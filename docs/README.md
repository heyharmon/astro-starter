# Documentation

This directory contains architectural and functional reference documentation. **Humans don't operate this site directly** — agents do. These docs explain how the system is structured and how it works at a high level, so a human reading them understands the architecture without needing to learn procedural CMS tasks.

Procedural how-tos for agents live in `.claude/agents/<agent>/*.md` (skills), not here.

## Architecture & Functional Reference

| Document | What it covers |
|----------|---------------|
| [Getting Started](getting-started.md) | Setup, first run, how to talk to the system |
| [Project Structure](project-structure.md) | Directory layout, key files, architecture overview |
| [Agent System](agent-system.md) | The six specialist agents, routing rules, how they coordinate |
| [Build Workflow](build-workflow.md) | Stage-gate process for building new client sites |
| [Client Management](client-management.md) | Multi-client workflow: branches, worktrees, concepts, scaling |
| [Deployment](deployment.md) | Vercel setup, automated deploys, concept previews |
| [Content Schemas](content-schemas.md) | Zod schemas, frontmatter fields, content collection reference |
| [Design System](design-system.md) | Tailwind theme, design tokens, styleguide, typography, color palette |

## Where the procedural work lives

| Operation | Skill |
|-----------|-------|
| Create a page | `.claude/agents/content/create-page.md` |
| Edit content | `.claude/agents/content/edit-content.md` |
| Create a blog post | `.claude/agents/content/create-blog-post.md` |
| Update navigation | `.claude/agents/content/update-nav.md` |
| Update SEO | `.claude/agents/seo/update-seo.md` |

## Quick Links

- **CLAUDE.md** (project root) — Agent routing rules and orchestration. The first thing Claude reads.
- **SITE_GUIDE.md** (project root) — Condensed agent-facing reference: schemas, config files, SEO/styling rules, validation.
- **RESUME.md** (project root) — Agent resume: capabilities, skills, integration, task interface.
- `.claude/agents/` — Individual agent definitions and skills.
