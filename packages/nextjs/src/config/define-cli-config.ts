import {
  defineCliConfig as defineCliConfigCore,
  SitecoreCliConfigInpout,
  SitecoreCliConfig,
} from '@sitecore-content-sdk/core/config';

import * as byocTemplate from '../components/templates/byoc-component';
import * as defaultTemplate from '../components/templates/default-component';

/**
 * Accepts a SitecoreCliConfigInpout object and returns sitecore cli configuration, updated with required default values
 * @param {SitecoreCliConfigInpout} cliConfig the cli configuration provided by the appication
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInpout): SitecoreCliConfig => {
  addDefaultScaffoldTemplates(cliConfig);
  return defineCliConfigCore(cliConfig);
};

/**
 * Adds default scaffold templates to the Sitecore CLI configuration.
 * @param {SitecoreCliConfigInpout} cliConfig - The Sitecore CLI configuration object
 */
function addDefaultScaffoldTemplates(cliConfig: SitecoreCliConfigInpout) {
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
