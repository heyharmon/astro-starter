# Documentation

This directory contains all project documentation, organized by topic.

## For Humans

| Document | What it covers |
|----------|---------------|
| [Getting Started](getting-started.md) | Setup, first run, how to use the system |
| [Project Structure](project-structure.md) | Directory layout, key files, architecture overview |
| [CMS Operations](cms-operations.md) | Creating pages, editing content, managing navigation — the day-to-day CMS tasks |
| [Client Management](client-management.md) | Multi-client workflow: branches, worktrees, concepts, scaling |
| [Deployment](deployment.md) | Vercel setup, automated deploys, concept previews |

## For Agents (and curious humans)

| Document | What it covers |
|----------|---------------|
| [Agent System](agent-system.md) | The six specialist agents, routing rules, how they coordinate |
| [Build Workflow](build-workflow.md) | Stage-gate process for building new client sites |
| [Content Schemas](content-schemas.md) | Zod schemas, frontmatter fields, content collection reference |
| [Design System](design-system.md) | Tailwind theme, design tokens, style tile, typography, color palette |

## Quick Links

- **RESUME.md** (project root) — This agent's resume: capabilities, skills, integration, task interface
- **CLAUDE.md** (project root) — Agent routing rules and orchestration. This is what Claude reads first.
- **SITE_GUIDE.md** (project root) — Condensed CMS reference for agents. Points here for details.
- `.claude/agents/` — Individual agent definitions and skills
