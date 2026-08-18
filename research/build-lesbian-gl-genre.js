#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json");
const AUDIT_PATH = path.join(__dirname, "lesbian-gl-2026-08-18.json");
const CHUNK_SIZE = 600000;

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const oldParts = [...manifest.parts];
const payload = oldParts.map((name) => fs.readFileSync(path.join(DATA_DIR, name), "utf8")).join("");
const data = JSON.parse(payload);
const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, "utf8"));

if (!Array.isArray(audit.archiveEntries) || audit.archiveEntries.length !== audit.counts.verifiedTitles) {
  throw new Error("Lesbian / GL audit is missing a complete archiveEntries array.");
}

data.catalogue.lesbianGlArchive = audit.archiveEntries;
data.catalogue.lesbianGlResearch = {
  generatedAt: audit.generatedAt,
  methodology: audit.methodology,
  counts: audit.counts,
  sources: audit.sources,
};

const json = JSON.stringify(data);
const chunks = [];
for (let offset = 0; offset < json.length; offset += CHUNK_SIZE) {
  chunks.push(json.slice(offset, offset + CHUNK_SIZE));
}
const width = String(chunks.length).length;
const parts = chunks.map((chunk, index) => {
  const number = String(index + 1).padStart(width, "0");
  return "morningstar-data-" + number + "-" + sha256(chunk).slice(0, 12) + ".txt";
});

for (const oldPart of oldParts) {
  if (!parts.includes(oldPart)) fs.rmSync(path.join(DATA_DIR, oldPart), { force: true });
}
for (let index = 0; index < parts.length; index += 1) {
  fs.writeFileSync(path.join(DATA_DIR, parts[index]), chunks[index]);
}

const nextManifest = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  dataSha256: sha256(json),
  dataBytes: Buffer.byteLength(json, "utf8"),
  parts,
  lesbianGlTitles: audit.counts.verifiedTitles,
  lesbianGlMatchedExistingTitles: audit.counts.matchedExistingTitles,
  lesbianGlNewArchiveTitles: audit.counts.newArchiveTitles,
  lesbianGlThaiTitles: audit.counts.thaiTitles,
  lesbianGlSourceDate: "2026-08-18",
};
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2) + "\n");

console.log(
  "Rebuilt " + parts.length + " data parts with " + audit.counts.verifiedTitles +
  " Lesbian / GL titles (" + audit.counts.thaiTitles + " Thai).",
);
