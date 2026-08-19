(() => {
  "use strict";

  const MANIFEST_URL = "./data/imdb/manifest.json";
  const PAGE_SIZE = 100;
  const UNKNOWN = "__unknown__";
  const VIEW_KEY = "morningstar-imdb-view";
  const GRID_KEY = "morningstar-imdb-grid-columns";

  const state = {
    manifest: null,
    records: [],
    loadedFiles: 0,
    loading: false,
    loaded: false,
    page: 1,
    filtered: [],
    renderTimer: null,
    viewMode: "grid",
    gridColumns: 5,
    synopsisCache: new Map(),
    synopsisQueue: [],
    synopsisRunning: false,
  };

  const idx = {
    id: 0,
    title: 1,
    original: 2,
    type: 3,
    start: 4,
    end: 5,
    runtime: 6,
    genres: 7,
    adult: 8,
    rating: 9,
    votes: 10,
    totalRuntime: 11,
    episodeCount: 12,
    knownEpisodeRuntimeCount: 13,
    knownRuntimeMinutes: 14,
    countries: 15,
    languages: 16,
    poster: 17,
    tvmazeUrl: 18,
  };

  const css = `
    #ms-imdb-open{position:fixed;right:16px;bottom:16px;z-index:9998;border:1px solid #42ff63;background:#071109;color:#b8ffc3;padding:10px 14px;border-radius:999px;font:700 13px/1 system-ui,sans-serif;box-shadow:0 8px 30px #0009;cursor:pointer}
    #ms-imdb-open:hover{background:#0e1f12}
    #ms-imdb-shell{position:fixed;inset:0;z-index:9999;background:#050806f5;color:#edf7ef;font:14px/1.45 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:none;overflow:auto}
    #ms-imdb-shell.ms-open{display:block}
    #ms-imdb-panel{max-width:1320px;margin:0 auto;padding:20px 18px 48px}
    .ms-imdb-top{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;position:sticky;top:0;background:#050806f2;backdrop-filter:blur(10px);padding:10px 0 14px;z-index:5;border-bottom:1px solid #223426}
    .ms-imdb-title{font-size:25px;font-weight:850;margin:0 0 4px}.ms-imdb-sub{color:#98ad9d;max-width:900px}
    #ms-imdb-close{border:1px solid #526557;background:#111a13;color:#fff;padding:9px 12px;border-radius:9px;cursor:pointer}
    .ms-imdb-progress{margin:16px 0 10px;background:#0f1711;border:1px solid #25372a;border-radius:12px;padding:12px}
    .ms-imdb-bar{height:7px;background:#1e2c21;border-radius:99px;overflow:hidden;margin-top:8px}.ms-imdb-bar>span{display:block;height:100%;background:#42ff63;width:0}
    .ms-imdb-controls{display:grid;grid-template-columns:minmax(240px,2fr) repeat(4,minmax(120px,1fr));gap:10px;margin:12px 0}
    .ms-imdb-controls input,.ms-imdb-controls select{width:100%;box-sizing:border-box;border:1px solid #304236;background:#0c120e;color:#eef7f0;border-radius:9px;padding:10px 11px;outline:none}
    .ms-imdb-controls input:focus,.ms-imdb-controls select:focus{border-color:#42ff63}
    .ms-imdb-check{display:flex;align-items:center;gap:7px;border:1px solid #304236;background:#0c120e;border-radius:9px;padding:8px 10px;white-space:nowrap}.ms-imdb-check input{width:auto}
    .ms-imdb-duration-default{border-color:#42ff63!important;box-shadow:inset 0 0 0 1px #42ff6333}
    .ms-imdb-display{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:12px 0;border:1px solid #26382b;background:#09100b;border-radius:12px;padding:9px 10px}
    .ms-imdb-display strong{margin-right:4px}
    .ms-imdb-view-btn{border:1px solid #304236;background:#0c120e;color:#dce9df;border-radius:8px;padding:8px 11px;cursor:pointer}
    .ms-imdb-view-btn.ms-active{border-color:#42ff63;background:#102317;color:#d6ffdc}
    .ms-imdb-grid-control{display:flex;align-items:center;gap:6px;margin-left:auto;color:#9fb0a3}
    .ms-imdb-grid-control input{width:64px;border:1px solid #304236;background:#0c120e;color:#fff;border-radius:8px;padding:7px}
    .ms-imdb-meta{display:flex;gap:12px;flex-wrap:wrap;color:#aebdb1;margin:10px 0 12px}.ms-imdb-meta strong{color:#fff}
    .ms-imdb-results{--ms-grid-columns:5}
    .ms-imdb-results[data-view="grid"]{display:grid;grid-template-columns:repeat(var(--ms-grid-columns),minmax(0,1fr));gap:12px}
    .ms-imdb-results[data-view="list"],.ms-imdb-results[data-view="detailed"]{display:grid;gap:9px}
    .ms-imdb-card{border:1px solid #243228;background:#09100b;border-radius:12px;overflow:hidden;min-width:0}
    .ms-imdb-poster-link,.ms-imdb-poster-box{display:block;overflow:hidden;background:#111a13;text-decoration:none;position:relative}
    .ms-imdb-poster-img{display:block;width:100%;height:100%;object-fit:cover;background:#111a13}
    .ms-imdb-poster-placeholder{display:flex;width:100%;height:100%;align-items:center;justify-content:center;text-align:center;font:850 28px/1 system-ui,sans-serif;color:#6f8774;background:linear-gradient(145deg,#0c120e,#172019)}
    .ms-imdb-poster-placeholder[hidden]{display:none}
    .ms-imdb-name{font-weight:800;font-size:15px;line-height:1.25}
    .ms-imdb-name a{color:#f4fff6;text-decoration:none}.ms-imdb-name a:hover{color:#42ff63}
    .ms-imdb-original{font-size:12px;color:#8da294;margin-top:3px}
    .ms-imdb-genres{font-size:12px;color:#b5c4b8;margin-top:5px}
    .ms-imdb-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
    .ms-imdb-badge{font-size:11px;padding:3px 6px;border-radius:999px;border:1px solid #304236;background:#0d1710;color:#c6d7c9}
    .ms-imdb-rating{font-weight:760;color:#fff}
    .ms-imdb-warning{color:#ffd58a}
    .ms-imdb-plot{color:#d2ddd4;margin-top:9px;line-height:1.52}
    .ms-imdb-plot-empty{color:#879b8b;font-style:italic}
    .ms-imdb-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:9px;font-size:12px}
    .ms-imdb-link{color:#42ff63;text-decoration:none}.ms-imdb-link:hover{text-decoration:underline}
    .ms-imdb-source{color:#728577;font-size:11px;margin-top:6px}
    .ms-imdb-results[data-view="grid"] .ms-imdb-card{display:flex;flex-direction:column}
    .ms-imdb-results[data-view="grid"] .ms-imdb-poster-link,.ms-imdb-results[data-view="grid"] .ms-imdb-poster-box{aspect-ratio:5/7;width:100%}
    .ms-imdb-results[data-view="grid"] .ms-imdb-card-body{padding:10px;min-width:0}
    .ms-imdb-results[data-view="grid"] .ms-imdb-name{font-size:14px}
    .ms-imdb-results[data-view="list"] .ms-imdb-card{display:grid;grid-template-columns:58px minmax(0,2.2fr) 115px 95px 120px 110px;gap:11px;align-items:center;padding:8px 10px}
    .ms-imdb-results[data-view="list"] .ms-imdb-poster-link,.ms-imdb-results[data-view="list"] .ms-imdb-poster-box{width:50px;height:72px;border-radius:7px}
    .ms-imdb-results[data-view="list"] .ms-imdb-card-body{display:contents}
    .ms-imdb-results[data-view="list"] .ms-list-main{min-width:0}
    .ms-imdb-results[data-view="detailed"] .ms-imdb-card{display:grid;grid-template-columns:132px minmax(0,1fr);gap:15px;padding:12px}
    .ms-imdb-results[data-view="detailed"] .ms-imdb-poster-link,.ms-imdb-results[data-view="detailed"] .ms-imdb-poster-box{width:120px;height:168px;border-radius:9px}
    .ms-imdb-results[data-view="detailed"] .ms-imdb-card-body{min-width:0}
    .ms-imdb-pages{display:flex;align-items:center;justify-content:center;gap:10px;margin:18px 0}.ms-imdb-pages button{border:1px solid #39503e;background:#0d160f;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer}.ms-imdb-pages button:disabled{opacity:.35;cursor:default}
    .ms-imdb-note{margin-top:20px;color:#8fa094;font-size:12px;border-top:1px solid #223426;padding-top:14px}.ms-imdb-note a{color:#9dffa9}
    .ms-imdb-empty{padding:40px 10px;text-align:center;color:#9daf9f;border:1px dashed #26382b;border-radius:12px}
    @media(max-width:1100px){.ms-imdb-results[data-view="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}.ms-imdb-results[data-view="list"] .ms-list-tablet-hide{display:none}.ms-imdb-results[data-view="list"] .ms-imdb-card{grid-template-columns:58px minmax(0,1fr) 95px 110px}}
    @media(max-width:900px){.ms-imdb-controls{grid-template-columns:1fr 1fr 1fr}.ms-imdb-controls .ms-imdb-search{grid-column:1/-1}.ms-imdb-results[data-view="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:650px){#ms-imdb-panel{padding:10px 10px 40px}.ms-imdb-title{font-size:20px}.ms-imdb-controls{grid-template-columns:1fr 1fr}.ms-imdb-controls .ms-imdb-search{grid-column:1/-1}.ms-imdb-results[data-view="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}.ms-imdb-results[data-view="list"] .ms-imdb-card{grid-template-columns:50px minmax(0,1fr) 76px}.ms-imdb-results[data-view="list"] .ms-list-mobile-hide{display:none}.ms-imdb-results[data-view="detailed"] .ms-imdb-card{grid-template-columns:92px minmax(0,1fr);gap:10px;padding:9px}.ms-imdb-results[data-view="detailed"] .ms-imdb-poster-link,.ms-imdb-results[data-view="detailed"] .ms-imdb-poster-box{width:84px;height:118px}.ms-imdb-grid-control{margin-left:0}#ms-imdb-open{right:10px;bottom:10px}}
    @media(max-width:430px){.ms-imdb-controls{grid-template-columns:1fr}.ms-imdb-controls .ms-imdb-search{grid-column:auto}.ms-imdb-results[data-view="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}.ms-imdb-display{gap:6px}.ms-imdb-view-btn{padding:7px 9px}.ms-imdb-results[data-view="detailed"] .ms-imdb-card{grid-template-columns:1fr}.ms-imdb-results[data-view="detailed"] .ms-imdb-poster-link,.ms-imdb-results[data-view="detailed"] .ms-imdb-poster-box{width:110px;height:154px}}
  `;

  function number(value) { return new Intl.NumberFormat().format(value || 0); }
  function escapeHtml(value) { return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
  function stringValue(record,index) { return typeof record[index] === "string" ? record[index] : ""; }
  function arrayValue(record,index) { return Array.isArray(record[index]) ? record[index] : []; }

  function years(record) {
    const start = record[idx.start], end = record[idx.end];
    if (!start) return "Year n/a";
    if (!end || end === start) return String(start);
    return `${start}–${end}`;
  }
  function typeLabel(value) { return value === "tvMiniSeries" ? "Mini Series" : "TV Series"; }
  function formatMinutes(value) {
    if (!Number.isFinite(Number(value)) || Number(value) < 0) return "Unknown";
    const minutes = Math.round(Number(value)), hours = Math.floor(minutes/60), remainder = minutes%60;
    if (!hours) return `${remainder}m`;
    return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
  }
  function durationInfo(record) {
    const total = record[idx.totalRuntime], episodes = Number(record[idx.episodeCount] || 0), known = Number(record[idx.knownEpisodeRuntimeCount] || 0), knownMinutes = Number(record[idx.knownRuntimeMinutes] || 0);
    if (total !== null && total !== undefined) return {exact:true,text:formatMinutes(total),detail:`${number(episodes)} IMDb-listed episodes timed`};
    if (known > 0) return {exact:false,text:`≥ ${formatMinutes(knownMinutes)}`,detail:`${number(known)}/${number(episodes)} episodes have runtime`};
    return {exact:false,text:"Unknown total",detail:episodes ? `${number(episodes)} episodes listed; runtime missing` : "Episode/runtime data incomplete"};
  }
  function countryName(code) { try { return new Intl.DisplayNames([navigator.language || "en"],{type:"region"}).of(code) || code; } catch(_) { return code; } }
  function languageName(value) { if (!/^[a-z]{2,3}$/i.test(value || "")) return value || "Unknown"; try { return new Intl.DisplayNames([navigator.language || "en"],{type:"language"}).of(value) || value; } catch(_) { return value; } }
  function matchesArrayFilter(values,selected) { if (!selected || selected === "all") return true; if (selected === UNKNOWN) return !values.length; return values.includes(selected); }

  function isLikelySoap(record) {
    const genres = new Set(arrayValue(record,idx.genres));
    if (genres.has("Soap") || genres.has("Soap Opera")) return true;
    const episodes = Number(record[idx.episodeCount] || 0);
    if (episodes < 80 || !genres.has("Drama")) return false;
    if (!(genres.has("Romance") || genres.has("Family"))) return false;
    const strong = ["Action","Adventure","Crime","Fantasy","Horror","Mystery","Sci-Fi","Thriller","Animation","Documentary","Reality-TV","Sport","News","Talk-Show"];
    return !strong.some((genre)=>genres.has(genre));
  }

  function verificationSearchUrl(record,purpose="details") {
    const year = record[idx.start] ? ` ${record[idx.start]}` : "";
    const tail = purpose === "plot" ? "TV series plot synopsis" : "TV series country language total runtime episodes";
    return `https://www.google.com/search?q=${encodeURIComponent(`"${record[idx.title]}"${year} ${tail}`)}`;
  }

  function posterMarkup(record) {
    const poster = stringValue(record,idx.poster), tvmazeUrl = stringValue(record,idx.tvmazeUrl) || "https://www.tvmaze.com/", initial = String(record[idx.title] || "?").trim().charAt(0).toUpperCase() || "?";
    if (!poster) return `<div class="ms-imdb-poster-box" title="No cover available"><span class="ms-imdb-poster-placeholder">${escapeHtml(initial)}</span></div>`;
    return `<a class="ms-imdb-poster-link" href="${escapeHtml(tvmazeUrl)}" target="_blank" rel="noopener noreferrer" title="Cover via TVmaze"><img class="ms-imdb-poster-img" src="${escapeHtml(poster)}" alt="${escapeHtml(record[idx.title])} cover" loading="lazy" decoding="async" fetchpriority="low"><span class="ms-imdb-poster-placeholder" hidden>${escapeHtml(initial)}</span></a>`;
  }

  function wirePosterFallbacks() {
    document.querySelectorAll("#ms-imdb-list .ms-imdb-poster-img").forEach((image)=>image.addEventListener("error",()=>{image.hidden=true;const p=image.parentElement?.querySelector(".ms-imdb-poster-placeholder");if(p)p.hidden=false;},{once:true}));
  }

  function tvmazeId(record) {
    const match = stringValue(record,idx.tvmazeUrl).match(/\/shows\/(\d+)(?:\/|$)/);
    return match ? match[1] : "";
  }
  function plainTextFromHtml(value) { if (!value) return ""; const t=document.createElement("template"); t.innerHTML=String(value); return (t.content.textContent || "").replace(/\s+/g," ").trim(); }
  function tvmazeMeta(show) { return [typeof show?.status === "string" ? show.status.trim() : "", show?.network?.name || show?.webChannel?.name || ""].filter(Boolean).join(" · "); }

  function hydrateVisibleSynopses() {
    const targets = Array.from(document.querySelectorAll('#ms-imdb-list .ms-imdb-plot[data-tvmaze-id]')).filter((e)=>e.textContent.includes("loading"));
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) { targets.slice(0,12).forEach(queueSynopsis); return; }
    const observer = new IntersectionObserver((entries)=>{ for(const entry of entries){ if(!entry.isIntersecting)continue; observer.unobserve(entry.target); queueSynopsis(entry.target); } },{root:document.querySelector("#ms-imdb-shell"),rootMargin:"300px 0px"});
    targets.forEach((target)=>observer.observe(target));
  }
  function queueSynopsis(element) {
    const mazeId=element.dataset.tvmazeId;
    if(!mazeId)return;
    if(state.synopsisCache.has(mazeId)){applySynopsis(element,state.synopsisCache.get(mazeId));return;}
    if(element.dataset.queued === "1")return;
    element.dataset.queued="1"; state.synopsisQueue.push({mazeId,element}); runSynopsisQueue();
  }
  function applySynopsis(element,payload) {
    if(!element?.isConnected)return;
    if(!payload){ element.classList.add("ms-imdb-plot-empty"); element.textContent="Synopsis unavailable for this title."; const searchUrl=element.dataset.plotSearch; const source=element.nextElementSibling; if(searchUrl && source && !source.querySelector?.(".ms-imdb-plot-search")){ const link=document.createElement("a"); link.className="ms-imdb-link ms-imdb-plot-search"; link.href=searchUrl; link.target="_blank"; link.rel="noopener noreferrer"; link.textContent="Search plot on web ↗"; source.append(" · ",link);} return; }
    element.classList.remove("ms-imdb-plot-empty"); element.textContent=payload.summary; const source=element.nextElementSibling; if(source && payload.meta) source.textContent=`${payload.meta} · Synopsis via TVmaze exact IMDb-ID match.`;
  }
  async function runSynopsisQueue() {
    if(state.synopsisRunning)return; state.synopsisRunning=true;
    try { while(state.synopsisQueue.length){ const job=state.synopsisQueue.shift(); if(!job?.mazeId)continue; let payload=state.synopsisCache.get(job.mazeId); if(payload===undefined){ try{ const response=await fetch(`https://api.tvmaze.com/shows/${encodeURIComponent(job.mazeId)}`); if(!response.ok)throw new Error(`TVmaze HTTP ${response.status}`); const show=await response.json(), summary=plainTextFromHtml(show.summary); payload=summary ? {summary,meta:tvmazeMeta(show)} : null; }catch(_){payload=null;} state.synopsisCache.set(job.mazeId,payload); await new Promise((resolve)=>setTimeout(resolve,550)); } applySynopsis(job.element,payload); } } finally { state.synopsisRunning=false; }
  }

  function addOptions(select,options,labeler,includeUnknown,unknownCount) {
    const first=select.options[0]; select.innerHTML=""; select.appendChild(first);
    if(includeUnknown && unknownCount){const option=document.createElement("option");option.value=UNKNOWN;option.textContent=`Unknown (${number(unknownCount)})`;select.appendChild(option);}
    for(const entry of options || []){const option=document.createElement("option");option.value=entry.value;option.textContent=`${labeler(entry.value)} (${number(entry.count)})`;select.appendChild(option);}
  }
  function populateFilterOptions() {
    const meta=state.manifest?.filterOptions || {};
    addOptions(document.querySelector("#ms-imdb-country"),meta.countries,(v)=>`${countryName(v)} · ${v}`,true,meta.unknownCountry);
    addOptions(document.querySelector("#ms-imdb-language"),meta.languages,(v)=>languageName(v),true,meta.unknownLanguage);
    addOptions(document.querySelector("#ms-imdb-genre"),meta.genres,(v)=>v,false,0);
  }
  function savedView(defaults){const stored=localStorage.getItem(VIEW_KEY);return ["grid","list","detailed"].includes(stored)?stored:(defaults.viewMode || "grid");}
  function savedColumns(defaults){const stored=Number(localStorage.getItem(GRID_KEY));if(Number.isInteger(stored)&&stored>=2&&stored<=8)return stored;const fallback=Number(defaults.gridColumns || 5);return Math.max(2,Math.min(8,Number.isFinite(fallback)?fallback:5));}

  function buildShell() {
    const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
    const open=document.createElement("button");open.id="ms-imdb-open";open.type="button";open.textContent="IMDb Archive";document.body.appendChild(open);
    const shell=document.createElement("div");shell.id="ms-imdb-shell";shell.innerHTML=`<div id="ms-imdb-panel"><div class="ms-imdb-top"><div><h2 class="ms-imdb-title">Complete IMDb TV Archive</h2><div class="ms-imdb-sub">A Morningstar-style view of all IMDb TV Series + TV Mini Series. Default duration is <strong>4–60 hours</strong>. Exact TVmaze matches add covers and can load synopsis/details on demand.</div></div><button id="ms-imdb-close" type="button">Close</button></div><div class="ms-imdb-progress"><div id="ms-imdb-progress-text">Archive manifest not loaded yet.</div><div class="ms-imdb-bar"><span id="ms-imdb-progress-bar"></span></div></div><div class="ms-imdb-controls"><input class="ms-imdb-search" id="ms-imdb-search" type="search" placeholder="Search title, original title or IMDb ID" autocomplete="off"><select id="ms-imdb-type"><option value="all">All types</option><option value="tvSeries">TV Series</option><option value="tvMiniSeries">TV Mini Series</option></select><select id="ms-imdb-country"><option value="all">All countries</option></select><select id="ms-imdb-language"><option value="all">All languages</option></select><select id="ms-imdb-genre"><option value="all">All genres</option></select><input id="ms-imdb-min-hours" class="ms-imdb-duration-default" type="number" min="0" step="0.25" value="4"><input id="ms-imdb-max-hours" class="ms-imdb-duration-default" type="number" min="0.25" step="0.25" value="60"><input id="ms-imdb-min-rating" type="number" min="0" max="10" step="0.1" placeholder="Min IMDb rating"><input id="ms-imdb-year-from" type="number" min="1800" max="2100" placeholder="From year"><input id="ms-imdb-year-to" type="number" min="1800" max="2100" placeholder="To year"><select id="ms-imdb-sort"><option value="votes">Most votes</option><option value="rating">Highest rating</option><option value="duration">Shortest total</option><option value="year">Newest</option><option value="title">Title A–Z</option></select><label class="ms-imdb-check"><input id="ms-imdb-unknown-duration" type="checkbox"> Include unknown/partial duration</label><label class="ms-imdb-check"><input id="ms-imdb-exclude-animation" type="checkbox"> Exclude animation/cartoons</label><label class="ms-imdb-check"><input id="ms-imdb-exclude-documentary" type="checkbox"> Exclude documentaries</label><label class="ms-imdb-check"><input id="ms-imdb-exclude-soap" type="checkbox"> Exclude likely soaps</label><label class="ms-imdb-check"><input id="ms-imdb-adult" type="checkbox"> Include adult-flagged</label></div><div class="ms-imdb-display"><strong>Display</strong><button class="ms-imdb-view-btn" data-view="grid" type="button">Grid</button><button class="ms-imdb-view-btn" data-view="list" type="button">List</button><button class="ms-imdb-view-btn" data-view="detailed" type="button">Detailed + plot</button><label class="ms-imdb-grid-control">Cards / row <input id="ms-imdb-grid-columns" type="number" min="2" max="8" step="1" value="5"></label></div><div class="ms-imdb-meta" id="ms-imdb-meta"></div><div class="ms-imdb-results" id="ms-imdb-list" data-view="grid"><div class="ms-imdb-empty">Open the archive to begin loading.</div></div><div class="ms-imdb-pages" id="ms-imdb-pages"></div><div class="ms-imdb-note" id="ms-imdb-note"></div></div>`;document.body.appendChild(shell);
    open.addEventListener("click",openArchive); shell.querySelector("#ms-imdb-close").addEventListener("click",()=>shell.classList.remove("ms-open")); shell.addEventListener("click",(event)=>{if(event.target===shell)shell.classList.remove("ms-open");});
    ["ms-imdb-search","ms-imdb-min-hours","ms-imdb-max-hours","ms-imdb-min-rating","ms-imdb-year-from","ms-imdb-year-to"].forEach((id)=>shell.querySelector(`#${id}`).addEventListener("input",scheduleFilter));
    ["ms-imdb-type","ms-imdb-country","ms-imdb-language","ms-imdb-genre","ms-imdb-sort","ms-imdb-unknown-duration","ms-imdb-exclude-animation","ms-imdb-exclude-documentary","ms-imdb-exclude-soap","ms-imdb-adult"].forEach((id)=>shell.querySelector(`#${id}`).addEventListener("change",scheduleFilter));
    shell.querySelectorAll(".ms-imdb-view-btn").forEach((button)=>button.addEventListener("click",()=>setView(button.dataset.view)));
    shell.querySelector("#ms-imdb-grid-columns").addEventListener("input",(event)=>{const columns=Math.max(2,Math.min(8,Number(event.target.value)||5));state.gridColumns=columns;localStorage.setItem(GRID_KEY,String(columns));renderResults();});
  }

  function setView(view){if(!["grid","list","detailed"].includes(view))return;state.viewMode=view;localStorage.setItem(VIEW_KEY,view);document.querySelectorAll(".ms-imdb-view-btn").forEach((button)=>button.classList.toggle("ms-active",button.dataset.view===view));renderResults();}

  async function ensureManifest() {
    if(state.manifest)return state.manifest;
    const response=await fetch(MANIFEST_URL,{cache:"no-cache"});if(!response.ok)throw new Error(`IMDb manifest HTTP ${response.status}`);state.manifest=await response.json();
    const open=document.querySelector("#ms-imdb-open");if(open)open.textContent=`IMDb Archive · ${number(state.manifest.totalTitles)}`;
    const defaults=state.manifest.uiDefaults || {};document.querySelector("#ms-imdb-min-hours").value=defaults.minTotalHoursInclusive ?? 4;document.querySelector("#ms-imdb-max-hours").value=defaults.maxTotalHoursInclusive ?? 60;document.querySelector("#ms-imdb-unknown-duration").checked=Boolean(defaults.includeUnknownDuration);document.querySelector("#ms-imdb-exclude-animation").checked=Boolean(defaults.excludeCartoons);document.querySelector("#ms-imdb-exclude-documentary").checked=Boolean(defaults.excludeDocumentary);document.querySelector("#ms-imdb-exclude-soap").checked=Boolean(defaults.excludeLikelySoap);state.viewMode=savedView(defaults);state.gridColumns=savedColumns(defaults);document.querySelector("#ms-imdb-grid-columns").value=state.gridColumns;document.querySelectorAll(".ms-imdb-view-btn").forEach((button)=>button.classList.toggle("ms-active",button.dataset.view===state.viewMode));populateFilterOptions();
    const duration=state.manifest.durationEnrichment || {},origin=state.manifest.originFilterEnrichment || {};document.querySelector("#ms-imdb-note").innerHTML=`${escapeHtml(state.manifest.source.attribution)} Personal/non-commercial IMDb dataset use only. Total duration is the sum of IMDb-listed episode runtimes and is exact only when every listed episode has a runtime. Country/language/cover are added only where TVmaze maps the exact IMDb ID; synopsis/status/network are fetched from TVmaze only for visible Detailed-view cards. ${duration.exactTitles ? `${number(duration.exactTitles)} titles have exact total runtime.` : ""} ${origin.matchedTvmazeTitles ? `${number(origin.matchedTvmazeTitles)} titles have an exact TVmaze match.` : ""} ${origin.titlesWithPoster ? `${number(origin.titlesWithPoster)} have a TVmaze cover.` : ""} <a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb</a> · <a href="https://developer.imdb.com/non-commercial-datasets/" target="_blank" rel="noopener noreferrer">IMDb dataset source</a> · <a href="https://www.tvmaze.com/api" target="_blank" rel="noopener noreferrer">TVmaze API (CC BY-SA)</a>.`;return state.manifest;
  }

  async function openArchive(){const shell=document.querySelector("#ms-imdb-shell");shell.classList.add("ms-open");try{await ensureManifest();updateProgress();if(!state.loaded&&!state.loading)loadAllChunks();filterAndRender();}catch(error){document.querySelector("#ms-imdb-progress-text").textContent=`Could not load IMDb archive: ${error.message}`;}}
  async function loadAllChunks(){state.loading=true;const files=state.manifest.files.map((entry)=>entry.file),queue=files.slice();const workers=Array.from({length:Math.min(6,queue.length)},()=> (async()=>{while(queue.length){const file=queue.shift(),response=await fetch(`./data/imdb/${file}`);if(!response.ok)throw new Error(`${file}: HTTP ${response.status}`);const chunk=await response.json();state.records.push(...chunk);state.loadedFiles+=1;updateProgress();scheduleFilter();}})());try{await Promise.all(workers);state.loaded=true;state.loading=false;updateProgress();filterAndRender();}catch(error){state.loading=false;document.querySelector("#ms-imdb-progress-text").textContent=`Archive loading stopped: ${error.message}`;}}
  function updateProgress(){if(!state.manifest)return;const totalFiles=state.manifest.files.length,pct=totalFiles?Math.round((state.loadedFiles/totalFiles)*100):0;text=state.loaded?`Loaded ${number(state.records.length)} titles from ${totalFiles} archive chunks.`:`Loading ${number(state.records.length)} / ${number(state.manifest.totalTitles)} titles · ${state.loadedFiles}/${totalFiles} chunks (${pct}%). Filters work progressively while loading.`;document.querySelector("#ms-imdb-progress-text").textContent=text;document.querySelector("#ms-imdb-progress-bar").style.width=`${pct}%`;}
  function scheduleFilter(){clearTimeout(state.renderTimer);state.renderTimer=setTimeout(()=>{state.page=1;filterAndRender();},160);}

  function filterAndRender(){if(!state.manifest)return;const shell=document.querySelector("#ms-imdb-shell"),query=shell.querySelector("#ms-imdb-search").value.trim().toLocaleLowerCase(),type=shell.querySelector("#ms-imdb-type").value,country=shell.querySelector("#ms-imdb-country").value,language=shell.querySelector("#ms-imdb-language").value,genre=shell.querySelector("#ms-imdb-genre").value,minHoursText=shell.querySelector("#ms-imdb-min-hours").value.trim(),maxHoursText=shell.querySelector("#ms-imdb-max-hours").value.trim(),minMinutes=minHoursText?Number(minHoursText)*60:0,maxMinutes=maxHoursText?Number(maxHoursText)*60:Infinity,includeUnknownDuration=shell.querySelector("#ms-imdb-unknown-duration").checked,excludeAnimation=shell.querySelector("#ms-imdb-exclude-animation").checked,excludeDocumentary=shell.querySelector("#ms-imdb-exclude-documentary").checked,excludeSoap=shell.querySelector("#ms-imdb-exclude-soap").checked,minRating=Number(shell.querySelector("#ms-imdb-min-rating").value||0),yearFrom=Number(shell.querySelector("#ms-imdb-year-from").value||0),yearTo=Number(shell.querySelector("#ms-imdb-year-to").value||9999),includeAdult=shell.querySelector("#ms-imdb-adult").checked,sort=shell.querySelector("#ms-imdb-sort").value;
    let filtered=state.records.filter((record)=>{if(!includeAdult&&record[idx.adult])return false;if(type!=="all"&&record[idx.type]!==type)return false;if(!matchesArrayFilter(arrayValue(record,idx.countries),country))return false;if(!matchesArrayFilter(arrayValue(record,idx.languages),language))return false;const genres=arrayValue(record,idx.genres);if(genre!=="all"&&!genres.includes(genre))return false;if(excludeAnimation&&genres.includes("Animation"))return false;if(excludeDocumentary&&genres.includes("Documentary"))return false;if(excludeSoap&&isLikelySoap(record))return false;const totalRuntime=record[idx.totalRuntime],hasExact=totalRuntime!==null&&totalRuntime!==undefined;if(!hasExact&&!includeUnknownDuration)return false;if(hasExact){const total=Number(totalRuntime);if(Number.isFinite(minMinutes)&&total<minMinutes)return false;if(Number.isFinite(maxMinutes)&&total>maxMinutes)return false;}else{const knownMinutes=Number(record[idx.knownRuntimeMinutes]||0);if(Number.isFinite(maxMinutes)&&knownMinutes>maxMinutes)return false;}if(minRating&&(!record[idx.rating]||record[idx.rating]<minRating))return false;const year=record[idx.start]||0;if(yearFrom&&year<yearFrom)return false;if(yearTo<9999&&(!year||year>yearTo))return false;if(query){const haystack=`${record[idx.title]}\n${record[idx.original]}\n${record[idx.id]}`.toLocaleLowerCase();if(!haystack.includes(query))return false;}return true;});
    const collator=new Intl.Collator(undefined,{sensitivity:"base",numeric:true});if(sort==="rating")filtered.sort((a,b)=>(b[idx.rating]||-1)-(a[idx.rating]||-1)||(b[idx.votes]||0)-(a[idx.votes]||0));else if(sort==="duration")filtered.sort((a,b)=>(a[idx.totalRuntime]??Infinity)-(b[idx.totalRuntime]??Infinity)||(a[idx.knownRuntimeMinutes]||0)-(b[idx.knownRuntimeMinutes]||0)||(b[idx.votes]||0)-(a[idx.votes]||0));else if(sort==="year")filtered.sort((a,b)=>(b[idx.start]||0)-(a[idx.start]||0)||(b[idx.votes]||0)-(a[idx.votes]||0));else if(sort==="title")filtered.sort((a,b)=>collator.compare(a[idx.title],b[idx.title])||(a[idx.start]||0)-(b[idx.start]||0));else filtered.sort((a,b)=>(b[idx.votes]||0)-(a[idx.votes]||0)||(b[idx.rating]||-1)-(a[idx.rating]||-1));state.filtered=filtered;renderResults();
  }

  function commonCardData(record){const genres=arrayValue(record,idx.genres),countries=arrayValue(record,idx.countries),languages=arrayValue(record,idx.languages),duration=durationInfo(record),rating=record[idx.rating]?`${Number(record[idx.rating]).toFixed(1)} ★`:"No rating",votes=record[idx.votes]?`${number(record[idx.votes])} votes`:"0 votes",countryText=countries.length?countries.map(countryName).join(" / "):"Country unknown",languageText=languages.length?languages.map(languageName).join(" / "):"Language unknown",original=record[idx.original]&&record[idx.original]!==record[idx.title]?record[idx.original]:"";return{genres,duration,rating,votes,countryText,languageText,original};}
  function badges(record,data){return [years(record),typeLabel(record[idx.type]),data.duration.text,data.rating].map((value)=>`<span class="ms-imdb-badge">${escapeHtml(value)}</span>`).join("");}
  function actionLinks(record,data){const tvmazeUrl=stringValue(record,idx.tvmazeUrl),missingMeta=!data.duration.exact||data.countryText==="Country unknown"||data.languageText==="Language unknown";return `<a class="ms-imdb-link" href="https://www.imdb.com/title/${encodeURIComponent(record[idx.id])}/" target="_blank" rel="noopener noreferrer">IMDb ↗</a>${tvmazeUrl?`<a class="ms-imdb-link" href="${escapeHtml(tvmazeUrl)}" target="_blank" rel="noopener noreferrer">TVmaze ↗</a>`:""}${missingMeta?`<a class="ms-imdb-link" href="${verificationSearchUrl(record)}" target="_blank" rel="noopener noreferrer">Verify metadata ↗</a>`:""}`;}
  function renderGridCard(record){const data=commonCardData(record);return `<article class="ms-imdb-card">${posterMarkup(record)}<div class="ms-imdb-card-body"><div class="ms-imdb-name"><a href="https://www.imdb.com/title/${encodeURIComponent(record[idx.id])}/" target="_blank" rel="noopener noreferrer">${escapeHtml(record[idx.title])}</a>${record[idx.adult]?" · 18+":""}</div>${data.original?`<div class="ms-imdb-original">${escapeHtml(data.original)}</div>`:""}<div class="ms-imdb-badges">${badges(record,data)}</div><div class="ms-imdb-genres">${escapeHtml(data.genres.join(" · ")||"Genre n/a")}</div><div class="ms-imdb-original">${escapeHtml(data.countryText)} · ${escapeHtml(data.languageText)}</div><div class="ms-imdb-actions">${actionLinks(record,data)}</div></div></article>`;}
  function renderListCard(record){const data=commonCardData(record);return `<article class="ms-imdb-card">${posterMarkup(record)}<div class="ms-imdb-card-body"><div class="ms-list-main"><div class="ms-imdb-name"><a href="https://www.imdb.com/title/${encodeURIComponent(record[idx.id])}/" target="_blank" rel="noopener noreferrer">${escapeHtml(record[idx.title])}</a>${record[idx.adult]?" · 18+":""}</div>${data.original?`<div class="ms-imdb-original">${escapeHtml(data.original)}</div>`:""}<div class="ms-imdb-genres">${escapeHtml(data.genres.join(" · ")||"Genre n/a")}</div><div class="ms-imdb-original">${escapeHtml(data.countryText)} · ${escapeHtml(data.languageText)}</div></div><div class="ms-list-mobile-hide">${escapeHtml(typeLabel(record[idx.type]))}</div><div>${escapeHtml(years(record))}</div><div class="ms-list-tablet-hide${data.duration.exact?"":" ms-imdb-warning"}"><strong>${escapeHtml(data.duration.text)}</strong><div class="ms-imdb-original">${escapeHtml(data.duration.detail)}</div></div><div class="ms-list-tablet-hide"><span class="ms-imdb-rating">${escapeHtml(data.rating)}</span><div class="ms-imdb-original">${escapeHtml(data.votes)}</div><div class="ms-imdb-actions">${actionLinks(record,data)}</div></div></div></article>`;}
  function renderDetailedCard(record){const data=commonCardData(record),mazeId=tvmazeId(record),cached=mazeId?state.synopsisCache.get(mazeId):undefined,synopsisHtml=mazeId?`<div class="ms-imdb-plot${cached===null?" ms-imdb-plot-empty":""}" data-tvmaze-id="${escapeHtml(mazeId)}" data-plot-search="${escapeHtml(verificationSearchUrl(record,"plot"))}">${cached===undefined?"Synopsis loading when visible…":cached===null?"Synopsis unavailable for this title.":escapeHtml(cached.summary)}</div><div class="ms-imdb-source">${cached?.meta?escapeHtml(cached.meta)+" · ":""}Synopsis via TVmaze exact IMDb-ID match.</div>`:`<div class="ms-imdb-plot ms-imdb-plot-empty">Synopsis unavailable for this title.</div><div class="ms-imdb-actions"><a class="ms-imdb-link" href="${verificationSearchUrl(record,"plot")}" target="_blank" rel="noopener noreferrer">Search plot on web ↗</a></div>`;return `<article class="ms-imdb-card">${posterMarkup(record)}<div class="ms-imdb-card-body"><div class="ms-imdb-name"><a href="https://www.imdb.com/title/${encodeURIComponent(record[idx.id])}/" target="_blank" rel="noopener noreferrer">${escapeHtml(record[idx.title])}</a>${record[idx.adult]?" · 18+":""}</div>${data.original?`<div class="ms-imdb-original">Original title: ${escapeHtml(data.original)}</div>`:""}<div class="ms-imdb-badges">${badges(record,data)}</div><div class="ms-imdb-genres">${escapeHtml(data.genres.join(" · ")||"Genre n/a")}</div><div class="ms-imdb-original">${escapeHtml(data.countryText)} · ${escapeHtml(data.languageText)}</div><div class="ms-imdb-original">${escapeHtml(data.duration.detail)} · ${escapeHtml(data.votes)}</div>${synopsisHtml}<div class="ms-imdb-actions">${actionLinks(record,data)}</div></div></article>`;}

  function renderResults(){if(!state.manifest)return;const list=document.querySelector("#ms-imdb-list"),pages=document.querySelector("#ms-imdb-pages"),meta=document.querySelector("#ms-imdb-meta"),totalPages=Math.max(1,Math.ceil(state.filtered.length/PAGE_SIZE));state.page=Math.min(state.page,totalPages);const start=(state.page-1)*PAGE_SIZE,slice=state.filtered.slice(start,start+PAGE_SIZE),minHours=document.querySelector("#ms-imdb-min-hours").value.trim(),maxHours=document.querySelector("#ms-imdb-max-hours").value.trim(),includeUnknownDuration=document.querySelector("#ms-imdb-unknown-duration").checked;list.dataset.view=state.viewMode;list.style.setProperty("--ms-grid-columns",String(state.gridColumns));document.querySelector(".ms-imdb-grid-control").style.display=state.viewMode==="grid"?"flex":"none";meta.innerHTML=`<span><strong>${number(state.filtered.length)}</strong> matching loaded titles</span><span><strong>${number(state.manifest.totalTitles)}</strong> total in snapshot</span><span>Duration <strong>${escapeHtml(minHours||"0")}–${escapeHtml(maxHours||"∞")}h</strong></span><span>${includeUnknownDuration?"Unknown/partial durations included":"Only exact total durations"}</span><span>View <strong>${escapeHtml(state.viewMode==="detailed"?"Detailed + plot":state.viewMode)}</strong></span>${state.loaded?'<span><strong>Archive fully loaded</strong></span>':'<span>Still loading…</span>'}`;if(!slice.length)list.innerHTML=`<div class="ms-imdb-empty">No matching titles in the ${state.loaded?"archive":"loaded portion yet"}. Try widening the duration range or including Unknown/partial duration.</div>`;else{const renderer=state.viewMode==="detailed"?renderDetailedCard:state.viewMode==="list"?renderListCard:renderGridCard;list.innerHTML=slice.map(renderer).join("");wirePosterFallbacks();if(state.viewMode==="detailed")hydrateVisibleSynopses();}pages.innerHTML=`<button id="ms-imdb-prev" type="button" ${state.page<=1?"disabled":""}>Previous</button><span>Page ${number(state.page)} / ${number(totalPages)}</span><button id="ms-imdb-next" type="button" ${state.page>=totalPages?"disabled":""}>Next</button>`;pages.querySelector("#ms-imdb-prev").addEventListener("click",()=>{if(state.page>1){state.page-=1;renderResults();document.querySelector("#ms-imdb-shell").scrollTo({top:0,behavior:"smooth"});}});pages.querySelector("#ms-imdb-next").addEventListener("click",()=>{if(state.page<totalPages){state.page+=1;renderResults();document.querySelector("#ms-imdb-shell").scrollTo({top:0,behavior:"smooth"});}});}

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",buildShell,{once:true});else buildShell();
})();