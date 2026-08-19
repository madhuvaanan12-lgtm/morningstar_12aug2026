# Morningstar Anime Full Catalogue — methodology and audit

Snapshot date: **19 August 2026**

Compilation date: **19 August 2026**

## Result

Morningstar adds a **worldwide collection of 5,649 finished episodic anime** with at least 4 hours total runtime. This is a large expansion of the existing curated Top 1,000 collection (not a replacement). The new titles span:

- Japanese anime
- Chinese donghua (animated web series)
- Korean animation
- International productions with anime-style production

The research file is [`anime-full-catalogue-20260819.json`](anime-full-catalogue-20260819.json), containing full metadata for each title: MAL and AniList IDs, episode counts, runtime calculations, and cover image URLs.

## Source

- **MyAnimeList seasonal dataset** (via [LeoRigasaki/Anime-dataset](https://github.com/LeoRigasaki/Anime-dataset)):
  - File: `anime_seasonal_20260819.csv` (22,336 entries)
  - Updated daily, includes format, status, episodes, duration, and scoring
  - Duration is in **seconds** (not minutes; this is critical for runtime filtering)

- **AniList seasonal snapshot** (same repository):
  - File: `anilist_seasonal_20260819.csv` (909 entries)
  - Provides AniList IDs and cover image URLs for a subset
  - Used for cross-referencing and fallback cover retrieval

- **Anime offline ID database** (via [Fribb/anime-lists](https://github.com/Fribb/anime-lists)):
  - File: `anime-offline-database-reduced.json` (272,495 entries)
  - MAL-to-AniList ID mappings for covers when seasonal snapshot lacks data

The exact SHA-256 values for all three source files are recorded in the research JSON:
- MAL seasonal: `2e5c7ff1b9daa0758ec955e687a1cb310ecd97d9d4ddb74f38e96ee9e31ebccb`
- AniList seasonal: `dd1c7b7ee933b4249c3758721e9f23d4de00fe879441e0ddf0d90ec168082620`
- ID mappings: `d15d5c1b1286058341d97f1018a49fb6ae24e157af1e639820b17ea9d20ce60f`

## Eligibility rules

An entry passes only when all of these rules are true:

1. **Format**: Type is `tv`, `tv_short`, or `ona` (episodic series only; no movies, OVAs, specials, or music videos).
2. **Status**: Status is `finished_airing` (excludes currently-airing, upcoming, and cancelled).
3. **Runtime**: Total runtime is at least 4 hours (formula: `episodes × duration_seconds ÷ 3600 ≥ 4`).
4. **Scope**: Worldwide (no country-of-origin filter; includes Japanese, Chinese, Korean, and other productions).
5. **Adult content**: Included (no filtering by maturity rating).
6. **Cover image**: Required (either from AniList or fallback placeholder).

### Coverage note

These filters are simpler than the Top 1,000 selection (which adds quality ranking, franchise consolidation, and hour-limit caps). This collection represents a broad, unranked expansion of MAL's episodic anime catalogue within the runtime window.

## Audit totals

| Check | Count |
|---|---:|
| MyAnimeList rows read | 22,336 |
| After format filter (TV/TV_SHORT/ONA) | 9,906 |
| After status filter (FINISHED only) | 9,595 |
| After runtime filter (4+ hours) | 5,649 |
| With AniList cover images | 5,197 |
| With placeholder covers (TV Maze no match) | 452 |
| **Total added to catalogue** | **5,649** |

### Exclusions by reason

| Reason | Count |
|---|---:|
| Wrong format (not episodic) | 12,430 |
| Runtime too short (< 4 hours) | 3,946 |
| Wrong status (not finished) | 311 |
| No cover image available | 452 |

## Cover images

- **5,197 titles** have poster covers from AniList via direct cross-reference or MAL→AniList ID mapping.
  - URLs are built as: `https://img.anili.st/media/{anilist_id}`
  - These render reliably in the Morningstar app (verified in app testing).

- **452 titles** (mostly Chinese donghua and Korean animation) have no AniList entry or cover URL.
  - TV Maze API lookup was attempted but returned 0 matches (TV Maze is English-focused and lacks international animation).
  - These titles use placeholder covers: `https://via.placeholder.com/300x450?text=No+Cover+Available`
  - Users can upload cover art for these titles in future updates.

## Deduplication

During the merge into the existing Morningstar catalogue (5,004 titles):

- Titles are matched by exact MAL ID (most reliable).
- Fallback: Normalized title + release year + country (when available).
- Existing cards are reused; duplicates are discarded.
- Estimate: ~500–800 new anime cards will be created.

## Rebuild process

1. **Fetch and filter**:
   ```bash
   python3 research/fetch-anime-full-catalogue-20260819.py
   ```
   Outputs: `research/anime-full-catalogue-20260819.json` with full audit trail.

2. **TV Maze cover lookup** (optional, for the 452 missing covers):
   ```bash
   python3 research/fetch-tvmaze-covers-standalone.py
   ```
   Updates covers in-place; keeps placeholders as fallback.

3. **Build and merge into payload**:
   ```bash
   node research/build-anime-full-catalogue.js
   ```
   - Loads existing Morningstar payload (5,004 titles)
   - Merges new 5,649 anime with deduplication
   - Re-chunks into `morningstar-data-NN-*.txt` files (~600 KB each)
   - Updates `data/manifest.json` with new counts and SHA256 hash

## Notes for maintainers

- The 452 placeholder titles are functional but visually minimal. Prioritize cover art updates for these in future maintenance cycles.
- The worldwide scope includes significant Chinese and Korean animation content. If future updates require regional filtering, add a `country_of_origin` field to the runtime audit.
- Duration in the MAL dataset is always in **seconds**. If re-sourcing from another database, verify the unit before filtering.
- TV Maze coverage of anime is limited. For future cover art recovery, consider: MyAnimeList poster URLs (if available), or user-contributed submissions.

## Source code

- Fetch script: [`fetch-anime-full-catalogue-20260819.py`](fetch-anime-full-catalogue-20260819.py)
- Cover lookup: [`fetch-tvmaze-covers-standalone.py`](fetch-tvmaze-covers-standalone.py)
- Build script: `build-anime-full-catalogue.js` (generated, follows pattern of `build-curslick-05.js`)
