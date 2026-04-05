# Getting Started

## What This Is

An Astro 5 static site starter managed entirely by Claude agents. No CMS dashboard — you tell Claude what you want in natural language, and specialist agents handle content, design, SEO, images, development, and deployment.

The same codebase serves as the **base template** for multiple client websites. Each client gets a branch and its own working directory via git worktrees.

## Prerequisites

- Node.js 20+
- npm
- Git 2.37+ (for worktree performance)
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
npm run validate # JSON checks + full build
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
| New client | "Set up a new client called Bob's Plumbing" |
| Deploy | "Deploy Little Campus to Vercel" |

Claude reads `CLAUDE.md` to understand the project, routes your request to the right specialist agent, and executes it. You review the result and iterate.

## Project Modes

This project operates in two modes depending on context:

### Base Development (on `main`)

You're improving the shared starter template. Agents keep everything generic — placeholder content, neutral colors, reusable components. Changes here eventually merge into all client branches.

### Client Work (on `client/<slug>`)

You're building or maintaining a specific client's website. Agents use the client's name, branding, reference URL, and design tokens. Each client has its own content, design, and images.

The system detects which mode it's in by reading `src/data/client.json`. No manual configuration needed.

## Next Steps

- [Project Structure](project-structure.md) — understand the directory layout
- [CMS Operations](cms-operations.md) — day-to-day content management
- [Client Management](client-management.md) — multi-client workflow
- [Agent System](agent-system.md) — how the specialist agents work
