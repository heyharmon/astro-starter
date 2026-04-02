---
name: seo-topical-map
description: Expert SEO keyword strategist for generating high-impact topical maps focused on the 80/20 rule — the 20% of keywords that drive 80% of results. This skill should be used when users need to identify pillar keywords and build keyword clusters that inform a content strategy. Designed for company founders with 1-6 offerings (products, services, or tools) who are going to market and need to know what content to create to achieve topical authority and rank on the first page of search engines.
---

# SEO Topical Map Generator

This skill generates comprehensive topical maps that serve as the foundation for a brand's content and SEO strategy. The output provides a clear roadmap of pillar keywords and cluster topics that inform what pages, articles, and content assets to create.

## When to Use This Skill

- A user asks to generate a topical map, keyword strategy, or content roadmap for a business
- A user needs to identify pillar keywords for SEO
- A user wants to understand what content to create to rank for their target topics
- A user mentions going to market with a new product/service and needs SEO guidance

## Required Inputs

Before generating a topical map, collect the following information:

| Input | Description | Example |
|-------|-------------|---------|
| Business name | Company or brand name | "Paraloom" |
| Business description | What the business does, its offerings (1-6 products/services/tools), and target audience | "AI visibility analytics platform that helps brands understand and optimize how they appear in AI-generated responses" |
| Geography | Target market location(s) | "United States" or "Salt Lake City, Utah" or "Global" |
| Website URL | Current website if one exists | "https://paraloom.com" (or "None yet") |
| Lookalike competitors | 2-5 businesses in the same space | "Semrush, Ahrefs, Clearscope" |

## Topical Map Generation Process

### Step 1: Understand the Business Context

Analyze the provided inputs to understand:

- **Business type** — Is this SaaS, service business, e-commerce, content/media, or agency? The business type shapes which pillar patterns and cluster strategies apply.
- **Core offerings** — What specific products, services, or tools does the business sell? Each offering typically warrants pillar consideration.
- **Target audience** — Who are the buyers? What problems drive them to search? What language do they use?
- **Geographic relevance** — Local, regional, national, or global? Geographic modifiers may or may not be relevant.
- **Competitive landscape** — Who are the lookalike competitors? What's the business's differentiation angle?

The business type should orient all subsequent keyword decisions. A local service business needs different pillars than a global SaaS platform.

### Step 2: Identify Pillar Keywords

Pillar keywords are broad, foundational keywords that represent the major topics the business should own. To identify pillars:

1. **Map each offering to a pillar** — Each product, service, or tool typically warrants its own pillar
2. **Identify audience-problem pillars** — What problems does the target audience search for solutions to?
3. **Consider industry/category pillars** — Broader industry terms the business should be associated with
4. **Evaluate geographic pillars** — If location matters, include geo-modified pillar terms

Use web_search to validate pillar keywords by checking:
- Search results show commercial/informational intent aligned with the business
- Competitors are ranking for these terms
- The topic has enough depth to support meaningful cluster topics

**Validation searches:**
- Search the pillar keyword directly to see what types of content rank
- Search "[competitor name] [pillar keyword]" to verify competitors target this topic
- Search variations of the pillar to gauge topic breadth

Reference: See `references/pillar-keyword-methodology.md` for detailed criteria and examples.

### Step 3: Expand Each Pillar into Keyword Clusters

For each pillar keyword, generate cluster keywords that cover the topic comprehensively. Use the cluster expansion framework:

1. **Question modifiers** — what is, how to, why, when to, where to
2. **Comparison modifiers** — vs, alternatives, compared to, or
3. **Qualifier modifiers** — best, top, free, cheap, enterprise, for [audience]
4. **Intent modifiers** — buy, pricing, demo, examples, templates, tools
5. **Long-tail variations** — specific use cases, niche applications, edge cases

Use web_search to:
- Search the pillar keyword to see what related topics rank alongside it
- Search competitor names + pillar keywords to find their content, then use web_fetch to analyze what topics they cover
- Identify content gaps (topics competitors miss or cover poorly)

Reference: See `references/cluster-expansion-framework.md` for the complete expansion methodology.

### Step 4: Map Search Intent and Content Types

For each cluster keyword, determine:

1. **Search intent**:
   - **Informational** — User wants to learn (blog posts, guides, how-tos)
   - **Navigational** — User looking for a specific page/brand (homepage, about, product pages)
   - **Commercial investigation** — User comparing options (comparison pages, reviews, listicles)
   - **Transactional** — User ready to act (landing pages, pricing pages, signup pages)

2. **Recommended content type**:
   - Blog post / Article
   - Landing page
   - Product/Service page
   - Comparison page
   - Guide / Tutorial
   - Resource page / Tool
   - FAQ page

Reference: See `references/search-intent-mapping.md` for intent classification guidelines.

### Step 5: Prioritize and Organize

Assign priority tiers based on:

- **Tier 1 (High)** — Direct commercial intent, core offerings, lower competition
- **Tier 2 (Medium)** — Supporting topics, audience problems, moderate competition  
- **Tier 3 (Low)** — Broader awareness topics, high competition, long-term plays

### Step 6: Competitor Analysis

Use web_search to analyze the provided lookalike competitors:

1. Search each competitor's brand name to understand their positioning
2. Search key pillar and cluster keywords to see which competitors rank
3. When a competitor ranks for an important keyword, use web_fetch to visit that page and analyze:
   - What topics they cover
   - How they structure their content
   - What content format they use
4. Note content gaps — topics competitors don't cover or cover poorly
5. Document content formats competitors use successfully

**Important for JSON Export:** When documenting competitor insights, link them to specific keywords:
- If a competitor ranks for a specific cluster keyword, add that insight to that keyword's `competitorInsights` array
- If a keyword represents a content gap (no competitors cover it), note this as an opportunity
- If a keyword has weak competitor coverage, note this as an opportunity to create better content
- Include the competitor name and their content URL when applicable

Reference: See `references/competitor-analysis-guide.md` for the full analysis framework.

## Output Format

Generate the topical map in TWO formats. Both outputs should be provided together:

### 1. Markdown Report

Generate the topical map as markdown tables using the template in `assets/topical-map-template.md`.

The markdown output should include:

1. **Executive Summary** — Overview of the strategy, number of pillars, total clusters
2. **Pillar Keywords Table** — All pillars with rationale
3. **Cluster Tables** — One table per pillar with all cluster keywords
4. **Content Roadmap** — Prioritized list of content to create first
5. **Competitor Insights** — Key findings from competitor analysis

### 2. JSON Export

Generate a JSON document using the structure in `assets/keyword-export-template.json`. See `assets/keyword-export-example.json` for a complete example. This JSON format enables import into keyword management tools.

**Key requirements for JSON:**
- Each pillar keyword contains nested cluster keywords
- Each cluster keyword includes: keyword, searchIntent, contentType, priority, and competitorInsights (if applicable)
- Competitor insights must be linked to specific keywords, not just listed separately
- The JSON should be valid and ready for import into keyword management applications

**Competitor Insights Linking:**
- When a competitor insight relates to a specific keyword (e.g., "Competitor X ranks for this keyword but coverage is thin"), include that insight in the `competitorInsights` array for that keyword
- Include insights that identify opportunities (content gaps, weak competitor coverage, format opportunities)
- Each insight should specify which competitor(s) it relates to and what opportunity it represents
- If a keyword has no competitor insights, use an empty array `[]` for `competitorInsights`
- Common insight types to include:
  - **Content gap**: "No competitors currently rank for this keyword"
  - **Weak coverage**: "[Competitor] ranks but content is thin/outdated - opportunity to create deeper resource"
  - **Format opportunity**: "All competitors use [format X] - [format Y] could differentiate"
  - **Competitive strength**: "[Competitor] has strong content here - need to match/exceed quality"

**JSON Generation Process:**
1. After generating the markdown report, extract all pillar and cluster data
2. For each cluster keyword, check if any competitor insights were identified during analysis
3. Link insights to keywords by adding them to the keyword's `competitorInsights` array
4. Calculate metadata (total counts) after all keywords are added
5. Validate JSON structure matches the template before outputting

**Note on Competitor Insights:**
- The markdown report may include general competitor insights (e.g., "Competitor X excels at comparison content")
- The JSON export should link insights to specific keywords where applicable
- If a general insight applies to multiple keywords, include it in each relevant keyword's `competitorInsights` array
- If an insight doesn't relate to a specific keyword, it can remain only in the markdown report

## Key Principles

- **Quality over quantity (80/20 rule)** — Focus on the 20% of keywords that will drive 80% of SEO and GEO results. Fewer high-impact keywords beat exhaustive lists.
- **Business-type alignment** — Pillar and cluster strategies should match the specific business type (SaaS, service, e-commerce, etc.)
- **User intent alignment** — Every keyword should match content the business can credibly create and that serves real searcher needs
- **Topical authority focus** — The map should help the business become THE authority on their pillars, not spread thin across too many topics
- **Actionable output** — The user should know exactly what content to create after receiving the map
- **No volume/difficulty claims** — This skill does not provide search volume or keyword difficulty metrics. Users will obtain these separately. Focus on strategic keyword selection based on intent, relevance, and competitive positioning.
