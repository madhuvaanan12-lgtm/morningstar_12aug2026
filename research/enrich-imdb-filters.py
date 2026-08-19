#!/usr/bin/env python3
"""Add conservative country/language filter metadata to the generated IMDb archive.

IMDb's free non-commercial TSV set does not expose a canonical production-country
or spoken-language field for each title. title.akas.tsv.gz does expose region and
language for alternative title rows plus an isOriginalTitle flag. This script uses
only rows explicitly marked as original-title rows. If that is missing, it falls
back only when the title has exactly one unambiguous AKA region/language.

The result is deliberately conservative: ambiguous titles stay Unknown rather than
being assigned a guessed country or language.
"""

from __future__ import annotations

import csv
import gzip
import hashlib
import json
import shutil
import tempfile
import urllib.request
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "imdb"
MANIFEST_PATH = OUT_DIR / "manifest.json"
REPORT_PATH = ROOT / "research" / "imdb-tv-import-report.json"
AKAS_URL = "https://datasets.imdbws.com/title.akas.tsv.gz"
USER_AGENT = "Morningstar personal IMDb archive filter enricher/1.0"
APPENDED_FIELDS = ["originRegionCodes", "originLanguageCodes"]
BASE_WITH_DURATION_FIELDS = 15


def download(url: str, destination: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response, destination.open("wb") as output:
        shutil.copyfileobj(response, output, length=1024 * 1024)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, payload: object, *, pretty: bool = False) -> None:
    if pretty:
        text = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    else:
        text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    path.write_text(text, encoding="utf-8")


def clean_region(value: str) -> str | None:
    if not value or value == r"\N":
        return None
    value = value.strip().upper()
    # Keep ordinary two-letter country/region codes only. IMDb also contains
    # historical/special market codes; those stay Unknown in the Country filter.
    if len(value) == 2 and value.isalpha():
        return value
    return None


def clean_language(value: str) -> str | None:
    if not value or value == r"\N":
        return None
    value = value.strip().lower()
    if 2 <= len(value) <= 3 and value.isalpha():
        return value
    return None


def remember_single(store: dict[str, str | None], title_id: str, value: str | None) -> None:
    if value is None:
        return
    if title_id not in store:
        store[title_id] = value
    elif store[title_id] != value:
        store[title_id] = None


def load_archive(manifest: dict[str, object]) -> tuple[list[list[object]], set[str]]:
    records: list[list[object]] = []
    title_ids: set[str] = set()
    for entry in manifest["files"]:
        path = OUT_DIR / str(entry["file"])
        chunk = json.loads(path.read_text(encoding="utf-8"))
        records.extend(chunk)
        title_ids.update(str(record[0]) for record in chunk)
    if len(records) != int(manifest["totalTitles"]):
        raise RuntimeError("IMDb archive record count does not match manifest before filter enrichment")
    return records, title_ids


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    records, title_ids = load_archive(manifest)

    original_regions: dict[str, set[str]] = defaultdict(set)
    original_languages: dict[str, set[str]] = defaultdict(set)
    sole_region: dict[str, str | None] = {}
    sole_language: dict[str, str | None] = {}

    with tempfile.TemporaryDirectory(prefix="morningstar-imdb-filter-") as temp_dir_name:
        temp_dir = Path(temp_dir_name)
        akas_path = temp_dir / "title.akas.tsv.gz"
        download(AKAS_URL, akas_path)

        with gzip.open(akas_path, "rt", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle, delimiter="\t")
            for row in reader:
                title_id = row["titleId"]
                if title_id not in title_ids:
                    continue
                region = clean_region(row.get("region", ""))
                language = clean_language(row.get("language", ""))
                remember_single(sole_region, title_id, region)
                remember_single(sole_language, title_id, language)
                if row.get("isOriginalTitle") == "1":
                    if region:
                        original_regions[title_id].add(region)
                    if language:
                        original_languages[title_id].add(language)

        country_counts: Counter[str] = Counter()
        language_counts: Counter[str] = Counter()
        genre_counts: Counter[str] = Counter()
        unknown_country = 0
        unknown_language = 0
        exact_in_default_range = 0

        for record in records:
            if len(record) < BASE_WITH_DURATION_FIELDS:
                raise RuntimeError("Filter enrichment requires duration enrichment to run first")
            if len(record) > BASE_WITH_DURATION_FIELDS:
                del record[BASE_WITH_DURATION_FIELDS:]

            title_id = str(record[0])
            countries = sorted(original_regions.get(title_id) or ())
            languages = sorted(original_languages.get(title_id) or ())

            if not countries:
                fallback_region = sole_region.get(title_id)
                if fallback_region:
                    countries = [fallback_region]
            if not languages:
                fallback_language = sole_language.get(title_id)
                if fallback_language:
                    languages = [fallback_language]

            record.extend([countries, languages])

            if countries:
                country_counts.update(countries)
            else:
                unknown_country += 1
            if languages:
                language_counts.update(languages)
            else:
                unknown_language += 1

            genres = record[7] if isinstance(record[7], list) else []
            genre_counts.update(str(genre) for genre in genres if genre)

            total_runtime = record[11]
            if isinstance(total_runtime, (int, float)) and 240 <= total_runtime <= 3600:
                exact_in_default_range += 1

        cursor = 0
        new_files: list[dict[str, object]] = []
        for entry in manifest["files"]:
            count = int(entry["count"])
            chunk = records[cursor : cursor + count]
            cursor += count
            path = OUT_DIR / str(entry["file"])
            write_json(path, chunk)
            new_entry = dict(entry)
            new_entry["bytes"] = path.stat().st_size
            new_entry["sha256"] = sha256_file(path)
            new_files.append(new_entry)
        if cursor != len(records):
            raise RuntimeError("Filter rewrite did not consume all IMDb records")

        fields = list(manifest.get("fields") or [])
        manifest["schemaVersion"] = 3
        manifest["generatedAt"] = datetime.now(timezone.utc).isoformat()
        manifest["fields"] = fields[:BASE_WITH_DURATION_FIELDS] + APPENDED_FIELDS
        manifest["files"] = new_files

        source = dict(manifest.get("source") or {})
        source["akasUrl"] = AKAS_URL
        source["akasSha256"] = sha256_file(akas_path)
        manifest["source"] = source

        manifest["originFilterEnrichment"] = {
            "method": "Country/language are conservative best-available inferences from IMDb AKA rows explicitly marked isOriginalTitle=1; fallback only when all AKA metadata has one unambiguous region/language.",
            "countryFieldMeaning": "Best-available original-title country/region, not a guaranteed production-country field.",
            "languageFieldMeaning": "Best-available original-title AKA language, not a guaranteed spoken-language field.",
            "titlesWithCountry": len(records) - unknown_country,
            "titlesWithLanguage": len(records) - unknown_language,
            "unknownCountry": unknown_country,
            "unknownLanguage": unknown_language,
        }

        manifest["filterOptions"] = {
            "genres": [{"value": value, "count": count} for value, count in sorted(genre_counts.items())],
            "countries": [{"value": value, "count": count} for value, count in sorted(country_counts.items())],
            "languages": [{"value": value, "count": count} for value, count in sorted(language_counts.items())],
            "unknownCountry": unknown_country,
            "unknownLanguage": unknown_language,
        }

        duration = dict(manifest.get("durationEnrichment") or {})
        duration.pop("defaultMaxHoursExclusive", None)
        duration["defaultMinHoursInclusive"] = 4
        duration["defaultMaxHoursInclusive"] = 60
        duration["exactTitlesInDefaultRange"] = exact_in_default_range
        manifest["durationEnrichment"] = duration

        defaults = dict(manifest.get("uiDefaults") or {})
        defaults.pop("maxTotalHoursExclusive", None)
        defaults["minTotalHoursInclusive"] = 4
        defaults["maxTotalHoursInclusive"] = 60
        defaults["includeUnknownDuration"] = False
        defaults["excludeCartoons"] = False
        defaults["excludeDocumentary"] = False
        defaults["excludeLikelySoap"] = False
        manifest["uiDefaults"] = defaults

        write_json(MANIFEST_PATH, manifest, pretty=True)

        report = json.loads(REPORT_PATH.read_text(encoding="utf-8")) if REPORT_PATH.exists() else {}
        report["filterEnrichment"] = {
            "country": manifest["originFilterEnrichment"],
            "genreCount": len(genre_counts),
            "countryOptionCount": len(country_counts),
            "languageOptionCount": len(language_counts),
            "defaultDurationRangeHours": [4, 60],
            "defaultDurationRule": "Exact total runtime must be between 4 and 60 hours inclusive. Unknown/partial totals stay excluded by default.",
            "categoryExclusions": {
                "cartoons": "Optional; genre-based Animation exclusion in UI.",
                "documentary": "Optional; genre-based Documentary exclusion in UI.",
                "soap": "Optional conservative UI heuristic because the free IMDb TSV dataset has no canonical soap-opera flag.",
            },
        }
        write_json(REPORT_PATH, report, pretty=True)

    print(
        f"IMDb filter metadata enriched: {len(country_counts)} country/region codes, "
        f"{len(language_counts)} language codes, {len(genre_counts)} genres; "
        f"{exact_in_default_range:,} exact-duration titles in the default 4-60h range."
    )


if __name__ == "__main__":
    main()
