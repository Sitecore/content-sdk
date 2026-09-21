/**
 * Framework-agnostic codegen helpers that are safe to bundle for the browser.
 *
 * The generated `.sitecore/import-map.ts` is part of the client bundle, so anything reachable from
 * this entry point must stay free of `node:*` builtins and of Node-only dependencies such as `glob`.
 * Keep Node/build-time codegen in `./tools` and `./node-tools` instead.
 */
export { combineImportEntries } from './import-map-utils';
