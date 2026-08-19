# TMDB duration backfill

Morningstar's IMDb Archive keeps exact IMDb episode-summed durations as the highest-priority source. This branch adds transparent estimates for titles where an exact total is unavailable.

## Priority

1. Exact IMDb episode runtime sum — never replaced.
2. IMDb known-episode average × IMDb episode count.
3. TVmaze `averageRuntime` × IMDb episode count for exact IMDb-ID matches.
4. IMDb series-level runtime × IMDb episode count.
5. TMDB fallback for titles still unresolved:
   - `/find/{IMDb ID}?external_source=imdb_id`
   - `/tv/{TMDB ID}`
   - median `episode_run_time` × episode count
   - fallback: last-episode runtime × episode count
   - fallback: IMDb series runtime × TMDB episode count

All non-exact totals remain labelled as estimates in the UI (`≈`).

## TMDB credentials

Configure either `TMDB_READ_ACCESS_TOKEN` (preferred) or `TMDB_API_KEY` in the Netlify build environment. Credential values are never printed or written to generated archive JSON.

`TMDB_MAX_REQUESTS` bounds API work per build. Default: 1200 total requests. Unresolved titles are attempted in descending IMDb vote-count order so popular titles are recovered first.

TMDB attribution notice used by the archive UI:

> This product uses the TMDB API but is not endorsed or certified by TMDB.
