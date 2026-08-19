#!/usr/bin/env python3
"""Build a complete Morningstar archive of IMDb TV Series + TV Mini Series.

IMDb does not permit scraping its Advanced Search pages for bulk extraction.
This importer uses IMDb's official non-commercial datasets instead and keeps
only title types tvSeries and tvMiniSeries. It is intended for personal,
non-commercial Morningstar use.
"""

from __future__ import annotations

import csv
import gzip
import hashlib
import json
import re
import shutil
import tempfile
import unicodedata
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "imdb"
REPORT_PATH = ROOT / "research" / "imdb-tv-import-report.json"
BASICS_URL = "https://datasets.imdbws.com/title.basics.tsv.gz"
RATINGS_URL = "https://datasets.imdbws.com/title.ratings.tsv.gz"
ADVANCED_SEARCH_URL = "https://www.imdb.com/search/title/?title_type=tv_series%2Ctv_miniseries"
TARGET_TYPES = {"tvSeries", "tvMiniSeries"}
CHUNK_RECORDS = 6000
USER_AGENT = "Morningstar personal IMDb archive importer/1.0"
ATTRIBUTION = "Information courtesy of IMDb. Used with permission."

# Compact record schema shared with imdb-archive.js.
FIELDS = [
    "tconst",
    "primaryTitle",
    "originalTitle",
    "titleType",
    "startYear",
    "endYear",
    "runtimeMinutes",
    "genres",
    "isAdult",
    "averageRating",
    "numVotes",
]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response, destination.open("wb") as output:
        shutil.copyfileobj(response, output, length=1024 * 1024)


def nullable_int(value: str) -> int | None:
    if not value or value == r"\N":
        return None
    try:
        return int(value)
    except ValueError:
        return None


def nullable_float(value: str) -> float | None:
    if not value or value == r"\N":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def clean_text(value: str) -> str:
    return "" if value == r"\N" else value


def title_bucket(title: str) -> str:
    folded = unicodedata.normalize("NFKD", title or "")
    folded = "".join(ch for ch in folded if not unicodedata.combining(ch)).strip().upper()
    for char in folded:
        if "A" <= char <= "Z" or "0" <= char <= "9":
            return char
        if char.isalnum():
            return "#"
    return "#"


def title_sort_key(record: list[object]) -> tuple[str, int, str]:
    title = unicodedata.normalize("NFKD", str(record[1])).casefold()
    title = re.sub(r"[^a-z0-9]+", " ", title).strip()
    year = record[4] if isinstance(record[4], int) else 9999
    return title, year, str(record[0])


def write_json(path: Path, payload: object, *, pretty: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if pretty:
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    else:
        text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    path.write_text(text, encoding="utf-8")


def patch_index() -> bool:
    path = ROOT / "index.html"
    marker = '<script defer src="./imdb-archive.js"></script>'
    text = path.read_text(encoding="utf-8")
    if marker in text:
        return False
    if "</body>" not in text:
        raise RuntimeError("index.html has no </body> marker for IMDb archive integration")
    text = text.replace("</body>", f"  {marker}\n</body>")
    path.write_text(text, encoding="utf-8")
    return True


def patch_readme() -> bool:
    path = ROOT / "README.md"
    marker = "## Complete IMDb TV archive"
    text = path.read_text(encoding="utf-8")
    if marker in text:
        return False
    addition = """

## Complete IMDb TV archive

Morningstar includes a separate, lazy-loaded IMDb archive generated from IMDb's official non-commercial datasets. It contains every `tvSeries` and `tvMiniSeries` row present in the daily dataset snapshot, including adult-flagged rows in the data while hiding them in the archive UI by default.

The archive intentionally does **not** scrape IMDb Advanced Search. IMDb permits bulk personal/non-commercial use through its published datasets and explicitly disallows screen scraping for this purpose. The available fields are IMDb ID, primary/original title, title type, start/end year, runtime, genres, adult flag, rating and vote count. Plot text, posters and certificate data are not in the permitted non-commercial dataset and are therefore not bulk-copied from IMDb pages.

The main curated Morningstar catalogue stays unchanged and fast at startup. Open **IMDb Archive** to lazy-load the complete archive only when needed. The importer is `research/import-imdb-tv.py`; provenance and counts are recorded in `research/imdb-tv-import-report.json` and `data/imdb/manifest.json`.

Information courtesy of IMDb. Used with permission.
"""
    path.write_text(text.rstrip() + addition + "\n", encoding="utf-8")
    return True


def main() -> None:
    generated_at = datetime.now(timezone.utc).isoformat()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Clear generated shards from an older run while retaining the directory.
    for existing in OUT_DIR.glob("*.json"):
        existing.unlink()

    with tempfile.TemporaryDirectory(prefix="morningstar-imdb-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        basics_path = temp_dir / "title.basics.tsv.gz"
        ratings_path = temp_dir / "title.ratings.tsv.gz"
        download(BASICS_URL, basics_path)
        download(RATINGS_URL, ratings_path)

        records: list[list[object]] = []
        record_index: dict[str, int] = {}
        type_counts: Counter[str] = Counter()
        adult_count = 0

        with gzip.open(basics_path, "rt", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            for row in reader:
                title_type = row["titleType"]
                if title_type not in TARGET_TYPES:
                    continue
                genres = [] if row["genres"] == r"\N" else row["genres"].split(",")
                is_adult = row["isAdult"] == "1"
                record = [
                    row["tconst"],
                    clean_text(row["primaryTitle"]),
                    clean_text(row["originalTitle"]),
                    title_type,
                    nullable_int(row["startYear"]),
                    nullable_int(row["endYear"]),
                    nullable_int(row["runtimeMinutes"]),
                    genres,
                    is_adult,
                    None,
                    0,
                ]
                record_index[row["tconst"]] = len(records)
                records.append(record)
                type_counts[title_type] += 1
                adult_count += int(is_adult)

        rated_count = 0
        with gzip.open(ratings_path, "rt", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            for row in reader:
                position = record_index.get(row["tconst"])
                if position is None:
                    continue
                records[position][9] = nullable_float(row["averageRating"])
                records[position][10] = nullable_int(row["numVotes"]) or 0
                rated_count += 1

        buckets: dict[str, list[list[object]]] = defaultdict(list)
        for record in records:
            buckets[title_bucket(str(record[1]))].append(record)

        files: list[dict[str, object]] = []
        bucket_counts: dict[str, int] = {}
        for bucket in sorted(buckets, key=lambda value: (value == "#", value)):
            items = buckets[bucket]
            items.sort(key=title_sort_key)
            bucket_counts[bucket] = len(items)
            slug = "other" if bucket == "#" else bucket.lower()
            for offset in range(0, len(items), CHUNK_RECORDS):
                chunk = items[offset : offset + CHUNK_RECORDS]
                part = offset // CHUNK_RECORDS + 1
                filename = f"{slug}-{part:03d}.json"
                path = OUT_DIR / filename
                write_json(path, chunk)
                files.append(
                    {
                        "file": filename,
                        "bucket": bucket,
                        "count": len(chunk),
                        "bytes": path.stat().st_size,
                        "sha256": sha256_file(path),
                    }
                )

        manifest = {
            "schemaVersion": 1,
            "generatedAt": generated_at,
            "source": {
                "name": "IMDb Non-Commercial Datasets",
                "basicsUrl": BASICS_URL,
                "ratingsUrl": RATINGS_URL,
                "advancedSearchReference": ADVANCED_SEARCH_URL,
                "basicsSha256": sha256_file(basics_path),
                "ratingsSha256": sha256_file(ratings_path),
                "licenseNote": "Personal/non-commercial use only; see IMDb dataset terms.",
                "attribution": ATTRIBUTION,
            },
            "fields": FIELDS,
            "titleTypes": ["tvSeries", "tvMiniSeries"],
            "totalTitles": len(records),
            "seriesTitles": type_counts["tvSeries"],
            "miniSeriesTitles": type_counts["tvMiniSeries"],
            "adultFlaggedTitles": adult_count,
            "ratedTitles": rated_count,
            "bucketCounts": bucket_counts,
            "chunkRecordLimit": CHUNK_RECORDS,
            "files": files,
            "uiDefaults": {"includeAdult": False, "pageSize": 100},
        }
        write_json(OUT_DIR / "manifest.json", manifest, pretty=True)

        report = {
            "schemaVersion": 1,
            "generatedAt": generated_at,
            "intent": "Complete IMDb TV Series + TV Mini Series archive for Morningstar",
            "method": "Official IMDb non-commercial TSV datasets; no IMDb webpage scraping",
            "advancedSearchReference": {
                "url": ADVANCED_SEARCH_URL,
                "observedOn": "2026-08-19",
                "observedResultCount": 371275,
                "note": "IMDb Advanced Search and the daily dataset can differ slightly because they refresh independently.",
            },
            "counts": {
                "total": len(records),
                "tvSeries": type_counts["tvSeries"],
                "tvMiniSeries": type_counts["tvMiniSeries"],
                "adultFlagged": adult_count,
                "rated": rated_count,
                "chunks": len(files),
            },
            "includedFields": FIELDS,
            "notBulkImported": [
                "plots/summaries",
                "poster/image URLs",
                "content ratings/certificates",
                "cast/crew",
                "keywords",
            ],
            "reasonForMissingFields": "These are not present in the permitted IMDb non-commercial basics/ratings datasets used by this import.",
            "source": manifest["source"],
        }
        write_json(REPORT_PATH, report, pretty=True)

    patch_index()
    patch_readme()
    print(
        f"IMDb archive built: {len(records):,} titles "
        f"({type_counts['tvSeries']:,} TV Series, {type_counts['tvMiniSeries']:,} TV Mini Series) "
        f"across {len(files)} chunks."
    )


if __name__ == "__main__":
    main()
