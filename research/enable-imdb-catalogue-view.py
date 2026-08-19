#!/usr/bin/env python3
"""Ensure the enhanced Morningstar-style IMDb archive UI loads after the legacy archive."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
TAG = '<script defer src="./imdb-archive-catalogue.js"></script>'

text = INDEX.read_text(encoding="utf-8")
if TAG not in text:
    marker = "</body>"
    if marker not in text:
        raise RuntimeError("index.html has no </body> marker for IMDb catalogue UI injection")
    text = text.replace(marker, f"  {TAG}\n{marker}", 1)
    INDEX.write_text(text, encoding="utf-8")

print("Morningstar-style IMDb archive UI enabled.")
