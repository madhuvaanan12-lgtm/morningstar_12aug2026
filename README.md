# Morningstar

Morningstar is a mobile-friendly, static television-series discovery app.

- 5,004 ranked main-catalogue titles
- 179 watched titles preserved
- 3,632 optional K-drama titles
- Curslick editorial collections (4: Run Hide Fight, Annabelle horror, Protector romance, Lesbian happy endings)
- Search, year/genre/country/format filters, My List, watched controls, and JSON backup/restore

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
define the collection's editorial exclusives (shows absent from the main catalogue, rendered with
generated cover art) and catalogue-linked entries (`showId` into an existing title), then rewrite and
re-chunk the data payload in `data/`. Run `node research/build-curslick-0N.js` to apply one.

Collection 03, *Protector romance*, also has an illustrated long-form edition at
`research/hired-to-protect-them.html`, linked from that collection's research trail.

Collection 04, *Lesbian happy endings*, is a strict two-condition list: the show must have an actual
ending, and the central lesbian couple must be alive and together — on screen — in that ending. It
ranks eleven qualifying shows first, then seven well-known titles that almost fit and fail one of the
two conditions (killed off right after the romance lands, cancelled before any ending exists, undone
by a later spinoff, or still airing) — each with the specific reason named, so a future editor extending
this collection knows the bar new entries need to clear.

## Deploy on Netlify

1. In Netlify, choose **Add new project** → **Import an existing project**.
2. Choose **GitHub** and select this repository.
3. Netlify will read `netlify.toml`; no build command is needed.
4. Choose **Deploy**.

If Netlify asks for the settings manually, leave the build command empty and use `.` as the publish directory.
