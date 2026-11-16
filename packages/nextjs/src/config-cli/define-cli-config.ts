import { SitecoreCliConfigInput, SitecoreCliConfig } from '@sitecore-content-sdk/content/config';
import { defineCliConfig as defineCliConfigCore } from '@sitecore-content-sdk/content/config-cli';
import { GenerateMapFunction } from '@sitecore-content-sdk/content/tools';
import { byocTemplate } from '../tools/templating/byoc-component';
import { defaultTemplate } from '../tools/templating/default-component';
import { generateMap, NextjsGenerateMapArgs } from '../tools/generate-map';

/**
 * CLI configuration input for Next.js apps. Extends `SitecoreCliConfigInput`
 * with Next.js-specific component map options.
 * @public
 */
export type NextjsCliConfigInput = Omit<SitecoreCliConfigInput, 'componentMap'> & {
  /**
   * Configuration for the `sitecore-tools component generate-map` CLI command
   */
  componentMap?: NextjsGenerateMapArgs & {
    /**
     * Function implementation for generating a component map
     */
    generator?: GenerateMapFunction;
  };
};

/**
 * Accepts a `NextjsCliConfigInput` object and returns the Sitecore Content SDK CLI configuration from the specified file,
 * updated with the required default values.
 * @param {NextjsCliConfigInput} cliConfig the cli configuration provided by the application
 * @returns {SitecoreCliConfig} full sitecore cli configuration to use with cli
 * @public
 */
export const defineCliConfig = (cliConfig: NextjsCliConfigInput): SitecoreCliConfig => {
  addDefaultScaffoldTemplates(cliConfig);
  addDefaultComponentMapGenerator(cliConfig);
  return defineCliConfigCore(cliConfig);
};

/**
 * Adds default scaffold templates to the CLI configuration.
 * @param {NextjsCliConfigInput} cliConfig - The CLI configuration object
 */
function addDefaultScaffoldTemplates(cliConfig: NextjsCliConfigInput) {
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
 * @param {NextjsCliConfigInput} cliConfig - The CLI configuration object
 */
function addDefaultComponentMapGenerator(cliConfig: NextjsCliConfigInput) {
  cliConfig.componentMap = {
    generator: generateMap,
    paths: ['src/components'],
    ...cliConfig.componentMap,
  };
}
