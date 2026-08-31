/**
 * Public API of `@sitecore-content-sdk/angular/codegen`.
 *
 * Consumed by the auto-generated `.sitecore/import-map.ts` (see the Angular `writeImportMap` shim,
 * which renders the map with `framework: 'angular'`).
 */
export { defaultImportEntries } from './default-import-entries';
export { ImportEntry } from '@sitecore-content-sdk/content/codegen';
// Local, browser-safe copy — importing from `content/tools` would drag `glob`/`node:*` into the
// browser bundle via the generated `.sitecore/import-map.ts`. See ./combine-import-entries.ts.
export { combineImportEntries } from './combine-import-entries';
