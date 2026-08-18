# Lesbian / GL genre methodology

Source date: 18 August 2026
Genre label: Lesbian / GL

## Result

The first research pass contains **475 unique scripted series**:

- 199 titles reuse an existing Morningstar record.
- 276 titles receive a new archive card.
- 67 titles are Thai.
- Every included record carries the Lesbian / GL genre and title-level source evidence.

The requested 1,000 was treated as a research target, not a quota. The available specialist databases
can exceed 1,000 only by mixing in minor/occasional appearances, one-off films, reality programming,
unreleased announcements, or titles whose queer character is not a substantial recurring part of the
show. This pass stops at 475 rather than padding the genre with weaker matches.

## Inclusion rule

A title qualifies when at least one source establishes either:

1. a female-led GL/yuri romance or dedicated GL drama; or
2. a protagonist, main, several, ensemble, or supporting queer-woman storyline that recurs as a
   substantial part of the scripted series.

This is a representation genre, not an ending guarantee. Ongoing, cancelled and unhappy-ending titles
can qualify. The stricter Curslick 04 collection remains the place for completed stories whose central
couple is alive and together in the ending.

## Exclusions

The build removes:

- rows labelled Minor or Occasional;
- reality, competition, talk, documentary and one-off programming;
- entries explicitly marked Upcoming;
- Thai 2026 announcements that had not released or begun airing by 18 August 2026;
- duplicate seasons and alternate spellings of the same series.

The application exempts these archive entries from the default country and runtime exclusions. That
keeps Thai, short-form web series and longer ensemble series available through the genre filter.
Explicit K-drama exclusions still work.

## Sources

- [Aria's WLW television database](https://docs.google.com/spreadsheets/d/1xfxTPC-fYnxhUKQeO00KFKW4wFI5I7Z074Er7MIIh9Y/edit?usp=drivesdk) — rows from the 2023–2026 tabs with
  Protagonist, Main, Several, Ensemble or Supporting prominence. Minor/Occasional and non-scripted
  rows were removed.
- [Wikipedia's international GL drama list](https://en.wikipedia.org/wiki/List_of_GL_dramas) — released dedicated GL dramas,
  consolidated to one series record.
- [Thai GL Hub's 2026 line-up](https://thaiglhub.com/2026-gl-series-line-up/) — released or airing titles only, checked
  against the source date.
- [LezWatch.TV](https://lezwatchtv.com/) — public Gold Star and Shows We Love editorial signals.
  LezWatch.TV reports a much broader database of more than 2,200 shows, so the full unfiltered set was
  not treated as 2,200 central lesbian/GL stories.
- [Autostraddle's 100 best queer sci-fi/fantasy shows](https://www.autostraddle.com/the-100-best-lesbian-bisexual-and-queer-sci-fi-and-fantasy-shows-of-all-time/) — accessible ranks
  51–100 supplement the specialist databases with a published editorial ranking.
- Morningstar Curslick 04 — the existing ending-audited set, including its explicitly marked warning
  entries.

## Data model

catalogue.lesbianGlArchive stores one source record per verified title. If Morningstar already has a
record, the archive record reuses that exact id and contributes the genre/evidence fields during the
normal series merge. Otherwise it stores a lightweight archive card with a stable gl-... id.
The merged record preserves one card per series, unions genres and carries lesbianGlArchive: true.

The machine-readable audit is research/lesbian-gl-2026-08-18.json. It contains counts, source rules,
every canonical candidate, matching decisions, and the archive entries consumed by the rebuild script.
