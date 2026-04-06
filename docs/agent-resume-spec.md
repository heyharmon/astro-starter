# Agent Resume Specification

Version: `agentresume/v1-draft`

## 1. Purpose

An Agent Resume is a machine-readable and human-readable document that describes an AI agent's capabilities, skills, integration requirements, task interface, quality process, limitations, and compatibility with orchestration platforms.

Resumes enable:

- **Discovery** — an orchestrator (CEO agent, project manager, hiring agent) can read a resume and determine whether the agent is a good fit for a role
- **Integration** — a platform can read the resume to understand adapter config, environment requirements, and workspace setup
- **Delegation** — a manager agent can read the resume to understand what tasks the agent accepts, what it produces, and how it reports status
- **Evaluation** — a reviewer can assess the agent's quality process, limitations, and proficiency levels before hiring
- **Portability** — an agent can move between companies, platforms, and orchestrators without rewriting its identity

## 2. Core Principles

1. Markdown is canonical. The resume is a Markdown file with YAML frontmatter.
2. The resume describes the agent, not the platform. Platform-specific config lives in optional sections.
3. Resumes are self-describing. An orchestrator reading only the resume should understand what the agent does, how to task it, and what to expect.
4. Proficiency is honest. Agents declare limitations alongside capabilities.
5. The format extends Agent Companies. A resume can be referenced from an `AGENTS.md` package or stand alone.
6. No secrets in resumes. Environment declarations describe what's needed, not the values.

## 3. File Convention

The resume file is named `RESUME.md` and lives at the root of the agent's project or workspace.

```text
my-agent/
├── RESUME.md           ← the agent resume
├── AGENTS.md           ← Agent Companies agent definition (if applicable)
├── .claude/            ← agent internals (skills, config)
└── ...
```

When an Agent Companies package includes a resume, `AGENTS.md` may reference it:

```yaml
resume: RESUME.md
```

A resume can also exist without an Agent Companies package — it stands alone as a portable identity document.

## 4. Frontmatter Schema

```yaml
schema: agentresume/v1
kind: agent
name: Human Readable Agent Name
slug: url-safe-slug
version: 1.0.0
runtime: claude-code | codex | opencode | cursor | custom
adapter: claude_local | codex_local | process | http | null
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `schema` | string | Must be `agentresume/v1` |
| `kind` | string | Must be `agent` |
| `name` | string | Human-readable agent name |
| `slug` | string | URL-safe identifier (lowercase, hyphenated) |

### Recommended Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | SemVer version of the agent |
| `runtime` | string | Primary runtime (e.g., `claude-code`, `codex`, `opencode`) |
| `adapter` | string | Preferred orchestrator adapter type (e.g., `claude_local`) |

## 5. Identity

The `identity` block provides a brief, scannable description of the agent.

```yaml
identity:
  title: Full-Stack Web Developer
  headline: Builds static websites using Astro 5 and Tailwind CSS 4
  domain: web-development
  tags:
    - web-development
    - static-sites
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Job title — what a hiring agent would see |
| `headline` | string | yes | One-line description of what the agent does |
| `domain` | string | yes | Primary domain (e.g., `web-development`, `data-analysis`, `devops`) |
| `tags` | string[] | no | Searchable tags for discovery |

## 6. Capabilities

The `capabilities` array lists what the agent can do, with proficiency levels and optional evidence.

```yaml
capabilities:
  - id: build-websites
    name: Build Complete Websites
    description: Build production-ready static websites from a reference URL or brief
    proficiency: expert
    evidence:
      - Built client websites through a five-stage quality process
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable identifier for the capability |
| `name` | string | yes | Human-readable capability name |
| `description` | string | yes | What this capability entails |
| `proficiency` | enum | yes | `beginner`, `intermediate`, `advanced`, `expert` |
| `evidence` | string[] | no | Concrete examples or accomplishments demonstrating the capability |

### Proficiency Levels

| Level | Meaning |
|-------|---------|
| `beginner` | Can perform with guidance. May need iteration or human correction. |
| `intermediate` | Competent. Handles standard cases reliably. Edge cases may need help. |
| `advanced` | Highly capable. Handles complex cases. Produces high-quality output. |
| `expert` | Mastery. Handles the full range of this capability autonomously. |

## 7. Skills

The `skills` array lists the agent's installed skills — reusable procedures or specialist sub-agents.

```yaml
skills:
  - name: content
    type: specialist-agent
    description: CMS operator — creates pages, edits content
    path: .claude/agents/content.md
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Skill shortname |
| `type` | string | yes | `skill`, `specialist-agent`, `shared-skill`, or `tool` |
| `description` | string | yes | What the skill does |
| `path` | string | no | Relative path to the skill definition |

Skill `type` values:

| Type | Meaning |
|------|---------|
| `skill` | A standalone procedure the agent can execute |
| `specialist-agent` | An internal sub-agent with its own routing and ownership |
| `shared-skill` | A skill shared across multiple internal agents |
| `tool` | An external tool or CLI the agent uses |

## 8. Stack

The `stack` block describes the agent's technology stack — what frameworks, tools, and runtimes the agent works with.

```yaml
stack:
  framework: Astro 5
  styling: Tailwind CSS 4
  deployment: Vercel
  output: Static HTML
```

This is a free-form key-value block. Use descriptive keys relevant to the agent's domain. The purpose is to help a hiring agent or platform understand what technologies the agent brings.

## 9. Workspace

The `workspace` block maps the agent's project structure — where key files live.

```yaml
workspace:
  instructions: CLAUDE.md
  agents: .claude/agents/
  content: src/content/
  styles: src/styles/global.css
```

This is a free-form key-value block. The purpose is to help an orchestrator understand the agent's project layout for workspace configuration.

## 10. Integration

The `integration` block describes how to connect the agent to an orchestration platform.

```yaml
integration:
  adapter: claude_local
  config:
    cwd: "{project-root}"
    instructionsFilePath: "{project-root}/CLAUDE.md"
  env:
    UNSPLASH_ACCESS_KEY:
      kind: secret
      requirement: optional
      description: Unsplash API key for image sourcing
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `adapter` | string | yes | Adapter type for the orchestration platform |
| `config` | object | yes | Adapter configuration (platform-specific) |
| `config.cwd` | string | yes | Working directory. Use `{project-root}` as a placeholder. |
| `config.instructionsFilePath` | string | no | Path to the agent's instruction file |
| `context` | object | no | Files the agent reads for runtime context |
| `env` | object | no | Environment variable declarations (never include values) |

### Environment Declarations

Environment entries describe what the agent needs, not the secret values:

```yaml
env:
  MY_API_KEY:
    kind: secret | plain
    requirement: required | optional
    description: What this variable is used for
    default: ""
```

## 11. Task Interface

The `taskInterface` block describes how the agent receives and produces work. This is the most important section for a hiring manager or orchestrator agent — it answers "how do I work with this agent?"

```yaml
taskInterface:
  accepts:
    - Build a new website from a reference URL
    - Edit page content
    - Deploy to Vercel
  produces:
    - Production-ready static websites
    - Vercel deployments with preview URLs
  taskFormat: |
    Provide tasks as natural language descriptions. Include:
    - What to do
    - Which client or workspace
    - Any reference URLs or constraints
  statusReporting: |
    Reports via comments on the assigned issue.
    Includes screenshots for visual work.
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accepts` | string[] | yes | Types of tasks the agent can receive |
| `produces` | string[] | yes | Types of outputs the agent delivers |
| `taskFormat` | string | yes | How to write a good task for this agent |
| `statusReporting` | string | no | How the agent reports progress and completion |

## 12. Quality Process

The `qualityProcess` block describes how the agent ensures quality — review stages, evaluation criteria, and standards.

```yaml
qualityProcess:
  method: stage-gate | continuous | review-based | none
  stages:
    - name: Style
      description: Apply aesthetic to design tokens
      gate: Human approves style tile
  evaluation:
    criteria: path/to/criteria.md
    passingThreshold: "Description of what passing looks like"
```

This section is optional but strongly recommended. It helps an orchestrator understand how much oversight the agent needs and where human review is expected.

## 13. Limitations

The `limitations` array lists what the agent cannot do. Honest limitations build trust and help hiring decisions.

```yaml
limitations:
  - No server-side rendering — static output only
  - Cannot generate custom illustrations or logos
  - Requires human approval at stage gates during initial build
```

This is a required section. An agent with no declared limitations is less trustworthy than one that acknowledges its boundaries.

## 14. Compatibility

The `compatibility` block describes which orchestrators, runtimes, and standards the agent works with.

```yaml
compatibility:
  orchestrators:
    - name: Paperclip
      adapter: claude_local
      notes: Full compatibility. Set cwd to project root.
  runtimes:
    - name: Claude Code
      version: ">=1.0"
  agentCompanies:
    schema: agentcompanies/v1
    role: specialist
    reportsTo: ops-manager
    suggestedTitle: Web Developer
```

### Orchestrator Compatibility

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Orchestrator name |
| `adapter` | string | Which adapter to use |
| `notes` | string | Setup notes, compatibility caveats |

### Runtime Compatibility

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Runtime name |
| `version` | string | Version constraint |
| `notes` | string | Any notes |

### Agent Companies Compatibility

| Field | Type | Description |
|-------|------|-------------|
| `schema` | string | Agent Companies spec version |
| `role` | string | Suggested role (e.g., `specialist`, `manager`, `executive`) |
| `reportsTo` | string | Suggested manager slug |
| `suggestedTitle` | string | Suggested job title in an org chart |

## 15. Body Content

The Markdown body (below the frontmatter) is the human-readable narrative. It should include:

1. **What the agent does** — one paragraph summary
2. **How the agent works** — workflow, internal architecture, anything a manager should know
3. **When to hire** — ideal use cases
4. **When not to hire** — what the agent is not suited for

The body is what a human reads. The frontmatter is what machines read. Both should be consistent.

## 16. Relationship to Agent Companies

A resume complements the Agent Companies specification:

| Spec | Purpose | File |
|------|---------|------|
| Agent Companies | Defines the agent's **role in an organization** — reporting structure, skills, instructions | `AGENTS.md` |
| Agent Resume | Defines the agent's **identity and capabilities** — what it can do, how to work with it, quality guarantees | `RESUME.md` |

An `AGENTS.md` tells an orchestrator "this agent is the CTO, reports to the CEO, and uses these skills." A `RESUME.md` tells an orchestrator "this agent builds static websites, accepts tasks as natural language, produces Vercel deployments, and follows a five-stage quality process."

When both exist:
- `AGENTS.md` is the org-chart definition (position, reporting, skills)
- `RESUME.md` is the capability document (what the agent can do and how)
- `AGENTS.md` may reference the resume: `resume: RESUME.md`

A resume can exist without an Agent Companies package. An agent with only a `RESUME.md` is a freelancer — it has no org placement but fully describes its capabilities.

## 17. Resolution and Discovery

An orchestrator looking for agents can:

1. Read `RESUME.md` from a git repository
2. Search by `domain`, `tags`, or `capabilities[].id`
3. Check `compatibility.orchestrators` for platform fit
4. Check `compatibility.agentCompanies` for org chart fit
5. Read `taskInterface` to understand how to delegate work
6. Read `limitations` to understand what the agent cannot do

A hiring agent evaluating candidates can compare resumes by:
- Capability coverage (does this agent have the capabilities I need?)
- Proficiency levels (is it expert or beginner at the critical skills?)
- Limitations (do the limitations conflict with my requirements?)
- Quality process (how much oversight will this agent need?)
- Integration requirements (do I have the right adapter, env vars, and workspace?)

## 18. Minimal Example

```yaml
---
schema: agentresume/v1
kind: agent
name: Code Reviewer
slug: code-reviewer
version: 1.0.0
runtime: claude-code
adapter: claude_local

identity:
  title: Senior Code Reviewer
  headline: Reviews pull requests for correctness, style, and security
  domain: software-engineering
  tags: [code-review, security, quality]

capabilities:
  - id: code-review
    name: Pull Request Review
    description: Reviews code changes for bugs, style violations, and security issues
    proficiency: expert
  - id: security-audit
    name: Security Audit
    description: Identifies common security vulnerabilities in web applications
    proficiency: advanced

skills:
  - name: review
    type: skill
    description: Paranoid code review with security focus

taskInterface:
  accepts:
    - Review a pull request
    - Audit a codebase for security issues
  produces:
    - Review comments on the PR
    - Security audit report
  taskFormat: Provide a PR URL or repository path.

limitations:
  - Cannot run tests — review only
  - Limited to languages it has training data for
  - Does not fix issues, only identifies them

compatibility:
  orchestrators:
    - name: Paperclip
      adapter: claude_local
---

# Code Reviewer

Reviews pull requests for correctness, style consistency, and security vulnerabilities. Produces detailed review comments directly on the PR.

## When to Hire

- You need automated code review on every PR
- You want security-focused review that catches common vulnerabilities

## When Not to Hire

- You need an agent that also fixes the issues it finds
- You need review of non-code artifacts (designs, docs)
```

## 19. Export Rules

A compliant exporter should:

- Emit the YAML frontmatter and Markdown body
- Omit secret values (only declare `kind`, `requirement`, and `description`)
- Omit machine-local paths (use `{project-root}` placeholders)
- Preserve `version` for reproducibility
- Omit empty or default-valued fields
- Preserve the body narrative alongside the structured frontmatter
