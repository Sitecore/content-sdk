---
name: content-sdk-atoms-setup
description: Explains starter atoms wiring — src/atoms, Providers atomsConfig, CLI validate/update, first lock file.
---

# Atoms setup (App Router)

**Read first:** `src/atoms/index.tsx`, `src/Providers.tsx`, `sitecore.cli.config.ts`

## When

- First-time atoms onboarding in a scaffolded app
- Confirming Provider/CLI wiring before creating atoms
- Generating the initial `.sitecore/atoms.lock.json`

## Rules

- Starter already wires atoms: empty catalog/registry in `src/atoms/index.tsx`, `atomsConfig` on `SitecoreProvider` in `Providers.tsx`, `atoms.validation.breakOnError` in `sitecore.cli.config.ts`
- `npm run sitecore-tools:atoms:validate` runs on `dev` and `build`; `npm run sitecore-tools:atoms:update` regenerates the lock file
- CLI reads **`src/atoms/index.ts(x)` only** and requires a named **`catalog`** export (from `defineAtomsCatalog`)
- Atoms are **not** registered in `.sitecore/component-map*` — they use `atomsConfig`, not the component map
- After scaffold (or before first validate), run `npm run sitecore-tools:atoms:update` once so `.sitecore/atoms.lock.json` exists (`MV-012` if missing)
- Commit the lock file (templates keep it via `!.sitecore/atoms.lock.json`); do not hand-edit hashes

## Stop

- Stop if the app lacks `src/atoms/` or `atomsConfig` — restore from the template before creating atoms
- For defining components/actions → `content-sdk-atoms-create`
- For versioning / lock drift → `content-sdk-atoms-maintain`
