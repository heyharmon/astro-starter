# Agent System

This project uses five specialist agents orchestrated by a root Claude instance. **Agent definitions, ownership, and routing rules live in [`CLAUDE.md`](../CLAUDE.md)** — that's the single source of truth, and it's loaded for every session. This doc covers the meta: how agent files are structured, how skills work, and how to extend the system.

## Architecture

```
User Request
     │
     ▼
┌─────────────┐
│  Root Claude │ ← Reads CLAUDE.md for routing rules
│ Orchestrator │
└──────┬──────┘
       │ Routes to specialist agent based on task domain
       │
  ┌────┴────┬────────┬────────┬────────┐
  ▼         ▼        ▼        ▼        ▼
Content  Design    SEO     Images    Dev
```

**Key rule:** Agents do not call each other. The root orchestrator handles all inter-agent coordination.

## Agent File Structure

```
.claude/agents/
├── shared/                    → Shared skills (available to all agents)
│   └── browser/
│       └── SKILL.md           → Browser operations (screenshots, comparison, DOM inspection)
├── <agent>.md                 → Agent definition (YAML frontmatter + role description)
└── <agent>/
    ├── <skill>.md             → Simple skill (procedure description)
    └── <skill>/
        ├── SKILL.md           → Complex skill (multi-phase workflow)
        ├── references/        → Supporting documentation
        └── scripts/           → Helper scripts (Python, etc.)
```

### Agent Definition Format

```yaml
---
name: content
description: >
  Use for any task involving content creation or editing...
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
---

# Content Agent — CMS Operator

## Skills
(table of available skills — agent-specific and shared)

## Before Every Task
(context detection + prerequisite reads)

## Ownership Boundaries
(what this agent can and cannot modify)

## Rules
(agent-specific constraints)
```

## Skills

**Agent-specific skills** live inside the agent's directory (e.g., `.claude/agents/design/polish-page.md`). Only that agent uses them.

**Shared skills** live in `.claude/agents/shared/` and are referenced from each agent that uses them. Each agent adds the shared skill to its Skills table with the full path. The skill file is read on demand, just like agent-specific skills.

Current shared skills:

| Skill | Path | Used by | Underlying tool |
|-------|------|---------|----------------|
| Browser | `.claude/agents/shared/browser/SKILL.md` | All agents | `playwright-cli` via Bash |

The browser skill is the **only** way agents should interact with browsers. It standardizes screenshots, page comparison, DOM inspection, and dev server lifecycle. Uses `playwright-cli` (a CLI tool designed for coding agents) rather than Playwright MCP — all browser operations run as Bash commands.

### Skill File Formats

**Simple skill** — a plain Markdown file with a YAML `description:` and a `$ARGUMENTS` placeholder at the end:

```markdown
---
description: "Short description of what this skill does."
---

# Skill Name

## Procedure
1. Step one
2. Step two

$ARGUMENTS
```

**Complex skill** — uses the `SKILL.md` convention inside a subdirectory, with supporting files:

```
<skill>/
├── SKILL.md           → Multi-phase workflow instructions
├── references/        → Supporting documentation, guides
├── assets/            → Templates, examples
└── scripts/           → Helper scripts (Python, etc.)
```

## Adding a New Agent

1. Create `.claude/agents/<name>.md` with YAML frontmatter (`name`, `description`, `tools`, `model: inherit`).
2. Create `.claude/agents/<name>/` for skills.
3. Add the agent to `CLAUDE.md` in the Agents section with routing rules.
4. Add shared skills to its Skills table if needed (e.g., Browser).

## Adding a New Skill

### Agent-specific skill

1. Create `.claude/agents/<agent>/<skill>.md` (simple) or `.claude/agents/<agent>/<skill>/SKILL.md` (complex).
2. Add the skill to the agent's Skills table in its definition file.
3. Add supporting references/scripts in subdirectories as needed.

### Shared skill

1. Create `.claude/agents/shared/<skill>/SKILL.md`.
2. Add the skill to the Skills table of **every agent** that should have access.
3. If the skill requires a CLI tool, ensure it's installed (the skill itself should document installation steps).
4. Document the shared skill in this file's "Current shared skills" table.
