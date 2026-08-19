# TMDB backfill limits

The TMDB fallback is deliberately bounded so a Netlify build cannot accidentally issue hundreds of thousands of authenticated requests.

- Default request cap: 1200 total TMDB API requests per build.
- Each matched title normally consumes two requests: IMDb-ID find + TV-series details.
- Remaining unresolved titles are ordered by IMDb vote count, highest first.
- `TMDB_MAX_REQUESTS` can raise or lower the cap (hard ceiling in code: 20000).
- 429 and transient 5xx responses use retry/backoff.
- Exact IMDb totals are never replaced by TMDB estimates.
