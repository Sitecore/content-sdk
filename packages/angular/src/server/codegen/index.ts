/**
 * Public API of `@sitecore-content-sdk/angular/codegen`.
 *
 * Consumed by the auto-generated `.sitecore/import-map.ts` (see the Angular `writeImportMap` shim,
 * which renders the map with `framework: 'angular'`).
 */
export { defaultImportEntries } from './default-import-entries';
export { ImportEntry } from '@sitecore-content-sdk/content/codegen';
// Must come from `content/codegen-utils`, not `content/tools`: the generated `.sitecore/import-map.ts`
// imports this helper and is bundled for the browser, and the `tools` barrel reaches `glob`/`node:*`.
export { combineImportEntries } from '@sitecore-content-sdk/content/codegen-utils';
