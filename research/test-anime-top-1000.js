/* Integrity test for the generated Anime 1000 catalogue and static payload. */
const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");
const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));
const serialized = manifest.parts
  .map((part) => {
    const partPath = path.join(DATA_DIR, part);
    assert(fs.existsSync(partPath), `Missing data part: ${part}`);
    return fs.readFileSync(partPath, "utf8");
  })
  .join("");
const data = JSON.parse(serialized);
const research = JSON.parse(
  fs.readFileSync(path.join(__dirname, "anime-top-1000-2026-08-16.json"), "utf8"),
);
const supplementText = fs.readFileSync(
  path.join(__dirname, "anilist-2026-supplement-2026-08-16.json"),
  "utf8",
);
const supplement = JSON.parse(supplementText);

assert.strictEqual(
  crypto.createHash("sha256").update(serialized).digest("hex"),
  manifest.dataSha256,
  "Payload hash mismatch",
);
assert.strictEqual(Buffer.byteLength(serialized), manifest.dataBytes, "Payload byte count mismatch");
assert.strictEqual(data.catalogue.shows.length, 5004, "Main catalogue count changed");
assert.strictEqual(data.catalogue.watchedArchive.length, 179, "Watched archive count changed");
assert.strictEqual(data.kDramaArchive.shows.length, 3632, "K-drama archive count changed");
assert.strictEqual(new Set(data.catalogue.shows.map((show) => show.id)).size, 5004);
assert.strictEqual(data.curslick.collections.length, 5, "Expected five Curslick collections");
assert.deepStrictEqual(
  data.curslick.collections.map((collection) => collection.entries.length),
  [26, 26, 19, 18, 1000],
  "An existing Curslick collection changed",
);

const collection = data.curslick.collections.find(
  (item) => item.id === "top-1000-finished-anime-under-60-hours",
);
assert(collection, "Anime 1000 collection is missing");
assert.strictEqual(collection.number, "05");
assert.strictEqual(collection.entries.length, 1000);
assert.strictEqual(research.titles.length, 1000);
assert.strictEqual(research.audit.eligibleBeforeRankingCut, 4223);
assert.strictEqual(research.source.inputRows, 20618);
assert.strictEqual(research.source.supplement.rowCount, 196);
assert.strictEqual(supplement.rowCount, 196);
assert.strictEqual(
  crypto.createHash("sha256").update(supplementText).digest("hex"),
  research.source.supplement.sha256,
  "2026 supplement hash mismatch",
);
assert(
  supplement.rows.every(
    (row) => row.status === "FINISHED" && row.startDate_year === 2026 && Array.isArray(row.relations),
  ),
  "2026 supplement contains an unaudited row",
);

const known = new Map();
for (const show of [
  ...data.catalogue.shows,
  ...data.kDramaArchive.shows,
  ...data.catalogue.watchedArchive,
]) {
  if (!known.has(show.id)) known.set(show.id, show);
}
const seen = new Set();
const seenMemberIds = new Set();
let matched = 0;
let created = 0;

for (let index = 0; index < collection.entries.length; index += 1) {
  const position = index + 1;
  const entry = collection.entries[index];
  const source = research.titles[index];
  assert.strictEqual(entry.position, position, `Position gap at ${position}`);
  assert.strictEqual(source.position, position, `Research position gap at ${position}`);
  assert.strictEqual(source.status, "FINISHED", `Non-finished research entry at ${position}`);
  assert(source.runtimeMinutes < 3600, `Runtime violation at ${position}`);
  assert.strictEqual(source.completionAudit.cancelledEntries, 0);
  assert.strictEqual(source.completionAudit.releasingEntries, 0);
  assert.strictEqual(source.completionAudit.missingLinkedEntries, 0);
  assert(source.image.startsWith("http"), `Missing source poster at ${position}`);
  assert(source.members.length >= 1, `Missing mainline members at ${position}`);
  assert(
    source.members.every(
      (member) => member.status === "FINISHED" && /^\d{4}-\d{2}-\d{2}$/.test(member.endDate),
    ),
    `Unfinished or undated member at ${position}`,
  );
  const recalculatedMinutes = source.members.reduce(
    (total, member) => total + member.episodesOrParts * member.durationMinutes,
    0,
  );
  assert(
    Math.abs(recalculatedMinutes - source.runtimeMinutes) < 0.1,
    `Runtime calculation mismatch at ${position}`,
  );
  for (const member of source.members) {
    assert(!seenMemberIds.has(member.anilistId), `AniList member reused at ${position}`);
    seenMemberIds.add(member.anilistId);
  }

  assert(Boolean(entry.showId) !== Boolean(entry.show), `Entry ${position} must have showId xor show`);
  const show = entry.showId ? known.get(entry.showId) : entry.show;
  assert(show, `Unresolved show at ${position}`);
  if (entry.showId) matched += 1;
  else created += 1;

  assert(!seen.has(show.id), `Duplicate show ${show.id}`);
  seen.add(show.id);
  assert.strictEqual(show.animeRank, position, `Anime rank mismatch at ${position}`);
  assert.strictEqual(show.animeEndedVerified, true, `Completion flag missing at ${position}`);
  assert(show.animeRuntimeHours < 60, `Show runtime violation at ${position}`);
  assert.strictEqual(show.runtimeHours, source.runtimeHours, `Displayed runtime mismatch at ${position}`);
  assert.strictEqual(show.episodes, source.episodesOrParts, `Displayed episode count mismatch at ${position}`);
  assert(show.genres.includes("Top 1000 Anime"), `Browse tag missing at ${position}`);
  assert(show.genres.includes("Anime"), `Anime tag missing at ${position}`);
  assert(entry.placementNote.includes(`Ranked #${position}`));
  assert(entry.why.includes("FINISHED"));

  if (entry.show) {
    assert.strictEqual(show.status, "Ended");
    assert.strictEqual(show.format, "Anime");
    assert.strictEqual(show.country, "Japan");
    assert.strictEqual(show.language, "Japanese");
    assert(show.image.startsWith("http"), `New show poster missing at ${position}`);
    assert(show.shortPlot.length >= 20, `New show short plot missing at ${position}`);
    assert(show.longPlot.length >= show.shortPlot.length, `New show long plot invalid at ${position}`);
    assert(show.sourceUrl.includes("anilist.co/anime/"), `New show source invalid at ${position}`);
  }
}

assert.strictEqual(matched, 212, "Existing-title match count changed");
assert.strictEqual(created, 788, "New-title count changed");
assert.strictEqual(manifest.animeTopTitles, 1000);
assert.strictEqual(manifest.animeMatchedExistingTitles, matched);
assert.strictEqual(manifest.animeNewCatalogueTitles, created);
assert.strictEqual(data.catalogue.animeResearch.total, 1000);
const supplementIds = new Set(supplement.rows.map((row) => row.id));
assert.strictEqual(
  research.titles.filter((title) => title.members.some((member) => supplementIds.has(member.anilistId)))
    .length,
  34,
  "Expected 34 selected franchises from the 2026 supplement",
);

const app = fs.readFileSync(path.join(REPO, "app.js"), "utf8");
assert(app.includes("t.placementNote ||"), "Curslick placement-note support is missing");
assert(app.includes("`${e.animeScore.toFixed(1)} AniList`"), "Anime card score support is missing");
assert(
  app.includes("` · ${e.animeScore.toFixed(1)} AniList`"),
  "Anime detail score support is missing",
);

console.log(
  `Anime 1000 integrity OK: ${matched} existing + ${created} new, ${manifest.parts.length} data parts.`,
);
