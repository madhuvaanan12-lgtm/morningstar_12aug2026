const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const REPO = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO, "data");
const app = fs.readFileSync(path.join(REPO, "app.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "manifest.json"), "utf8"));
const data = JSON.parse(
  manifest.parts.map((part) => fs.readFileSync(path.join(DATA_DIR, part), "utf8")).join(""),
);

const aliasStart = app.indexOf("KDRAMA_EQUIVALENT_TITLE_GROUPS = [");
const aliasEnd = app.indexOf("function isTopFiveOrigin");
const functionsStart = app.indexOf("function normaliseTitleKey");
const functionsEnd = app.indexOf("function hasShowId");
assert(aliasStart >= 0 && aliasEnd > aliasStart, "K-drama alias map is missing");
assert(functionsStart >= 0 && functionsEnd > functionsStart, "Catalogue merge functions are missing");

const context = {
  console,
  TITLE_STOP_WORDS: [
    "of",
    "and",
    "in",
    "on",
    "to",
    "my",
    "is",
    "it",
    "that",
    "this",
    "with",
    "for",
    "you",
    "me",
    "we",
    "who",
    "s",
    "are",
    "be",
    "at",
    "by",
    "from",
    "i",
  ],
  UNPLACED_COUNTRIES: ["", "International", "Unknown", "Various"],
  x: (show) =>
    show.kDramaArchive === true || show.country === "South Korea" || show.language === "Korean",
};
vm.createContext(context);
vm.runInContext(
  `var ${app.slice(aliasStart, aliasEnd)}\n${app.slice(functionsStart, functionsEnd)}\n` +
    "this.buildMergedCatalogue = buildMergedCatalogue; this.isLatinTitle = isLatinTitle;",
  context,
);

const input = [
  ...data.catalogue.shows.map((show) => ({ ...show, mainCatalogue: true })),
  ...data.kDramaArchive.shows,
  ...data.catalogue.watchedArchive.map((show) => ({ ...show, watchedArchiveRecord: true })),
  ...data.curslick.collections.flatMap((collection) =>
    collection.entries.flatMap((entry) =>
      entry.show ? [{ ...entry.show, curslickExclusive: true }] : [],
    ),
  ),
];
const merged = context.buildMergedCatalogue(input);

function recordsFor(...ids) {
  return merged.filter(
    (show) => ids.some((id) => show.id === id || (show.aliasIds || []).includes(id)),
  );
}

function assertMergedPair(expectedTitle, expectedOriginalTitle, watchedId, archiveId) {
  const records = recordsFor(watchedId, archiveId);
  assert.strictEqual(records.length, 1, `${expectedTitle} still has duplicate records`);
  assert.strictEqual(records[0].title, expectedTitle, `${expectedTitle} is not the display title`);
  assert.strictEqual(
    records[0].originalTitle,
    expectedOriginalTitle,
    `${expectedTitle} lost its original title`,
  );
  assert.strictEqual(records[0].watched, true, `${expectedTitle} did not inherit watched status`);
  assert(records[0].aliasIds.includes(archiveId), `${expectedTitle} did not preserve its old archive id`);
}

assertMergedPair("Strong Girl Bong Soon", "힘쎈여자 도봉순", "tt6263222", "mdl-18894");
assertMergedPair("Bring It On, Ghost", "싸우자귀신아", "tt5768840", "mdl-18468");
assertMergedPair("Tempted", "위대한 유혹자", "tt7923816", "mdl-26230");
assertMergedPair("Rain or Shine", "그냥 사랑하는 사이", "tt7521898", "mdl-24230");

assert.strictEqual(
  recordsFor("tt8648696", "mdl-28327").length,
  1,
  "MyDramaList URL aliases are not merging alternate English titles",
);
assert.strictEqual(
  recordsFor("tt27898511", "mdl-754113").length,
  2,
  "Two different 2025 Korean shows named Trigger were merged",
);

const unresolvedWatchedKdramas = data.catalogue.watchedArchive
  .filter((show) => show.country === "South Korea" || show.language === "Korean")
  .filter((show) => {
    const record = recordsFor(show.id)[0];
    return !record || !record.watched || !record.kDramaArchive;
  });
assert.deepStrictEqual(unresolvedWatchedKdramas, [], "A watched K-drama lost its watched status");

assert.strictEqual(
  merged.filter((show) => show.kDramaArchive && !context.isLatinTitle(show.title)).length,
  0,
  "A K-drama display title is not in the English-title field",
);
assert(!app.includes('className: "card-original-title"'), "Original titles still render on cards");
assert(
  !app.includes('className: "curslick-original-title"'),
  "Original titles still render in Curslick lists",
);
assert(app.includes('children: ["Original title: ", e.originalTitle]'), "Detail original title is missing");

console.log(
  `Catalogue normalization OK: ${merged.length.toLocaleString()} unique records; all watched K-dramas resolve to one English-title record.`,
);
