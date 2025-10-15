import { Argv } from 'yargs';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as tools from '@sitecore-content-sdk/core/tools';
import inquirer from 'inquirer';
import loadCliConfig from '../../../utils/load-config';
import { handler as generateMapHandler } from './generate-map';

let { getComponentVariantSpec, getComponentList, getComponentRegistryUrl } = tools;

export const unitMocks = (
  toolsModule: Pick<
    typeof tools,
    'getComponentVariantSpec' | 'getComponentList' | 'getComponentRegistryUrl'
  >
) => {
  getComponentVariantSpec = toolsModule.getComponentVariantSpec;
  getComponentList = toolsModule.getComponentList;
  getComponentRegistryUrl = toolsModule.getComponentRegistryUrl;
};

type AddArgs = {
  /**
   * The unique identifier of the newly created variant.
   */
  variantId: string;
  /**
   * The target path for the component variant.
   */
  targetPath?: string;
  /**
   * If true, skips the component map generation.
   * Default: false.
   */
  skipComponentMap?: boolean;
  /**
   * If true, overwrites the existing component.
   * Default: false.
   */
  overwrite?: boolean;
  /**
   * Path to the `sitecore.cli.config` file.
   * Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.
   */
  config?: string;
};

/**
 * @param {Argv} yargs
 */
export function args(yargs: Argv<AddArgs>) {
  /* istanbul ignore next */
  return yargs
    .positional('variantId', {
      requiresArg: true,
      positional: true,
      type: 'string',
      describe: `The unique identifier of the newly created variant.`,
    })
    .option('target-path', {
      requiresArg: false,
      type: 'string',
      describe: 'The target path for the component variant.',
    })
    .option('skip-component-map', {
      requiresArg: false,
      type: 'boolean',
      describe: 'If true, skips the component map generation.',
      default: false,
    })
    .option('overwrite', {
      requiresArg: false,
      type: 'boolean',
      describe: 'If true, overwrites the existing component.',
      default: false,
    })
    .option('config', {
      requiresArg: false,
      type: 'string',
      describe:
        'Path to the `sitecore.cli.config` file. Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats',
    });
}

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv<AddArgs>) {
  /* istanbul ignore next */
  return yargs.command<AddArgs>('add <variant-id>', 'Adds a component variant', args, handler);
}

/**
 * Handler for the add command.
 * @param {AddArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: AddArgs) {
  const { variantId, targetPath: targetPathArg, skipComponentMap, config, overwrite } = argv;

  console.log(chalk.green('Adding component variant'));

  let targetPath = targetPathArg;

  const cliConfig = loadCliConfig(config);

  if (!cliConfig.config) {
    console.error(
      'The `sitecore.cli.config` file is missing a `config`. Please add it to use this command.'
    );
    return;
  }

  const { contextId, edgeUrl } = cliConfig.config.api.edge;

  try {
    const spec = await getComponentVariantSpec({
      edgeUrl,
      variantId,
      targetPath,
    });

    const componentType = spec.meta['contentsdk-component-type'];
    const componentName = spec.meta['contentsdk-component-name'];
    const variantName = spec.meta['contentsdk-component-variant-name'];
    const title = spec.title;

    if (componentType !== 'variant') {
      console.error(
        chalk.red(
          `The component "${title}" is not a content-sdk variant. Please, select a content-sdk variant to use this command.`
        )
      );

      return;
    }

    if (!targetPath) {
      const { paths, exclude } = cliConfig.componentMap;

      const components = getComponentList(paths, exclude, true);

      const registeredComponent = components.find((c) => c.componentName === componentName);

      if (registeredComponent) {
        targetPath = registeredComponent.filePath
          .replace(/\\/g, '/')
          .replace(/([^/]+)\.([^.]+)$/, `$1.${variantName}.$2`);
      } else {
        targetPath = await inquirer
          .prompt({
            type: 'input',
            name: 'targetPath',
            required: true,
            message: `Enter the target path for the component variant.\nThe filename must follow the format: {componentName}.{variantName}.ts\n(example: src/components/MyComponent/MyComponent.variantA.ts):`,
          })
          .then((answer) => answer.targetPath);
      }
    }

    const registryUrl = getComponentRegistryUrl({
      variantId,
      contextId,
      targetPath: targetPath as string,
    });

    execSync(`npx shadcn@latest add ${registryUrl}${overwrite ? ' --overwrite' : ''}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    if (!skipComponentMap) {
      generateMapHandler({ config });
    }

    console.log(chalk.green(`Component variant ${variantName} added successfully`));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Failed to add component variant: ${errorMessage}`));
    return;
  }
}
