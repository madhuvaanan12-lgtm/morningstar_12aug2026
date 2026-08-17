#!/usr/bin/env python3
"""Compile Morningstar's franchise-level Top 1000 finished anime audit.

The base input is ``anilist_anime_data_complete.csv`` published by the AniList
Anime Dataset collector. A dated 2026 supplement closes that collector's
current year-range gap. The output is intentionally self-contained: the
catalogue builder can be rerun without reparsing the 400+ MB source CSV.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import math
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from typing import Any, Iterable

import pandas as pd


PRIMARY_FORMATS = {"TV", "TV_SHORT", "ONA"}
MAINLINE_FORMATS = {"TV", "TV_SHORT", "ONA", "OVA", "SPECIAL", "MOVIE"}
SEQUENCE_RELATIONS = {"PREQUEL", "SEQUEL"}
SOURCE_DATASET_URL = "https://www.kaggle.com/datasets/calebmwelsh/anilist-anime-dataset"
SOURCE_REPOSITORY_URL = "https://github.com/calebmwelsh/AnimeDatasetCompiler"
SNAPSHOT_UPDATED_AT = "2026-08-16T07:34:31.210Z"
OUTPUT_COUNT = 1000
MANUAL_NON_ANIMATION_IDS = {
    98143,  # Thunderbolt Fantasy is a glove-puppetry production, not animation.
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="AniList source CSV")
    parser.add_argument(
        "--supplement",
        type=Path,
        help="Dated 2026 AniList supplement JSON with relation edges",
    )
    parser.add_argument(
        "--mal-metadata",
        type=Path,
        help="Optional current MyAnimeList anime-standalone.csv for more reliable poster URLs",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(__file__).with_name("anime-top-1000-2026-08-16.json"),
    )
    return parser.parse_args()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def text(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""
    return str(value).strip()


def integer(value: Any) -> int | None:
    if value is None or pd.isna(value):
        return None
    return int(value)


def number(value: Any) -> float | None:
    if value is None or pd.isna(value):
        return None
    return float(value)


def json_value(value: Any, fallback: Any) -> Any:
    if isinstance(value, (list, dict)):
        return value
    if not isinstance(value, str) or not value.strip():
        return fallback
    try:
        parsed = json.loads(value)
        return parsed
    except json.JSONDecodeError:
        return fallback


def clean_plot(value: Any) -> str:
    plot = text(value)
    if not plot:
        return ""
    plot = re.sub(r"<br\s*/?>", "\n", plot, flags=re.I)
    plot = re.sub(r"</p\s*>", "\n", plot, flags=re.I)
    plot = re.sub(r"<[^>]+>", "", plot)
    plot = html.unescape(plot)
    plot = re.sub(r"\[Written by MAL Rewrite\]", "", plot, flags=re.I)
    plot = re.sub(r"\s*\(Source:\s*[^)]+\)\s*$", "", plot, flags=re.I)
    plot = re.sub(r"[ \t]+", " ", plot)
    plot = re.sub(r"[ \t]+\n", "\n", plot)
    plot = re.sub(r"\n\s*\n+", "\n\n", plot)
    return plot.strip()


def clamp_words(value: str, limit: int) -> str:
    if len(value) <= limit:
        return value
    clipped = value[: limit + 1].rsplit(" ", 1)[0].rstrip(" ,;:-")
    return clipped + "…"


def short_plot(value: str, limit: int = 300) -> str:
    if not value:
        return ""
    sentences = re.split(r"(?<=[.!?])\s+", value.replace("\n", " "))
    chosen: list[str] = []
    for sentence in sentences:
        candidate = " ".join(chosen + [sentence]).strip()
        if chosen and len(candidate) > limit:
            break
        chosen.append(sentence)
        if len(candidate) >= 150:
            break
    return clamp_words(" ".join(chosen).strip(), limit)


def iso_date(row: dict[str, Any], prefix: str) -> str:
    year = integer(row[f"{prefix}Date_year"])
    month = integer(row[f"{prefix}Date_month"])
    day = integer(row[f"{prefix}Date_day"])
    if not year or not month or not day:
        return ""
    return date(year, month, day).isoformat()


def unique_strings(values: Iterable[Any], limit: int | None = None) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        item = text(value)
        key = item.casefold()
        if not item or key in seen:
            continue
        seen.add(key)
        result.append(item)
        if limit and len(result) >= limit:
            break
    return result


class UnionFind:
    def __init__(self, values: Iterable[int]):
        self.parent = {value: value for value in values}

    def find(self, value: int) -> int:
        while self.parent[value] != value:
            self.parent[value] = self.parent[self.parent[value]]
            value = self.parent[value]
        return value

    def union(self, left: int, right: int) -> None:
        left_root = self.find(left)
        right_root = self.find(right)
        if left_root != right_root:
            self.parent[right_root] = left_root


def build_record(
    component_rows: list[dict[str, Any]],
    primary_rows: list[dict[str, Any]],
) -> dict[str, Any]:
    scored = [
        row
        for row in primary_rows
        if number(row["meanScore"]) is not None and number(row["averageScore"]) is not None
    ]
    representative = max(
        scored,
        key=lambda row: (integer(row["popularity"]) or 0, number(row["meanScore"]) or 0),
    )
    weights = [math.sqrt(max(1, integer(row["popularity"]) or 0)) for row in scored]
    weight_total = sum(weights)
    weighted_mean = sum((number(row["meanScore"]) or 0) * weight for row, weight in zip(scored, weights)) / weight_total
    weighted_average = sum(
        (number(row["averageScore"]) or 0) * weight for row, weight in zip(scored, weights)
    ) / weight_total

    component_rows.sort(key=lambda row: (iso_date(row, "start") or "9999", int(row["id"])))
    runtime_minutes = sum(int(row["episodes"]) * float(row["duration"]) for row in component_rows)
    episodes = sum(int(row["episodes"]) for row in component_rows)
    starts = [iso_date(row, "start") for row in component_rows if iso_date(row, "start")]
    ends = [iso_date(row, "end") for row in component_rows]

    title = text(representative["title_english"]) or text(representative["title_romaji"])
    romaji = text(representative["title_romaji"])
    native = text(representative["title_native"])
    original_title = romaji if romaji and romaji.casefold() != title.casefold() else native

    alias_values: list[Any] = [title, romaji, native]
    genre_values: list[Any] = []
    for row in component_rows:
        alias_values.extend(
            [row["title_english"], row["title_romaji"], row["title_native"]]
        )
        alias_values.extend(json_value(row["synonyms"], []))
        genre_values.extend(json_value(row["genres"], []))

    plot = clean_plot(representative["description"])
    genres = unique_strings(genre_values)
    if not plot:
        genre_phrase = ", ".join(genres[:4]).lower() or "story-driven"
        plot = (
            f"A finished Japanese anime series built around {genre_phrase} storytelling. "
            f"Its currently catalogued mainline run contains {episodes} episodes or parts."
        )

    image = text(representative["coverImage_extraLarge"]) or text(representative["coverImage_large"])
    if not image:
        image = next(
            (
                text(row["coverImage_extraLarge"]) or text(row["coverImage_large"])
                for row in primary_rows
                if text(row["coverImage_extraLarge"]) or text(row["coverImage_large"])
            ),
            "",
        )

    members = []
    for row in component_rows:
        member_title = text(row["title_english"]) or text(row["title_romaji"])
        member_runtime = int(row["episodes"]) * float(row["duration"]) / 60
        members.append(
            {
                "anilistId": int(row["id"]),
                "malId": integer(row["idMal"]),
                "title": member_title,
                "originalTitle": text(row["title_romaji"]),
                "format": text(row["format"]),
                "status": text(row["status"]),
                "episodesOrParts": int(row["episodes"]),
                "durationMinutes": round(float(row["duration"]), 2),
                "runtimeHours": round(member_runtime, 2),
                "startDate": iso_date(row, "start") or None,
                "endDate": iso_date(row, "end"),
                "meanScore": integer(row["meanScore"]),
                "popularity": integer(row["popularity"]) or 0,
                "sourceUrl": text(row["siteUrl"]) or f"https://anilist.co/anime/{int(row['id'])}",
            }
        )

    return {
        "anilistId": int(representative["id"]),
        "malId": integer(representative["idMal"]),
        "title": title,
        "originalTitle": original_title or title,
        "aliases": unique_strings(alias_values, limit=80),
        "year": int(min(starts)[:4]) if starts else integer(representative["startDate_year"]),
        "endYear": int(max(ends)[:4]),
        "endDate": max(ends),
        "status": "FINISHED",
        "episodesOrParts": episodes,
        "typicalEpisodeMinutes": round(runtime_minutes / episodes, 1),
        "runtimeMinutes": round(runtime_minutes, 2),
        "runtimeHours": round(runtime_minutes / 60, 1),
        "formats": sorted({text(row["format"]) for row in component_rows}),
        "genres": genres,
        "country": "Japan",
        "language": "Japanese",
        "score100": round(weighted_mean, 2),
        "averageScore100": round(weighted_average, 2),
        "score10": round(weighted_mean / 10, 2),
        "popularity": max(integer(row["popularity"]) or 0 for row in scored),
        "shortPlot": short_plot(plot),
        "longPlot": clamp_words(plot, 1800),
        "image": image,
        "sourceName": "AniList",
        "sourceUrl": text(representative["siteUrl"])
        or f"https://anilist.co/anime/{int(representative['id'])}",
        "mainlineEntryCount": len(component_rows),
        "completionAudit": {
            "finishedEntries": len(component_rows),
            "releasingEntries": 0,
            "cancelledEntries": 0,
            "missingLinkedEntries": 0,
        },
        "members": members,
        "_sort": (weighted_mean, weighted_average, max(integer(row["popularity"]) or 0 for row in scored)),
    }


def main() -> None:
    args = parse_args()
    columns = [
        "id",
        "idMal",
        "title_romaji",
        "title_english",
        "title_native",
        "synonyms",
        "format",
        "status",
        "description",
        "startDate_year",
        "startDate_month",
        "startDate_day",
        "endDate_year",
        "endDate_month",
        "endDate_day",
        "episodes",
        "duration",
        "countryOfOrigin",
        "coverImage_extraLarge",
        "coverImage_large",
        "genres",
        "averageScore",
        "meanScore",
        "popularity",
        "isAdult",
        "siteUrl",
        "relations",
    ]
    frame = pd.read_csv(args.source, usecols=columns)
    base_rows = {int(row["id"]): row for row in frame.to_dict(orient="records")}
    rows = dict(base_rows)
    supplement_payload: dict[str, Any] | None = None
    if args.supplement:
        supplement_payload = json.loads(args.supplement.read_text(encoding="utf-8"))
        supplement_rows = supplement_payload.get("rows") or []
        if len(supplement_rows) != supplement_payload.get("rowCount"):
            raise RuntimeError("2026 supplement rowCount does not match its rows")
        for row in supplement_rows:
            anime_id = int(row["id"])
            if anime_id in rows:
                raise RuntimeError(f"Duplicate AniList ID {anime_id} across base and supplement")
            rows[anime_id] = row
    mal_images: dict[int, str] = {}
    if args.mal_metadata:
        mal_frame = pd.read_csv(args.mal_metadata, usecols=["id", "image"])
        mal_images = {
            int(row["id"]): text(row["image"])
            for row in mal_frame.to_dict(orient="records")
            if text(row["image"])
        }
    union_find = UnionFind(rows)
    missing_links: dict[int, list[dict[str, Any]]] = defaultdict(list)

    for anime_id, row in rows.items():
        for relation in json_value(row["relations"], []):
            if relation.get("relationType") not in SEQUENCE_RELATIONS:
                continue
            node = relation.get("node") or {}
            if node.get("type") != "ANIME":
                continue
            related_id = node.get("id")
            if related_id in rows:
                union_find.union(anime_id, int(related_id))
            else:
                missing_links[anime_id].append(node)

    components: dict[int, list[int]] = defaultdict(list)
    for anime_id in rows:
        components[union_find.find(anime_id)].append(anime_id)
    components_with_missing_links = {union_find.find(anime_id) for anime_id in missing_links}

    exclusions: Counter[str] = Counter()
    eligible: list[dict[str, Any]] = []
    for component_id, anime_ids in components.items():
        component_rows = [rows[anime_id] for anime_id in anime_ids]
        primary_rows = [row for row in component_rows if text(row["format"]) in PRIMARY_FORMATS]

        if not primary_rows:
            exclusions["no_series_format"] += 1
            continue
        if any(int(row["id"]) in MANUAL_NON_ANIMATION_IDS for row in component_rows):
            exclusions["manual_review_not_animation"] += 1
            continue
        if component_id in components_with_missing_links:
            exclusions["missing_linked_prequel_or_sequel"] += 1
            continue
        if not all(text(row["countryOfOrigin"]) == "JP" for row in primary_rows):
            exclusions["not_japanese_origin"] += 1
            continue
        if any(text(row["status"]) != "FINISHED" for row in component_rows):
            exclusions["releasing_upcoming_or_cancelled"] += 1
            continue
        if any(text(row["format"]) not in MAINLINE_FORMATS for row in component_rows):
            exclusions["unsupported_mainline_format"] += 1
            continue
        if any(bool(row["isAdult"]) for row in component_rows if not pd.isna(row["isAdult"])):
            exclusions["adult"] += 1
            continue
        if any(
            number(row["episodes"]) is None
            or number(row["episodes"]) <= 0
            or number(row["duration"]) is None
            or number(row["duration"]) <= 0
            for row in component_rows
        ):
            exclusions["missing_runtime"] += 1
            continue
        if sum(int(row["episodes"]) for row in primary_rows) < 2:
            exclusions["not_a_series"] += 1
            continue
        if any(not iso_date(row, "end") for row in component_rows):
            exclusions["missing_complete_end_date"] += 1
            continue
        runtime_minutes = sum(
            int(row["episodes"]) * float(row["duration"]) for row in component_rows
        )
        if runtime_minutes >= 60 * 60:
            exclusions["runtime_60_hours_or_more"] += 1
            continue
        if not any(
            number(row["meanScore"]) is not None and number(row["averageScore"]) is not None
            for row in primary_rows
        ):
            exclusions["missing_score"] += 1
            continue
        eligible.append(build_record(component_rows, primary_rows))

    eligible.sort(
        key=lambda record: (
            -record["_sort"][0],
            -record["_sort"][1],
            -record["_sort"][2],
            record["anilistId"],
        )
    )
    if len(eligible) < OUTPUT_COUNT:
        raise RuntimeError(f"Only {len(eligible)} anime franchises passed the rules")

    selected = eligible[:OUTPUT_COUNT]
    for position, record in enumerate(selected, 1):
        record["position"] = position
        del record["_sort"]
        mal_id = record["malId"]
        if mal_id is not None and mal_id in mal_images:
            record["image"] = mal_images[mal_id]
            record["imageSourceName"] = "MyAnimeList"
            record["imageSourceUrl"] = f"https://myanimelist.net/anime/{mal_id}"
        else:
            record["image"] = f"https://img.anili.st/media/{record['anilistId']}"
            record["imageSourceName"] = "AniList image proxy"
            record["imageSourceUrl"] = record["sourceUrl"]

    if len({record["anilistId"] for record in selected}) != OUTPUT_COUNT:
        raise RuntimeError("Duplicate representative AniList IDs in Top 1000")
    if any(record["status"] != "FINISHED" for record in selected):
        raise RuntimeError("A non-finished entry reached the Top 1000")
    if any(record["runtimeMinutes"] >= 3600 for record in selected):
        raise RuntimeError("A 60-hour-or-longer entry reached the Top 1000")
    if any(record["completionAudit"]["cancelledEntries"] for record in selected):
        raise RuntimeError("A cancelled entry reached the Top 1000")
    if any(not record["image"] for record in selected):
        raise RuntimeError("A selected entry has no poster URL")

    payload = {
        "schemaVersion": 1,
        "generatedAt": "2026-08-17T00:00:00+05:30",
        "snapshotUpdatedAt": SNAPSHOT_UPDATED_AT,
        "source": {
            "name": "AniList Anime Dataset",
            "url": SOURCE_DATASET_URL,
            "collectorRepository": SOURCE_REPOSITORY_URL,
            "csvSha256": file_sha256(args.source),
            "inputRows": len(rows),
            "baseInputRows": len(base_rows),
            "supplement": {
                "path": args.supplement.name if args.supplement else None,
                "sha256": file_sha256(args.supplement) if args.supplement else None,
                "rowCount": supplement_payload.get("rowCount") if supplement_payload else 0,
                "snapshotDate": supplement_payload.get("snapshotDate") if supplement_payload else None,
                "source": supplement_payload.get("source") if supplement_payload else None,
                "relationsSource": supplement_payload.get("relationsSource")
                if supplement_payload
                else None,
            },
            "posterMetadata": {
                "name": "MyAnimeList daily anime dataset",
                "url": "https://github.com/meesvandongen/anime-dataset",
                "csvSha256": file_sha256(args.mal_metadata) if args.mal_metadata else None,
                "matchedSelectedPosters": sum(
                    1 for record in selected if record["imageSourceName"] == "MyAnimeList"
                ),
            },
        },
        "criteria": {
            "franchiseGrouping": "PREQUEL and SEQUEL relations are one mainline entry",
            "seriesFormats": sorted(PRIMARY_FORMATS),
            "countedMainlineFormats": sorted(MAINLINE_FORMATS),
            "countryOfOrigin": "JP",
            "requiredStatus": "FINISHED",
            "excludedStatuses": ["RELEASING", "NOT_YET_RELEASED", "CANCELLED", "HIATUS"],
            "minimumSeriesEpisodes": 2,
            "maximumRuntimeExclusiveHours": 60,
            "requiresCompleteEndDate": True,
            "requiresEveryLinkedPrequelOrSequelInSnapshot": True,
            "adultTitlesExcluded": True,
        },
        "ranking": {
            "primary": "Popularity-square-root-weighted meanScore across TV, TV_SHORT and ONA installments",
            "tieBreakers": [
                "Popularity-square-root-weighted averageScore",
                "Highest franchise installment popularity",
                "Representative AniList ID",
            ],
        },
        "audit": {
            "sequenceComponents": len(components),
            "eligibleBeforeRankingCut": len(eligible),
            "selected": len(selected),
            "exclusionsByFirstFailedRule": dict(sorted(exclusions.items())),
        },
        "titles": selected,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(selected)} titles to {args.output}")
    print(f"eligible before cut: {len(eligible)}")
    print(f"#1: {selected[0]['title']} ({selected[0]['score10']}/10)")
    print(f"#1000: {selected[-1]['title']} ({selected[-1]['score10']}/10)")


if __name__ == "__main__":
    main()
