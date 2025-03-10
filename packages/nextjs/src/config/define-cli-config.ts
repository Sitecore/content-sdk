import {
  defineCliConfig as defineCliConfigCore,
  SitecoreCliConfigInput,
  SitecoreCliConfig,
} from '@sitecore-content-sdk/core/config';

import * as byocTemplate from '../tools/templating/byoc-component';
import * as defaultTemplate from '../tools/templating/default-component';

/**
 * Accepts a `SitecoreCliConfigInput` object and returns the Sitecore Content SDK CLI configuration from the specified file,
 * updated with the required default values.
 * @param {SitecoreCliConfigInput} cliConfig the cli configuration provided by the application
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInput): SitecoreCliConfig => {
  addDefaultScaffoldTemplates(cliConfig);
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

  cliConfig.scaffold.templates.unshift(
    {
      name: 'default',
      generateTemplate: defaultTemplate.generateTemplate,
      getNextSteps: defaultTemplate.getNextSteps,
    },
    {
      name: 'byoc',
      generateTemplate: byocTemplate.generateTemplate,
      getNextSteps: byocTemplate.getNextSteps,
    }
  );
}
