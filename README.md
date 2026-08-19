# Morningstar

Morningstar is a mobile-friendly, static television-series discovery app.

- 5,004 ranked main-catalogue titles
- 179 watched titles preserved
- 3,632 optional K-drama titles
- 1,000 franchise-ranked finished anime under 60 hours (212 existing titles reused + 788 new cards)
- 465 verified Lesbian / GL titles (193 existing records reused + 272 archive cards), including 66 Thai series
- Curslick editorial collections (5: Run Hide Fight, Annabelle horror, Protector romance, Lesbian happy endings, Anime 1000)
- Search, year/genre/country/format filters, Watchlist, Not Interested reasons/notes, watched controls, and JSON backup/restore
- Sticky collapsible filters plus Grid, List, and Detailed-with-plot views
- Adjustable cards-per-row control in Grid view

## Exclusions

The filter dock opens with an **Exclusions** block that decides which titles are eligible before any
other filter runs. It applies to Browse, the home rails and every Curslick collection, and the chosen
set is stored in `localStorage` under `morningstar-exclusions`.

| Exclusion | Default | Rule |
| --- | --- | --- |
| Outside the top 5 countries | on | Keeps United States, United Kingdom, South Korea, Japan and China. Titles filed as `International`/`Unknown` fall back to their language, so an English, Korean, Japanese or Chinese production still qualifies. |
| K-dramas | off | Korean series from 2016 onward are part of Browse by default; switch this on to hide the whole shelf. |
| K-dramas before 2015 | on | Korean series with a premiere year before 2015 stay out. |
| K-dramas from 2015 | on | Korean series that premiered during 2015 stay out as a separate choice. |
| Under 4 hours total | on | Drops titles whose estimated total runtime is below 4 hours. Titles with no runtime estimate are kept. |
| Over 60 hours total | on | Drops titles whose estimated total runtime is above 60 hours. |

Lesbian / GL Archive entries are exempt from the country and runtime exclusions so Thai, short-form and
long-running representation remains reachable from its genre filter. The explicit K-drama exclusions
still apply to Korean entries.

"Back to defaults" restores the table above. Five exclusions are active by default. The dock header
counts the active exclusions alongside the ordinary filters.

## Watchlist and Not Interested

Watchlist replaces the older “My List” label without changing its `morningstar-list` storage key, so
existing saved titles remain intact. Not Interested is a separate list stored under
`morningstar-not-interested`. Every Not Interested entry records one of these reasons plus an optional
600-character note:

1. Incomplete ending
2. I don't like the ending
3. Not worthy for 1 in 1000 show I can watch in lifetime

Watchlist and Not Interested are mutually exclusive: moving a title into either one removes it from
the other. Watched, Watchlist and Not Interested titles are hidden from Home, Browse and Curslick by
default. The filter dock can include each category independently, while the dedicated Watchlist and
Not Interested pages always expose their own saved titles.

List backups use schema version 2 and include Watchlist, Not Interested reasons/notes and extra
watched marks. “Export to Drive” opens the device share sheet with the JSON backup, while “Import from
Drive” uses the system file picker. Legacy schema-version-1 backups containing `myList` and
`extraWatched` remain importable.

## Series detail

Opening a series shows the IMDb rating (with its vote count beneath it), year, episode count, runtime
and status on one fact line, then the plot. Where a title has a genuinely longer synopsis the plot
block expands; where it does not, it simply renders — there is no toggle that reveals the same
sentence twice.

The header carries an IMDb link and a MyDramaList link side by side. For the 2,927 K-drama archive
titles sourced from MyDramaList directly, the merge preserves that real title-page URL even when a
TVmaze record wins the rest of the card; every other title falls back to a MyDramaList search link
for its exact title.

Below the plot sits a row of chips: every Curslick collection the series belongs to, then its genres.
A chip is a button only when there is already researched copy behind it — a collection's "why it
belongs" write-up, or the Lesbian / GL archive's inclusion evidence — and clicking it expands that
existing text. Genres with no such write-up render as plain labels, so no chip invites a click that
leads nowhere. Opening a series from inside a collection auto-expands that collection's chip.

Two ChatGPT links sit in the header. **Ending & romance** asks three questions: whether the story
actually has an ending, whether there is romance between the main couple, and whether that couple
ends up together — or is at least implied or open-ended enough to read as a soft endgame. The second
link is labelled with the series' runtime and year and opens a plain lookup.

Generated `longPlot` fields used to end with a templated sentence restating the episode count,
format, country, runtime and genres. Since the fact line and chips already carry all of that, it is
stripped from the payload by `research/strip-plot-boilerplate.js`.

## One card per series

The catalogue, the K-drama archive, the Lesbian / GL Archive, the watched history and Curslick's
editorial exclusives are merged into a single record per series before anything is rendered. Records are joined by id, by
matching title/original-title plus year and origin, and — across the catalogue and the K-drama
archive only — by a bigram/token similarity pass, MyDramaList's alternate-title URL, and a small
verified alias map for titles whose English names are completely different. This catches pairs such
as "Strong Woman Do Bong Soon" / "Strong Girl Bong Soon" and "Just Between Lovers" / "Rain or
Shine". Korean shows use the MyDramaList English display title everywhere in Browse, Home, search,
Watchlist, Not Interested and Curslick. The original-language title appears only after the series is opened, labelled
"Original title" like IMDb. The merged record unions the genres and is watched if *any* source record
was watched. Every id and alternate title that was folded in is kept as an alias, so old Watchlist,
watched marks and searches continue to work.

## Lesbian / GL genre

The **Lesbian / GL** genre is an evidence-backed representation archive rather than an ending promise.
It contains 465 unique series: 193 reuse an existing Morningstar record and 272 supply a new archive
card. Sixty-six entries are Thai, with the 2026 slate limited to titles released or airing by
18 August 2026. The source union uses Aria's WLW television database, the international GL drama list,
Thai GL Hub, LezWatch.TV's strongest public editorial signals, Autostraddle's queer sci-fi/fantasy
ranking and the existing Curslick 04 audit.

Minor/occasional-only appearances, reality and competition programmes, documentaries, unreleased Thai
projects and duplicate seasons are excluded, along with titles where a queer-woman storyline is only
secondary or supporting inside a primarily non-GL series. The archive deliberately stops well short of
1,000 rather than padding the genre with cameo-only, unreleased, or non-primary entries. Its complete
methodology and title-by-title evidence live in `research/lesbian-gl-methodology.md` and
`research/lesbian-gl-2026-08-18.json`.

This genre is broader than Collection 04, *Lesbian happy endings*. A title can be in the genre even
when it is ongoing, cancelled or has an unhappy ending; Collection 04 remains the strict ending-safe
recommendation.

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
