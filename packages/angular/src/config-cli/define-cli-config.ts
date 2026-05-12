import type {
  SitecoreCliConfig,
  SitecoreCliConfigInput,
} from '@sitecore-content-sdk/content/config';
import { defineCliConfig as defineCliConfigCore } from '@sitecore-content-sdk/content/config-cli';
import { generateMap } from '../tools/generate-map';

const noopBuildCommand = async () => {};

/**
 * Ensures `build.commands` exists so {@link defineCliConfigCore} validation passes.
 * @param {SitecoreCliConfigInput} cliConfig - CLI configuration being built up
 */
function addDefaultBuildCommands(cliConfig: SitecoreCliConfigInput) {
  if (!cliConfig.build) {
    cliConfig.build = {};
  }
  if (!cliConfig.build.commands?.length) {
    cliConfig.build.commands = [noopBuildCommand];
  }
}

/**
 * Minimal default scaffold entry so `sitecore-tools project scaffold` remains usable.
 * @param {SitecoreCliConfigInput} cliConfig - CLI configuration being built up
 */
function addDefaultScaffoldTemplates(cliConfig: SitecoreCliConfigInput) {
  if (!cliConfig.scaffold) {
    cliConfig.scaffold = {};
  }
  if (!cliConfig.scaffold.templates?.length) {
    cliConfig.scaffold.templates = [
      {
        name: 'default',
        fileExtension: '.component.ts',
        generateTemplate: (componentName: string) => `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  template: '<p>${componentName}</p>',
})
export class ${componentName}Component {}
`,
      },
    ];
  }
}

/**
 * Registers the Angular component map generator (same CLI entrypoint as Next.js).
 * @param {SitecoreCliConfigInput} cliConfig - CLI configuration being built up
 */
function addDefaultComponentMapGenerator(cliConfig: SitecoreCliConfigInput) {
  cliConfig.componentMap = {
    generator: generateMap,

    paths: ['src/app/components'],

    ...cliConfig.componentMap,
  };
}

/**
 * Accepts a {@link SitecoreCliConfigInput} and returns CLI configuration with Angular defaults
 * (component map generator, optional build/scaffold placeholders), then applies core validation.
 * @param {SitecoreCliConfigInput} cliConfig - CLI configuration from `sitecore.cli.config.ts`
 * @returns Resolved {@link SitecoreCliConfig}
 * @public
 */
export const defineCliConfig = (cliConfig: SitecoreCliConfigInput): SitecoreCliConfig => {
  addDefaultBuildCommands(cliConfig);
  addDefaultScaffoldTemplates(cliConfig);
  addDefaultComponentMapGenerator(cliConfig);
  return defineCliConfigCore(cliConfig);
};
