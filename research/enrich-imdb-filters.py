#!/usr/bin/env python3
"""Add discovery metadata, remote covers, and scalable duration estimates.

IMDb remains the source for title IDs, types, years, genres, ratings, episode counts,
and exact episode-derived total duration. TVmaze is used only when a show has an
exact external IMDb ID match. For those matches we add best-available country/
language metadata, the primary poster URL, the TVmaze show URL, and TVmaze's
average episode runtime when available.

When IMDb cannot provide an exact total duration, Morningstar may calculate a
clearly labelled estimate. Estimate priority is:
1. IMDb known-episode average runtime x IMDb episode count.
2. TVmaze average runtime x IMDb episode count (exact IMDb-ID match only).
3. IMDb series-level runtime x IMDb episode count.

Estimates never replace exact episode-summed totals and are stored separately.
Poster files are never downloaded into the repository or generated Netlify output;
only remote TVmaze CDN URLs are stored in the compact archive records.
"""

from __future__ import annotations

import hashlib
import json
import time
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "imdb"
MANIFEST_PATH = OUT_DIR / "manifest.json"
REPORT_PATH = ROOT / "research" / "imdb-tv-import-report.json"
TVMAZE_BASE = "https://api.tvmaze.com"
TVMAZE_UPDATES_URL = f"{TVMAZE_BASE}/updates/shows"
USER_AGENT = "Morningstar personal TV archive metadata enricher/1.2"
BASE_WITH_DURATION_FIELDS = 15
APPENDED_FIELDS = [
    "countryCodes",
    "languages",
    "posterUrl",
    "tvmazeUrl",
    "estimatedTotalRuntimeMinutes",
    "durationEstimateSource",
]
REQUEST_INTERVAL_SECONDS = 0.5


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, payload: object, *, pretty: bool = False) -> None:
    text = (
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
        if pretty
        else json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    )
    path.write_text(text, encoding="utf-8")


def fetch_json(url: str, *, retries: int = 8):
    last_error: Exception | None = None
    for attempt in range(retries):
        request = urllib.request.Request(
            url,
            headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            last_error = error
            if error.code == 404:
                raise
            if error.code != 429 and error.code < 500:
                raise
            time.sleep(min(2 + attempt * 2, 15))
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
            time.sleep(min(2 + attempt * 2, 15))
    raise RuntimeError(f"Could not fetch {url}: {last_error}")


def clean_country_code(value) -> str | None:
    if not isinstance(value, str):
        return None
    value = value.strip().upper()
    return value if len(value) == 2 and value.isalpha() else None


def clean_text(value) -> str | None:
    if not isinstance(value, str):
        return None
    value = value.strip()
    return value or None


def clean_https_url(value) -> str | None:
    value = clean_text(value)
    return value if value and value.startswith("https://") else None


def positive_number(value) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)) and value > 0:
        return float(value)
    return None


def show_country(show: dict) -> str | None:
    for container_name in ("network", "webChannel"):
        container = show.get(container_name)
        if isinstance(container, dict):
            country = container.get("country")
            if isinstance(country, dict):
                code = clean_country_code(country.get("code"))
                if code:
                    return code
    dvd_country = show.get("dvdCountry")
    if isinstance(dvd_country, dict):
        return clean_country_code(dvd_country.get("code"))
    return None


def show_poster(show: dict) -> str | None:
    image = show.get("image")
    if not isinstance(image, dict):
        return None
    return clean_https_url(image.get("medium")) or clean_https_url(image.get("original"))


def show_average_runtime(show: dict) -> float | None:
    # TVmaze exposes both runtime and averageRuntime in primary show information.
    # Prefer averageRuntime because it is designed to represent typical episode
    # length across shows whose individual episode lengths vary.
    return positive_number(show.get("averageRuntime")) or positive_number(show.get("runtime"))


def load_archive(manifest: dict[str, object]) -> tuple[list[list[object]], set[str]]:
    records: list[list[object]] = []
    title_ids: set[str] = set()
    for entry in manifest["files"]:
        path = OUT_DIR / str(entry["file"])
        chunk = json.loads(path.read_text(encoding="utf-8"))
        records.extend(chunk)
        title_ids.update(str(record[0]) for record in chunk)
    if len(records) != int(manifest["totalTitles"]):
        raise RuntimeError("IMDb archive record count does not match manifest before TVmaze enrichment")
    return records, title_ids


def tvmaze_mapping(title_ids: set[str]) -> tuple[dict[str, dict[str, object]], int, int]:
    updates = fetch_json(TVMAZE_UPDATES_URL)
    if not isinstance(updates, dict) or not updates:
        raise RuntimeError("TVmaze updates/shows did not return the expected show-id map")

    max_show_id = max(int(show_id) for show_id in updates.keys())
    max_page = max_show_id // 250
    mapping: dict[str, dict[str, object]] = {}
    pages_read = 0
    shows_read = 0

    for page in range(max_page + 1):
        try:
            shows = fetch_json(f"{TVMAZE_BASE}/shows?page={page}")
        except urllib.error.HTTPError as error:
            if error.code == 404:
                break
            raise
        if not isinstance(shows, list):
            raise RuntimeError(f"TVmaze show index page {page} returned a non-list payload")

        pages_read += 1
        shows_read += len(shows)
        for show in shows:
            if not isinstance(show, dict):
                continue
            externals = show.get("externals")
            imdb_id = externals.get("imdb") if isinstance(externals, dict) else None
            if not imdb_id or imdb_id not in title_ids:
                continue

            candidate: dict[str, object] = {
                "country": show_country(show),
                "language": clean_text(show.get("language")),
                "poster": show_poster(show),
                "tvmaze": clean_https_url(show.get("url")),
                "averageRuntime": show_average_runtime(show),
            }
            previous = mapping.get(imdb_id)
            if previous is None:
                mapping[imdb_id] = candidate
            else:
                for key, value in candidate.items():
                    if not previous.get(key) and value:
                        previous[key] = value

        time.sleep(REQUEST_INTERVAL_SECONDS)

    return mapping, pages_read, shows_read


def estimate_total_runtime(record: list[object], meta: dict[str, object]) -> tuple[int | None, str | None]:
    """Return a transparent estimate only when exact total runtime is unavailable."""
    exact_total = positive_number(record[11])
    if exact_total is not None:
        return None, None

    episode_count = int(positive_number(record[12]) or 0)
    if episode_count <= 0:
        return None, None

    known_count = int(positive_number(record[13]) or 0)
    known_minutes = positive_number(record[14])
    if known_count > 0 and known_minutes is not None:
        average_known = known_minutes / known_count
        estimate = round(average_known * episode_count)
        if estimate > 0:
            return estimate, "IMDb known-episode average × IMDb episode count"

    tvmaze_average = positive_number(meta.get("averageRuntime"))
    if tvmaze_average is not None:
        estimate = round(tvmaze_average * episode_count)
        if estimate > 0:
            return estimate, "TVmaze average runtime × IMDb episode count"

    imdb_series_runtime = positive_number(record[6])
    if imdb_series_runtime is not None:
        estimate = round(imdb_series_runtime * episode_count)
        if estimate > 0:
            return estimate, "IMDb series runtime × IMDb episode count"

    return None, None


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    records, title_ids = load_archive(manifest)
    mapping, pages_read, shows_read = tvmaze_mapping(title_ids)

    country_counts: Counter[str] = Counter()
    language_counts: Counter[str] = Counter()
    genre_counts: Counter[str] = Counter()
    estimate_source_counts: Counter[str] = Counter()
    unknown_country = 0
    unknown_language = 0
    matched_tvmaze = 0
    poster_count = 0
    tvmaze_average_runtime_count = 0
    exact_in_default_range = 0
    estimated_duration_count = 0
    estimated_in_default_range = 0
    no_usable_duration_after_estimation = 0

    for record in records:
        if len(record) < BASE_WITH_DURATION_FIELDS:
            raise RuntimeError("TVmaze enrichment requires duration enrichment to run first")
        if len(record) > BASE_WITH_DURATION_FIELDS:
            del record[BASE_WITH_DURATION_FIELDS:]

        title_id = str(record[0])
        meta = mapping.get(title_id) or {}
        country = meta.get("country") if isinstance(meta.get("country"), str) else None
        language = meta.get("language") if isinstance(meta.get("language"), str) else None
        poster = meta.get("poster") if isinstance(meta.get("poster"), str) else None
        tvmaze_url = meta.get("tvmaze") if isinstance(meta.get("tvmaze"), str) else None
        countries = [country] if country else []
        languages = [language] if language else []

        estimated_total, estimate_source = estimate_total_runtime(record, meta)
        record.extend([countries, languages, poster, tvmaze_url, estimated_total, estimate_source])

        if title_id in mapping:
            matched_tvmaze += 1
        if positive_number(meta.get("averageRuntime")) is not None:
            tvmaze_average_runtime_count += 1
        if poster:
            poster_count += 1
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

        exact_total = positive_number(record[11])
        if exact_total is not None:
            if 240 <= exact_total <= 3600:
                exact_in_default_range += 1
        elif estimated_total is not None:
            estimated_duration_count += 1
            if estimate_source:
                estimate_source_counts.update([estimate_source])
            if 240 <= estimated_total <= 3600:
                estimated_in_default_range += 1
        else:
            no_usable_duration_after_estimation += 1

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
        raise RuntimeError("TVmaze rewrite did not consume all IMDb records")

    fields = list(manifest.get("fields") or [])
    manifest["schemaVersion"] = 5
    manifest["generatedAt"] = datetime.now(timezone.utc).isoformat()
    manifest["fields"] = fields[:BASE_WITH_DURATION_FIELDS] + APPENDED_FIELDS
    manifest["files"] = new_files

    source = dict(manifest.get("source") or {})
    source["countryLanguageCoverSource"] = "TVmaze public API show index"
    source["tvmazeApiUrl"] = "https://api.tvmaze.com/shows?page=:num"
    source["tvmazeAttribution"] = "Country/language/poster/average-runtime enrichment courtesy of TVmaze (CC BY-SA)."
    source["coverStorage"] = "Remote TVmaze poster URLs only; image files are not stored by Morningstar."
    source["durationEstimatePolicy"] = "Exact IMDb episode sums first; otherwise transparent estimates from IMDb partial episode averages, TVmaze averageRuntime, or IMDb series runtime multiplied by IMDb episode count."
    manifest["source"] = source

    manifest["originFilterEnrichment"] = {
        "method": "Exact IMDb-ID match to TVmaze show index; country uses network/web-channel/DVD country, language uses TVmaze show language, poster uses TVmaze primary show image, and averageRuntime is used only for labelled duration estimates.",
        "countryFieldMeaning": "Best-available TV network/web-channel country, not guaranteed production country.",
        "languageFieldMeaning": "TVmaze show language for matched titles.",
        "matchedTvmazeTitles": matched_tvmaze,
        "titlesWithTvmazeAverageRuntime": tvmaze_average_runtime_count,
        "titlesWithPoster": poster_count,
        "titlesWithCountry": len(records) - unknown_country,
        "titlesWithLanguage": len(records) - unknown_language,
        "unknownCountry": unknown_country,
        "unknownLanguage": unknown_language,
        "tvmazePagesRead": pages_read,
        "tvmazeShowsRead": shows_read,
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
    duration["estimatedTitles"] = estimated_duration_count
    duration["estimatedTitlesInDefaultRange"] = estimated_in_default_range
    duration["usableDurationTitles"] = int(duration.get("exactTitles") or 0) + estimated_duration_count
    duration["noUsableDurationAfterEstimation"] = no_usable_duration_after_estimation
    duration["estimateSourceCounts"] = dict(estimate_source_counts)
    duration["estimatePolicy"] = "Estimates are never labelled exact and never overwrite exact IMDb episode-summed totals."
    manifest["durationEnrichment"] = duration

    defaults = dict(manifest.get("uiDefaults") or {})
    defaults.pop("maxTotalHoursExclusive", None)
    defaults["minTotalHoursInclusive"] = 4
    defaults["maxTotalHoursInclusive"] = 60
    defaults["includeUnknownDuration"] = False
    defaults["useEstimatedDuration"] = True
    defaults["excludeCartoons"] = False
    defaults["excludeDocumentary"] = False
    defaults["excludeLikelySoap"] = False
    manifest["uiDefaults"] = defaults

    write_json(MANIFEST_PATH, manifest, pretty=True)

    report = json.loads(REPORT_PATH.read_text(encoding="utf-8")) if REPORT_PATH.exists() else {}
    report["filterEnrichment"] = {
        "source": "TVmaze public show index matched by exact IMDb ID",
        "tvmazeMatchedTitles": matched_tvmaze,
        "titlesWithTvmazeAverageRuntime": tvmaze_average_runtime_count,
        "titlesWithPoster": poster_count,
        "tvmazePagesRead": pages_read,
        "tvmazeShowsRead": shows_read,
        "genreCount": len(genre_counts),
        "countryOptionCount": len(country_counts),
        "languageOptionCount": len(language_counts),
        "defaultDurationRangeHours": [4, 60],
        "coverStrategy": "Store only TVmaze medium poster URL and lazy-load visible results; no poster binaries in Git/Netlify.",
        "durationStrategy": {
            "exact": "Sum of every IMDb-listed episode runtime when all episode runtimes are known.",
            "estimatePriority": [
                "IMDb known-episode average × IMDb episode count",
                "TVmaze average runtime × IMDb episode count for exact IMDb-ID matches",
                "IMDb series runtime × IMDb episode count",
            ],
            "estimatedTitles": estimated_duration_count,
            "estimatedTitlesInDefaultRange": estimated_in_default_range,
            "noUsableDurationAfterEstimation": no_usable_duration_after_estimation,
            "estimateSourceCounts": dict(estimate_source_counts),
        },
        "defaultDurationRule": "Use exact duration when available; otherwise use a clearly labelled estimate. Usable total must be between 4 and 60 hours inclusive. Truly unknown totals remain excluded by default.",
        "categoryExclusions": {
            "cartoons": "Optional; IMDb genre-based Animation exclusion in UI.",
            "documentary": "Optional; IMDb genre-based Documentary exclusion in UI.",
            "soap": "Optional conservative UI heuristic because the IMDb free TSV dataset has no canonical soap-opera flag.",
        },
    }
    write_json(REPORT_PATH, report, pretty=True)

    print(
        f"IMDb filters/durations enriched: {matched_tvmaze:,} TVmaze exact-ID matches, "
        f"{tvmaze_average_runtime_count:,} TVmaze average runtimes, {poster_count:,} posters; "
        f"{estimated_duration_count:,} labelled duration estimates, "
        f"{no_usable_duration_after_estimation:,} titles still without usable total duration."
    )


if __name__ == "__main__":
    main()
