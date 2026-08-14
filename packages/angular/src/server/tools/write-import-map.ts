import {
  writeImportMap as writeImportMapContent,
  defaultImportMapTemplate,
  type WriteImportMapArgs,
  type ModuleExports,
} from '@sitecore-content-sdk/content/node-tools';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { AngularSitecoreConfig } from '../../config/define-config';

/**
 * Angular framework-specific import map template.
 * @param {Map<string, ModuleExports>} indexedImportMap - import map to render into `import-map.ts`.
 * @returns {string} contents for the resulting import map file.
 */
const angularDefaultMapTemplate = (indexedImportMap: Map<string, ModuleExports>): string =>
  defaultImportMapTemplate(indexedImportMap, 'angular');

/**
 * Angular shim over the default `writeImportMap` function to get framework-specific map.
 * @param {WriteImportMapArgs} args - include/exclude paths to be processed for the import map.
 * @returns {(args: { scConfig: AngularSitecoreConfig }) => Promise<void>} build command
 * compatible with the Angular CLI configuration.
 * @public
 */
export const writeImportMap = (
  args: WriteImportMapArgs
): ((args: { scConfig: AngularSitecoreConfig }) => Promise<void>) => {
  const command = writeImportMapContent({
    ...args,
    defaultTemplate: angularDefaultMapTemplate,
  });
  return async ({ scConfig }: { scConfig: AngularSitecoreConfig }) => {
    // AngularSitecoreConfig is a structural superset of SitecoreConfig; only redirects.locales
    // and the Express-typed multisite callback differ, neither of which the import map reads.
    await command({ scConfig: scConfig as SitecoreConfig });
  };
};
