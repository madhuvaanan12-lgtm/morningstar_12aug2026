#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const AUDIT_PATH = path.join(__dirname, "lesbian-gl-2026-08-18.json");
const REPORT_PATH = path.join(__dirname, "lesbian-gl-cover-audit-2026-08-18.json");
const FALLBACK_DIR = path.join(ROOT, "assets", "gl-covers");
const LOOKUP_DATE = "2026-08-18";
const USER_AGENT = "Morningstar/1.0 (Lesbian-GL cover completion; GitHub project)";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’‘`]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  const slug = normalize(value).replace(/\s+/g, "-").replace(/^-|-$/g, "");
  return slug || "untitled";
}

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapTitle(title, maxChars = 24, maxLines = 4) {
  const words = String(title || "Untitled").trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  const consumed = lines.join(" ").split(/\s+/).length;
  if (consumed < words.length && lines.length) lines[lines.length - 1] = `${lines[lines.length - 1].replace(/…$/, "")}…`;
  return lines.slice(0, maxLines);
}

function writeFallbackPoster(entry) {
  fs.mkdirSync(FALLBACK_DIR, { recursive: true });
  const filename = `${slugify(entry.title)}-${entry.year || "unknown"}.svg`;
  const absolute = path.join(FALLBACK_DIR, filename);
  const lines = wrapTitle(entry.title);
  const startY = 390 - (lines.length - 1) * 37;
  const titleSvg = lines
    .map((line, index) => `<text x="50%" y="${startY + index * 74}" text-anchor="middle" class="title">${xmlEscape(line)}</text>`)
    .join("\n  ");
  const meta = [entry.year || null, entry.country && entry.country !== "Unknown" ? entry.country : null].filter(Boolean).join(" · ") || "Morningstar archive";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
  <defs>
    <radialGradient id="g" cx="78%" cy="18%" r="75%"><stop offset="0" stop-color="#39ff14" stop-opacity=".25"/><stop offset=".58" stop-color="#101510" stop-opacity=".08"/><stop offset="1" stop-color="#050706"/></radialGradient>
    <linearGradient id="leaf" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#73ff5c"/><stop offset="1" stop-color="#147a18"/></linearGradient>
  </defs>
  <rect width="600" height="900" fill="#050706"/>
  <rect width="600" height="900" fill="url(#g)"/>
  <g opacity=".88" transform="translate(300 170)">
    <ellipse cx="0" cy="0" rx="105" ry="70" fill="url(#leaf)"/>
    <ellipse cx="-78" cy="18" rx="72" ry="48" fill="#39ff14" opacity=".45" transform="rotate(-28)"/>
    <ellipse cx="80" cy="20" rx="72" ry="48" fill="#39ff14" opacity=".45" transform="rotate(28)"/>
    <ellipse cx="0" cy="55" rx="78" ry="48" fill="#73ff5c" opacity=".55"/>
    <circle cx="0" cy="18" r="44" fill="#b7ff9f" opacity=".75"/>
  </g>
  <text x="50%" y="295" text-anchor="middle" fill="#73ff5c" font-family="Arial,sans-serif" font-size="20" font-weight="800" letter-spacing="5">LESBIAN / GL</text>
  ${titleSvg}
  <text x="50%" y="715" text-anchor="middle" fill="#9ca19b" font-family="Arial,sans-serif" font-size="20">${xmlEscape(meta)}</text>
  <line x1="120" x2="480" y1="755" y2="755" stroke="#39ff14" stroke-opacity=".35"/>
  <text x="50%" y="815" text-anchor="middle" fill="#f1f4ef" font-family="Arial,sans-serif" font-size="28" font-weight="900" letter-spacing="4">MORNINGSTAR</text>
  <text x="50%" y="850" text-anchor="middle" fill="#6d756c" font-family="Arial,sans-serif" font-size="14">archive cover fallback</text>
</svg>\n`;
  fs.writeFileSync(absolute, svg, "utf8");
  return `/assets/gl-covers/${filename}`;
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function tvmazeScore(entry, show) {
  if (!show || !show.image) return -Infinity;
  const wanted = normalize(entry.title);
  const got = normalize(show.name);
  let score = 0;
  if (got === wanted) score += 100;
  else if (got.includes(wanted) || wanted.includes(got)) score += 42;
  else return -Infinity;

  const premiereYear = show.premiered ? Number(String(show.premiered).slice(0, 4)) : null;
  if (entry.year && premiereYear) {
    const delta = Math.abs(Number(entry.year) - premiereYear);
    if (delta === 0) score += 35;
    else if (delta === 1) score += 14;
    else score -= 32;
  }

  const wantedCountry = normalize(entry.country);
  const gotCountry = normalize(show.network?.country?.name || show.webChannel?.country?.name || "");
  if (wantedCountry && wantedCountry !== "unknown" && gotCountry) {
    if (wantedCountry === gotCountry) score += 10;
    else score -= 5;
  }

  if (show.type === "Scripted" || show.type === "Animation") score += 5;
  return score;
}

async function lookupTvmaze(entry) {
  const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(entry.title)}`;
  const results = await getJson(url);
  const scored = (Array.isArray(results) ? results : [])
    .map((row) => ({ row, score: tvmazeScore(entry, row.show) }))
    .filter((x) => Number.isFinite(x.score))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 70) return null;
  const show = best.row.show;
  const image = show.image?.original || show.image?.medium;
  if (!image) return null;
  return {
    image,
    imageSourceName: "TVmaze",
    imageSourceUrl: show.url || url,
    imageMatchScore: best.score,
  };
}

function wikipediaScore(entry, page) {
  if (!page || !page.original?.source) return -Infinity;
  const wanted = normalize(entry.title);
  const title = normalize(page.title);
  let score = 0;
  if (title === wanted) score += 100;
  else if (title.startsWith(wanted + " ") || title.includes(wanted + " tv ") || title.includes(wanted + " series")) score += 72;
  else if (title.includes(wanted) && wanted.length >= 8) score += 48;
  else return -Infinity;
  if (/film|movie|album|song|novel|book/.test(title) && !/television|series|tv/.test(title)) score -= 60;
  return score;
}

async function lookupWikipedia(entry) {
  const query = `${entry.title} ${entry.year || ""} television series`.trim();
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=0&gsrlimit=6&gsrsearch=${encodeURIComponent(query)}&prop=pageimages|info&piprop=original&inprop=url&origin=*`;
  const data = await getJson(url);
  const pages = Object.values(data?.query?.pages || {});
  const scored = pages
    .map((page) => ({ page, score: wikipediaScore(entry, page) }))
    .filter((x) => Number.isFinite(x.score))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best || best.score < 70) return null;
  return {
    image: best.page.original.source,
    imageSourceName: "Wikipedia / Wikimedia Commons",
    imageSourceUrl: best.page.fullurl || `https://en.wikipedia.org/?curid=${best.page.pageid}`,
    imageMatchScore: best.score,
  };
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf8"));
  if (!Array.isArray(audit.archiveEntries)) throw new Error("archiveEntries missing from Lesbian / GL audit");

  const targets = audit.archiveEntries.filter((entry) => Object.prototype.hasOwnProperty.call(entry, "image") && !String(entry.image || "").trim());
  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    lookupDate: LOOKUP_DATE,
    archiveTitles: audit.archiveEntries.length,
    blankImagesBefore: targets.length,
    tvmazeResolved: 0,
    wikipediaResolved: 0,
    generatedFallbacks: 0,
    blankImagesAfter: null,
    resolved: [],
    fallbacks: [],
  };

  console.log(`Found ${targets.length} Lesbian / GL archive entries with blank image fields.`);

  for (let index = 0; index < targets.length; index += 1) {
    const entry = targets[index];
    let found = null;
    try {
      found = await lookupTvmaze(entry);
    } catch (error) {
      console.warn(`TVmaze lookup failed for ${entry.title}: ${error.message}`);
    }

    if (found) {
      Object.assign(entry, found, { imageLookupDate: LOOKUP_DATE });
      report.tvmazeResolved += 1;
      report.resolved.push({ id: entry.id, title: entry.title, year: entry.year, source: "TVmaze", image: entry.image, sourceUrl: entry.imageSourceUrl, score: entry.imageMatchScore });
    }

    if ((index + 1) % 15 === 0 && index + 1 < targets.length) {
      console.log(`TVmaze progress ${index + 1}/${targets.length}; respecting API rate limit…`);
      await sleep(10500);
    } else {
      await sleep(120);
    }
  }

  const unresolvedAfterTvmaze = targets.filter((entry) => !String(entry.image || "").trim());
  console.log(`${unresolvedAfterTvmaze.length} still unresolved after TVmaze; trying Wikipedia/Wikimedia conservatively.`);

  for (let index = 0; index < unresolvedAfterTvmaze.length; index += 1) {
    const entry = unresolvedAfterTvmaze[index];
    let found = null;
    try {
      found = await lookupWikipedia(entry);
    } catch (error) {
      console.warn(`Wikipedia lookup failed for ${entry.title}: ${error.message}`);
    }
    if (found) {
      Object.assign(entry, found, { imageLookupDate: LOOKUP_DATE });
      report.wikipediaResolved += 1;
      report.resolved.push({ id: entry.id, title: entry.title, year: entry.year, source: found.imageSourceName, image: entry.image, sourceUrl: entry.imageSourceUrl, score: entry.imageMatchScore });
    }
    await sleep(180);
  }

  for (const entry of targets) {
    if (String(entry.image || "").trim()) continue;
    const image = writeFallbackPoster(entry);
    Object.assign(entry, {
      image,
      imageSourceName: "Morningstar generated fallback",
      imageSourceUrl: "local asset",
      imageLookupDate: LOOKUP_DATE,
      imageMatchScore: null,
    });
    report.generatedFallbacks += 1;
    report.fallbacks.push({ id: entry.id, title: entry.title, year: entry.year, image });
  }

  report.blankImagesAfter = audit.archiveEntries.filter((entry) => Object.prototype.hasOwnProperty.call(entry, "image") && !String(entry.image || "").trim()).length;
  audit.coverAudit = {
    generatedAt: report.generatedAt,
    blankImagesBefore: report.blankImagesBefore,
    realPostersResolved: report.tvmazeResolved + report.wikipediaResolved,
    generatedFallbacks: report.generatedFallbacks,
    blankImagesAfter: report.blankImagesAfter,
    report: "research/lesbian-gl-cover-audit-2026-08-18.json",
  };

  fs.writeFileSync(AUDIT_PATH, JSON.stringify(audit, null, 2) + "\n", "utf8");
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + "\n", "utf8");

  execFileSync(process.execPath, [path.join(__dirname, "build-lesbian-gl-genre.js")], {
    cwd: ROOT,
    stdio: "inherit",
  });

  if (report.blankImagesAfter !== 0) throw new Error(`Cover completion failed: ${report.blankImagesAfter} blank image fields remain.`);

  console.log(`Cover completion finished: ${report.tvmazeResolved} TVmaze, ${report.wikipediaResolved} Wikipedia/Wikimedia, ${report.generatedFallbacks} branded fallbacks; 0 blank images remain.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
