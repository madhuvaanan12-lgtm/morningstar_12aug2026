#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "manifest.json"), "utf8"));
const payload = manifest.parts
  .map((name) => fs.readFileSync(path.join(ROOT, "data", name), "utf8"))
  .join("");
const data = JSON.parse(payload);
const audit = JSON.parse(
  fs.readFileSync(path.join(__dirname, "lesbian-gl-2026-08-18.json"), "utf8"),
);
const app = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const archive = data.catalogue.lesbianGlArchive;

assert(Array.isArray(archive), "catalogue.lesbianGlArchive must be an array");
assert.strictEqual(archive.length, audit.counts.verifiedTitles);
assert.strictEqual(manifest.lesbianGlTitles, archive.length);
assert.strictEqual(
  manifest.lesbianGlMatchedExistingTitles,
  audit.counts.matchedExistingTitles,
);
assert.strictEqual(manifest.lesbianGlNewArchiveTitles, audit.counts.newArchiveTitles);
assert.strictEqual(manifest.lesbianGlThaiTitles, audit.counts.thaiTitles);

const ids = archive.map((entry) => entry.id);
assert.strictEqual(new Set(ids).size, ids.length, "Lesbian / GL archive ids must be unique");
for (const entry of archive) {
  assert(entry.genres.includes("Lesbian / GL"), entry.title + " is missing the genre");
  assert.strictEqual(entry.lesbianGlArchive, true);
  assert(Array.isArray(entry.glEvidence) && entry.glEvidence.length > 0);
}

const thaiHubTitles = archive.filter((entry) =>
  entry.glEvidence.some((evidence) => evidence.source === "Thai GL Hub 2026 line-up"),
);
assert.strictEqual(thaiHubTitles.length, 28, "Thai GL Hub released/airing pass changed");
for (const forbidden of ["Moonshadow", "Under Her Rules", "Fairway of Love"]) {
  assert(!archive.some((entry) => entry.title === forbidden), forbidden + " is not released yet");
}

assert(app.includes("function isLesbianGl(e)"), "app is missing the GL exclusion helper");
assert(
  app.includes("...(e.lesbianGlArchive || []).map"),
  "GL archive is not included in the merged catalogue",
);
assert(app.includes('"LESBIAN / GL ARCHIVE"'), "GL archive modal label is missing");
assert(
  app.includes('e.genres || []).includes("Lesbian / GL")'),
  "GL genre is not recognized by the exclusion helper",
);
new Function(app);

console.log(
  "Verified " + archive.length + " Lesbian / GL records, including " +
    manifest.lesbianGlThaiTitles + " Thai titles; app.js parses successfully.",
);
