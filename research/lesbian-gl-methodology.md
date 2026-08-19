# Lesbian / GL genre methodology

Source date: 18 August 2026; last updated: 19 August 2026
Genre label: Lesbian / GL

## Why This Genre Matters

The Lesbian / GL genre is an evidence-backed representation archive designed to surface stories where women-loving-women relationships, queer female characters, and sapphic narratives occupy **primary structural importance** — not cameos, subtext, or secondary subplot roles.

Lesbian and GL representation has historically been marginalized in mainstream television catalogs, often buried under broader "LGBTQ+" tags that don't capture the specific experience of girl-love storytelling. This genre honors:

- Dedicated lesbian dramas and romance-centered series
- Shows where sapphic relationships drive the central plot
- Yuri/GL anime traditions (Japanese animation with female romance as core)
- International queer women's storytelling (Thai GL, Korean dramas, Chinese web series, UK/USA television)
- Stories across endings: some are happy, some tragic, some unfinished — representation doesn't require a specific ending

This genre deliberately excludes shows where queer women appear as supporting characters or subtext in primarily heterosexual-focused or genre-driven narratives (superhero ensembles, medical dramas, sci-fi action, etc.).

## Result

The curated collection contains **465 unique scripted series**:

- 193 titles reuse an existing Morningstar record.
- 272 titles receive a new archive card.
- 66 titles are Thai.
- Every included record carries the Lesbian / GL genre and title-level source evidence.

A verification pass on 19 August 2026 removed 19 titles that failed primary-genre criteria (false
positives from source data that featured queer women only as supporting characters in primarily
non-GL narratives) and added 9 verified titles, after merging 3 near-duplicate candidate rows an
earlier pass had introduced. See **19 August 2026 verification pass** below.

The requested 1,000 was treated as a research target, not a quota. The available specialist databases
can exceed 1,000 only by mixing in minor/occasional appearances, one-off films, reality programming,
unreleased announcements, or titles whose queer character is not a substantial recurring part of the
show. This collection stops at 465 rather than padding the genre with weaker matches.

## Inclusion rule

A title qualifies when at least one source establishes that sapphic women or GL storytelling is **primary** to the series, meaning:

1. **Dedicated GL/yuri romance or GL drama** — the series centers on female-female romance or relationships as its core premise; or
2. **Protagonist or leading queer-woman storyline** — a queer female character(s) or sapphic relationship drives the central narrative as substantially as it would in any other primary-genre show (not background elements, cameos, or secondary arcs in shows whose primary genre is action, medical drama, or superhero ensemble).

**Primary** is key: We exclude shows where queer women appear prominently but in supporting roles within primarily non-sapphic narratives (e.g., a queer secondary character in a procedural, or sapphic subtext in a superhero ensemble). We include shows where sapphic narratives are as central to the series as they would be in any other romance, drama, or character-driven show.

This is a representation genre, not an ending guarantee. Ongoing, cancelled, and unhappy-ending titles can qualify. For titles seeking happy, completed endings, see **Curslick Collection 04** (Lesbian happy endings), which applies stricter criteria: the show must have an actual ending, and the central lesbian couple must be alive and together on screen in that ending.

The Lesbian / GL genre is intentionally broader than Collection 04 — it captures the full spectrum of sapphic storytelling, while Collection 04 is the curated recommendation for viewers seeking story completeness and romantic resolution.

## Exclusions

The build removes:

- rows labelled Minor or Occasional;
- reality, competition, talk, documentary and one-off programming;
- entries explicitly marked Upcoming;
- Thai 2026 announcements that had not released or begun airing by 18 August 2026;
- duplicate seasons and alternate spellings of the same series.
- **titles where sapphic representation is secondary, supporting, or subtext within primarily non-GL narratives** (e.g., a queer character in a superhero ensemble, LGBTQ+ side story in a medical drama, or sapphic subtext in a primarily heterosexual-focused show). These are false positives that fail the **primary-genre test**.

The application exempts these archive entries from the default country and runtime exclusions. That
keeps Thai, short-form web series and longer ensemble series available through the genre filter.
Explicit K-drama exclusions still work.

## 19 August 2026 verification pass

A verification pass removed 19 titles that appeared in the original 18 August research but failed
primary-genre criteria on individual, title-by-title web verification. Examples of removed titles:

- **Genre shows with secondary queer content**: Arcane (fantasy/action with sapphic subtext), Arrow (superhero with queer secondary characters), Agents of S.H.I.E.L.D. (spy action ensemble)
- **Procedurals and dramas with supporting LGBT characters**: 9-1-1 (emergency ensemble), A Good Girl's Guide to Murder (mystery thriller with queer best friend), All American: Homecoming (sports drama)
- **Horror/anthology with queer supporting roles**: American Horror Story, American Horror Stories (horror primary, LGBTQ+ secondary)
- **Other non-GL primary shows**: Atypical (autism coming-of-age, not lesbian primary), And Just Like That... (romantic comedy/drama, not GL primary), A Murder at the End of the World (mystery thriller)

The same pass added 9 verified titles: Beguinas (Spain), Girls Band Cry, Gushing Over Magical Girls,
Jellyfish Can't Swim in the Night, Kase-san and Morning Glories, Adachi and Shimamura (Japan), Mayfly
Angel, Tendering Resignation (South Korea), and Xeque Mate (Brazil). Adachi and Shimamura already
existed in Morningstar's main catalogue (id `tt12728882`) and was linked as a matched-existing record
rather than given a second card. Three candidate rows an earlier editing pass had appended a second
time for shows already present in the research — Friendly Rivalry, Futari Escape, and Us (added again
under the casing "US") — were merged back into their original single entries rather than counted as
new titles.

**A note on how this was applied.** `research/lesbian-gl-2026-08-18.json` carries two arrays: `candidates`,
a lightweight research/audit trail, and `archiveEntries`, the fully-shaped records `research/build-lesbian-gl-genre.js`
actually copies into `data/catalogue.lesbianGlArchive` — the array the running app reads. An earlier
editing pass updated only `candidates` and never touched `archiveEntries`, `data/*.txt`, or `data/manifest.json`,
so none of that pass's removals or additions ever reached the published catalogue: the genre filter and
its exclusions kept showing the original, unedited 18 August set. This pass reconciled `archiveEntries`
against the corrected `candidates` list, generated branded fallback cover art for the newly-added titles
(`assets/gl-covers/`, via the same template `research/fill-lesbian-gl-covers.js` uses — the sandbox this
pass ran in could not reach TVmaze or Wikipedia to look up real posters), ran `research/build-lesbian-gl-genre.js`
to rebuild the data payload, and verified the result with `research/test-lesbian-gl-genre.js`. Any future
edit to this genre must edit `archiveEntries` (not just `candidates`) and rerun the build script, or the
same desync will happen again.

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
