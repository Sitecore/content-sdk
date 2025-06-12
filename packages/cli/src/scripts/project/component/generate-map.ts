import { Argv } from 'yargs';
import { watchItems } from '../../../utils/watch-items';
import loadCliConfig from '../../../utils/load-config';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv<GenerateMapCliArgs>) {
  return yargs.command<GenerateMapCliArgs>(
    'generate-map',
    'Generates component map based on provided paths',
    args,
    handler
  );
}

/**
 * The arguments for the build command.
 */
export type GenerateMapCliArgs = {
  /**
   * If true, watches for changes in the specified paths and updates the component map accordingly.
   */
  watch?: boolean;
  /**
   * Path to the `sitecore.cli.config` file.
   * Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.
   */
  config?: string;
};

/**
 * @param {Argv} yargs
 */
export function args(yargs: Argv<GenerateMapCliArgs>) {
  return yargs
    .option('watch', {
      requiresArg: false,
      type: 'boolean',
      describe:
        'If true, watches for changes in the specified paths and updates the component map accordingly.',
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
 * Handler for the `generate-map` command.
 * @param {GenerateMapCliArgs} argv Cli arguments for the command
 */
export function handler(argv: GenerateMapCliArgs) {
  const cliConfig = loadCliConfig(argv.config);
  if (!cliConfig.generateComponentMap) {
    console.error(
      'The `sitecore.cli.config` file is missing a `generateComponentMap` configuration. Please add it to use this command.'
    );
    return;
  }
  const componentMapGenerator = cliConfig.generateComponentMap.generator;
  const { paths, destination, packages, exclude } = cliConfig.generateComponentMap.args;
  if (argv.watch) {
    console.log(
      `Watching for component changes to component builder sources in:\n ${paths.join('\n')}`
    );
    watchItems(paths, componentMapGenerator.bind(null, { paths, destination, packages, exclude }));
  } else {
    console.log(`Generating component map for:\n ${paths.join('\n')}`);
    componentMapGenerator({ paths, destination, packages, exclude });
  }
}
