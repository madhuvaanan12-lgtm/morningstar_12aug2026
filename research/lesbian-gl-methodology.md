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

The curated collection contains **461 unique scripted series**:

- 198 titles reuse an existing Morningstar record.
- 263 titles receive a new archive card.
- 67 titles are Thai.
- Every included record carries the Lesbian / GL genre and title-level source evidence.

A cleanup pass in August 2026 removed 19 titles that failed primary-genre criteria (false positives from source data that featured queer women only as supporting characters in primarily non-GL narratives).

The requested 1,000 was treated as a research target, not a quota. The available specialist databases
can exceed 1,000 only by mixing in minor/occasional appearances, one-off films, reality programming,
unreleased announcements, or titles whose queer character is not a substantial recurring part of the
show. This pass stops at 475 rather than padding the genre with weaker matches.

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

## August 2026 Cleanup

To strengthen genre accuracy, a verification pass removed 19 titles that appeared in source data but failed primary-genre criteria on verification. Examples of removed titles:

- **Genre shows with secondary queer content**: Arcane (fantasy/action with sapphic subtext), Arrow (superhero with queer secondary characters), Agents of S.H.I.E.L.D. (spy action ensemble)
- **Procedurals and dramas with supporting LGBT characters**: 9-1-1 (emergency ensemble), A Good Girl's Guide to Murder (mystery thriller with queer best friend), All American: Homecoming (sports drama)
- **Horror/anthology with queer supporting roles**: American Horror Story, American Horror Stories (horror primary, LGBTQ+ secondary)
- **Other non-GL primary shows**: Atypical (autism coming-of-age, not lesbian primary), And Just Like That... (romantic comedy/drama, not GL primary), A Murder at the End of the World (mystery thriller)

This cleanup improves precision: from 475 candidates, 19 false positives were removed and 5 verified GL shows were added (Friendly Rivalry, Gushing Over Magical Girls, Futari Escape, Adachi and Shimamura, Kase-san and Morning Glories), bringing the collection to 461 titles with higher confidence in primary-genre classification.

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
