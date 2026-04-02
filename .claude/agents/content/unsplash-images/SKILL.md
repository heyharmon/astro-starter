---
name: unsplash-image-sourcing
description: Source and download images from Unsplash based on descriptions. Triggers when user mentions finding, sourcing, getting, searching for, or needing an image, photo, graphic, background, hero image, or visual for websites, content, or projects. Presents 3-6 options with thumbnails, supports feedback-based refinement (thumbs up/down), and downloads with proper attribution.
---

# Unsplash Image Sourcing

Source images from Unsplash with iterative refinement and proper attribution.

## Setup

Requires `UNSPLASH_ACCESS_KEY` environment variable. If not set, ask the user to provide their API key and set it:

```bash
export UNSPLASH_ACCESS_KEY="your_key_here"
```

## Workflow

### 1. Analyze Request

Before searching, determine if the request is **single-subject** or **multi-subject**:

**Single-subject indicators:**
- "find an image of X"
- "I need a photo for my homepage"
- "get me a background of mountains"

**Multi-subject indicators:**
- "I need photos of X, Y, and Z"
- "get images for each of these: A, B, C"
- "one of X, one of Y, one of Z"
- Lists, commas, or "each" language

### 2. Search

**For single-subject requests**, run one search returning 3-6 options:

```bash
python3 scripts/unsplash_search.py "search terms" -n 6 --json
```

**For multi-subject requests**, extract each distinct subject and run separate searches with 1-2 results each:

```bash
python3 scripts/unsplash_search.py "arches national park" -n 2 --json
python3 scripts/unsplash_search.py "grand canyon" -n 2 --json
python3 scripts/unsplash_search.py "zion national park" -n 2 --json
```

Group results by subject when presenting.

**Search term translation:**
- "hero image for a SaaS landing page about productivity" → "productivity workspace minimal"
- "background for a restaurant website" → "restaurant interior ambient"
- "photo of mountains for travel blog" → "mountain landscape scenic"

### 3. Present Results

**Single-subject format:**
```
Here are 6 options for "mountain landscape":

1. [Thumbnail] Snow-capped peaks at sunrise - by John Smith (ID: abc123)
2. [Thumbnail] Misty mountain valley - by Jane Doe (ID: def456)
...

Let me know which you'd like to download, or give feedback (👍/👎) to refine the search.
```

**Multi-subject format:**
```
Here are images for your 5 locations:

**Arches National Park**
1. [Thumbnail] Delicate Arch at sunset - by John Smith (ID: abc123)
2. [Thumbnail] Double Arch formation - by Jane Doe (ID: def456)

**Grand Canyon**
3. [Thumbnail] South Rim panorama - by Bob Wilson (ID: ghi789)
4. [Thumbnail] Canyon at golden hour - by Sarah Lee (ID: jkl012)

**Zion National Park**
...

Let me know which to download. You can select individual images (e.g., "1, 3, 5"), all from a category (e.g., "all Zion"), or download all.
```

### 4. Handle Feedback

Track rejected image IDs in conversation. On refinement request:

```bash
python3 scripts/unsplash_search.py "refined terms" -n 6 --exclude id1 id2 id3 --json
```

Refine search terms based on feedback:
- "more dramatic lighting" → add "dramatic moody"
- "less busy, more minimal" → add "minimal clean simple"
- "warmer colors" → add "warm golden"

### 5. Download

When user selects image(s), download to `/mnt/user-data/outputs/`:

```bash
python3 scripts/unsplash_download.py \
  --url "{download_url}" \
  --output-dir "/mnt/user-data/outputs" \
  --filename "{query_slug}-{context_slug}" \
  --download-endpoint "{download_endpoint}" \
  --metadata-json '{"description":"...","photographer":"...","photographer_url":"...","unsplash_url":"..."}'
```

**Filename convention:** `{search-query}-{image-context}.jpg`
- Example: `mountain-landscape-snowy-peaks-sunrise.jpg`

For bulk download, run the script for each selected image.

### 6. Deliver

Present downloaded file(s) to user and include attribution info:
- Link to the image file
- Photographer credit with links
- Remind user of attribution requirements for public use

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/unsplash_search.py` | Search Unsplash, returns JSON with results |
| `scripts/unsplash_download.py` | Download image with attribution file |

## API Reference

See `references/unsplash_api.md` for size options, search parameters, and attribution requirements.
