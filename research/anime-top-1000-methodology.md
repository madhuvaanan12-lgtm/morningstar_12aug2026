# Morningstar Anime 1000 — methodology and audit

Snapshot date: **16 August 2026**

Catalogue build date: **17 August 2026**

## Result

Morningstar contains a ranked Curslick collection of exactly **1,000 Japanese anime series** whose
currently catalogued mainline runs are finished and total **strictly less than 60 hours**. The same
titles are searchable in Browse with the `Top 1000 Anime` genre/tag.

The research file is [`anime-top-1000-2026-08-16.json`](anime-top-1000-2026-08-16.json). It preserves
every title's rank, score, poster, plot, dates, formats, runtime calculation, AniList links and the
individual installments counted in the franchise total.

## Source

- [AniList Anime Dataset](https://www.kaggle.com/datasets/calebmwelsh/anilist-anime-dataset), updated
  16 August 2026. Its 20,422-row base snapshot exposes AniList's explicit `FINISHED`, `RELEASING`
  and `CANCELLED` statuses, country of origin, relations, dates, episode counts, duration, scores,
  popularity, plots and cover images.
- [Dataset collector and field definitions](https://github.com/calebmwelsh/AnimeDatasetCompiler).
- [Daily AniList seasonal dataset](https://github.com/LeoRigasaki/Anime-dataset), snapshot commit
  `a9eb180c851f81fe976e71da58c3d78f3675ef5c`, supplies 196 finished entries that started in 2026.
  This closes the base collector's current year-range gap.
- [MiruroAPI](https://github.com/Shineii86/MiruroAPI) supplied each supplement entry's live AniList
  `PREQUEL`/`SEQUEL` edges. Those edges are stored in the dated, hashed
  [`anilist-2026-supplement-2026-08-16.json`](anilist-2026-supplement-2026-08-16.json), so the build
  does not depend on a future API response.
- [AniList anime catalogue](https://anilist.co/search/anime), linked from every new Morningstar card.

The exact SHA-256 values for both source CSVs and the supplement JSON are recorded in the research JSON.

## Eligibility rules

An entry passes only when all of these rules are true:

1. At least one installment is `TV`, `TV_SHORT` or `ONA`, and the series has at least two episodes.
2. Every series-format installment has `countryOfOrigin: JP`.
3. AniList `PREQUEL` and `SEQUEL` relations are joined into one franchise-level mainline entry.
4. Linked `MOVIE`, `OVA` and `SPECIAL` continuations count toward episodes/parts and total runtime.
5. Every linked mainline installment is `FINISHED` and has a complete day-level end date.
6. A franchise is rejected when a linked prequel/sequel is releasing, upcoming, cancelled, on hiatus,
   or referenced by AniList but missing from the snapshot.
7. `episodes × duration` is summed across all linked installments and must be **under 3,600 minutes**.
8. Adult titles are excluded, and a usable AniList score and poster are required.
9. A final medium check removes catalogue anomalies that are not actually animation (the snapshot's
   glove-puppetry entry was excluded here).

This is stricter than treating each completed season as a separate ended show. For example, an
otherwise finished season is excluded when AniList already links it to an upcoming sequel.

“Ended” here means the anime production sequence recorded in the snapshot has finished; it does not
claim that every adaptation reaches the final chapter of its manga or novel. A sequel announced after
the snapshot can change a franchise's eligibility.

## Franchise ranking

The ranking is quality-first:

1. AniList `meanScore`, combined across the franchise's TV/TV Short/ONA installments. Each installment
   is weighted by the square root of its AniList popularity so a tiny entry cannot dominate a major
   multi-season series.
2. Popularity-weighted `averageScore`.
3. Highest installment popularity.
4. Representative AniList ID for a deterministic final tie-break.

## Audit totals

| Check | Count |
|---|---:|
| AniList rows read | 20,618 (20,422 base + 196 current-year supplement) |
| Prequel/sequel components | 16,552 |
| Eligible franchises before the Top 1,000 cut | 4,223 |
| Selected | 1,000 |
| Existing Morningstar anime reused | 212 |
| New searchable anime cards added | 788 |
| Selected entries with cancelled/releasing/missing linked installments | 0 |
| Selected entries at or above 60 hours | 0 |
| Selected entries without posters | 0 |

The research JSON also records exclusions by the first failed rule.

## Rebuild

```bash
python research/fetch-anilist-2026-supplement.py \
  --source /path/to/anilist_seasonal_20260816.csv
python research/compile-anime-top-1000.py \
  --source /path/to/anilist_anime_data_complete.csv \
  --supplement research/anilist-2026-supplement-2026-08-16.json \
  --mal-metadata /path/to/anime-standalone.csv
node research/build-curslick-05.js
```

The compiler creates the audited 1,000-title research payload. The builder matches exact titles back
to existing Morningstar anime where safe, creates the remaining cards, installs Curslick collection
05, adds the Browse tag, validates references and posters, and rewrites the chunked static payload.
The optional daily MyAnimeList metadata supplies poster URLs; titles without a MAL ID use the
`img.anili.st` AniList image proxy.
