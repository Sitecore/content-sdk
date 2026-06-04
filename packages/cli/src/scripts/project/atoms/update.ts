import { updateLockFile } from './lock-file';

export const command = 'update';

export const describe =
  'Regenerate the atom versions lock file from the current atom definitions. Run after intentional schema changes.';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe: 'Path to the `sitecore.cli.config` file.',
  },
};

export type UpdateArgs = {
  config?: string;
};

/**
 * Handler for `sitecore-tools project atoms update`.
 * Regenerates `.sitecore/atom-versions.lock.json` from current atom definitions.
 * @param {UpdateArgs} _argv - The arguments passed to the command.
 */
export async function handler(_argv: UpdateArgs) {
  await updateLockFile();
  console.log('[atoms update] Lock file updated successfully.');
}

