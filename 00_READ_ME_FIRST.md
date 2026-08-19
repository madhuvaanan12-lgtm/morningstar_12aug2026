# 🥬 MORNING STAR — PARKED UNTIL NABARD

**Do not use or restart Morning Star until after clearing NABARD.**

The project is backed up and intentionally put away so NABARD stays the priority.

> **Always remember your cabbage. 🥬**

## Where the backup lives

Google Drive → **Morning Star — GitHub Backup 2026-08-19**
<https://drive.google.com/drive/folders/15c9ZWroqFbZnEJSEakO_fPQx4VJzBATd>

That folder holds:

- `morningstar_12aug2026-all-history.bundle` — the complete repository, every commit and branch
- `morningstar_12aug2026-source-main.zip` — plain file snapshot, no Git needed
- `00 READ ME FIRST` — restore instructions and checksums

Restore with:

```
git clone morningstar_12aug2026-all-history.bundle morningstar_12aug2026
```

A fresh backup can be regenerated any time from
`.github/workflows/morningstar-backup.yml` (Actions → *Morning Star complete backup* →
Run workflow), which uploads the same two files as a build artifact.
