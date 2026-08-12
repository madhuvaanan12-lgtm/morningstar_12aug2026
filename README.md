# Morningstar

Morningstar is a mobile-friendly, static television-series discovery app.

- 5,004 ranked main-catalogue titles
- 179 watched titles preserved
- 3,632 optional K-drama titles
- Curslick editorial collections (3: Run Hide Fight, Annabelle horror, Protector romance)
- Search, year/genre/country/format filters, My List, watched controls, and JSON backup/restore

## Curslick collections

Collections live in the data payload under `curslick.collections` and surface automatically in the
Curslick hub, the collection switcher and the home CTA — no app code changes are needed to add one.
Each entry either points at a catalogue title with `showId` or embeds its own `show` object, which is
then marked as a Curslick editorial exclusive.

Collection 03, *Protector romance*, also has an illustrated long-form edition at
`research/hired-to-protect-them.html`, linked from that collection's research trail.

## Deploy on Netlify

1. In Netlify, choose **Add new project** → **Import an existing project**.
2. Choose **GitHub** and select this repository.
3. Netlify will read `netlify.toml`; no build command is needed.
4. Choose **Deploy**.

If Netlify asks for the settings manually, leave the build command empty and use `.` as the publish directory.
