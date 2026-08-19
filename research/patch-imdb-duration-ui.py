#!/usr/bin/env python3
"""Teach the IMDb archive UI to use transparent duration estimates.

The archive's main JS is intentionally kept compact. This build-time patch adds two
schema fields produced by enrich-imdb-filters.py / enrich-imdb-tmdb-duration.py and
makes filtering/sorting use an estimate only when an exact IMDb total is absent.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "imdb-archive-catalogue.js"

text = PATH.read_text(encoding="utf-8")

replacements = [
    (
        "tvmazeUrl:18};",
        "tvmazeUrl:18,estimatedTotal:19,durationEstimateSource:20};",
    ),
    (
        'function durationInfo(r){const t=r[idx.totalRuntime],e=Number(r[idx.episodeCount]||0),k=Number(r[idx.knownEpisodeRuntimeCount]||0),m=Number(r[idx.knownRuntimeMinutes]||0);if(t!==null&&t!==undefined)return{exact:true,text:formatMinutes(t),detail:`${number(e)} IMDb-listed episodes timed`};if(k>0)return{exact:false,text:`≥ ${formatMinutes(m)}`,detail:`${number(k)}/${number(e)} episodes have runtime`};return{exact:false,text:"Unknown total",detail:e?`${number(e)} episodes listed; runtime missing`:"Episode/runtime data incomplete"};}',
        'function durationInfo(r){const t=r[idx.totalRuntime],et=r[idx.estimatedTotal],src=stringValue(r,idx.durationEstimateSource),e=Number(r[idx.episodeCount]||0),k=Number(r[idx.knownEpisodeRuntimeCount]||0),m=Number(r[idx.knownRuntimeMinutes]||0);if(t!==null&&t!==undefined)return{exact:true,text:formatMinutes(t),detail:`${number(e)} IMDb-listed episodes timed`};if(et!==null&&et!==undefined&&Number(et)>0)return{exact:false,estimated:true,text:`≈ ${formatMinutes(et)}`,detail:src||"Estimated total duration"};if(k>0)return{exact:false,text:`≥ ${formatMinutes(m)}`,detail:`${number(k)}/${number(e)} episodes have runtime`};return{exact:false,text:"Unknown total",detail:e?`${number(e)} episodes listed; runtime missing`:"Episode/runtime data incomplete"};}',
    ),
    (
        'const rt=r[idx.totalRuntime],ex=rt!==null&&rt!==undefined;if(!ex&&!u)return false;if(ex&&(Number(rt)<min||Number(rt)>max))return false;if(!ex&&Number(r[idx.knownRuntimeMinutes]||0)>max)return false;',
        'const rt=r[idx.totalRuntime],et=r[idx.estimatedTotal],usable=rt!==null&&rt!==undefined?rt:et,has=usable!==null&&usable!==undefined;if(!has&&!u)return false;if(has&&(Number(usable)<min||Number(usable)>max))return false;if(!has&&Number(r[idx.knownRuntimeMinutes]||0)>max)return false;',
    ),
    (
        '(a[idx.totalRuntime]??Infinity)-(b[idx.totalRuntime]??Infinity)',
        '(a[idx.totalRuntime]??a[idx.estimatedTotal]??Infinity)-(b[idx.totalRuntime]??b[idx.estimatedTotal]??Infinity)',
    ),
    (
        'Default duration is <strong>4–60 hours</strong>. Exact TVmaze matches add covers and can load synopsis/details on demand.',
        'Default duration is <strong>4–60 hours</strong>. Exact IMDb totals are preferred; clearly marked estimates are used only when exact totals are unavailable. Exact TVmaze matches add covers and can load synopsis/details on demand.',
    ),
    (
        'Detailed view loads TVmaze synopsis/status/network only for visible exact-ID matches. <a href="https://www.imdb.com/" target="_blank">IMDb</a> · <a href="https://www.tvmaze.com/api" target="_blank">TVmaze API (CC BY-SA)</a>.',
        'Detailed view loads TVmaze synopsis/status/network only for visible exact-ID matches. Duration filters prefer exact IMDb episode sums, then labelled estimates from IMDb/TVmaze/TMDB when available. This product uses the TMDB API but is not endorsed or certified by TMDB. <a href="https://www.imdb.com/" target="_blank">IMDb</a> · <a href="https://www.tvmaze.com/api" target="_blank">TVmaze API (CC BY-SA)</a> · <a href="https://www.themoviedb.org/" target="_blank">TMDB</a>.',
    ),
]

for old, new in replacements:
    if old not in text:
        raise RuntimeError(f"IMDb duration UI patch target not found: {old[:100]!r}")
    text = text.replace(old, new, 1)

PATH.write_text(text, encoding="utf-8")
print("IMDb archive UI patched for exact + estimated durations.")
