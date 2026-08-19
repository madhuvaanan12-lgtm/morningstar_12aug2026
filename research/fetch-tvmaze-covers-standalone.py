#!/usr/bin/env python3
"""
Fetch TV Maze poster covers for 452 anime titles missing AniList cover images.

Usage:
    python3 fetch-tvmaze-covers-standalone.py

Input:
    - research/anime-full-catalogue-20260819.json (anime list with 452 placeholders)

Output:
    - Updates the same JSON file with TV Maze covers where found
    - Keeps placeholder for titles not found on TV Maze
    - Creates a summary report

Rate limiting: 0.5s between requests to respect TV Maze API limits.
"""

import json
import time
import sys
from pathlib import Path
from urllib import request, parse, error

RESEARCH_DIR = Path(__file__).parent
CATALOGUE_FILE = RESEARCH_DIR / "anime-full-catalogue-20260819.json"

def fetch_tvmaze_poster(title):
    """
    Fetch poster URL from TV Maze for a given title.
    Returns poster URL or None if not found.
    """
    try:
        encoded = parse.quote(title)
        url = f"https://api.tvmaze.com/singlesearch/shows?q={encoded}"

        req = request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read())
            if data and data.get("image") and data["image"].get("medium"):
                return data["image"]["medium"]
    except (error.URLError, error.HTTPError, json.JSONDecodeError, TimeoutError):
        pass

    return None

def main():
    print("=" * 60)
    print("TV MAZE COVER FETCHER FOR 452 ANIME TITLES")
    print("=" * 60)
    print()

    if not CATALOGUE_FILE.exists():
        print(f"ERROR: {CATALOGUE_FILE} not found")
        sys.exit(1)

    with open(CATALOGUE_FILE) as f:
        catalogue = json.load(f)

    # Find titles needing covers
    needs_covers = [a for a in catalogue["anime"] if a["cover_source"] == "placeholder"]
    print(f"Titles to process: {len(needs_covers):,}\n")

    matched = 0
    not_found = 0
    errors = 0

    for i, anime in enumerate(needs_covers, 1):
        title = anime["title"]
        mal_id = anime["mal_id"]

        # Attempt lookup
        poster = fetch_tvmaze_poster(title)

        if poster:
            anime["cover_image"] = poster
            anime["cover_source"] = "tvmaze"
            matched += 1
            status = "✓"
        else:
            not_found += 1
            status = "✗"

        # Progress every 50
        if i % 50 == 0:
            elapsed = (i / len(needs_covers)) * (i * 0.5)  # rough estimate
            print(f"  {i:>4}/{len(needs_covers):,} {status} {title[:50]}")

        # Rate limit
        time.sleep(0.5)

    print()
    print("RESULTS:")
    print(f"  ✓ TV Maze matched:        {matched:,}")
    print(f"  ✗ Not found (placeholder): {not_found:,}")
    print()

    # Save
    with open(CATALOGUE_FILE, "w") as f:
        json.dump(catalogue, f, indent=2)

    print(f"✓ Saved: {CATALOGUE_FILE}")
    print()
    print("Next step: Run build-anime-full-catalogue.js to merge into payload")

if __name__ == "__main__":
    main()
