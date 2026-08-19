#!/usr/bin/env node
"use strict";

// Every generated `longPlot` in the payload ends with a templated sentence that
// restates metadata already shown elsewhere in the detail modal:
//
//   "This completed 15-episode live action series from United Kingdom develops
//    that premise across an estimated 22.5-hour run, using drama, crime, mystery
//    storytelling to deepen the central relationships, conflicts and consequences."
//
// It says nothing the fact line and aside do not already say, so it is stripped
// from every record here rather than hidden at render time — that keeps it out
// of the shipped payload too.
//
// Matching is deliberately conservative: the sentence must sit at the very end
// of the field, and the whole span from "This " to the end must match the
// template exactly. Anything else is left alone. Runtimes like "22.5-hour" mean
// the sentence can contain a period, so the start is located by walking back
// from the template's marker phrase rather than by splitting on ".".

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const MANIFEST_PATH = path.join(DATA_DIR, "manifest.json");
const CHUNK_SIZE = 600000;

const MARKER = "develops that premise across an estimated";
const TAIL = "to deepen the central relationships, conflicts and consequences.";
const TEMPLATE =
  /^This .*?develops that premise across an estimated .*?-hour run, using .*? storytelling to deepen the central relationships, conflicts and consequences\.$/;

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function stripBoilerplate(longPlot) {
  if (typeof longPlot !== "string") return null;
  const trimmed = longPlot.trimEnd();
  if (!trimmed.endsWith(TAIL)) return null;
  const markerIndex = trimmed.lastIndexOf(MARKER);
  if (markerIndex < 0) return null;
  const startIndex = trimmed.lastIndexOf("This ", markerIndex);
  if (startIndex < 0) return null;
  if (!TEMPLATE.test(trimmed.slice(startIndex))) return null;
  const kept = trimmed.slice(0, startIndex).trimEnd();
  return kept || null;
}

// Records live in several arrays (catalogue.shows, watchedArchive,
// lesbianGlArchive) and inside embedded curslick `show` objects, so walk the
// whole tree rather than naming each list.
function walk(node, onRecord) {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, onRecord);
    return;
  }
  if (!node || typeof node !== "object") return;
  if (typeof node.longPlot === "string") onRecord(node);
  for (const key of Object.keys(node)) walk(node[key], onRecord);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const oldParts = [...manifest.parts];
const payload = oldParts.map((name) => fs.readFileSync(path.join(DATA_DIR, name), "utf8")).join("");
const data = JSON.parse(payload);

let stripped = 0;
let untouched = 0;
const seen = new Set();
walk(data, (record) => {
  if (seen.has(record)) return;
  seen.add(record);
  const next = stripBoilerplate(record.longPlot);
  if (next === null) {
    untouched += 1;
    return;
  }
  record.longPlot = next;
  stripped += 1;
});

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

fs.writeFileSync(
  MANIFEST_PATH,
  JSON.stringify(
    {
      ...manifest,
      generatedAt: new Date().toISOString(),
      dataSha256: sha256(json),
      dataBytes: Buffer.byteLength(json, "utf8"),
      parts,
    },
    null,
    2,
  ) + "\n",
);

console.log(
  "Stripped the templated closing sentence from " + stripped + " longPlot fields (" +
    untouched + " left unchanged); rebuilt " + parts.length + " data parts.",
);
