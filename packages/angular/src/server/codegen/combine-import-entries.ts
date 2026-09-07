import { ImportEntry } from '@sitecore-content-sdk/content/codegen';

/**
 * Combines the default import entries with the generated import entries.
 *
 * A browser-safe local copy of Content SDK's `combineImportEntries`. The shared one is only exported
 * from `@sitecore-content-sdk/content/tools`, a Node/build-time barrel that pulls in `glob` (and other
 * `node:*` builtins). The generated `.sitecore/import-map.ts` imports this helper and is bundled into
 * the **browser** build (the design library resolves real component classes from it), so it must not
 * reach through `content/tools`. This function is pure and depends only on the `ImportEntry` type.
 * @param {ImportEntry[]} defaultImportEntries - The default import entries.
 * @param {ImportEntry[]} generatedImportEntries - The generated import entries.
 * @returns {ImportEntry[]} The combined import entries.
 * @public
 */
export const combineImportEntries = (
  defaultImportEntries: ImportEntry[],
  generatedImportEntries: ImportEntry[]
): ImportEntry[] => {
  const combinedEntries: ImportEntry[] = [];
  const importMap = new Map<string, ImportEntry>();

  // add generated entries to the map, overwriting existing ones
  generatedImportEntries.forEach((entry) => {
    importMap.set(entry.module, entry);
  });

  // add default entries to the map, if not present
  defaultImportEntries.forEach((defaultEntry) => {
    const mapEntry = importMap.get(defaultEntry.module);
    if (mapEntry) {
      defaultEntry.exports.forEach((defaultExportsEntry) => {
        if (!mapEntry.exports.some((e) => e.name === defaultExportsEntry.name)) {
          mapEntry.exports.push(defaultExportsEntry);
        }
      });
    } else {
      importMap.set(defaultEntry.module, defaultEntry);
    }
  });

  // convert map back to array
  importMap.forEach((value) => {
    combinedEntries.push(value);
  });

  return combinedEntries;
};
