import {
  writeImportMap as writeImportMapCoreImpl,
  WriteImportMapArgs,
} from '@sitecore-content-sdk/content/tools';
import {
  detectRouterType,
  nextjsClientMapTemplate,
  nextjsServertMapTemplate,
  nextjsDefaultMapTemplate,
} from '../templating/utils';

let writeImportMapCore = writeImportMapCoreImpl;

export const __mockDependencies = (mocks: any) => {
  if (mocks.writeImportMapCore) {
    writeImportMapCore = mocks.writeImportMapCore;
  }
};

/**
 * Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts
 * @param {WriteImportMapArgs} args include/exclude paths settings to be processed for import-map, and the Sitecore configuration.
 * @public
 */
export const writeImportMap = (args: WriteImportMapArgs) => {
  const isAppRouter = detectRouterType() === 'app';
  return writeImportMapCore({
    ...args,
    separateServerClientMaps: isAppRouter,
    defaultTemplate: isAppRouter ? nextjsServertMapTemplate : nextjsDefaultMapTemplate,
    clientTemplate: nextjsClientMapTemplate,
  });
};
