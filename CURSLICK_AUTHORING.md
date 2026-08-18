# Curslick Authoring Standard

**Effective date:** 18 August 2026  
**Morningstar section:** Curslick  
**Related page:** ME2 — Methods and Everything Else

This file is a permanent instruction for every future Curslick collection added to Morningstar.

## Mandatory provenance for every new Curslick

Every Curslick must record all of the following. Do not publish a future collection without these fields.

1. **Created date** — exact date the Curslick was first produced.
2. **Last updated date** — exact date of the latest meaningful research/ranking revision.
3. **AI provider** — for example OpenAI, Anthropic, Google, or another provider actually used.
4. **Exact AI model** — write the real model name/version used for the work. Do not write only “ChatGPT”, “Claude”, “Gemini”, or “AI”.
5. **Role of each model** — if more than one AI/model was used, state what each one did (research, extraction, ranking, verification, coding, etc.).
6. **Methodology** — explain how the list was created in enough detail that another researcher could repeat the process.
7. **Methodology date** — the date on which that methodology was applied or last materially revised.
8. **Source/research basis** — the important databases, websites, catalogues, reviews, official sources, datasets, or existing Morningstar data used.
9. **Inclusion rules** — what qualifies a series for the Curslick.
10. **Exclusion rules** — what disqualifies a series.
11. **Ranking logic** — what the ranking means and which factors determine order (for example closeness first, quality second).
12. **Verification** — how titles, endings, episode counts, countries, genres, similarity claims, or other important facts were checked.
13. **Known limitations** — any incomplete coverage, uncertain metadata, unavailable sources, or judgement calls.

## Accuracy rule

Never guess provenance. If an older/legacy Curslick does not have reliable AI/model or methodology records, write **“not recorded”** rather than inventing them later.

## Date rule

A methodology without a date is incomplete. Every methodology statement must have a creation or last-reviewed date in a human-readable format (for example **18 Aug 2026**) and may additionally store an ISO date (`2026-08-18`) for machine use.

## Recommended data fields

```json
{
  "createdDate": "2026-08-18",
  "updatedDate": "2026-08-18",
  "aiProvider": "<actual provider>",
  "aiModel": "<exact actual model>",
  "aiRoles": ["<role>"],
  "methodology": "<repeatable description>",
  "methodologyDate": "2026-08-18",
  "sources": ["<source or dataset>"],
  "inclusionRules": ["<rule>"],
  "exclusionRules": ["<rule>"],
  "rankingLogic": "<what determines order>",
  "verification": "<checks performed>",
  "limitations": "<known limitations>"
}
```

## Curslick editorial principle

Curslick is not simply a generic “best shows” list. A collection should state **what exact feeling, premise, relationship dynamic, setting, structure, or viewing need is being matched**. Ranking should be transparent about whether it prioritizes closeness, overall quality, ending preference, or another criterion.

The short list/card interface may summarize this methodology, but the full provenance must remain available in the collection metadata, research file, or ME2 documentation.
