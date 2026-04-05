# Agent System

This project uses six specialist agents orchestrated by a root Claude instance. Each agent has defined ownership boundaries, skills, and context-detection behavior.

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
  ┌────┴────┬────────┬────────┬────────┬────────┐
  ▼         ▼        ▼        ▼        ▼        ▼
Content  Design    SEO     Images    Dev     Deploy
```

**Key rule:** Agents do not call each other. The root orchestrator handles all inter-agent coordination.

## The Six Agents

### Content Agent (`content`)

CMS operator. Creates, edits, and removes content through Markdown files and JSON configuration.

| What | Details |
|------|---------|
| **When** | Creating/editing pages, blog posts, services. Managing nav, footer, site-meta. |
| **Owns** | `src/content/`, `src/data/`, `src/pages/` (route files for new pages only) |
| **Skills** | `create-page`, `edit-content`, `update-nav`, `draft-all-pages` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash |
| **Definition** | `.claude/agents/content.md` |

### Design Agent (`design`)

Design system manager. Controls visual appearance through Tailwind tokens and classes.

| What | Details |
|------|---------|
| **When** | Changing colors, typography, fonts, spacing, layout, component appearance |
| **Owns** | `src/styles/global.css`, Tailwind classes in `.astro` components and layouts |
| **Skills** | `update-styles`, `apply-style-tile`, `polish-page`, `match-reference`, `style-guide-generator` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash, Playwright |
| **Definition** | `.claude/agents/design.md` |

### SEO Agent (`seo`)

Search optimization specialist. Manages metadata, keyword research, and content briefs.

| What | Details |
|------|---------|
| **When** | SEO auditing, meta titles/descriptions, OG images, keyword research, competitor analysis |
| **Owns** | SEO frontmatter fields (`title`, `description`, `featuredImage`/`image`, `tags`), `site-meta.json` (SEO fields) |
| **Skills** | `update-seo`, `seo-topical-map` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch, Chrome MCP |
| **Definition** | `.claude/agents/seo.md` |

### Images Agent (`images`)

Visual asset specialist. Sources, downloads, and places images.

| What | Details |
|------|---------|
| **When** | Stock photo search, reference site image pulling, image selection for pages |
| **Owns** | `public/images/` (except `placeholders/`), image frontmatter fields |
| **Skills** | `source-page-images`, `unsplash-search`, `pull-reference-images` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash, Playwright |
| **Definition** | `.claude/agents/images.md` |

### Dev Agent (`dev`)

General-purpose developer. Handles structural code changes, components, schemas, and build config.

| What | Details |
|------|---------|
| **When** | Bug fixes, new features, components, schema changes, build config, refactoring |
| **Owns** | Everything not owned by other agents — components, layouts, schemas, build config |
| **Skills** | `block-replicator`, `vue-converter` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch |
| **Definition** | `.claude/agents/dev.md` |

### Deploy Agent (`deploy`)

Deployment and infrastructure specialist. Handles Vercel deploys and client worktree management.

| What | Details |
|------|---------|
| **When** | Deploying to Vercel, setting up projects, managing client branches/worktrees, creating concept branches |
| **Owns** | `client.json` deploy field, `vercel.json`, `.github/workflows/deploy-*.yml`, lifecycle scripts |
| **Skills** | `vercel-deploy`, `worktree-manager` |
| **Tools** | Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch |
| **Definition** | `.claude/agents/deploy.md` |

## Routing Rules

Defined in `CLAUDE.md`, the routing rules determine which agent handles each request:

1. **Single-domain request** — Route directly to the matching agent.
2. **Multi-domain request** — Break into sub-tasks. Execute sequentially, foundational changes first.
   - Example: "Add a Pricing page with good SEO and styled like About" → Content creates page → SEO optimizes metadata → Design adjusts styling.
3. **Reference-based work** — When the user provides a reference URL:
   1. Screenshot the reference (Playwright)
   2. Extract text content (WebFetch)
   3. Delegate with visual context to the appropriate agents
   4. Structural changes before styling (Dev before Design)
   5. Visual comparison after all agents finish
4. **Ambiguous request** — Ask the user to clarify.

## Client Context Detection

Every agent reads `src/data/client.json` as its first step in "Before Every Task":

| Context | `isBase` | Agent Behavior |
|---------|----------|----------------|
| Base (`main`) | `true` | Generic, placeholder content, neutral palette, reusable components |
| Client branch | `false` | Client-specific content, branding, design tokens, real images |
| Concept branch | `false` + `isConcept: true` | Same as client, but experimental — may be discarded |

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
(table of available skills — includes both agent-specific and shared skills)

## Before Every Task
(context detection + prerequisite reads)

## Ownership Boundaries
(what this agent can and cannot modify)

## Rules
(agent-specific constraints)
```

### Skill Types

**Agent-specific skills** live inside the agent's own directory (e.g., `.claude/agents/design/polish-page.md`). Only that agent uses them.

**Shared skills** live in `.claude/agents/shared/` and are referenced by multiple agents. Each agent that needs the shared skill adds it to its Skills table with the full path. The skill is read on demand, just like agent-specific skills.

Current shared skills:

| Skill | Path | Used by |
|-------|------|---------|
| Browser | `.claude/agents/shared/browser/SKILL.md` | Design, Images, SEO, Dev, Deploy |

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

1. Create `.claude/agents/<name>.md` with YAML frontmatter (`name`, `description`, `tools`, `model: inherit`)
2. Create `.claude/agents/<name>/` for skills
3. Add the agent to `CLAUDE.md` in the Agents section with routing rules
4. Add shared skills to its Skills table if needed (e.g., Browser)
5. Update this documentation

## Adding a New Skill

### Agent-specific skill

1. Create `.claude/agents/<agent>/<skill>.md` (simple) or `.claude/agents/<agent>/<skill>/SKILL.md` (complex)
2. Add the skill to the agent's Skills table in its definition file
3. Add supporting references/scripts in subdirectories as needed

### Shared skill

1. Create `.claude/agents/shared/<skill>/SKILL.md`
2. Add the skill to the Skills table of **every agent** that should have access
3. Ensure each agent's `tools:` list includes the required MCP tools (e.g., `mcp__playwright__*` for the browser skill)
4. Document the shared skill in this file's "Current shared skills" table
