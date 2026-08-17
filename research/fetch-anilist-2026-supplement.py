#!/usr/bin/env python3
"""Build a dated 2026 AniList supplement with PREQUEL/SEQUEL audits.

The daily seasonal CSV supplies current metadata. MiruroAPI's public AniList
proxy supplies relation edges, which the catalogue compiler uses to reject
unfinished, cancelled, or incompletely captured franchise sequences.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

import pandas as pd


SOURCE_URL = "https://github.com/LeoRigasaki/Anime-dataset"
SOURCE_COMMIT = "a9eb180c851f81fe976e71da58c3d78f3675ef5c"
SOURCE_SNAPSHOT = "data/raw/anilist_seasonal_20260816.csv"
RELATIONS_API = "https://mirurotvapi.vercel.app/api/anime/{anime_id}/relations"
RELATIONS_REPOSITORY = "https://github.com/Shineii86/MiruroAPI"
SNAPSHOT_DATE = "2026-08-16"
GENERATED_AT = "2026-08-17T09:15:00+05:30"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="Daily AniList seasonal CSV")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).with_name("anilist-2026-supplement-2026-08-16.json"),
    )
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument(
        "--minimum-request-interval",
        type=float,
        default=0.85,
        help="Seconds between request starts across all workers (default stays below 90/minute)",
    )
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def scalar(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if pd.isna(value):
        return None
    return value


def integer(value: Any) -> int | None:
    value = scalar(value)
    return int(value) if value is not None else None


def number(value: Any) -> float | None:
    value = scalar(value)
    return float(value) if value is not None else None


def split_values(value: Any) -> list[str]:
    value = scalar(value)
    if not value:
        return []
    return [item.strip() for item in str(value).split(";") if item.strip()]


def date_parts(value: Any) -> tuple[int | None, int | None, int | None]:
    value = scalar(value)
    if not value:
        return None, None, None
    year, month, day = (int(part) for part in str(value).split("-")[:3])
    return year, month, day


class RateLimiter:
    def __init__(self, interval: float):
        self.interval = interval
        self.next_start = 0.0
        self.lock = threading.Lock()

    def wait(self) -> None:
        with self.lock:
            now = time.monotonic()
            delay = max(0.0, self.next_start - now)
            self.next_start = max(now, self.next_start) + self.interval
        if delay:
            time.sleep(delay)


def fetch_relations(anime_id: int, limiter: RateLimiter) -> list[dict[str, Any]]:
    url = RELATIONS_API.format(anime_id=anime_id)
    for attempt in range(1, 6):
        limiter.wait()
        request = urllib.request.Request(
            url,
            headers={
                "Accept": "application/json",
                "User-Agent": "MorningstarCatalogueResearch/1.0",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                payload = json.load(response)
            result = payload.get("results") or {}
            if not payload.get("success") or int(result.get("id", -1)) != anime_id:
                raise RuntimeError(f"unexpected relation response for AniList {anime_id}")
            relations = []
            for relation in result.get("relations") or []:
                if relation.get("relationType") not in {"PREQUEL", "SEQUEL"}:
                    continue
                node = relation.get("node") or {}
                relations.append(
                    {
                        "relationType": relation["relationType"],
                        "node": {
                            "id": node.get("id"),
                            "type": node.get("type"),
                            "format": node.get("format"),
                            "status": node.get("status"),
                            "episodes": node.get("episodes"),
                            "meanScore": node.get("meanScore"),
                            "averageScore": node.get("averageScore"),
                            "popularity": node.get("popularity"),
                            "title": node.get("title"),
                        },
                    }
                )
            return relations
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, RuntimeError) as error:
            if attempt == 5:
                raise RuntimeError(f"failed relations for AniList {anime_id}: {error}") from error
            time.sleep(min(16, 2**attempt))
    raise AssertionError("unreachable")


def row_record(row: dict[str, Any], relations: list[dict[str, Any]]) -> dict[str, Any]:
    start_year, start_month, start_day = date_parts(row["start_date"])
    end_year, end_month, end_day = date_parts(row["end_date"])
    anime_id = int(row["anime_id"])
    return {
        "id": anime_id,
        "idMal": integer(row["mal_id"]),
        "title_romaji": scalar(row["title"]) or "",
        "title_english": scalar(row["english_title"]) or "",
        "title_native": scalar(row["japanese_title"]) or "",
        "synonyms": split_values(row["synonyms"]),
        "format": scalar(row["type"]) or "",
        "status": scalar(row["status"]) or "",
        "description": scalar(row["synopsis"]) or "",
        "startDate_year": start_year,
        "startDate_month": start_month,
        "startDate_day": start_day,
        "endDate_year": end_year,
        "endDate_month": end_month,
        "endDate_day": end_day,
        "episodes": integer(row["episodes"]),
        "duration": number(row["duration"]),
        "countryOfOrigin": scalar(row["country_of_origin"]) or "",
        "coverImage_extraLarge": scalar(row["cover_image_large"]) or "",
        "coverImage_large": scalar(row["cover_image_large"]) or "",
        "genres": split_values(row["genres"]),
        "averageScore": integer(row["score"]),
        "meanScore": integer(row["mean_score"]),
        "popularity": integer(row["popularity"]) or 0,
        "isAdult": bool(row["is_adult"]),
        "siteUrl": scalar(row["site_url"]) or f"https://anilist.co/anime/{anime_id}",
        "relations": relations,
    }


def main() -> None:
    args = parse_args()
    frame = pd.read_csv(args.source)
    frame = frame[
        (frame["season_year"] == 2026)
        & (frame["status"] == "FINISHED")
        & (frame["start_date"].astype(str).str.startswith("2026-"))
    ]
    source_rows = sorted(frame.to_dict(orient="records"), key=lambda row: int(row["anime_id"]))
    if len(source_rows) < 150:
        raise RuntimeError(f"Only {len(source_rows)} finished 2026 rows found; source looks incomplete")

    limiter = RateLimiter(args.minimum_request_interval)
    relations_by_id: dict[int, list[dict[str, Any]]] = {}
    completed = 0
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(fetch_relations, int(row["anime_id"]), limiter): int(row["anime_id"])
            for row in source_rows
        }
        for future in as_completed(futures):
            anime_id = futures[future]
            relations_by_id[anime_id] = future.result()
            completed += 1
            if completed % 20 == 0 or completed == len(source_rows):
                print(f"relations {completed}/{len(source_rows)}", flush=True)

    rows = [
        row_record(row, relations_by_id[int(row["anime_id"])])
        for row in source_rows
    ]
    payload = {
        "schemaVersion": 1,
        "generatedAt": GENERATED_AT,
        "snapshotDate": SNAPSHOT_DATE,
        "source": {
            "name": "Daily AniList seasonal dataset",
            "url": SOURCE_URL,
            "commit": SOURCE_COMMIT,
            "path": SOURCE_SNAPSHOT,
            "csvSha256": file_sha256(args.source),
        },
        "relationsSource": {
            "name": "MiruroAPI AniList relations proxy",
            "urlTemplate": RELATIONS_API,
            "repository": RELATIONS_REPOSITORY,
        },
        "criteria": {"seasonYear": 2026, "startDateYear": 2026, "status": "FINISHED"},
        "rowCount": len(rows),
        "rows": rows,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(rows)} rows to {args.output}")


if __name__ == "__main__":
    main()
