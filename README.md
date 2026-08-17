# Morningstar

Morningstar is a mobile-friendly, static television-series discovery app.

- 5,004 ranked main-catalogue titles
- 179 watched titles preserved
- 3,632 optional K-drama titles
- 1,000 franchise-ranked finished anime under 60 hours (212 existing titles reused + 788 new cards)
- Curslick editorial collections (5: Run Hide Fight, Annabelle horror, Protector romance, Lesbian happy endings, Anime 1000)
- Search, year/genre/country/format filters, My List, watched controls, and JSON backup/restore
- Sticky collapsible filters plus Grid, List, and Detailed-with-plot views
- Adjustable cards-per-row control in Grid view

## Exclusions

The filter dock opens with an **Exclusions** block that decides which titles are eligible before any
other filter runs. It applies to Browse, My List's source pool, the home rails and every Curslick
collection, and the chosen set is stored in `localStorage` under `morningstar-exclusions`.

| Exclusion | Default | Rule |
| --- | --- | --- |
| Outside the top 5 countries | on | Keeps United States, United Kingdom, South Korea, Japan and China. Titles filed as `International`/`Unknown` fall back to their language, so an English, Korean, Japanese or Chinese production still qualifies. |
| K-dramas | off | Korean series are part of Browse by default now; switch this on to hide the whole shelf. |
| K-dramas before 2010 | on | Korean series with a premiere year under 2010 stay out. |
| Under 4 hours total | on | Drops titles whose estimated total runtime is below 4 hours. Titles with no runtime estimate are kept. |
| Over 60 hours total | on | Drops titles whose estimated total runtime is above 60 hours. |

"Back to defaults" restores the table above. The dock header counts the active exclusions alongside
the ordinary filters.

## One card per series

The catalogue, the K-drama archive, the watched history and Curslick's editorial exclusives are
merged into a single record per series before anything is rendered — 8,815 source records collapse to
7,875 cards. The same Korean drama routinely appears in the ranked catalogue under one English title
(IMDb's) and in the K-drama archive under another (MyDramaList's), which is what produced duplicate
cards and made an already-watched series look unwatched.

Records are joined in four passes, the last three only between a catalogue record and a K-drama
archive record, and each catalogue record can claim at most one archive record (best score wins, so
nothing chains "Reply 1997" into "Reply 1994"):

1. **Same id**, and same normalised title/original-title plus year and origin.
2. **English-title similarity** — bigram similarity ≥ 0.65 or a shared-distinctive-token test:
   *Empress Ki* / *The Empress Ki*, *Under the Queen's Umbrella* / *The Queen's Umbrella*.
3. **Romanised native title** — Hangul original titles are romanised in the browser and compared to
   the catalogue's romanisation, which is exact far more often than the English names are:
   응답하라 1988 → `eungdaphara 1988` matches *Answer Me 1988*'s `Eungdaphara 1988`, so *Reply 1988*
   folds into it. This is what catches *Tempted* / *Great Seducer*, *Rain or Shine* /
   *Just Between Lovers* and *Bring It On, Ghost* / *Let's Fight Ghost*.
4. **Plot fingerprint** — TF-IDF cosine over the two synopses, accepted only above 0.4 and only when
   it beats the runner-up by 30%, for shows whose two English names share nothing:
   *Nice Guy* / *The Innocent Man*, *Haechi* / *Hatch*, *Delayed Justice* / *Fly Dragon*.

Years must be within one, episode counts within one (or an exact 2× split at the same episode
length, which is how the two sources disagree about split broadcasts), and conflicting numbers in
the titles veto a match.

The merged record keeps the IMDb-linked English title, shows the native-script original underneath
it (IMDb style), keeps the romanisation and every folded English title searchable and lists them as
"Also known as" on the detail page, unions the genres, and is watched if *any* of its source records
was. Every folded id is kept as an alias, so My List entries, watched marks and Curslick `showId`
references saved against the old id keep resolving.

All 127 watched Korean titles now resolve to a single card; 60 catalogue titles still have no
identifiable archive twin, none of them watched.

## Curslick collections

Collections live in the data payload under `curslick.collections` and surface automatically in the
Curslick hub, the collection switcher and the home CTA — no app code changes are needed to add one.
Each entry either points at a catalogue title with `showId` or embeds its own `show` object, which is
then marked as a Curslick editorial exclusive.

A "page" in Curslick terms is just one of these collections: a ranked, researched list built around a
strict inclusion rule (e.g. "closest TV shows to *Run Hide Fight*", or "shows with a specific kind of
ending"), not necessarily a genre browse. Each collection's `matchingStandard` field states that rule
explicitly, and `researchNote` explains how titles were checked against it — including naming the
well-known titles that almost qualify but don't, and why. Build scripts for each collection live in
`research/build-curslick-0N.js` and are the reference implementation for adding another one: they
define the collection's editorial exclusives (shows absent from the main catalogue, using verified
poster URLs with generated cover art as a fallback) and catalogue-linked entries (`showId` into an existing title), then rewrite and
re-chunk the data payload in `data/`. Run `node research/build-curslick-0N.js` to apply one.

Collection 03, *Protector romance*, also has an illustrated long-form edition at
`research/hired-to-protect-them.html`, linked from that collection's research trail.

Collection 04, *Lesbian happy endings*, is a strict two-condition list: the show must have an actual
ending, and the central lesbian couple must be alive and together — on screen — in that ending. It
ranks eleven qualifying shows first, then seven well-known titles that almost fit and fail one of the
two conditions (killed off right after the romance lands, cancelled before any ending exists, undone
by a later spinoff, or still airing) — each with the specific reason named, so a future editor extending
this collection knows the bar new entries need to clear.

Collection 05, *Anime 1000*, groups AniList PREQUEL/SEQUEL relations into franchise-level runs, counts
linked movies, OVAs and specials toward the runtime, and admits a title only when every currently
catalogued mainline installment is FINISHED, fully end-dated, present in the source snapshot and below
60 combined hours. The 16 August 2026 combined snapshot produced 4,223 eligible franchises before
the Top 1,000 quality cut. Full rules, exclusions and the reproducible audit live in
`research/anime-top-1000-methodology.md`; the machine-readable title audit is
`research/anime-top-1000-2026-08-16.json`.

## Deploy on Netlify

1. In Netlify, choose **Add new project** → **Import an existing project**.
2. Choose **GitHub** and select this repository.
3. Netlify will read `netlify.toml`; no build command is needed.
4. Choose **Deploy**.

If Netlify asks for the settings manually, leave the build command empty and use `.` as the publish directory.
