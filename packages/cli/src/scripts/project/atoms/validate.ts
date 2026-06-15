import loadCliConfig from '../../../utils/load-config';
import { ValidateResult } from './types';
import { loadCatalog, loadCurrentAtoms, readLockFile } from './utils';

export const command = 'validate';

export const describe =
  'Validate that the current atom implementations match the lock file. Fails if any atom has changed without a version bump.';

export const builder = {
  config: {
    requiresArg: false,
    type: 'string',
    describe: 'Path to the `sitecore.cli.config` file.',
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
    console.error('[atoms validate] Lock file validation failed:');
    for (const issue of result.issues) {
      console.error(`  - ${issue}`);
    }

    if (breakOnError)
      throw new Error(
        'Atom validation failed. See issues above. You see this error because `breakOnError` is enabled in your CLI config.'
      );
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
      issues: ['Lock file not found. Run `sitecore-tools project atoms update` to generate it.'],
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
      issues.push(
        `Catalog version mismatch: lock file has ${lockSide}, current is ${currentSide}.`
      );
    }
  }

  // Check for atoms in lock but missing from current definitions
  for (const [name, entry] of Object.entries(lock.atoms)) {
    if (!currentAtoms[name]) {
      issues.push(`Atom "${name}" is in the lock file but not found in current definitions.`);
      continue;
    }

    const current = currentAtoms[name];
    const currentVersion = current.version || undefined;

    // Check per-atom version drift (skip only when neither side declares a version)
    if (entry.version !== undefined || currentVersion !== undefined) {
      if (entry.version !== currentVersion) {
        const lockSide = entry.version !== undefined ? `"${entry.version}"` : 'not set';
        const currentSide = currentVersion !== undefined ? `"${currentVersion}"` : 'not set';
        issues.push(
          `Atom "${name}" version mismatch: lock file has ${lockSide}, current is ${currentSide}.`
        );
      }
    }

    if (current.schemaHash !== entry.hash) {
      issues.push(`Atom "${name}" schema has changed.`);
    }
  }

  // Check for new atoms not in lock file
  for (const name of Object.keys(currentAtoms)) {
    if (!lock.atoms[name])
      issues.push(
        `Atom "${name}" is new and not in the lock file. ` +
          `Run \`sitecore-tools project atoms update\` to add it.`
      );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
