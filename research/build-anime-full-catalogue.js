/* Merges 5,649-anime full catalogue into Morningstar payload and re-chunks data files. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");
const RESEARCH_PATH = path.join(__dirname, "anime-full-catalogue-20260819.json");
const CATALOGUE_TAG = "Full Anime Catalogue";

const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));
const data = JSON.parse(
  manifest.parts.map((part) => fs.readFileSync(path.join(DATA_DIR, part), "utf8")).join("")
);
const research = JSON.parse(fs.readFileSync(RESEARCH_PATH, "utf8"));

console.log(`Loaded existing catalogue: ${data.catalogue.shows.length} titles`);
console.log(`Loading research: ${research.anime.length} new anime`);

if (research.anime.length !== 5649) {
  throw new Error(`Expected 5,649 anime, found ${research.anime.length}`);
}

// Build ID index for existing catalogue
const byMalId = new Map();
const byAnilistId = new Map();
const byTitle = new Map();

for (const show of data.catalogue.shows) {
  if (show.malId) byMalId.set(show.malId, show);
  if (show.anilistId) byAnilistId.set(show.anilistId, show);
  const normalized = normalize(show.title);
  if (!byTitle.has(normalized)) byTitle.set(normalized, []);
  byTitle.get(normalized).push(show);
}

function normalize(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const dedupeLog = [];
const newShows = [];
let matched = 0;
let added = 0;

for (const anime of research.anime) {
  // Try exact matches first
  let existing = byMalId.get(anime.mal_id);
  if (existing) {
    dedupeLog.push({
      title: anime.title,
      mal_id: anime.mal_id,
      reason: "mal_id_exact",
      existing_id: existing.id,
    });
    matched++;
    continue;
  }

  if (anime.anilist_id) {
    existing = byAnilistId.get(anime.anilist_id);
    if (existing) {
      dedupeLog.push({
        title: anime.title,
        anilist_id: anime.anilist_id,
        reason: "anilist_id_exact",
        existing_id: existing.id,
      });
      matched++;
      continue;
    }
  }

  // Create new show
  const show = {
    id: `anilist-${anime.anilist_id}` || `mal-${anime.mal_id}`,
    title: anime.title,
    originalTitle: anime.title,
    year: null,
    endYear: null,
    episodes: anime.episodes,
    episodeRuntime: Math.round(anime.duration_seconds / 60),
    runtimeHours: anime.total_hours,
    genres: ["Anime"],
    country: null,
    language: null,
    format: "Anime",
    imdbId: null,
    imdbUrl: null,
    image: anime.cover_image,
    shortPlot: "",
    longPlot: "",
    status: "Ended",
    sourceName: "AniList",
    sourceUrl: anime.anilist_id ? `https://anilist.co/anime/${anime.anilist_id}` : null,
    watched: false,
    imdbRating: null,
    imdbVotes: 0,
    qualityScore: null,
    rank: null,
    featured: false,
    curslickExclusive: false,
    malId: anime.mal_id,
    anilistId: anime.anilist_id,
    animeRuntimeHours: anime.total_hours,
    animeEpisodesOrParts: anime.episodes,
    animeEndedVerified: true,
    animeSnapshotDate: "2026-08-19",
  };

  // Merge with existing if by title+year (as fallback dedup)
  const titleKey = normalize(show.title);
  if (byTitle.has(titleKey)) {
    const candidates = byTitle.get(titleKey).filter((s) => {
      const yearDiff = Math.abs((s.year || 2000) - (show.year || 2000));
      return yearDiff <= 1;
    });
    if (candidates.length > 0) {
      dedupeLog.push({
        title: anime.title,
        mal_id: anime.mal_id,
        reason: "title_year_fuzzy",
        existing_id: candidates[0].id,
      });
      matched++;
      continue;
    }
  }

  // New title
  newShows.push(show);
  byMalId.set(anime.mal_id, show);
  if (anime.anilist_id) byAnilistId.set(anime.anilist_id, show);
  added++;
}

console.log(`Deduplication results:`);
console.log(`  Matched to existing: ${matched}`);
console.log(`  New titles to add: ${added}`);

if (added === 0) {
  throw new Error("No new titles to add (all deduplicated)");
}

// Add genre tag to all new shows
for (const show of newShows) {
  show.genres = Array.from(new Set([...show.genres, CATALOGUE_TAG]));
}

// Append to catalogue
data.catalogue.shows = [...data.catalogue.shows, ...newShows];
data.curslick.generatedAt = new Date().toISOString();

// Update research metadata
if (!data.catalogue.animeFullCatalogueResearch) {
  data.catalogue.animeFullCatalogueResearch = {};
}
data.catalogue.animeFullCatalogueResearch = {
  total: research.anime.length,
  snapshotUpdatedAt: research.snapshot_date,
  matchedExistingTitles: matched,
  newCatalogueTitles: added,
  missingCovers: research.anime.filter((a) => a.cover_source === "placeholder").length,
  sourceHash: research.source_hashes,
};

// Chunk and save
const serialized = JSON.stringify(data);
JSON.parse(serialized);
const PART_SIZE = 600000;
const chunks = [];
for (let offset = 0; offset < serialized.length; offset += PART_SIZE) {
  chunks.push(serialized.slice(offset, offset + PART_SIZE));
}

// Remove old parts
for (const oldPart of manifest.parts) {
  fs.unlinkSync(path.join(DATA_DIR, oldPart));
}

// Write new parts
const parts = chunks.map((chunk, index) => {
  const hash = crypto.createHash("sha256").update(chunk).digest("hex").slice(0, 12);
  const name = `morningstar-data-${String(index + 1).padStart(2, "0")}-${hash}.txt`;
  fs.writeFileSync(path.join(DATA_DIR, name), chunk);
  return name;
});

// Update manifest
const nextManifest = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  catalogueTitles: data.catalogue.shows.length,
  curslickCollections: data.curslick.collections.length,
  animeFullCatalogueTitles: research.anime.length,
  animeFullCatalogueMatchedExisting: matched,
  animeFullCatalogueNewTitles: added,
  dataSha256: crypto.createHash("sha256").update(serialized).digest("hex"),
  dataBytes: Buffer.byteLength(serialized),
  parts,
};

fs.writeFileSync(
  path.join(DATA_DIR, "manifest.json"),
  JSON.stringify(nextManifest, null, 2) + "\n"
);

// Log deduplication details
const dedupeByReason = {};
for (const log of dedupeLog) {
  dedupeByReason[log.reason] = (dedupeByReason[log.reason] || 0) + 1;
}

console.log(`Deduplication by reason:`);
for (const [reason, count] of Object.entries(dedupeByReason)) {
  console.log(`  ${reason}: ${count}`);
}

console.log(`\nPayload updated:`);
console.log(`  Total catalogue titles: ${data.catalogue.shows.length}`);
console.log(`  Data parts: ${parts.length} (${nextManifest.dataBytes.toLocaleString()} bytes)`);
console.log(`  SHA256: ${nextManifest.dataSha256}`);
console.log(`\n✓ Manifest saved: ${path.join(DATA_DIR, "manifest.json")}`);
