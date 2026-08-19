---
name: content-sdk-atoms-maintain
description: Maintains atom versions and atoms.lock.json — validate, update, breakOnError, schema drift.
---

# Atoms maintain (App Router + Cache Components)

**Read first:** `.sitecore/atoms.lock.json`, `sitecore.cli.config.ts` (`atoms.validation`)
**Related:** `content-sdk-atoms-setup`, `content-sdk-atoms-create`

## When

- Schema or version changes after atoms already exist
- `atoms validate` fails on `dev` / `build`
- Tuning `breakOnError` for CI vs local

## Rules

- Lock file: `.sitecore/atoms.lock.json` — per-atom schema hashes (+ optional versions); optional catalog-level `version`
- `npm run sitecore-tools:atoms:validate` — compares current `src/atoms` definitions to the lock; runs on `dev`/`build`
- `npm run sitecore-tools:atoms:update` — regenerate lock **after intentional** schema/version changes (this is how you accept a new hash)
- Common issues: missing lock (`MV-012`); schema hash changed (`IV-010`); new atom not in lock (`MV-014`); lock atom missing from catalog (`MV-013`)
- Versions are **optional**. If you set catalog or per-atom `version`, lock and source must match (`IV-008` / `IV-009`); bump the version string when you intend a versioned change, then run `atoms update`
- `atoms.validation.breakOnError` in `sitecore.cli.config.ts`: `false` (starter default) logs issues without failing; `true` throws (`IE-009`) — use in CI when ready
- Do not hand-edit lock hashes; always regenerate via `atoms update`
- Removing an atom: delete from catalog/registry, then `atoms update` so the lock drops it

## Stop

- Stop if creating a new atom from scratch → `content-sdk-atoms-create`
- Stop if Provider/CLI wiring is broken → `content-sdk-atoms-setup`
