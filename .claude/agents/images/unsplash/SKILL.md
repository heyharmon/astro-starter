---
name: unsplash-search
description: Search and download images from Unsplash. Presents options with thumbnails, supports feedback-based refinement, downloads with proper attribution, and places images in public/images/.
---

# Unsplash Image Search & Download

Source images from Unsplash with iterative refinement, proper attribution, and automatic placement.

## Setup

Requires `UNSPLASH_ACCESS_KEY` environment variable. If not set, ask the user to provide their API key:

```bash
export UNSPLASH_ACCESS_KEY="your_key_here"
```

## Workflow

### 1. Analyze Request

Determine if the request is **single-subject** or **multi-subject**:

- **Single-subject:** "find a hero image for the homepage"
- **Multi-subject:** "I need images for each service card" (multiple distinct images)

### 2. Search

**Single-subject** — one search, 3-6 options:
```bash
python3 .claude/agents/images/unsplash/scripts/unsplash_search.py "search terms" -n 6 --json
```

**Multi-subject** — separate searches, 1-2 results each:
```bash
python3 .claude/agents/images/unsplash/scripts/unsplash_search.py "term one" -n 2 --json
python3 .claude/agents/images/unsplash/scripts/unsplash_search.py "term two" -n 2 --json
```

**Search term translation** — translate page context into effective search queries:
- "hero image for a welding company" → "industrial welding sparks workshop"
- "background for a daycare about page" → "children playing daycare colorful"
- "team photo for consulting firm" → "professional team office meeting"

### 3. Present Results

Show thumbnail previews, descriptions, photographer credit, and IDs. Let the user (or orchestrator) select which to download.

### 4. Handle Feedback

Track rejected IDs. On refinement:
```bash
python3 .claude/agents/images/unsplash/scripts/unsplash_search.py "refined terms" -n 6 --exclude id1 id2 --json
```

### 5. Download

Download to the appropriate subdirectory of `public/images/`:

```bash
python3 .claude/agents/images/unsplash/scripts/unsplash_download.py \
  --url "{download_url}" \
  --output-dir "public/images/{category}" \
  --filename "{descriptive-slug}" \
  --download-endpoint "{download_endpoint}" \
  --metadata-json '{"description":"...","photographer":"...","photographer_url":"...","unsplash_url":"..."}'
```

**Directory convention:**
| Placement | Directory | Example |
|-----------|-----------|---------|
| Hero backgrounds | `public/images/hero/` | `hero/workshop-sparks.jpg` |
| Service images | `public/images/services/` | `services/web-design.jpg` |
| Project images | `public/images/projects/` | `projects/hospital-retrofit.jpg` |
| Team/portraits | `public/images/team/` | `team/owner-portrait.jpg` |
| Blog images | `public/images/blog/` | `blog/industry-trends.jpg` |
| General/other | `public/images/` | `office-exterior.jpg` |

**Filename convention:** `{descriptive-slug}.jpg` — e.g., `workshop-sparks-welding.jpg`

### 6. Place in Content

After downloading, update the relevant content file's frontmatter with the image path:

- **Pages:** Set `featuredImage: { src: "/images/hero/filename.jpg", alt: "descriptive alt text" }`
- **Services:** Set `image: { src: "/images/services/filename.jpg", alt: "descriptive alt text" }`
- **Projects:** Set `image: { src: "/images/projects/filename.jpg", alt: "descriptive alt text" }`
- **Blog:** Set `image: { src: "/images/blog/filename.jpg", alt: "descriptive alt text" }`

Also update any hardcoded image `src` attributes in `.astro` route files if the image is used in a non-frontmatter context (e.g., inline hero background).

### 7. Verify

Run `npm run validate` to ensure the build still passes with the new image references.

## Scripts

| Script | Purpose |
|--------|---------|
| `.claude/agents/images/unsplash/scripts/unsplash_search.py` | Search Unsplash, returns JSON |
| `.claude/agents/images/unsplash/scripts/unsplash_download.py` | Download image + generate attribution |

## API Reference

See `.claude/agents/images/unsplash/references/unsplash_api.md` for size options, search parameters, and attribution requirements.
