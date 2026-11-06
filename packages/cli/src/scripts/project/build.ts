import loadCliConfig from '../../utils/load-config';
import { ensureSitecoreDirectory } from '../../utils/ensure-sitecore-directory';
import { trackAppBuilt } from '../../telemetry/track';

export const command = ['build', 'b'];

export const describe = 'Performs build time automation';

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
  /**
   * Skip usage telemetry for this run.
   */
  noTelemetry?: boolean;
};

/**
 * Handler for the build command.
 * @param {BuildArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: BuildArgs) {
  ensureSitecoreDirectory();

  try {
    const cliConfig = loadCliConfig(argv.config);

    if (cliConfig.build && Array.isArray(cliConfig.build.commands)) {
      for (const command of cliConfig.build.commands) {
        await command({ scConfig: cliConfig.config });
      }
    }

    await trackAppBuilt({
      success: true,
      config: cliConfig.config,
      noTelemetry: argv.noTelemetry,
    });
  } catch (error) {
    await trackAppBuilt({
      success: false,
      error,
      noTelemetry: argv.noTelemetry,
    });
    throw error;
  }

  // grace period for all pooled connections to close (https://github.com/nodejs/undici/issues/5680)
  await new Promise((resolve) => setTimeout(resolve, 250));
  // Exit the process to avoid hanging the process by custom build commands
  process.exit(0);
}
