import {
  writeImportMap as writeImportMapCore,
  WriteImportMapArgs,
} from '@sitecore-content-sdk/core/tools';
import { detectRouterType, reactClientMapTemplate } from '../templating/utils';

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgs} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration.
 * @param {boolean} [args.separateServerClientMaps] whether to generate separate server and client import maps for Design Library. Defaults to true for Next JS App Router, false otherwise.
 * @public
 */
export const writeImportMap = (args: WriteImportMapArgs) => {
  const separateServerClientMaps = args.separateServerClientMaps ?? detectRouterType() === 'app';
  return writeImportMapCore({
    ...args,
    separateServerClientMaps,
    clientTemplate: reactClientMapTemplate,
  });
};
