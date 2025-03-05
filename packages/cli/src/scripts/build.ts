// import path from 'path';
import loadCliConfig from '../utils/load-config';

/* eslint-disable prettier/prettier */
export const command = 'build';

export const describe = 'Handles build time automation';

export const builder = {
  config: {
    requiresArg: true,
    type: 'string',
    describe: 'Path to the Sitecore cli config',
  },
};

/**
 * Handler for the build command.
 * @param {any} argv - The arguments passed to the command.
 */
export async function handler(argv: any) {
  const cliConfig = loadCliConfig(argv.config);

  cliConfig.build.commands.forEach((command: any) => {
    command();
  });
}
