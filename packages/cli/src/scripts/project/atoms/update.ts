import { AtomLockEntry, AtomVersionsLock } from './types';
import { loadCatalog, loadCurrentAtoms, writeLockFile } from './utils';

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
 */
export async function handler() {
  const currentAtoms = await loadCurrentAtoms();
  const catalog = loadCatalog();
  const catalogData = catalog.data as Record<string, unknown>;
  const catalogVersion = typeof catalogData?.version === 'string' ? catalogData.version : undefined;

  const atoms: Record<string, AtomLockEntry> = {};
  for (const [name, def] of Object.entries(currentAtoms)) {
    atoms[name] = {
      ...(def.version && { version: def.version }),
      hash: def.schemaHash,
    };
  }

  const lock: AtomVersionsLock = {
    ...(catalogVersion !== undefined && { version: catalogVersion }),
    generated: new Date().toISOString(),
    atoms,
  };

  writeLockFile(lock);

  console.log('[atoms update] Lock file updated successfully.');
}
