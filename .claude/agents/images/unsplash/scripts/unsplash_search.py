#!/usr/bin/env python3
"""Search Unsplash for images matching a query."""

import argparse
import json
import os
import sys
import urllib.request
import urllib.parse
import urllib.error


def get_api_key():
    """Get API key from environment variable."""
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        print("ERROR: UNSPLASH_ACCESS_KEY environment variable not set.", file=sys.stderr)
        print("Please set it or provide your API key when prompted.", file=sys.stderr)
        sys.exit(1)
    return key


def search_unsplash(query: str, count: int = 6, exclude_ids: list = None) -> dict:
    """
    Search Unsplash for images.
    
    Args:
        query: Search terms
        count: Number of results (3-6 recommended)
        exclude_ids: List of image IDs to exclude from results
    
    Returns:
        Dict with results and metadata
    """
    api_key = get_api_key()
    exclude_ids = exclude_ids or []
    
    # Request more than needed to account for exclusions
    per_page = min(count + len(exclude_ids) + 4, 30)
    
    params = urllib.parse.urlencode({
        "query": query,
        "per_page": per_page,
        "orientation": "landscape",  # Most common for web use
    })
    
    url = f"https://api.unsplash.com/search/photos?{params}"
    
    req = urllib.request.Request(url, headers={
        "Authorization": f"Client-ID {api_key}",
        "Accept-Version": "v1"
    })
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("ERROR: Invalid API key.", file=sys.stderr)
        elif e.code == 403:
            print("ERROR: Rate limit exceeded. Try again later.", file=sys.stderr)
        else:
            print(f"ERROR: HTTP {e.code}: {e.reason}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"ERROR: Network error: {e.reason}", file=sys.stderr)
        sys.exit(1)
    
    results = []
    for photo in data.get("results", []):
        if photo["id"] in exclude_ids:
            continue
        if len(results) >= count:
            break
            
        results.append({
            "id": photo["id"],
            "description": photo.get("description") or photo.get("alt_description") or "No description",
            "thumbnail": photo["urls"]["thumb"],
            "preview": photo["urls"]["small"],
            "download_url": photo["urls"]["regular"],  # ~1080px, under 1800px
            "full_url": photo["urls"]["full"],  # Full size if needed
            "width": photo["width"],
            "height": photo["height"],
            "photographer": photo["user"]["name"],
            "photographer_url": photo["user"]["links"]["html"],
            "unsplash_url": photo["links"]["html"],
            "download_endpoint": photo["links"]["download_location"],  # Required for tracking
        })
    
    return {
        "query": query,
        "total_available": data.get("total", 0),
        "returned": len(results),
        "results": results
    }


def main():
    parser = argparse.ArgumentParser(description="Search Unsplash for images")
    parser.add_argument("query", help="Search query")
    parser.add_argument("-n", "--count", type=int, default=6, help="Number of results (default: 6)")
    parser.add_argument("--exclude", nargs="*", default=[], help="Image IDs to exclude")
    parser.add_argument("--json", action="store_true", help="Output raw JSON")
    
    args = parser.parse_args()
    
    results = search_unsplash(args.query, args.count, args.exclude)
    
    if args.json:
        print(json.dumps(results, indent=2))
    else:
        print(f"\n🔍 Unsplash results for: \"{results['query']}\"")
        print(f"   Found {results['total_available']} total, showing {results['returned']}\n")
        
        for i, img in enumerate(results["results"], 1):
            print(f"[{i}] {img['description'][:60]}{'...' if len(img['description']) > 60 else ''}")
            print(f"    ID: {img['id']}")
            print(f"    Size: {img['width']}x{img['height']}")
            print(f"    📷 {img['photographer']}")
            print(f"    🔗 {img['unsplash_url']}")
            print(f"    Preview: {img['preview']}")
            print()


if __name__ == "__main__":
    main()
