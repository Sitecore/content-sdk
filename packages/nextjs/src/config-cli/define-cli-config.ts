import { SitecoreCliConfigInput, SitecoreCliConfig } from '@sitecore-content-sdk/content/config';
import { defineCliConfig as defineCliConfigCore } from '@sitecore-content-sdk/content/config-cli';
import { byocTemplate } from '../tools/templating/byoc-component';
import { defaultTemplate } from '../tools/templating/default-component';
import { generateMap } from '../tools/generate-map';

/**
 * Accepts a `SitecoreCliConfigInput` object and returns the Sitecore Content SDK CLI configuration from the specified file,
 * updated with the required default values.
 * @param {SitecoreCliConfigInput} cliConfig the cli configuration provided by the application
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 * @public
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInput): SitecoreCliConfig => {
  addDefaultScaffoldTemplates(cliConfig);
  addDefaultComponentMapGenerator(cliConfig);
  return defineCliConfigCore(cliConfig);
};

/**
 * Adds default scaffold templates to the CLI configuration.
 * @param {SitecoreCliConfigInput} cliConfig - The CLI configuration object
 */
function addDefaultScaffoldTemplates(cliConfig: SitecoreCliConfigInput) {
  if (!cliConfig.scaffold) {
    cliConfig.scaffold = {};
  }

  if (!cliConfig.scaffold.templates) {
    cliConfig.scaffold.templates = [];
  }

  cliConfig.scaffold.templates.unshift(defaultTemplate, byocTemplate);
}

/**
 * Add the framework-specific implementaion of the component map generator to the CLI configuration.
 * @param {SitecoreCliConfigInput} cliConfig - The CLI configuration object
 */
function addDefaultComponentMapGenerator(cliConfig: SitecoreCliConfigInput) {
  cliConfig.componentMap = {
    generator: generateMap,
    paths: ['src/components'],
    ...cliConfig.componentMap,
  };
}
