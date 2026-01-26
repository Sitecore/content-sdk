import {
  writeImportMap as writeImportMapCore,
  WriteImportMapArgs,
} from '@sitecore-content-sdk/content/tools';
import {
  detectRouterType,
  nextjsClientMapTemplate,
  nextjsDefaultMapTemplate,
} from '../templating/utils';

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgs} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration.
 * @public
 */
export const writeImportMap = (args: WriteImportMapArgs) => {
  const separateServerClientMaps = detectRouterType() === 'app';
  return writeImportMapCore({
    ...args,
    separateServerClientMaps,
    serverTemplate: nextjsDefaultMapTemplate,
    clientTemplate: nextjsClientMapTemplate,
  });
};
