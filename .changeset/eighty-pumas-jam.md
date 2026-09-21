---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
'@sitecore-content-sdk/angular': patch
---

Fixed `next dev --webpack` / `next build --webpack` failing with `UnhandledSchemeError` for
`node:events` when the generated `.sitecore/import-map.ts` imported `combineImportEntries`.

That helper is now exported from a browser-safe `@sitecore-content-sdk/content/codegen-utils`
entry instead of the Node-only `content/tools` barrel (which pulled in `glob`). Next.js and
Angular `codegen` re-export it from there; `content/tools` still exposes it for compatibility.
