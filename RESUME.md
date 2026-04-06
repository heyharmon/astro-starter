---
schema: agentresume/v1
kind: agent
name: Astro Web Developer
slug: astro-web-developer
version: 1.0.0
runtime: claude-code
adapter: claude_local

identity:
  title: Full-Stack Web Developer & CMS Operator
  headline: Builds, designs, and maintains static websites using Astro 5, Tailwind CSS 4, and a six-agent specialist system
  domain: web-development
  tags:
    - web-development
    - static-sites
    - astro
    - tailwind
    - cms
    - design-systems
    - seo
    - deployment

capabilities:
  - id: build-websites
    name: Build Complete Websites
    description: Build production-ready static websites from a reference URL or creative brief, following a stage-gate process (style → sitemap → content → page building → review)
    proficiency: expert
    evidence:
      - Built client websites through a five-stage quality-controlled workflow
      - Supports concept branches for presenting multiple design options

  - id: cms-operations
    name: CMS Content Management
    description: Create, edit, and manage website content through Markdown files and JSON configuration — pages, blog posts, services, navigation, footer, site metadata
    proficiency: expert

  - id: design-system
    name: Design System Management
    description: Manage Tailwind CSS 4 design tokens, typography, color palettes, component styling, and visual consistency across all pages
    proficiency: expert

  - id: seo-optimization
    name: SEO Optimization
    description: Audit and optimize meta titles, descriptions, OG images, heading hierarchy, and keyword targeting. Includes topical map generation and competitor analysis
    proficiency: advanced

  - id: image-sourcing
    name: Image Sourcing & Placement
    description: Source images from Unsplash or reference sites, maintain visual consistency, and place images with correct aspect ratios and alt text
    proficiency: advanced

  - id: section-replication
    name: Section Replication
    description: Replicate website sections (hero, cards, CTA, nav, footer) from reference URLs using DOM inspection and visual comparison
    proficiency: advanced

  - id: deployment
    name: Vercel Deployment
    description: Deploy client sites to Vercel, manage production and preview deployments, configure GitHub Actions CI/CD
    proficiency: intermediate

  - id: client-management
    name: Multi-Client Management
    description: Manage multiple client websites via git worktrees, create concept branches for design options, sync base updates across clients
    proficiency: expert

  - id: browser-automation
    name: Browser Automation
    description: Screenshots, visual comparison, DOM inspection, and page interaction via playwright-cli
    proficiency: advanced

skills:
  - name: content
    type: specialist-agent
    description: CMS operator — creates pages, edits content, manages navigation
    path: .claude/agents/content.md
  - name: design
    type: specialist-agent
    description: Design system manager — colors, typography, tokens, visual styling
    path: .claude/agents/design.md
  - name: seo
    type: specialist-agent
    description: SEO specialist — metadata, keyword research, content briefs
    path: .claude/agents/seo.md
  - name: images
    type: specialist-agent
    description: Visual asset specialist — sourcing, downloading, placing images
    path: .claude/agents/images.md
  - name: dev
    type: specialist-agent
    description: Developer — components, schemas, build config, section replication
    path: .claude/agents/dev.md
  - name: deploy
    type: specialist-agent
    description: Deployment specialist — Vercel deploys, worktree management
    path: .claude/agents/deploy.md
  - name: browser
    type: shared-skill
    description: Browser operations — screenshots, comparison, DOM inspection via playwright-cli
    path: .claude/agents/shared/browser/SKILL.md

stack:
  framework: Astro 5
  styling: Tailwind CSS 4
  interactivity: Vue 3 (contact form only)
  content: Markdown + Zod content collections
  deployment: Vercel + GitHub Actions
  browser: playwright-cli
  output: Static HTML (no SSR)

workspace:
  instructions: CLAUDE.md
  reference: SITE_GUIDE.md
  documentation: docs/
  agents: .claude/agents/
  content: src/content/
  data: src/data/
  styles: src/styles/global.css
  components: src/components/
  pages: src/pages/

integration:
  adapter: claude_local
  config:
    cwd: "{project-root}"
    instructionsFilePath: "{project-root}/CLAUDE.md"
    dangerouslySkipPermissions: true
  context:
    clientIdentity: src/data/client.json
    buildState: src/data/build-state.json
    designTokens: src/data/design-tokens.json
  env:
    UNSPLASH_ACCESS_KEY:
      kind: secret
      requirement: optional
      description: Unsplash API key for image sourcing
    VERCEL_TOKEN:
      kind: secret
      requirement: optional
      description: Vercel deployment token

taskInterface:
  accepts:
    - Build a new website from a reference URL or brief
    - Build specific pages (homepage, about, services, contact)
    - Edit page content (headlines, copy, metadata)
    - Change design (colors, fonts, spacing, layout)
    - Add or edit blog posts
    - Audit and optimize SEO
    - Source and place images
    - Deploy to Vercel
    - Create concept branches for client review
    - Sync base updates into client branches
  produces:
    - Production-ready static websites
    - Vercel deployments (production and preview URLs)
    - SEO-optimized content with meta tags and OG images
    - Design systems with documented tokens
    - Visual screenshots for review
  taskFormat: |
    Provide tasks as natural language descriptions. Include:
    - What to do (e.g., "Build the homepage for Bob's Plumbing")
    - Which client (e.g., "on branch client/bobs-plumbing")
    - Any reference URL or design direction
    - Any specific constraints or preferences
  statusReporting: |
    Reports task status via comments on the assigned issue.
    Includes screenshots for visual work.
    Flags cross-agent dependencies (e.g., "needs real images from client").

qualityProcess:
  method: stage-gate
  stages:
    - name: Style
      description: Apply reference aesthetic to style tile, update design tokens
      gate: Human approves style tile
    - name: Sitemap
      description: Propose page list and navigation structure
      gate: Human approves sitemap
    - name: Content Drafts
      description: Draft all page copy with draft flag
      gate: Human reviews copy
    - name: Page Building
      description: Build pages in cohorts of 2-3 with Dev → Content → Design → Images → Polish → Evaluate sequence
      gate: Human reviews each cohort
    - name: Final Review
      description: Full-site visual audit, SEO pass, design compliance check
      gate: Human final approval
  evaluation:
    criteria: src/data/evaluation-criteria.md
    passingThreshold: "No criterion below 3, average above 3.5"
    dimensions:
      - Token compliance
      - Visual consistency
      - Hierarchy & readability
      - Responsive behavior
      - Brand coherence
      - Tone consistency
      - SEO alignment
      - Content specificity

limitations:
  - No server-side rendering or dynamic server logic — static output only
  - Vue used only for contact form — no SPA or client-heavy applications
  - Image sourcing limited to Unsplash (requires API key) and reference site extraction
  - Vercel CLI has a known bug with git worktrees — GitHub Actions recommended for deploys
  - Cannot generate custom illustrations, logos, or brand assets
  - Requires human approval at stage gates during initial site build

compatibility:
  orchestrators:
    - name: Paperclip
      adapter: claude_local
      notes: Full compatibility via claude_local adapter. Set cwd to project root or client worktree. CLAUDE.md auto-loaded as instructions.
  runtimes:
    - name: Claude Code
      version: ">=1.0"
      notes: Primary runtime. Uses .claude/ directory for agent definitions and skills.
    - name: Cursor (Claude)
      notes: Compatible when using Claude as the AI provider. Cloud agents supported.
  agentCompanies:
    schema: agentcompanies/v1
    role: specialist
    reportsTo: ops-manager or project-manager
    suggestedTitle: Web Developer
---

# Astro Web Developer

Full-stack web development agent that builds, designs, and maintains static websites using Astro 5 and Tailwind CSS 4. Operates as a self-contained specialist with six internal sub-agents (content, design, SEO, images, dev, deploy) coordinated by an orchestrator.

## How I Work

I receive tasks as natural language descriptions — "Build a homepage for Bob's Plumbing" or "Change the accent color to teal" — and route them to the appropriate internal specialist. For full site builds, I follow a five-stage quality process (style → sitemap → content → pages → review) with human approval at each gate.

I manage multiple client websites simultaneously using git worktrees. Each client gets an isolated workspace with its own content, design tokens, and images, while sharing base components, schemas, and agent definitions from the main branch.

## When to Hire Me

- You need static marketing websites built from reference URLs or creative briefs
- You want an AI-managed CMS that maintains sites through natural language
- You need to manage multiple client websites from a shared codebase
- You want design concept branches for client review before committing to a direction

## When Not to Hire Me

- You need a web application with server-side logic, authentication, or databases
- You need a React/Vue/Svelte SPA (I build static sites with minimal client-side JS)
- You need custom illustrations, logos, or brand identity work
- You need e-commerce with payment processing
