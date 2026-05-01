# Documentation

This directory contains architectural and functional reference documentation. **Humans don't operate this site directly** — agents do. These docs explain how the system is structured and how it works at a high level, so a human reading them understands the architecture without needing to learn procedural CMS tasks.

Procedural how-tos for agents live in `.claude/agents/<agent>/*.md` (skills), not here.

## Architecture & Functional Reference

| Document | What it covers |
|----------|---------------|
| [Getting Started](getting-started.md) | Setup, first run, how to talk to the system |
| [Project Structure](project-structure.md) | Directory layout, key files, architecture overview |
| [Agent System](agent-system.md) | Agent file structure, skill formats, how to extend the system |
| [Build Workflow](build-workflow.md) | Stage-gate process for building out the site |
| [Content Collections](content-collections.md) | Content architecture, collection purposes, editing workflow |
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

- **CLAUDE.md** (project root) — Agent routing rules, ownership, content architecture, build workflow, key paths. The first thing Claude reads.
- **Claude Code Agents** `.claude/agents/` — Individual agent definitions and skills.
