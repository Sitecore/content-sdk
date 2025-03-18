import loadCliConfig from '../utils/load-config';
export const command = 'build';

export const describe = 'Handles build time automation';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe:
      'Path to the `sitecore.cli.config` file. Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.',
  },
};

/**
 * The arguments for the build command.
 */
export type BuildArgs = {
  /**
   * Path to the `sitecore.cli.config` file.
   * Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.
   */
  config?: string;
};

/**
 * Handler for the build command.
 * @param {BuildArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: BuildArgs) {
  const cliConfig = loadCliConfig(argv.config);

  if (cliConfig.build && Array.isArray(cliConfig.build.commands)) {
    for (const command of cliConfig.build.commands) {
      await command();
    }
  }
}
