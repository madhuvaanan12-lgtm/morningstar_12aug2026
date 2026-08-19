# TMDB credential handling

The TMDB API key/read token must be supplied as a build-environment secret. The duration backfill reads `TMDB_READ_ACCESS_TOKEN` or `TMDB_API_KEY` and never writes credential values to the repository, generated archive JSON, browser JavaScript, logs, or PR text.

The provided credential is intentionally not hardcoded into Git history.
