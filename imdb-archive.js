(() => {
  "use strict";

  const MANIFEST_URL = "./data/imdb/manifest.json";
  const PAGE_SIZE = 100;
  const state = {
    manifest: null,
    records: [],
    loadedFiles: 0,
    loading: false,
    loaded: false,
    page: 1,
    filtered: [],
    renderTimer: null,
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
  };

  const css = `
    #ms-imdb-open{position:fixed;right:16px;bottom:16px;z-index:9998;border:1px solid #42ff63;background:#071109;color:#b8ffc3;padding:10px 14px;border-radius:999px;font:700 13px/1 system-ui,sans-serif;box-shadow:0 8px 30px #0009;cursor:pointer}
    #ms-imdb-open:hover{background:#0e1f12}
    #ms-imdb-shell{position:fixed;inset:0;z-index:9999;background:#050806f5;color:#edf7ef;font:14px/1.4 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:none;overflow:auto}
    #ms-imdb-shell.ms-open{display:block}
    #ms-imdb-panel{max-width:1180px;margin:0 auto;padding:20px 18px 48px}
    .ms-imdb-top{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;position:sticky;top:0;background:#050806f2;backdrop-filter:blur(10px);padding:10px 0 14px;z-index:2;border-bottom:1px solid #223426}
    .ms-imdb-title{font-size:25px;font-weight:850;margin:0 0 4px}.ms-imdb-sub{color:#98ad9d;max-width:760px}
    #ms-imdb-close{border:1px solid #526557;background:#111a13;color:#fff;padding:9px 12px;border-radius:9px;cursor:pointer}
    .ms-imdb-progress{margin:16px 0 10px;background:#0f1711;border:1px solid #25372a;border-radius:12px;padding:12px}
    .ms-imdb-bar{height:7px;background:#1e2c21;border-radius:99px;overflow:hidden;margin-top:8px}.ms-imdb-bar>span{display:block;height:100%;background:#42ff63;width:0}
    .ms-imdb-controls{display:grid;grid-template-columns:minmax(220px,2fr) repeat(5,minmax(110px,1fr));gap:10px;margin:12px 0}
    .ms-imdb-controls input,.ms-imdb-controls select{width:100%;box-sizing:border-box;border:1px solid #304236;background:#0c120e;color:#eef7f0;border-radius:9px;padding:10px 11px;outline:none}
    .ms-imdb-controls input:focus,.ms-imdb-controls select:focus{border-color:#42ff63}
    .ms-imdb-check{display:flex;align-items:center;gap:7px;border:1px solid #304236;background:#0c120e;border-radius:9px;padding:8px 10px;white-space:nowrap}.ms-imdb-check input{width:auto}
    .ms-imdb-meta{display:flex;gap:12px;flex-wrap:wrap;color:#aebdb1;margin:10px 0 12px}.ms-imdb-meta strong{color:#fff}
    .ms-imdb-list{display:grid;gap:8px}
    .ms-imdb-row{display:grid;grid-template-columns:minmax(0,2.2fr) 130px 90px 110px 110px;gap:12px;align-items:center;border:1px solid #243228;background:#09100b;border-radius:11px;padding:11px 12px}
    .ms-imdb-main{min-width:0}.ms-imdb-name{font-weight:780;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms-imdb-original{font-size:12px;color:#8da294;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}.ms-imdb-genres{font-size:12px;color:#b5c4b8;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ms-imdb-type{color:#bfffc8}.ms-imdb-rating{font-weight:750}.ms-imdb-link{color:#42ff63;text-decoration:none}.ms-imdb-link:hover{text-decoration:underline}
    .ms-imdb-pages{display:flex;align-items:center;justify-content:center;gap:10px;margin:18px 0}.ms-imdb-pages button{border:1px solid #39503e;background:#0d160f;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer}.ms-imdb-pages button:disabled{opacity:.35;cursor:default}
    .ms-imdb-note{margin-top:20px;color:#8fa094;font-size:12px;border-top:1px solid #223426;padding-top:14px}.ms-imdb-note a{color:#9dffa9}
    .ms-imdb-empty{padding:40px 10px;text-align:center;color:#9daf9f}
    @media(max-width:900px){.ms-imdb-controls{grid-template-columns:1fr 1fr}.ms-imdb-controls .ms-imdb-search{grid-column:1/-1}.ms-imdb-row{grid-template-columns:minmax(0,1fr) 90px 86px}.ms-imdb-row .ms-hide-mobile{display:none}}
    @media(max-width:560px){#ms-imdb-panel{padding:10px 10px 40px}.ms-imdb-title{font-size:20px}.ms-imdb-controls{grid-template-columns:1fr}.ms-imdb-controls .ms-imdb-search{grid-column:auto}.ms-imdb-row{grid-template-columns:minmax(0,1fr) 72px;padding:10px}.ms-imdb-row .ms-mobile-hide{display:none}#ms-imdb-open{right:10px;bottom:10px}}
  `;

  function number(value) {
    return new Intl.NumberFormat().format(value || 0);
  }

  function years(record) {
    const start = record[idx.start];
    const end = record[idx.end];
    if (!start) return "Year n/a";
    if (!end || end === start) return String(start);
    return `${start}–${end}`;
  }

  function typeLabel(value) {
    return value === "tvMiniSeries" ? "Mini Series" : "TV Series";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function buildShell() {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const open = document.createElement("button");
    open.id = "ms-imdb-open";
    open.type = "button";
    open.textContent = "IMDb Archive";
    document.body.appendChild(open);

    const shell = document.createElement("div");
    shell.id = "ms-imdb-shell";
    shell.innerHTML = `
      <div id="ms-imdb-panel">
        <div class="ms-imdb-top">
          <div>
            <h2 class="ms-imdb-title">Complete IMDb TV Archive</h2>
            <div class="ms-imdb-sub">All IMDb TV Series + TV Mini Series from the official non-commercial dataset snapshot. This archive loads only when you open it, so Morningstar's curated catalogue stays fast.</div>
          </div>
          <button id="ms-imdb-close" type="button">Close</button>
        </div>
        <div class="ms-imdb-progress">
          <div id="ms-imdb-progress-text">Archive manifest not loaded yet.</div>
          <div class="ms-imdb-bar"><span id="ms-imdb-progress-bar"></span></div>
        </div>
        <div class="ms-imdb-controls">
          <input class="ms-imdb-search" id="ms-imdb-search" type="search" placeholder="Search title, original title or IMDb ID" autocomplete="off">
          <select id="ms-imdb-type"><option value="all">All types</option><option value="tvSeries">TV Series</option><option value="tvMiniSeries">TV Mini Series</option></select>
          <input id="ms-imdb-min-rating" type="number" min="0" max="10" step="0.1" placeholder="Min rating">
          <input id="ms-imdb-year-from" type="number" min="1800" max="2100" placeholder="From year">
          <input id="ms-imdb-year-to" type="number" min="1800" max="2100" placeholder="To year">
          <select id="ms-imdb-sort"><option value="votes">Most votes</option><option value="rating">Highest rating</option><option value="year">Newest</option><option value="title">Title A–Z</option></select>
          <label class="ms-imdb-check"><input id="ms-imdb-adult" type="checkbox"> Include adult-flagged</label>
        </div>
        <div class="ms-imdb-meta" id="ms-imdb-meta"></div>
        <div class="ms-imdb-list" id="ms-imdb-list"><div class="ms-imdb-empty">Open the archive to begin loading.</div></div>
        <div class="ms-imdb-pages" id="ms-imdb-pages"></div>
        <div class="ms-imdb-note" id="ms-imdb-note"></div>
      </div>`;
    document.body.appendChild(shell);

    open.addEventListener("click", openArchive);
    shell.querySelector("#ms-imdb-close").addEventListener("click", () => shell.classList.remove("ms-open"));
    shell.addEventListener("click", (event) => {
      if (event.target === shell) shell.classList.remove("ms-open");
    });

    ["ms-imdb-search", "ms-imdb-min-rating", "ms-imdb-year-from", "ms-imdb-year-to"].forEach((id) => {
      shell.querySelector(`#${id}`).addEventListener("input", scheduleFilter);
    });
    ["ms-imdb-type", "ms-imdb-sort", "ms-imdb-adult"].forEach((id) => {
      shell.querySelector(`#${id}`).addEventListener("change", scheduleFilter);
    });
  }

  async function ensureManifest() {
    if (state.manifest) return state.manifest;
    const response = await fetch(MANIFEST_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`IMDb manifest HTTP ${response.status}`);
    state.manifest = await response.json();
    const open = document.querySelector("#ms-imdb-open");
    if (open) open.textContent = `IMDb Archive · ${number(state.manifest.totalTitles)}`;
    document.querySelector("#ms-imdb-note").innerHTML = `
      ${escapeHtml(state.manifest.source.attribution)} Personal/non-commercial dataset use only.
      <a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer">IMDb</a> ·
      <a href="https://developer.imdb.com/non-commercial-datasets/" target="_blank" rel="noopener noreferrer">dataset terms/source</a>.
      Plot summaries, posters and content certificates are not bulk-copied because they are not in the non-commercial basics/ratings datasets used here.`;
    return state.manifest;
  }

  async function openArchive() {
    const shell = document.querySelector("#ms-imdb-shell");
    shell.classList.add("ms-open");
    try {
      await ensureManifest();
      updateProgress();
      if (!state.loaded && !state.loading) loadAllChunks();
      filterAndRender();
    } catch (error) {
      document.querySelector("#ms-imdb-progress-text").textContent = `Could not load IMDb archive: ${error.message}`;
    }
  }

  async function loadAllChunks() {
    state.loading = true;
    const files = state.manifest.files.map((entry) => entry.file);
    const queue = files.slice();
    const workers = Array.from({ length: Math.min(6, queue.length) }, () => (async () => {
      while (queue.length) {
        const file = queue.shift();
        const response = await fetch(`./data/imdb/${file}`);
        if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
        const chunk = await response.json();
        state.records.push(...chunk);
        state.loadedFiles += 1;
        updateProgress();
        scheduleFilter();
      }
    })());

    try {
      await Promise.all(workers);
      state.loaded = true;
      state.loading = false;
      updateProgress();
      filterAndRender();
    } catch (error) {
      state.loading = false;
      document.querySelector("#ms-imdb-progress-text").textContent = `Archive loading stopped: ${error.message}`;
    }
  }

  function updateProgress() {
    if (!state.manifest) return;
    const totalFiles = state.manifest.files.length;
    const pct = totalFiles ? Math.round((state.loadedFiles / totalFiles) * 100) : 0;
    const text = state.loaded
      ? `Loaded ${number(state.records.length)} titles from ${totalFiles} archive chunks.`
      : `Loading ${number(state.records.length)} / ${number(state.manifest.totalTitles)} titles · ${state.loadedFiles}/${totalFiles} chunks (${pct}%). Search works progressively while loading.`;
    document.querySelector("#ms-imdb-progress-text").textContent = text;
    document.querySelector("#ms-imdb-progress-bar").style.width = `${pct}%`;
  }

  function scheduleFilter() {
    clearTimeout(state.renderTimer);
    state.renderTimer = setTimeout(() => {
      state.page = 1;
      filterAndRender();
    }, 160);
  }

  function filterAndRender() {
    if (!state.manifest) return;
    const shell = document.querySelector("#ms-imdb-shell");
    const query = shell.querySelector("#ms-imdb-search").value.trim().toLocaleLowerCase();
    const type = shell.querySelector("#ms-imdb-type").value;
    const minRating = Number(shell.querySelector("#ms-imdb-min-rating").value || 0);
    const yearFrom = Number(shell.querySelector("#ms-imdb-year-from").value || 0);
    const yearTo = Number(shell.querySelector("#ms-imdb-year-to").value || 9999);
    const includeAdult = shell.querySelector("#ms-imdb-adult").checked;
    const sort = shell.querySelector("#ms-imdb-sort").value;

    let filtered = state.records.filter((record) => {
      if (!includeAdult && record[idx.adult]) return false;
      if (type !== "all" && record[idx.type] !== type) return false;
      if (minRating && (!record[idx.rating] || record[idx.rating] < minRating)) return false;
      const year = record[idx.start] || 0;
      if (yearFrom && year < yearFrom) return false;
      if (yearTo < 9999 && (!year || year > yearTo)) return false;
      if (query) {
        const haystack = `${record[idx.title]}\n${record[idx.original]}\n${record[idx.id]}`.toLocaleLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
    if (sort === "rating") {
      filtered.sort((a, b) => (b[idx.rating] || -1) - (a[idx.rating] || -1) || (b[idx.votes] || 0) - (a[idx.votes] || 0));
    } else if (sort === "year") {
      filtered.sort((a, b) => (b[idx.start] || 0) - (a[idx.start] || 0) || (b[idx.votes] || 0) - (a[idx.votes] || 0));
    } else if (sort === "title") {
      filtered.sort((a, b) => collator.compare(a[idx.title], b[idx.title]) || (a[idx.start] || 0) - (b[idx.start] || 0));
    } else {
      filtered.sort((a, b) => (b[idx.votes] || 0) - (a[idx.votes] || 0) || (b[idx.rating] || -1) - (a[idx.rating] || -1));
    }

    state.filtered = filtered;
    renderResults();
  }

  function renderResults() {
    const list = document.querySelector("#ms-imdb-list");
    const pages = document.querySelector("#ms-imdb-pages");
    const meta = document.querySelector("#ms-imdb-meta");
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * PAGE_SIZE;
    const slice = state.filtered.slice(start, start + PAGE_SIZE);

    meta.innerHTML = `
      <span><strong>${number(state.filtered.length)}</strong> matching loaded titles</span>
      <span><strong>${number(state.manifest.totalTitles)}</strong> total in snapshot</span>
      <span>${number(state.manifest.seriesTitles)} series · ${number(state.manifest.miniSeriesTitles)} mini-series</span>
      ${state.loaded ? '<span><strong>Archive fully loaded</strong></span>' : '<span>Still loading…</span>'}`;

    if (!slice.length) {
      list.innerHTML = `<div class="ms-imdb-empty">No matching titles in the ${state.loaded ? "archive" : "loaded portion yet"}.</div>`;
    } else {
      list.innerHTML = slice.map((record) => {
        const genres = Array.isArray(record[idx.genres]) ? record[idx.genres].join(" · ") : "";
        const rating = record[idx.rating] ? `${Number(record[idx.rating]).toFixed(1)} ★` : "No rating";
        const votes = record[idx.votes] ? `${number(record[idx.votes])} votes` : "0 votes";
        const runtime = record[idx.runtime] ? `${number(record[idx.runtime])} min` : "Runtime n/a";
        const original = record[idx.original] && record[idx.original] !== record[idx.title]
          ? `<div class="ms-imdb-original">${escapeHtml(record[idx.original])}</div>` : "";
        return `<article class="ms-imdb-row">
          <div class="ms-imdb-main">
            <div class="ms-imdb-name">${escapeHtml(record[idx.title])}${record[idx.adult] ? " · 18+ flag" : ""}</div>
            ${original}
            <div class="ms-imdb-genres">${escapeHtml(genres || "Genre n/a")} · ${escapeHtml(runtime)}</div>
          </div>
          <div class="ms-imdb-type ms-mobile-hide">${typeLabel(record[idx.type])}</div>
          <div>${escapeHtml(years(record))}</div>
          <div class="ms-imdb-rating ms-hide-mobile">${escapeHtml(rating)}<div class="ms-imdb-original">${escapeHtml(votes)}</div></div>
          <div class="ms-hide-mobile"><a class="ms-imdb-link" href="https://www.imdb.com/title/${encodeURIComponent(record[idx.id])}/" target="_blank" rel="noopener noreferrer">Open IMDb ↗</a><div class="ms-imdb-original">${escapeHtml(record[idx.id])}</div></div>
        </article>`;
      }).join("");
    }

    pages.innerHTML = `
      <button id="ms-imdb-prev" type="button" ${state.page <= 1 ? "disabled" : ""}>Previous</button>
      <span>Page ${number(state.page)} / ${number(totalPages)}</span>
      <button id="ms-imdb-next" type="button" ${state.page >= totalPages ? "disabled" : ""}>Next</button>`;
    pages.querySelector("#ms-imdb-prev").addEventListener("click", () => {
      if (state.page > 1) { state.page -= 1; renderResults(); document.querySelector("#ms-imdb-panel").scrollTo({ top: 0, behavior: "smooth" }); }
    });
    pages.querySelector("#ms-imdb-next").addEventListener("click", () => {
      if (state.page < totalPages) { state.page += 1; renderResults(); document.querySelector("#ms-imdb-panel").scrollTo({ top: 0, behavior: "smooth" }); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildShell, { once: true });
  } else {
    buildShell();
  }
})();
