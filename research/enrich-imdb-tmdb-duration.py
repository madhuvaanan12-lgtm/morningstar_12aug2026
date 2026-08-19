#!/usr/bin/env python3
"""Backfill unresolved Morningstar IMDb-archive durations from TMDB.

This pass runs after IMDb exact-duration enrichment and TVmaze/IMDb estimate
creation. It only targets titles that still have neither an exact total duration
nor an existing estimate.

Authentication is read from environment variables only:
- TMDB_READ_ACCESS_TOKEN (preferred; sent as Bearer auth)
- TMDB_API_KEY (fallback; sent as the v3 api_key query parameter)

No credential value is printed or written into generated files.

The pass is intentionally bounded. TMDB lookups by IMDb ID require one request to
/find/{imdb_id}; matched TV shows then require one /tv/{tmdb_id} details request.
TMDB_MAX_REQUESTS limits total API requests per Netlify build (default: 1200).
Unresolved titles are prioritized by IMDb vote count so the most useful shows are
backfilled first.
"""

from __future__ import annotations

import hashlib
import json
import os
import statistics
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "imdb"
MANIFEST_PATH = OUT_DIR / "manifest.json"
REPORT_PATH = ROOT / "research" / "imdb-tv-import-report.json"
TMDB_BASE = "https://api.themoviedb.org/3"
USER_AGENT = "Morningstar personal IMDb archive TMDB duration backfill/1.0"
DEFAULT_MAX_REQUESTS = 1200
REQUEST_INTERVAL_SECONDS = 0.12

IDX_ID = 0
IDX_SERIES_RUNTIME = 6
IDX_VOTES = 10
IDX_EXACT_TOTAL = 11
IDX_EPISODE_COUNT = 12
IDX_ESTIMATED_TOTAL = 19
IDX_ESTIMATE_SOURCE = 20


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


def positive_number(value) -> float | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)) and value > 0:
        return float(value)
    return None


def get_credentials() -> tuple[str | None, str | None]:
    token = os.environ.get("TMDB_READ_ACCESS_TOKEN", "").strip() or None
    api_key = os.environ.get("TMDB_API_KEY", "").strip() or None
    return token, api_key


def request_json(
    path: str,
    *,
    token: str | None,
    api_key: str | None,
    query: dict[str, str] | None = None,
    retries: int = 6,
):
    params = dict(query or {})
    if api_key and not token:
        params["api_key"] = api_key
    url = f"{TMDB_BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)

    headers = {"Accept": "application/json", "User-Agent": USER_AGENT}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    last_error: Exception | None = None
    for attempt in range(retries):
        request = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            last_error = error
            if error.code in (401, 403):
                raise RuntimeError("TMDB authentication failed; check the Netlify secret value") from error
            if error.code == 404:
                return None
            if error.code != 429 and error.code < 500:
                return None
            retry_after = error.headers.get("Retry-After")
            if retry_after and retry_after.isdigit():
                delay = min(int(retry_after), 20)
            else:
                delay = min(1.5 * (attempt + 1), 10)
            time.sleep(delay)
        except (urllib.error.URLError, TimeoutError) as error:
            last_error = error
            time.sleep(min(1.5 * (attempt + 1), 10))
    raise RuntimeError(f"TMDB request failed after retries: {last_error}")


def load_archive(manifest: dict[str, object]) -> list[list[object]]:
    records: list[list[object]] = []
    for entry in manifest["files"]:
        path = OUT_DIR / str(entry["file"])
        records.extend(json.loads(path.read_text(encoding="utf-8")))
    if len(records) != int(manifest["totalTitles"]):
        raise RuntimeError("IMDb archive record count does not match manifest before TMDB backfill")
    return records


def tmdb_runtime_minutes(details: dict, record: list[object]) -> tuple[int | None, str | None]:
    episode_count = int(positive_number(details.get("number_of_episodes")) or 0)
    if episode_count <= 0:
        episode_count = int(positive_number(record[IDX_EPISODE_COUNT]) or 0)
    if episode_count <= 0:
        return None, None

    runtimes = [
        int(value)
        for value in (details.get("episode_run_time") or [])
        if positive_number(value) is not None
    ]
    if runtimes:
        typical_runtime = statistics.median(runtimes)
        estimate = round(float(typical_runtime) * episode_count)
        if estimate > 0:
            return estimate, "TMDB episode_run_time median × episode count"

    last_episode = details.get("last_episode_to_air")
    if isinstance(last_episode, dict):
        runtime = positive_number(last_episode.get("runtime"))
        if runtime is not None:
            estimate = round(runtime * episode_count)
            if estimate > 0:
                return estimate, "TMDB last-episode runtime × episode count"

    series_runtime = positive_number(record[IDX_SERIES_RUNTIME])
    if series_runtime is not None:
        estimate = round(series_runtime * episode_count)
        if estimate > 0:
            return estimate, "IMDb series runtime × TMDB episode count"

    return None, None


def main() -> None:
    token, api_key = get_credentials()
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    fields = list(manifest.get("fields") or [])
    if len(fields) <= IDX_ESTIMATE_SOURCE or fields[IDX_ESTIMATED_TOTAL] != "estimatedTotalRuntimeMinutes":
        raise RuntimeError("TMDB duration pass requires the TVmaze/estimate enrichment schema first")

    if not token and not api_key:
        tmdb = dict(manifest.get("tmdbDurationBackfill") or {})
        tmdb.update(
            {
                "enabled": False,
                "reason": "TMDB_READ_ACCESS_TOKEN / TMDB_API_KEY not configured in build environment",
                "requestsMade": 0,
                "titlesBackfilled": 0,
            }
        )
        manifest["tmdbDurationBackfill"] = tmdb
        write_json(MANIFEST_PATH, manifest, pretty=True)
        print("TMDB duration backfill skipped: no TMDB environment credential configured.")
        return

    try:
        max_requests = int(os.environ.get("TMDB_MAX_REQUESTS", str(DEFAULT_MAX_REQUESTS)))
    except ValueError:
        max_requests = DEFAULT_MAX_REQUESTS
    max_requests = max(0, min(max_requests, 20000))
    if max_requests == 0:
        print("TMDB duration backfill skipped: TMDB_MAX_REQUESTS=0.")
        return

    records = load_archive(manifest)
    unresolved = [
        record
        for record in records
        if positive_number(record[IDX_EXACT_TOTAL]) is None
        and positive_number(record[IDX_ESTIMATED_TOTAL]) is None
    ]
    unresolved.sort(key=lambda record: int(positive_number(record[IDX_VOTES]) or 0), reverse=True)

    requests_made = 0
    find_matches = 0
    details_read = 0
    backfilled = 0
    estimate_sources: Counter[str] = Counter()
    attempted = 0

    for record in unresolved:
        if requests_made >= max_requests:
            break
        attempted += 1
        imdb_id = str(record[IDX_ID])

        found = request_json(
            f"/find/{urllib.parse.quote(imdb_id)}",
            token=token,
            api_key=api_key,
            query={"external_source": "imdb_id", "language": "en-US"},
        )
        requests_made += 1
        time.sleep(REQUEST_INTERVAL_SECONDS)
        if not isinstance(found, dict):
            continue

        tv_results = found.get("tv_results")
        if not isinstance(tv_results, list) or not tv_results:
            continue
        candidate = tv_results[0] if isinstance(tv_results[0], dict) else None
        tmdb_id = candidate.get("id") if candidate else None
        if not isinstance(tmdb_id, int) or tmdb_id <= 0:
            continue
        find_matches += 1

        if requests_made >= max_requests:
            break
        details = request_json(
            f"/tv/{tmdb_id}",
            token=token,
            api_key=api_key,
            query={"language": "en-US"},
        )
        requests_made += 1
        time.sleep(REQUEST_INTERVAL_SECONDS)
        if not isinstance(details, dict):
            continue
        details_read += 1

        estimate, source = tmdb_runtime_minutes(details, record)
        if estimate is None or source is None:
            continue
        record[IDX_ESTIMATED_TOTAL] = estimate
        record[IDX_ESTIMATE_SOURCE] = source
        backfilled += 1
        estimate_sources[source] += 1

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
        raise RuntimeError("TMDB duration rewrite did not consume all IMDb records")
    manifest["files"] = new_files

    duration = dict(manifest.get("durationEnrichment") or {})
    prior_estimated = int(duration.get("estimatedTitles") or 0)
    prior_unusable = int(duration.get("noUsableDurationAfterEstimation") or 0)
    duration["estimatedTitles"] = prior_estimated + backfilled
    duration["usableDurationTitles"] = int(duration.get("exactTitles") or 0) + prior_estimated + backfilled
    duration["noUsableDurationAfterEstimation"] = max(0, prior_unusable - backfilled)
    sources = Counter(duration.get("estimateSourceCounts") or {})
    sources.update(estimate_sources)
    duration["estimateSourceCounts"] = dict(sources)
    manifest["durationEnrichment"] = duration

    manifest["tmdbDurationBackfill"] = {
        "enabled": True,
        "strategy": "Only titles still lacking exact or estimated duration; highest IMDb vote count first.",
        "authentication": "Build-time environment secret (credential value never written to output).",
        "maxRequests": max_requests,
        "requestsMade": requests_made,
        "titlesAttempted": attempted,
        "findMatches": find_matches,
        "detailsRead": details_read,
        "titlesBackfilled": backfilled,
        "estimateSourceCounts": dict(estimate_sources),
        "remainingWithoutUsableDuration": max(0, prior_unusable - backfilled),
    }

    source = dict(manifest.get("source") or {})
    source["tmdbDurationSource"] = "TMDB API /find IMDb-ID lookup + TV-series details"
    source["tmdbAttribution"] = "This product uses the TMDB API but is not endorsed or certified by TMDB."
    manifest["source"] = source
    write_json(MANIFEST_PATH, manifest, pretty=True)

    report = json.loads(REPORT_PATH.read_text(encoding="utf-8")) if REPORT_PATH.exists() else {}
    report["tmdbDurationBackfill"] = manifest["tmdbDurationBackfill"]
    write_json(REPORT_PATH, report, pretty=True)

    print(
        f"TMDB duration backfill: {backfilled:,} titles recovered from {attempted:,} attempted; "
        f"{requests_made:,}/{max_requests:,} API requests used."
    )


if __name__ == "__main__":
    main()
