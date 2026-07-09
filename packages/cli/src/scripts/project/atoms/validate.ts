import { constants } from '@sitecore-content-sdk/core';
import loadCliConfig from '../../../utils/load-config';
import { ValidateResult } from './types';
import { loadCatalog, loadCurrentAtoms, readLockFile } from './utils';

export const command = ['validate', 'v'];

export const describe =
  'Validate that the current atom implementations match the lock file. Fails if any atom has changed without a version bump.';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe: 'Path to the `sitecore.cli.config` file.',
    alias: 'c',
  },
};

export type ValidateArgs = {
  config?: string;
};

/**
 * Handler for `sitecore-tools project atoms validate`.
 * Reads the lock file and compares hashes against current atom definitions.
 * @param {ValidateArgs} argv - The arguments passed to the command.
 */
export async function handler(argv: ValidateArgs) {
  const cliConfig = loadCliConfig(argv.config);
  const breakOnError = cliConfig.atoms?.validation?.breakOnError ?? false;

  const result = await validateLockFile();

  if (!result.valid) {
    console.error(constants.ERROR_MESSAGES.IE_008);
    for (const issue of result.issues) {
      console.error(`  - ${issue}`);
    }

    if (breakOnError) throw new Error(constants.ERROR_MESSAGES.IE_009);
  } else console.log('[atoms validate] atoms.lock.json is up to date.');
}

/**
 * Validate the lock file against current atom definitions.
 * @returns A result with issues if any atom hash or version does not match.
 * @internal
 */
async function validateLockFile(): Promise<ValidateResult> {
  const lock = readLockFile();
  if (!lock)
    return {
      valid: false,
      issues: [constants.ERROR_MESSAGES.MV_012],
    };

  const currentAtoms = await loadCurrentAtoms();
  const catalogData = loadCatalog().data;
  const catalogVersion = typeof catalogData?.version === 'string' ? catalogData.version : undefined;
  const issues: string[] = [];

  // Check catalog root version drift (skip only when neither side declares a version)
  if (lock.version !== undefined || catalogVersion !== undefined) {
    if (catalogVersion !== lock.version) {
      const lockSide = lock.version !== undefined ? `"${lock.version}"` : 'not set';
      const currentSide = catalogVersion !== undefined ? `"${catalogVersion}"` : 'not set';
      issues.push(constants.ERROR_MESSAGES.IV_008(lockSide, currentSide));
    }
  }

  // Check for atoms in lock but missing from current definitions
  for (const [name, entry] of Object.entries(lock.atoms)) {
    if (!currentAtoms[name]) {
      issues.push(constants.ERROR_MESSAGES.MV_013(name));
      continue;
    }

    const current = currentAtoms[name];
    const currentVersion = current.version ?? undefined;

    // Check per-atom version drift (skip only when neither side declares a version)
    if (entry.version !== undefined || currentVersion !== undefined) {
      if (entry.version !== currentVersion) {
        const lockSide = entry.version !== undefined ? `"${entry.version}"` : 'not set';
        const currentSide = currentVersion !== undefined ? `"${currentVersion}"` : 'not set';
        issues.push(constants.ERROR_MESSAGES.IV_009(name, lockSide, currentSide));
      }
    }

    if (current.schemaHash !== entry.hash) {
      issues.push(constants.ERROR_MESSAGES.IV_010(name));
    }
  }

  // Check for new atoms not in lock file
  for (const name of Object.keys(currentAtoms)) {
    if (!lock.atoms[name]) issues.push(constants.ERROR_MESSAGES.MV_014(name));
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
