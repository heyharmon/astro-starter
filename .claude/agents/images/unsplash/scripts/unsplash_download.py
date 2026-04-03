#!/usr/bin/env python3
"""Download images from Unsplash with proper attribution."""

import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error


def get_api_key():
    """Get API key from environment variable."""
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        print("ERROR: UNSPLASH_ACCESS_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)
    return key


def slugify(text: str, max_length: int = 50) -> str:
    """Convert text to a filesystem-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text[:max_length].rstrip('-')


def trigger_download(download_endpoint: str):
    """
    Trigger Unsplash download endpoint (required by API guidelines).
    This notifies Unsplash of the download for photographer stats.
    """
    api_key = get_api_key()
    req = urllib.request.Request(download_endpoint, headers={
        "Authorization": f"Client-ID {api_key}",
    })
    try:
        with urllib.request.urlopen(req, timeout=10):
            pass
    except urllib.error.URLError:
        pass  # Non-critical, continue with download


def download_image(
    image_url: str,
    output_dir: str,
    filename: str,
    download_endpoint: str = None,
    metadata: dict = None
) -> dict:
    """
    Download an image from Unsplash.
    
    Args:
        image_url: URL to download from
        output_dir: Directory to save to
        filename: Base filename (without extension)
        download_endpoint: Unsplash tracking endpoint (required by ToS)
        metadata: Image metadata for attribution file
    
    Returns:
        Dict with download result
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # Trigger download tracking (required by Unsplash API guidelines)
    if download_endpoint:
        trigger_download(download_endpoint)
    
    # Download the image
    try:
        req = urllib.request.Request(image_url, headers={
            "User-Agent": "Mozilla/5.0"
        })
        with urllib.request.urlopen(req, timeout=30) as response:
            content_type = response.headers.get("Content-Type", "image/jpeg")
            ext = ".jpg" if "jpeg" in content_type else ".png" if "png" in content_type else ".jpg"
            
            filepath = os.path.join(output_dir, f"{filename}{ext}")
            
            with open(filepath, "wb") as f:
                f.write(response.read())
    except urllib.error.URLError as e:
        return {"success": False, "error": str(e)}
    
    result = {
        "success": True,
        "filepath": filepath,
        "filename": f"{filename}{ext}"
    }
    
    # Write attribution file
    if metadata:
        attr_path = os.path.join(output_dir, f"{filename}_attribution.txt")
        with open(attr_path, "w") as f:
            f.write(f"Image: {metadata.get('description', 'Untitled')}\n")
            f.write(f"Photographer: {metadata.get('photographer', 'Unknown')}\n")
            f.write(f"Photographer URL: {metadata.get('photographer_url', '')}\n")
            f.write(f"Unsplash URL: {metadata.get('unsplash_url', '')}\n")
            f.write(f"License: Unsplash License (https://unsplash.com/license)\n")
            f.write(f"\nAttribution (HTML):\n")
            f.write(f'Photo by <a href="{metadata.get("photographer_url", "")}?utm_source=your_app&utm_medium=referral">{metadata.get("photographer", "Unknown")}</a> on <a href="https://unsplash.com/?utm_source=your_app&utm_medium=referral">Unsplash</a>\n')
        result["attribution_file"] = attr_path
    
    return result


def main():
    parser = argparse.ArgumentParser(description="Download images from Unsplash")
    parser.add_argument("--url", required=True, help="Image URL to download")
    parser.add_argument("--output-dir", default=".", help="Output directory")
    parser.add_argument("--filename", required=True, help="Output filename (without extension)")
    parser.add_argument("--download-endpoint", help="Unsplash download tracking endpoint")
    parser.add_argument("--metadata-json", help="JSON string with image metadata")
    
    args = parser.parse_args()
    
    metadata = None
    if args.metadata_json:
        try:
            metadata = json.loads(args.metadata_json)
        except json.JSONDecodeError:
            print("Warning: Could not parse metadata JSON", file=sys.stderr)
    
    result = download_image(
        image_url=args.url,
        output_dir=args.output_dir,
        filename=args.filename,
        download_endpoint=args.download_endpoint,
        metadata=metadata
    )
    
    if result["success"]:
        print(f"✅ Downloaded: {result['filepath']}")
        if result.get("attribution_file"):
            print(f"📝 Attribution: {result['attribution_file']}")
    else:
        print(f"❌ Failed: {result['error']}", file=sys.stderr)
        sys.exit(1)
    
    print(json.dumps(result))


if __name__ == "__main__":
    main()
