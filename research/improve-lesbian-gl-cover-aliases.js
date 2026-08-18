#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const AUDIT_PATH = path.join(__dirname, "lesbian-gl-2026-08-18.json");
const REPORT_PATH = path.join(__dirname, "lesbian-gl-cover-audit-2026-08-18.json");
const LOOKUP_DATE = "2026-08-18";
const USER_AGENT = "Morningstar/1.0 (Lesbian-GL alias cover completion; GitHub project)";

const ALIASES = {
  "Agents of S.H.I.E.L.D.": ["Marvel's Agents of S.H.I.E.L.D."],
  "Arcane": ["Arcane: League of Legends"],
  "Back to 15": ["De Volta aos 15"],
  "Black Dove": ["Black Doves"],
  "Bob Loves Abishola": ["Bob Hearts Abishola"],
  "Criminal Minds: Evolution": ["Criminal Minds"],
  "Interview with a Vampire": ["Interview with the Vampire"],
  "My Marvelous Dream is You": ["My Marvellous Dream Is You"],
  "Neighbours: A New Chapter": ["Neighbours"],
  "No Traces (Sin Huellas)": ["Sin Huellas", "No Traces"],
  "Only Murders in the Buildling": ["Only Murders in the Building"],
  "Pretty Little Liars: Original Sin": ["Pretty Little Liars: Original Sin", "Pretty Little Liars"],
  "Santuary: A Witch's Tale": ["Sanctuary: A Witch's Tale"],
  "Special Ops: Lioness": ["Lioness"],
  "The Art of Joy": ["L'arte della gioia"],
  "The Most Beautiful Flower": ["La flor más bella"],
  "Três Graças (Three Graces)": ["Três Graças"],
  "Welcome to Eden": ["Bienvenidos a Edén"],
};

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

async function getJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

function scoreShow(entry, queryTitle, show) {
  if (!show?.image) return -Infinity;
  const wanted = normalize(queryTitle);
  const got = normalize(show.name);
  let score = 0;
  if (got === wanted) score += 100;
  else if (wanted.length >= 6 && (got.startsWith(wanted + " ") || wanted.startsWith(got + " "))) score += 76;
  else if (wanted.length >= 10 && (got.includes(wanted) || wanted.includes(got))) score += 58;
  else return -Infinity;

  const premiereYear = show.premiered ? Number(String(show.premiered).slice(0, 4)) : null;
  if (entry.year && premiereYear) {
    const delta = Math.abs(Number(entry.year) - premiereYear);
    if (delta === 0) score += 35;
    else if (delta === 1) score += 14;
    else if (delta <= 2) score += 3;
    else score -= 40;
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

async function lookup(entry) {
  const queries = [...new Set([entry.title, ...(ALIASES[entry.title] || [])])];
  let best = null;
  for (const queryTitle of queries) {
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(queryTitle)}`;
    let results;
    try {
      results = await getJson(url);
    } catch (error) {
      console.warn(`TVmaze failed for ${entry.title} via ${queryTitle}: ${error.message}`);
      continue;
    }
    for (const row of Array.isArray(results) ? results : []) {
      const score = scoreShow(entry, queryTitle, row.show);
      if (!Number.isFinite(score)) continue;
      if (!best || score > best.score) best = { score, show: row.show, queryTitle, url };
    }
    await sleep(130);
  }
  if (!best || best.score < 80) return null;
  const image = best.show.image?.original || best.show.image?.medium;
  if (!image) return null;
  return {
    image,
    imageSourceName: "TVmaze",
    imageSourceUrl: best.show.url || best.url,
    imageLookupDate: LOOKUP_DATE,
    imageLookupAlias: best.queryTitle === entry.title ? null : best.queryTitle,
    imageMatchScore: best.score,
  };
}

function removeOldFallback(image) {
  if (!String(image || "").startsWith("/assets/gl-covers/")) return;
  const file = path.join(ROOT, image.replace(/^\//, ""));
  fs.rmSync(file, { force: true });
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf8"));
  const oldReport = fs.existsSync(REPORT_PATH) ? JSON.parse(fs.readFileSync(REPORT_PATH, "utf8")) : {};
  const entries = audit.archiveEntries || [];
  const targets = entries.filter((entry) =>
    entry.imageSourceName === "Morningstar generated fallback" ||
    entry.imageSourceName === "Wikipedia / Wikimedia Commons"
  );

  let upgradedFallbacks = 0;
  let upgradedWikipedia = 0;
  const upgrades = [];
  console.log(`Rechecking ${targets.length} fallback/Wikipedia covers with corrected title aliases.`);

  for (let index = 0; index < targets.length; index += 1) {
    const entry = targets[index];
    const beforeSource = entry.imageSourceName;
    const beforeImage = entry.image;
    const found = await lookup(entry);
    if (found) {
      if (beforeSource === "Morningstar generated fallback") upgradedFallbacks += 1;
      if (beforeSource === "Wikipedia / Wikimedia Commons") upgradedWikipedia += 1;
      removeOldFallback(beforeImage);
      Object.assign(entry, found);
      upgrades.push({
        id: entry.id,
        title: entry.title,
        year: entry.year,
        previousSource: beforeSource,
        source: "TVmaze",
        alias: found.imageLookupAlias,
        image: found.image,
        sourceUrl: found.imageSourceUrl,
        score: found.imageMatchScore,
      });
    }

    if ((index + 1) % 15 === 0 && index + 1 < targets.length) await sleep(10500);
  }

  const fallbackEntries = entries.filter((entry) => entry.imageSourceName === "Morningstar generated fallback");
  const wikipediaEntries = entries.filter((entry) => entry.imageSourceName === "Wikipedia / Wikimedia Commons");
  const tvmazeEntries = entries.filter((entry) => entry.imageLookupDate === LOOKUP_DATE && entry.imageSourceName === "TVmaze");
  const blanks = entries.filter((entry) => Object.prototype.hasOwnProperty.call(entry, "image") && !String(entry.image || "").trim());

  const report = {
    ...oldReport,
    generatedAt: new Date().toISOString(),
    archiveTitles: entries.length,
    blankImagesBefore: oldReport.blankImagesBefore ?? 277,
    tvmazeResolved: tvmazeEntries.length,
    wikipediaResolved: wikipediaEntries.length,
    generatedFallbacks: fallbackEntries.length,
    blankImagesAfter: blanks.length,
    improvementPass: {
      date: LOOKUP_DATE,
      targetedFallbackOrWikipediaCovers: targets.length,
      upgradedFallbacksToRealPosters: upgradedFallbacks,
      upgradedWikipediaToRealPosters: upgradedWikipedia,
      upgradedTotal: upgrades.length,
      remainingGeneratedFallbacks: fallbackEntries.length,
      remainingWikipediaImages: wikipediaEntries.length,
      upgrades,
    },
    fallbacks: fallbackEntries.map((entry) => ({ id: entry.id, title: entry.title, year: entry.year, image: entry.image })),
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
  if (blanks.length) throw new Error(`${blanks.length} GL image fields are blank after alias improvement.`);

  console.log(`Alias pass upgraded ${upgrades.length} covers. Remaining: ${fallbackEntries.length} generated fallbacks, ${wikipediaEntries.length} Wikipedia images, 0 blanks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
