---
name: content-sdk-capabilities
description: >-
  Adds or changes Content SDK build-time capabilities (metadata.json and
  editing config). Use when the developer specifies that a feature needs a
  capability attached.
---

# Content SDK capabilities

**Detail:** [reference.md](reference.md) (data flow, key files, merge semantics)
**Read first:** `packages/core/src/capabilities.ts` (`CSDKCapabilities`), the target package's `capabilities` module

## When

- The developer says a feature needs a capability that Pages, Design Studio or another consumer reads from `.sitecore/metadata.json` or editing config
- A task changes a capability key, filter or package `/capabilities` export

## Rules

- Confirm first: a consumer app must discover or gate the feature from the head app; whether it carries `metadata` (agree the contract); whether it's unconditional or needs app wiring; which packages export it
- Add the key to `CSDKCapabilities` in core, then export it from each package's `/capabilities` default: `nextjs/src/capabilities/index.ts`, `angular/src/server/capabilities/index.ts`, `cli/src/capabilities.ts`. New packages need the `./capabilities` subpath in `package.json`
- Keep key names identical across packages that share a tree; merge ORs booleans, deep-merges sub-capabilities and ANDs filters
- Unconditional features are `{ value: true }`. Add a `filter` only when the app must adopt a route, middleware, import or setting
- Use the lightest correct filter:
  - one known file: `fileExists` / `fileContains` (`hasEditingRenderRoute`, `hasPersonalizeMiddleware` on `src/server.ts`)
  - config: read `sitecoreConfig` only (`hasCodeGenerationEnabled`)
  - SDK import anywhere in `src/`: reuse `someSourceFile` + `importsNamedExport` from the package's `capabilities/utils.ts` (`hasDesignLibrary`, `hasPersonalizeProxy`)
- Tie matched export names to the package so a rename breaks the build: `keyof typeof` a `type * as` namespace import (Next.js), or a spec-side type check when the module can't compile under `tsconfig.server.json` (Angular `DesignLibrary.spec.ts`)
- Keep filters synchronous and cheap; they run once per `sitecore-tools project build`
- Test merge behavior in `core/src/tools/capabilities/capabilities.test.ts` and filters next to each package module; run `api-extractor` after contract changes; update `scripts/verify-sample-capabilities.js` when sample keys change

## Stop

- Stop if no consumer app will read the capability from metadata or editing config
- Stop if the change would alter the resolved JSON shape: `false` leaves, sub-capabilities nested under anything but sibling keys of the parent, or `filter` written to output
- Stop and discuss explicit config or a template change if detection would need a TypeScript program, bundler graph or scanning outside `src/`
