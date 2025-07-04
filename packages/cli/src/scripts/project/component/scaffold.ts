import { scaffoldComponent } from '@sitecore-content-sdk/core/tools';
import loadCliConfig from '../../../utils/load-config.js';
import { Argv } from 'yargs';
import { ComponentTemplateType } from '@sitecore-content-sdk/core/config';

export const command = 'scaffold <componentName>';

export const describe = 'Scaffolds a new component';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv<ScaffoldArgs>) {
  return yargs
    .positional('componentName', {
      requiresArg: true,
      positional: true,
      type: 'string',
      describe: `Name of the component to scaffold. Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. It can also contain slashes to indicate a subfolder. Example: MyComponent or MyFolder/MyComponent. If no subfolder is specified, the component will be created under 'src/components'.`,
    })
    .option('config', {
      requiresArg: false,
      type: 'string',
      describe:
        'Path to the `sitecore.cli.config` file. Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats',
    })
    .option('templateName', {
      requiresArg: false,
      type: 'string',
      describe:
        'Name of the template that will be used to scaffold the component. Can be configured in the cli.config.',
    })
    .option('byoc', {
      requiresArg: false,
      type: 'boolean',
      describe: 'If true, scaffolds a byoc component.',
      default: false,
    });
}

/**
 * Arguments for the scaffold command.
 */
export type ScaffoldArgs = {
  /**
   * The name of the component to be scaffolded.
   */
  componentName: string;
  /**
   * Path to the `sitecore.cli.config` file.
   * Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.
   */
  config?: string;
  /**
   * The name of the template to use for scaffolding.
   */
  templateName?: string;
  /**
   * Indicates whether to scaffold a BYOC type component.
   */
  byoc?: boolean;
};

/**
 * Handler for the scaffold command.
 * @param {ScaffoldArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: ScaffoldArgs) {
  const nameParamFormat = new RegExp(/^((?:[\w\-]+\/)*)([A-Z][\w-]+)$/);
  const regExResult = nameParamFormat.exec(argv.componentName);

  if (regExResult === null) {
    console.log(`Error: Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. It can also contain slashes to indicate a subfolder`);

    return;
  }

  const cliConfig = await loadCliConfig(argv.config);

  const componentPath = regExResult[1];
  const componentName = regExResult[2];
  const outputFolder = componentPath || 'src/components';
  const templateName =
    argv.templateName ?? (argv.byoc ? ComponentTemplateType.BYOC : ComponentTemplateType.DEFAULT);

  scaffoldComponent(outputFolder, componentName, templateName, cliConfig.scaffold.templates);
}
