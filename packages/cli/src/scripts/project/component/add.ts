import { Argv } from 'yargs';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import * as tools from '@sitecore-content-sdk/content/tools';
import inquirer from 'inquirer';
import { handler as generateMapHandler } from './generate-map';
import loadCliConfig from '../../../utils/load-config';

let { getComponentSpec, getComponentList, getComponentSpecUrl } = tools;

export const unitMocks = (
  toolsModule: Pick<typeof tools, 'getComponentSpec' | 'getComponentList' | 'getComponentSpecUrl'>
) => {
  getComponentSpec = toolsModule.getComponentSpec;
  getComponentList = toolsModule.getComponentList;
  getComponentSpecUrl = toolsModule.getComponentSpecUrl;
};

type AddArgs = {
  /**
   * The unique identifier of the newly created component.
   */
  componentId: string;
  /**
   * The authentication token.
   */
  token: string;
  /**
   * The target path for the component.
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
    .positional('componentId', {
      requiresArg: true,
      positional: true,
      type: 'string',
      describe: `The unique identifier of the newly created component.`,
    })
    .option('token', {
      requiresArg: true,
      type: 'string',
      describe: 'The authentication token.',
      demandOption: true,
      alias: 't',
    })
    .option('target-path', {
      requiresArg: false,
      type: 'string',
      describe:
        'The relative target path for the component.\n(Example: components/Promo.WithText.ts)',
      alias: 'p',
    })
    .option('skip-component-map', {
      requiresArg: false,
      type: 'boolean',
      describe: 'If true, skips the component map generation.',
      default: false,
      alias: 's',
    })
    .option('overwrite', {
      requiresArg: false,
      type: 'boolean',
      describe: 'If true, overwrites the existing component.',
      default: false,
      alias: 'o',
    })
    .option('config', {
      requiresArg: false,
      type: 'string',
      describe:
        'Path to the `sitecore.cli.config` file. Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats',
      alias: 'c',
    });
}

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv<AddArgs>) {
  /* istanbul ignore next */
  return yargs.command<AddArgs>(
    ['add <component-id>', 'a <component-id>'],
    'Adds a component',
    args,
    handler
  );
}

/**
 * Validates the target path. If no target path is provided, returns true.
 * @param {string} [targetPath] - The target path to validate.
 * @returns {boolean | string} True if the target path is valid, the error message otherwise.
 */
const validateTargetPath = (targetPath?: string) => {
  if (!targetPath) {
    return true;
  }

  // Check for unsafe absolute path starting with "/"
  if (path.isAbsolute(targetPath)) {
    return 'Target path cannot be an absolute path starting with "/"';
  }

  // Check for path traversal attempts
  if (targetPath.includes('..')) {
    return 'Target path cannot contain ".." (path traversal)';
  }

  return true;
};

/**
 * Handler for the add command.
 * @param {AddArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: AddArgs) {
  const {
    componentId,
    token,
    targetPath: targetPathArg,
    skipComponentMap,
    config,
    overwrite,
  } = argv;

  console.log(chalk.green('Adding component'));

  let targetPath = targetPathArg;

  const cliConfig = loadCliConfig(config);

  if (!cliConfig.config) {
    console.error(
      'The `sitecore.cli.config` file is missing a `config`. Please add it to use this command.'
    );
    return;
  }

  const { edgeUrl } = cliConfig.config.api.edge;
  let backupPath: string | undefined;
  let resolvedFilePath: string | undefined;

  try {
    if (validateTargetPath(targetPath) !== true) {
      console.error(chalk.red(validateTargetPath(targetPath)));
      return;
    }

    const spec = await getComponentSpec({
      edgeUrl,
      componentId,
      targetPath,
      token,
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
            message: `Enter the target path for the component.\n(Example: components/Promo.WithText.ts):`,
            validate: validateTargetPath,
          })
          .then((answer) => answer.targetPath);
      }
    }

    resolvedFilePath = path.resolve(process.cwd(), targetPath as string);
    const isFileAlreadyExists = fs.existsSync(resolvedFilePath);
    backupPath = `${resolvedFilePath}.backup`;

    if (isFileAlreadyExists) {
      if (!overwrite) {
        const shouldOverwrite = await inquirer.prompt({
          type: 'confirm',
          name: 'overwrite',
          message: `File already exists: ${targetPath}. Overwrite?`,
          default: false,
        });

        if (!shouldOverwrite.overwrite) {
          return;
        }
      }

      fs.renameSync(resolvedFilePath, backupPath);

      console.log(chalk.yellow(`Overwriting existing file: ${targetPath}`));
    }

    const componentSpecUrl = getComponentSpecUrl({
      componentId,
      targetPath: targetPath as string,
      edgeUrl,
      token,
    });

    execSync(`npx shadcn@^3.4.2 add "${componentSpecUrl}"`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    if (isFileAlreadyExists) {
      fs.unlinkSync(backupPath);
    }

    if (!skipComponentMap) {
      generateMapHandler({ config });
    }

    console.log(chalk.green(`Component ${componentName} added successfully`));
  } catch (error) {
    if (backupPath && resolvedFilePath && fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, resolvedFilePath);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Failed to add component: ${errorMessage}`));
    return;
  }
}
