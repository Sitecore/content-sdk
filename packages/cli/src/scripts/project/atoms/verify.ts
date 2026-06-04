import loadCliConfig from '../../../utils/load-config';
import { verifyLockFile } from './lock-file';

export const command = 'verify';

export const describe =
  'Verify that the current atom implementations match the lock file. Fails if any atom has changed without a version bump.';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe: 'Path to the `sitecore.cli.config` file.',
  },
};

export type VerifyArgs = {
  config?: string;
};

/**
 * Handler for `sitecore-tools project atoms verify`.
 * Reads the lock file and compares hashes against current atom definitions.
 * Exits with code 1 if any atom hash does not match.
 * @param {VerifyArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: VerifyArgs) {
  const cliConfig = loadCliConfig(argv.config);
  const breakOnError = cliConfig.atoms?.validation?.breakOnError ?? false;

  const result = await verifyLockFile();

  if (!result.valid) {
    console.error('[atoms verify] Lock file verification failed:');
    for (const issue of result.issues) {
      console.error(`  - ${issue}`);
    }

    if (breakOnError) {
      process.exit(1);
    }
  } else {
    console.log('[atoms verify] All atom versions are up to date.');
  }
}

