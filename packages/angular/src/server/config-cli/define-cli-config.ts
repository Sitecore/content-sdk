import type {
  SitecoreCliConfig,
  SitecoreCliConfigInput,
} from '@sitecore-content-sdk/content/config';
import { defineCliConfig as defineCliConfigCore } from '@sitecore-content-sdk/content/config-cli';
import { generateMap } from '../tools/generate-map';
import { AngularSitecoreConfig } from '../../config/define-config';
import { generateSites as generateSitesContent } from '@sitecore-content-sdk/content/node-tools';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
const noopBuildCommand = async () => {};

export const generateSites = ({ destinationPath }: { destinationPath?: string } = {}): ((args: {
  scConfig: AngularSitecoreConfig;
}) => Promise<void>) => {
  return async ({ scConfig }: { scConfig: AngularSitecoreConfig }) => {
    const convertedConfig = scConfig as SitecoreConfig;
    await generateSitesContent({ destinationPath })({ scConfig: convertedConfig });
  };
};

/**
 * CLI configuration input for Angular apps. Narrows {@link SitecoreCliConfigInput}
 * so `config` is the resolved {@link AngularSitecoreConfig} from `sitecore.config.ts`
 * and build commands receive the same type in `scConfig`.
 * @public
 */
export type AngularCsdkCliConfig = Omit<SitecoreCliConfigInput, 'config' | 'build'> & {
  config: AngularSitecoreConfig;
  build?: {
    commands?: Array<(args?: { scConfig: AngularSitecoreConfig }) => Promise<void>>;
  };
};

/**
 * Ensures `build.commands` exists so {@link defineCliConfigCore} validation passes.
 * @param {AngularCsdkCliConfig} cliConfig - CLI configuration being built up
 */
function addDefaultBuildCommands(cliConfig: AngularCsdkCliConfig) {
  if (!cliConfig.build) {
    cliConfig.build = {};
  }
  if (!cliConfig.build.commands?.length) {
    cliConfig.build.commands = [noopBuildCommand];
  }
}

/**
 * Minimal default scaffold entry so `sitecore-tools project scaffold` remains usable.
 * @param {AngularCsdkCliConfig} cliConfig - CLI configuration being built up
 */
function addDefaultScaffoldTemplates(cliConfig: AngularCsdkCliConfig) {
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
 * Registers the Angular component map generator (same CLI entrypoint as other frameworks).
 * @param {AngularCsdkCliConfig} cliConfig - CLI configuration being built up
 */
function addDefaultComponentMapGenerator(cliConfig: AngularCsdkCliConfig) {
  cliConfig.componentMap = {
    generator: generateMap,
    paths: ['src/app/components'],
    ...cliConfig.componentMap,
  };
}

/**
 * Accepts an {@link AngularCsdkCliConfig} and returns CLI configuration with Angular defaults
 * (component map generator, optional build/scaffold placeholders), then applies core validation.
 * @param {AngularCsdkCliConfig} cliConfig - CLI configuration from `sitecore.cli.config.ts`
 * @returns Resolved {@link SitecoreCliConfig}
 * @public
 */
export const defineCliConfig = (cliConfig: AngularCsdkCliConfig): SitecoreCliConfig => {
  addDefaultBuildCommands(cliConfig);
  addDefaultScaffoldTemplates(cliConfig);
  addDefaultComponentMapGenerator(cliConfig);
  return defineCliConfigCore(
    // AngularSitecoreConfig is a structural superset; redirects.locales differs only in typing.
    cliConfig as unknown as SitecoreCliConfigInput
  );
};
