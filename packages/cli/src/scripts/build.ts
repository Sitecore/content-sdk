import loadCliConfig from '../utils/load-config';
export const command = 'build';

export const describe = 'Handles build time automation';

export const builder = {
  config: {
    requiresArg: true,
    type: 'string',
    describe: 'Path to the `sitecore.cli.config` file. Supports both JavaScript (`.js`) and TypeScript (`.ts`) formats.',
  },
};

/**
 * Handler for the build command.
 * @param {any} argv - The arguments passed to the command.
 */
export async function handler(argv: any) {
  const cliConfig = loadCliConfig(argv.config);

  if (cliConfig.build && Array.isArray(cliConfig.build.commands)) {
    cliConfig.build.commands.forEach((command: any) => {
      command();
    });
  }
}
