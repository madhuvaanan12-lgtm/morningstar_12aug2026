#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const AUDIT_PATH = path.join(__dirname, "lesbian-gl-2026-08-18.json");
const REPORT_PATH = path.join(__dirname, "lesbian-gl-cover-audit-2026-08-18.json");
const LOOKUP_DATE = "2026-08-18";
const USER_AGENT = "Morningstar/1.0 (Lesbian-GL final cover aliases; GitHub project)";

const ALIASES = {
  "Bob Loves Abishola": ["Bob ♥ Abishola", "Bob Abishola"],
  "Interview with a Vampire": ["Anne Rice's Interview with the Vampire"],
  "Land of Women": ["Tierra de Mujeres"],
  "Shelter": ["Harlan Coben's Shelter"],
};

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[’‘`]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function getJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function score(entry, query, show) {
  if (!show?.image) return -Infinity;
  const wanted = normalize(query);
  const got = normalize(show.name);
  let value = got === wanted ? 100 : (got.includes(wanted) || wanted.includes(got)) && wanted.length >= 8 ? 72 : -Infinity;
  if (!Number.isFinite(value)) return value;
  const showYear = show.premiered ? Number(String(show.premiered).slice(0, 4)) : null;
  if (entry.year && showYear) {
    const delta = Math.abs(Number(entry.year) - showYear);
    if (delta === 0) value += 35;
    else if (delta === 1) value += 12;
    else if (delta > 2) value -= 40;
  }
  if (show.type === "Scripted" || show.type === "Animation") value += 5;
  return value;
}

async function lookup(entry) {
  let best = null;
  for (const query of ALIASES[entry.title] || []) {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    let rows = [];
    try { rows = await getJson(url); } catch (error) { console.warn(`${entry.title}: ${error.message}`); }
    for (const row of Array.isArray(rows) ? rows : []) {
      const value = score(entry, query, row.show);
      if (Number.isFinite(value) && (!best || value > best.score)) best = { score: value, show: row.show, query, url };
    }
  }
  if (!best || best.score < 80) return null;
  return {
    image: best.show.image.original || best.show.image.medium,
    imageSourceName: "TVmaze",
    imageSourceUrl: best.show.url || best.url,
    imageLookupDate: LOOKUP_DATE,
    imageLookupAlias: best.query,
    imageMatchScore: best.score,
  };
}

function removeFallback(image) {
  if (!String(image || "").startsWith("/assets/gl-covers/")) return;
  fs.rmSync(path.join(ROOT, image.replace(/^\//, "")), { force: true });
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf8"));
  const oldReport = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  const entries = audit.archiveEntries || [];
  const targets = entries.filter((entry) => entry.imageSourceName === "Morningstar generated fallback" && ALIASES[entry.title]);
  const upgrades = [];

  for (const entry of targets) {
    const found = await lookup(entry);
    if (!found) continue;
    const previousImage = entry.image;
    removeFallback(previousImage);
    Object.assign(entry, found);
    upgrades.push({
      id: entry.id,
      title: entry.title,
      year: entry.year,
      alias: found.imageLookupAlias,
      image: found.image,
      sourceUrl: found.imageSourceUrl,
      score: found.imageMatchScore,
    });
  }

  const fallbacks = entries.filter((entry) => entry.imageSourceName === "Morningstar generated fallback");
  const wikipedia = entries.filter((entry) => entry.imageSourceName === "Wikipedia / Wikimedia Commons");
  const tvmaze = entries.filter((entry) => entry.imageLookupDate === LOOKUP_DATE && entry.imageSourceName === "TVmaze");
  const blanks = entries.filter((entry) => Object.prototype.hasOwnProperty.call(entry, "image") && !String(entry.image || "").trim());
  const resolved = entries
    .filter((entry) => entry.imageLookupDate === LOOKUP_DATE && entry.imageSourceName && entry.imageSourceName !== "Morningstar generated fallback")
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      year: entry.year,
      source: entry.imageSourceName,
      image: entry.image,
      sourceUrl: entry.imageSourceUrl,
      score: entry.imageMatchScore,
      alias: entry.imageLookupAlias || null,
    }));

  const report = {
    ...oldReport,
    generatedAt: new Date().toISOString(),
    archiveTitles: entries.length,
    blankImagesBefore: oldReport.blankImagesBefore || 277,
    tvmazeResolved: tvmaze.length,
    wikipediaResolved: wikipedia.length,
    generatedFallbacks: fallbacks.length,
    blankImagesAfter: blanks.length,
    resolved,
    fallbacks: fallbacks.map((entry) => ({ id: entry.id, title: entry.title, year: entry.year, image: entry.image })),
    finalAliasPass: {
      date: LOOKUP_DATE,
      targeted: targets.length,
      upgraded: upgrades.length,
      upgrades,
      remainingGeneratedFallbacks: fallbacks.length,
    },
  };

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
  execFileSync(process.execPath, [path.join(__dirname, "build-lesbian-gl-genre.js")], { cwd: ROOT, stdio: "inherit" });
  if (blanks.length) throw new Error(`${blanks.length} explicit GL image fields remain blank.`);
  console.log(`Final alias pass: ${upgrades.length}/${targets.length} upgraded; ${fallbacks.length} trustworthy local fallbacks remain; 0 blanks.`);
}

main().catch((error) => { console.error(error); process.exit(1); });
