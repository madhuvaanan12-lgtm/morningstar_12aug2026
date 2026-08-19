#!/usr/bin/env python3
"""
Fetch and compile the full anime catalogue for Morningstar.

Filters:
- Format: TV, TV_SHORT, ONA only (episodic series)
- Status: FINISHED only (completed airing)
- Runtime: 4+ hours total (episodes × duration_seconds / 3600 >= 4)
- Worldwide (no country restriction)
- Cover image: Required (AniList primary, TV Maze fallback)

Output: anime-full-catalogue-20260819.json with audit trail and source hashes.
"""

import json
import csv
import hashlib
from pathlib import Path
from collections import defaultdict
from datetime import datetime

REPO_ROOT = Path(__file__).parent.parent
DATA_SOURCES = Path("/tmp/claude-0/-home-user-morningstar-12aug2026/b6512d74-72a6-5e5e-8e8a-149a87f53365/scratchpad")
RESEARCH_DIR = REPO_ROOT / "research"

# File paths
MAL_FILE = DATA_SOURCES / "Anime-dataset" / "data" / "raw" / "anime_seasonal_20260819.csv"
ANILIST_FILE = DATA_SOURCES / "Anime-dataset" / "data" / "raw" / "anilist_seasonal_20260819.csv"
ID_MAPPING_FILE = DATA_SOURCES / "anime-lists" / "anime-offline-database-reduced.json"

def compute_sha256(filepath):
    """Compute SHA256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def load_anilist_mapping():
    """Load AniList IDs and metadata from the seasonal snapshot."""
    anilist_data = {}
    with open(ANILIST_FILE) as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                mal_id = int(row.get("mal_id", ""))
                anilist_id = int(row.get("anilist_id", ""))
                anilist_data[mal_id] = {
                    "anilist_id": anilist_id,
                    "cover_image_large": row.get("cover_image_large", ""),
                    "is_adult": row.get("is_adult", "").lower() == "true",
                    "country_of_origin": row.get("country_of_origin", ""),
                }
            except (ValueError, KeyError):
                continue
    return anilist_data

def load_id_mappings():
    """Load MAL-to-AniList ID mappings from anime-offline-database."""
    mappings = {}
    with open(ID_MAPPING_FILE) as f:
        data = json.load(f)
        entries = data if isinstance(data, list) else data.get("data", [])
        for entry in entries:
            mal_id = entry.get("mal_id")
            anilist_id = entry.get("anilist_id")
            if mal_id and anilist_id:
                mappings[mal_id] = anilist_id
    return mappings

def filter_anime():
    """Filter anime from MAL dataset and gather audit statistics."""
    anilist_mapping = load_anilist_mapping()
    id_mappings = load_id_mappings()

    audit = {
        "total_mal_entries": 0,
        "format_filter": 0,
        "status_filter": 0,
        "runtime_filter": 0,
        "cover_filter": 0,
        "final_count": 0,
        "excluded_by_reason": defaultdict(int),
    }

    results = []

    with open(MAL_FILE) as f:
        reader = csv.DictReader(f)
        for row in reader:
            audit["total_mal_entries"] += 1

            try:
                mal_id = int(row["anime_id"])
                title = row["title"]
                anime_type = row["type"].lower()
                episodes = int(row["episodes"]) if row["episodes"] else 0
                duration_seconds = int(row["duration"]) if row["duration"] else 0
                status = row["status"].lower()

                # Filter 1: Format (TV, TV_SHORT, ONA)
                if anime_type not in ["tv", "tv_short", "ona"]:
                    audit["excluded_by_reason"]["wrong_format"] += 1
                    continue
                audit["format_filter"] += 1

                # Filter 2: Status (FINISHED)
                if status != "finished_airing":
                    audit["excluded_by_reason"]["not_finished"] += 1
                    continue
                audit["status_filter"] += 1

                # Filter 3: Runtime (4+ hours)
                total_hours = (episodes * duration_seconds) / 3600 if episodes and duration_seconds else 0
                if total_hours < 4:
                    audit["excluded_by_reason"]["runtime_too_short"] += 1
                    continue
                audit["runtime_filter"] += 1

                # Get AniList ID and cover
                anilist_id = None
                cover_image = None

                # Try AniList seasonal snapshot first
                if mal_id in anilist_mapping:
                    anilist_id = anilist_mapping[mal_id]["anilist_id"]
                    cover_image = anilist_mapping[mal_id]["cover_image_large"]
                # Fallback to ID mappings database
                elif mal_id in id_mappings:
                    anilist_id = id_mappings[mal_id]

                # Build cover URL if we have AniList ID
                if anilist_id and not cover_image:
                    cover_image = f"https://img.anili.st/media/{anilist_id}"

                # Filter 4: Cover image requirement
                if not cover_image:
                    audit["excluded_by_reason"]["no_cover"] += 1
                    # Store for TV Maze lookup
                    results.append({
                        "mal_id": mal_id,
                        "anilist_id": anilist_id,
                        "title": title,
                        "episodes": episodes,
                        "duration_seconds": duration_seconds,
                        "total_hours": round(total_hours, 2),
                        "cover_image": None,
                        "cover_source": "needs_tvmaze",
                    })
                    continue
                audit["cover_filter"] += 1

                # Valid entry
                results.append({
                    "mal_id": mal_id,
                    "anilist_id": anilist_id,
                    "title": title,
                    "episodes": episodes,
                    "duration_seconds": duration_seconds,
                    "total_hours": round(total_hours, 2),
                    "cover_image": cover_image,
                    "cover_source": "anilist" if mal_id in anilist_mapping else "fallback",
                })
                audit["final_count"] += 1

            except (ValueError, KeyError) as e:
                audit["excluded_by_reason"]["parse_error"] += 1
                continue

    return results, audit

def main():
    print("=== Anime Full Catalogue Compilation ===\n")

    # Compute source file hashes
    mal_sha = compute_sha256(MAL_FILE)
    anilist_sha = compute_sha256(ANILIST_FILE)
    id_mapping_sha = compute_sha256(ID_MAPPING_FILE)

    print(f"MAL SHA256:          {mal_sha}")
    print(f"AniList SHA256:      {anilist_sha}")
    print(f"ID Mapping SHA256:   {id_mapping_sha}")
    print()

    # Filter anime
    filtered_anime, audit = filter_anime()

    # Print audit
    print("Audit Trail:")
    print(f"  Total MAL entries:        {audit['total_mal_entries']:,}")
    print(f"  Format filter (TV/ONA):   {audit['format_filter']:,}")
    print(f"  Status filter (FINISHED): {audit['status_filter']:,}")
    print(f"  Runtime filter (4+ hrs):  {audit['runtime_filter']:,}")
    print(f"  Cover available:          {audit['cover_filter']:,}")
    print(f"  Final count (with cover): {audit['final_count']:,}")
    print()
    print("Exclusions by reason:")
    for reason, count in sorted(audit["excluded_by_reason"].items(), key=lambda x: -x[1]):
        print(f"  {reason}: {count:,}")
    print()

    # Separate covers and no-cover titles
    with_cover = [a for a in filtered_anime if a["cover_source"] != "needs_tvmaze"]
    needs_tvmaze = [a for a in filtered_anime if a["cover_source"] == "needs_tvmaze"]

    print(f"With AniList covers: {len(with_cover):,}")
    print(f"Needing TV Maze:     {len(needs_tvmaze):,}")
    print()

    # Output research JSON
    output = {
        "snapshot_date": "2026-08-19",
        "compilation_date": datetime.utcnow().isoformat() + "Z",
        "source_hashes": {
            "mal_seasonal": mal_sha,
            "anilist_seasonal": anilist_sha,
            "id_mappings": id_mapping_sha,
        },
        "audit": {
            "total_entries": audit["total_mal_entries"],
            "after_format_filter": audit["format_filter"],
            "after_status_filter": audit["status_filter"],
            "after_runtime_filter": audit["runtime_filter"],
            "after_cover_filter": audit["cover_filter"],
            "final_count": audit["final_count"],
            "excluded_by_reason": dict(audit["excluded_by_reason"]),
        },
        "titles_with_cover": len(with_cover),
        "titles_needing_tvmaze": len(needs_tvmaze),
        "anime": filtered_anime,
    }

    output_file = RESEARCH_DIR / "anime-full-catalogue-20260819.json"
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Output saved: {output_file}")

if __name__ == "__main__":
    main()
