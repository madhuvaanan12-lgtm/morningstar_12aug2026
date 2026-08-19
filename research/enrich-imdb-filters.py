#!/usr/bin/env python3
"""Add discovery metadata and remote cover URLs to Morningstar's IMDb archive.

IMDb remains the source for title IDs, types, years, genres, ratings and episode-
derived total duration. TVmaze is used only when a show has an exact external IMDb
ID match. For those matches we add best-available country/language metadata, the
primary poster URL, and the TVmaze show URL for attribution.

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
USER_AGENT = "Morningstar personal TV archive metadata enricher/1.1"
BASE_WITH_DURATION_FIELDS = 15
APPENDED_FIELDS = ["countryCodes", "languages", "posterUrl", "tvmazeUrl"]
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
    # Medium is intentionally preferred: it is a poster-sized resized image and
    # avoids loading the original artwork for catalogue rows.
    return clean_https_url(image.get("medium")) or clean_https_url(image.get("original"))


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


def tvmaze_mapping(title_ids: set[str]) -> tuple[dict[str, dict[str, str | None]], int, int]:
    updates = fetch_json(TVMAZE_UPDATES_URL)
    if not isinstance(updates, dict) or not updates:
        raise RuntimeError("TVmaze updates/shows did not return the expected show-id map")

    max_show_id = max(int(show_id) for show_id in updates.keys())
    max_page = max_show_id // 250
    mapping: dict[str, dict[str, str | None]] = {}
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

            candidate = {
                "country": show_country(show),
                "language": clean_text(show.get("language")),
                "poster": show_poster(show),
                "tvmaze": clean_https_url(show.get("url")),
            }
            previous = mapping.get(imdb_id)
            if previous is None:
                mapping[imdb_id] = candidate
            else:
                # Duplicate exact IMDb IDs are unusual. Prefer already-known values
                # and fill only missing fields rather than overwriting them.
                for key, value in candidate.items():
                    if not previous.get(key) and value:
                        previous[key] = value

        # Free API limit is documented as at least 20 calls / 10 seconds.
        time.sleep(REQUEST_INTERVAL_SECONDS)

    return mapping, pages_read, shows_read


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    records, title_ids = load_archive(manifest)
    mapping, pages_read, shows_read = tvmaze_mapping(title_ids)

    country_counts: Counter[str] = Counter()
    language_counts: Counter[str] = Counter()
    genre_counts: Counter[str] = Counter()
    unknown_country = 0
    unknown_language = 0
    matched_tvmaze = 0
    poster_count = 0
    exact_in_default_range = 0

    for record in records:
        if len(record) < BASE_WITH_DURATION_FIELDS:
            raise RuntimeError("TVmaze enrichment requires duration enrichment to run first")
        if len(record) > BASE_WITH_DURATION_FIELDS:
            del record[BASE_WITH_DURATION_FIELDS:]

        title_id = str(record[0])
        meta = mapping.get(title_id) or {}
        country = meta.get("country")
        language = meta.get("language")
        poster = meta.get("poster")
        tvmaze_url = meta.get("tvmaze")
        countries = [country] if country else []
        languages = [language] if language else []
        record.extend([countries, languages, poster, tvmaze_url])

        if title_id in mapping:
            matched_tvmaze += 1
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
        raise RuntimeError("TVmaze rewrite did not consume all IMDb records")

    fields = list(manifest.get("fields") or [])
    manifest["schemaVersion"] = 4
    manifest["generatedAt"] = datetime.now(timezone.utc).isoformat()
    manifest["fields"] = fields[:BASE_WITH_DURATION_FIELDS] + APPENDED_FIELDS
    manifest["files"] = new_files

    source = dict(manifest.get("source") or {})
    source["countryLanguageCoverSource"] = "TVmaze public API show index"
    source["tvmazeApiUrl"] = "https://api.tvmaze.com/shows?page=:num"
    source["tvmazeAttribution"] = "Country/language/poster enrichment courtesy of TVmaze (CC BY-SA)."
    source["coverStorage"] = "Remote TVmaze poster URLs only; image files are not stored by Morningstar."
    manifest["source"] = source

    manifest["originFilterEnrichment"] = {
        "method": "Exact IMDb-ID match to TVmaze show index; country uses network/web-channel/DVD country, language uses TVmaze show language, poster uses TVmaze primary show image.",
        "countryFieldMeaning": "Best-available TV network/web-channel country, not guaranteed production country.",
        "languageFieldMeaning": "TVmaze show language for matched titles.",
        "matchedTvmazeTitles": matched_tvmaze,
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
        "source": "TVmaze public show index matched by exact IMDb ID",
        "tvmazeMatchedTitles": matched_tvmaze,
        "titlesWithPoster": poster_count,
        "tvmazePagesRead": pages_read,
        "tvmazeShowsRead": shows_read,
        "genreCount": len(genre_counts),
        "countryOptionCount": len(country_counts),
        "languageOptionCount": len(language_counts),
        "defaultDurationRangeHours": [4, 60],
        "coverStrategy": "Store only TVmaze medium poster URL and lazy-load visible results; no poster binaries in Git/Netlify.",
        "defaultDurationRule": "Exact total runtime must be between 4 and 60 hours inclusive. Unknown/partial totals stay excluded by default.",
        "categoryExclusions": {
            "cartoons": "Optional; IMDb genre-based Animation exclusion in UI.",
            "documentary": "Optional; IMDb genre-based Documentary exclusion in UI.",
            "soap": "Optional conservative UI heuristic because the IMDb free TSV dataset has no canonical soap-opera flag.",
        },
    }
    write_json(REPORT_PATH, report, pretty=True)

    print(
        f"IMDb filters/covers enriched: {matched_tvmaze:,} TVmaze exact-ID matches, "
        f"{poster_count:,} posters, {len(country_counts)} countries, "
        f"{len(language_counts)} languages, {len(genre_counts)} genres; "
        f"{exact_in_default_range:,} exact-duration titles in 4-60h."
    )


if __name__ == "__main__":
    main()
