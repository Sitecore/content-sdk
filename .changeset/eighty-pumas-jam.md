---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/angular': patch
---

Fixed `next dev --webpack` / `next build --webpack` failing with `UnhandledSchemeError` for
`node:events` when the generated `.sitecore/import-map.ts` imported `combineImportEntries`.

`content/tools` stays the browser-safe entry for that helper. Pure component-map helpers now live
apart from `glob`, and the Node-only `prepareComponentsForMap` / `buildComponentMapContent`
helpers (which depend on `path`) are exported from `content/node-tools`.
