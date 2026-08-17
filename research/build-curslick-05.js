/* Builds Curslick collection 05: Top 1,000 finished anime under 60 hours. */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");
const RESEARCH_PATH = path.join(__dirname, "anime-top-1000-2026-08-16.json");
const APP_PATH = path.join(REPO, "app.js");
const COLLECTION_ID = "top-1000-finished-anime-under-60-hours";
const TAG = "Top 1000 Anime";
const SNAPSHOT_LABEL = "16 Aug 2026";

const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));
const data = JSON.parse(
  manifest.parts.map((part) => fs.readFileSync(path.join(DATA_DIR, part), "utf8")).join(""),
);
const research = JSON.parse(fs.readFileSync(RESEARCH_PATH, "utf8"));

if (research.titles.length !== 1000) {
  throw new Error(`Expected 1,000 researched anime, found ${research.titles.length}`);
}

function normalize(value, relaxed = false) {
  let result = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ");
  if (relaxed) {
    result = result
      .replace(/\((?:19|20)\d{2}\)/g, " ")
      .replace(/\b(?:season|series|cour|part)\s*(?:one|1|i)\b/g, " ")
      .replace(/\bthe animation\b/g, " ")
      .replace(/\btv\b/g, " ");
  }
  return result.replace(/[^a-z0-9]+/g, " ").trim();
}

function addTag(show) {
  show.genres = Array.from(new Set([...(show.genres || []), "Anime", TAG]));
}

function attachAnimeAudit(show, item, synchronizeDisplay = false) {
  addTag(show);
  if (synchronizeDisplay) {
    Object.assign(show, {
      year: item.year,
      endYear: item.endYear,
      episodes: item.episodesOrParts,
      episodeRuntime: item.typicalEpisodeMinutes,
      runtimeHours: item.runtimeHours,
      status: "Ended",
    });
  }
  Object.assign(show, {
    animeRank: item.position,
    animeScore: item.score10,
    animePopularity: item.popularity,
    animeRuntimeHours: item.runtimeHours,
    animeEpisodesOrParts: item.episodesOrParts,
    animeMainlineEntryCount: item.mainlineEntryCount,
    animeEndedVerified: true,
    animeSnapshotDate: research.snapshotUpdatedAt.slice(0, 10),
    anilistId: item.anilistId,
    anilistUrl: item.sourceUrl,
  });
}

const existingLocations = [
  ...data.catalogue.shows.map((show) => ({ show, shelf: "catalogue" })),
  ...data.catalogue.watchedArchive.map((show) => ({ show, shelf: "watched" })),
].filter(({ show }) => ["Anime", "Animation"].includes(show.format));

const usedExistingIds = new Set();
const matchLog = [];

function findExisting(item) {
  const strictAliases = new Set(item.aliases.map((alias) => normalize(alias)).filter(Boolean));
  const relaxedAliases = new Set(
    item.aliases.map((alias) => normalize(alias, true)).filter((alias) => alias.length >= 4),
  );
  const candidates = existingLocations
    .filter(({ show }) => !usedExistingIds.has(show.id))
    .map((location) => {
      const names = [location.show.title, location.show.originalTitle].filter(Boolean);
      const strict = names.some((name) => strictAliases.has(normalize(name)));
      const relaxed = names.some((name) => relaxedAliases.has(normalize(name, true)));
      const yearDifference = Math.abs(Number(location.show.year || 0) - Number(item.year || 0));
      if ((!strict && !relaxed) || yearDifference > 2) return null;
      return {
        ...location,
        score: (strict ? 100 : 70) - yearDifference * 8 + (location.show.format === "Anime" ? 3 : 0),
        yearDifference,
      };
    })
    .filter(Boolean)
    .sort((left, right) =>
      right.score - left.score ||
      left.yearDifference - right.yearDifference ||
      (left.show.rank || 99999) - (right.show.rank || 99999),
    );
  if (!candidates.length || candidates[0].score < 60) return null;
  return candidates[0];
}

function imdbFindUrl(item) {
  const query = encodeURIComponent(`${item.title} ${item.year || ""}`.trim());
  return `https://www.imdb.com/find/?q=${query}&s=tt&ttype=tv`;
}

function newAnimeShow(item) {
  const show = {
    id: `anilist-${item.anilistId}`,
    title: item.title,
    originalTitle: item.originalTitle || item.title,
    year: item.year,
    endYear: item.endYear,
    episodes: item.episodesOrParts,
    episodeRuntime: item.typicalEpisodeMinutes,
    runtimeHours: item.runtimeHours,
    genres: [...item.genres],
    country: "Japan",
    language: "Japanese",
    format: "Anime",
    imdbId: null,
    imdbUrl: imdbFindUrl(item),
    image: item.image,
    shortPlot: item.shortPlot,
    longPlot: item.longPlot,
    status: "Ended",
    sourceName: "AniList",
    sourceUrl: item.sourceUrl,
    watched: false,
    imdbRating: null,
    imdbVotes: 0,
    qualityScore: null,
    rank: null,
    featured: false,
    curslickExclusive: true,
  };
  attachAnimeAudit(show, item);
  return show;
}

function completionWhy(item) {
  const unit = item.mainlineEntryCount === 1 ? "mainline entry" : "linked mainline entries";
  const parts = item.episodesOrParts === 1 ? "episode or part" : "episodes or parts";
  return (
    `AniList records all ${item.mainlineEntryCount} ${unit} as FINISHED with complete end dates: ` +
    `${item.episodesOrParts} ${parts}, ${item.runtimeHours.toFixed(1)} total hours. ` +
    `No linked PREQUEL or SEQUEL is releasing, cancelled, or missing from the ${SNAPSHOT_LABEL} snapshot.`
  );
}

const entries = research.titles.map((item) => {
  if (item.status !== "FINISHED" || item.runtimeMinutes >= 3600) {
    throw new Error(`Eligibility regression at #${item.position}: ${item.title}`);
  }
  const match = findExisting(item);
  const entry = {
    position: item.position,
    label: `Anime quality rank · ${item.score10.toFixed(2)}/10 AniList`,
    matchTags: [
      `${item.runtimeHours.toFixed(1)} hours`,
      `${item.mainlineEntryCount} finished mainline ${item.mainlineEntryCount === 1 ? "entry" : "entries"}`,
      item.formats.join(" + "),
    ],
    why: completionWhy(item),
    placementNote:
      `Ranked #${item.position} by the franchise's popularity-weighted AniList score; ` +
      "popularity and AniList ID break ties.",
  };
  if (match) {
    usedExistingIds.add(match.show.id);
    attachAnimeAudit(match.show, item, true);
    matchLog.push({ position: item.position, title: item.title, showId: match.show.id, shelf: match.shelf });
    entry.showId = match.show.id;
  } else {
    entry.show = newAnimeShow(item);
  }
  return entry;
});

const collection = {
  id: COLLECTION_ID,
  number: "05",
  title: "Top 1,000 finished anime under 60 hours",
  shortTitle: "Anime 1000",
  referenceTitle: "AniList finished anime",
  referenceYear: 2026,
  summary:
    "One thousand Japanese anime series ranked at franchise level. Linked prequels and sequels are counted together; every currently catalogued mainline installment must be finished, fully dated and under 60 combined hours.",
  matchingStandard:
    "Japanese-origin TV, TV Short or ONA animation with at least two episodes; PREQUEL/SEQUEL-linked movies, OVAs and specials count toward the same franchise runtime; every linked mainline entry must be FINISHED with a complete end date; no linked entry may be releasing, upcoming, cancelled or absent from the source snapshot; combined runtime must be strictly below 60 hours; adult titles and non-animation catalogue anomalies are excluded.",
  researchNote:
    `The ${research.source.inputRows.toLocaleString()}-row combined AniList snapshot was updated 16 August 2026. It produced ${research.audit.sequenceComponents.toLocaleString()} prequel/sequel components and ${research.audit.eligibleBeforeRankingCut.toLocaleString()} eligible franchises before the quality cut. Ranking uses the square-root of installment popularity to weight AniList mean scores, then weighted average score, peak popularity and AniList ID as tie-breakers. This verifies the catalogue state at the snapshot date; a sequel announced later can change eligibility.`,
  sources: [
    {
      label: "AniList Anime Dataset — 16 August 2026 snapshot",
      url: research.source.url,
    },
    {
      label: "AniList dataset collector and field definitions",
      url: research.source.collectorRepository,
    },
    {
      label: "Daily AniList 2026 supplement",
      url: research.source.supplement.source.url,
    },
    {
      label: "AniList relation supplement proxy",
      url: research.source.supplement.relationsSource.repository,
    },
    {
      label: "AniList anime catalogue",
      url: "https://anilist.co/search/anime",
    },
    {
      label: "Morningstar anime methodology and audit",
      url: "/research/anime-top-1000-methodology.md",
    },
  ],
  entries,
};

data.curslick.collections = data.curslick.collections.filter((item) => item.id !== COLLECTION_ID);
data.curslick.collections.push(collection);
data.curslick.collections.sort((left, right) => Number(left.number) - Number(right.number));
data.curslick.generatedAt = new Date().toISOString();
data.catalogue.animeResearch = {
  collectionId: COLLECTION_ID,
  total: 1000,
  snapshotUpdatedAt: research.snapshotUpdatedAt,
  source: research.source.url,
  rule: collection.matchingStandard,
  eligibleBeforeRankingCut: research.audit.eligibleBeforeRankingCut,
  matchedExistingTitles: matchLog.length,
  newCatalogueTitles: entries.length - matchLog.length,
};

const knownIds = new Set([
  ...data.catalogue.shows.map((show) => show.id),
  ...data.catalogue.watchedArchive.map((show) => show.id),
  ...data.kDramaArchive.shows.map((show) => show.id),
]);
const unresolved = collection.entries.filter((entry) => entry.showId && !knownIds.has(entry.showId));
if (unresolved.length) {
  throw new Error(`Unresolved showIds: ${unresolved.map((entry) => entry.showId).join(", ")}`);
}
const collectionIds = collection.entries.map((entry) => entry.showId || entry.show.id);
if (new Set(collectionIds).size !== 1000) throw new Error("Duplicate shows in Anime 1000 collection");
if (collection.entries.some((entry) => entry.show && !entry.show.image)) {
  throw new Error("Anime 1000 contains a title without a poster URL");
}

/* The existing bundle had a collection-specific placement sentence and no
   non-IMDb rating fallback. These exact, idempotent bundle patches keep the
   source app intact while making data-driven Curslick entries read correctly. */
let app = fs.readFileSync(APP_PATH, "utf8");
const appPatches = [
  {
    old: '(0,p.jsxs)("span",{children:["Placed #",t.position," by premise similarity, not by the global quality rank."]})',
    next: '(0,p.jsx)("span",{children:t.placementNote||["Placed #",t.position," by premise similarity, not by the global quality rank."]})',
    marker: "children:t.placementNote||",
  },
  {
    old: 'children:e.imdbRating?`${e.imdbRating.toFixed(1)} IMDb`:"Ranked series"',
    next: 'children:e.imdbRating?`${e.imdbRating.toFixed(1)} IMDb`:e.animeScore?`${e.animeScore.toFixed(1)} AniList`:"Ranked series"',
    marker: ':e.animeScore?`${e.animeScore.toFixed(1)} AniList`',
  },
  {
    old: 'e.imdbRating?` · ${e.imdbRating.toFixed(1)} IMDb`:""',
    next: 'e.imdbRating?` · ${e.imdbRating.toFixed(1)} IMDb`:e.animeScore?` · ${e.animeScore.toFixed(1)} AniList`:""',
    marker: ':e.animeScore?` · ${e.animeScore.toFixed(1)} AniList`',
  },
];
for (const patch of appPatches) {
  if (app.includes(patch.old)) app = app.replace(patch.old, patch.next);
  else if (!app.includes(patch.marker)) throw new Error(`Could not patch app bundle: ${patch.old}`);
}
fs.writeFileSync(APP_PATH, app);

const serialized = JSON.stringify(data);
JSON.parse(serialized);
const PART_SIZE = 600000;
const chunks = [];
for (let offset = 0; offset < serialized.length; offset += PART_SIZE) {
  chunks.push(serialized.slice(offset, offset + PART_SIZE));
}
for (const oldPart of manifest.parts) fs.unlinkSync(path.join(DATA_DIR, oldPart));
const parts = chunks.map((chunk, index) => {
  const hash = crypto.createHash("sha256").update(chunk).digest("hex").slice(0, 12);
  const name = `morningstar-data-${String(index + 1).padStart(2, "0")}-${hash}.txt`;
  fs.writeFileSync(path.join(DATA_DIR, name), chunk);
  return name;
});

const nextManifest = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  curslickCollections: data.curslick.collections.length,
  animeTopTitles: 1000,
  animeMatchedExistingTitles: matchLog.length,
  animeNewCatalogueTitles: entries.length - matchLog.length,
  dataSha256: crypto.createHash("sha256").update(serialized).digest("hex"),
  dataBytes: Buffer.byteLength(serialized),
  parts,
};
fs.writeFileSync(
  path.join(DATA_DIR, "manifest.json"),
  JSON.stringify(nextManifest, null, 2) + "\n",
);

console.log(
  "collections:",
  data.curslick.collections
    .map((item) => `${item.number} ${item.shortTitle} (${item.entries.length})`)
    .join(" | "),
);
console.log("Anime 1000 matched existing:", matchLog.length);
console.log("Anime 1000 new catalogue titles:", entries.length - matchLog.length);
console.log("parts:", parts.length, "bytes:", nextManifest.dataBytes);
