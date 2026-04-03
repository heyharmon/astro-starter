# Unsplash API Reference

## Authentication

All requests require the `UNSPLASH_ACCESS_KEY` environment variable.

Header: `Authorization: Client-ID {access_key}`

## Rate Limits

- Demo apps: 50 requests/hour
- Production apps: 5000 requests/hour (requires approval)

## Image Sizes

| Size | Description | Max Width |
|------|-------------|-----------|
| `thumb` | Thumbnail | 200px |
| `small` | Small preview | 400px |
| `regular` | Standard web | 1080px |
| `full` | Full resolution | Original |
| `raw` | Unprocessed | Original |

**Recommended for this skill:** `regular` (under 1800px requirement)

## Attribution Requirements (Required by Unsplash ToS)

When using Unsplash images, you must:

1. **Trigger the download endpoint** - Call the `download_location` URL when downloading
2. **Provide attribution** - Credit the photographer with a link

### Attribution Format

```html
Photo by <a href="{photographer_url}?utm_source={app_name}&utm_medium=referral">{photographer_name}</a> on <a href="https://unsplash.com/?utm_source={app_name}&utm_medium=referral">Unsplash</a>
```

## Search Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `query` | Search terms | required |
| `per_page` | Results per page | 10 (max 30) |
| `orientation` | `landscape`, `portrait`, `squarish` | any |
| `color` | Filter by color | any |
| `order_by` | `relevant` or `latest` | `relevant` |

## Common Color Filters

`black_and_white`, `black`, `white`, `yellow`, `orange`, `red`, `purple`, `magenta`, `green`, `teal`, `blue`
