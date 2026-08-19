# Duration backfill summary

Goal: reduce the large unknown-duration population in the complete IMDb TV Archive without pretending estimates are exact.

Pipeline:

1. IMDb exact episode-runtime sum.
2. IMDb known-episode average × IMDb episode count.
3. TVmaze average runtime × IMDb episode count for exact IMDb-ID matches.
4. IMDb series-level runtime × IMDb episode count.
5. TMDB fallback for still-unresolved, high-vote titles when a build secret is configured.

UI behavior:

- Exact totals display normally.
- Estimated totals display with `≈` and retain their source description.
- The default 4–60 hour filter can use exact or estimated totals.
- Titles with neither exact nor estimated total remain unknown/partial and stay excluded unless the existing include-unknown toggle is enabled.
