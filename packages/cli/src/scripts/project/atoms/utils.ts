import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ensureSitecoreDirectory } from '../../../utils/ensure-sitecore-directory';
import { AtomsInfoMap, AtomVersionsLock, CatalogLoadResult } from './types';
import { ATOMS_MODULE_PATH, LOCK_FILE_DIR, LOCK_FILE_NAME } from './constants';

/**
 * Get the absolute path to the lock file.
 * @returns {string} Absolute path to the lock file.
 * @internal
 */
export function getLockFilePath(): string {
  return path.resolve(process.cwd(), LOCK_FILE_DIR, LOCK_FILE_NAME);
}

/**
 * Compute a SHA-256 hash of a value serialized as JSON.
 * @param {unknown} schema - The component definition to hash.
 * @internal
 */
export function hashSchema(schema: unknown): string {
  const json = JSON.stringify(schema, null, 0);
  return crypto.createHash('sha256').update(json).digest('hex');
}

/**
 * Read the existing lock file. Returns null if it doesn't exist.
 * @internal
 */
export function readLockFile(): AtomVersionsLock | null {
  ensureSitecoreDirectory();
  const lockPath = getLockFilePath();
  if (!fs.existsSync(lockPath)) return null;

  const content = fs.readFileSync(lockPath, 'utf-8');
  return JSON.parse(content) as AtomVersionsLock;
}

/**
 * Write the lock file to disk.
 * @param {AtomVersionsLock} lock - The lock data to write. Will be stringified as JSON.
 * @internal
 */
export function writeLockFile(lock: AtomVersionsLock): void {
  const lockPath = getLockFilePath();
  const dir = path.dirname(lockPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf-8');
}

/**
 * Resolve the absolute path to the atoms module, trying common extensions.
 * @internal
 */
export function resolveAtomsModulePath(): string | null {
  const base = path.resolve(process.cwd(), ATOMS_MODULE_PATH);
  const extensions = ['.ts', '.tsx'];

  for (const ext of extensions) {
    if (fs.existsSync(base + ext)) return base + ext;
  }

  return null;
}

/**
 * Load the raw catalog object from the project's atoms module.
 * @internal
 */
export function loadCatalog(): CatalogLoadResult {
  const modulePath = resolveAtomsModulePath();
  if (!modulePath) {
    throw new Error(
      `Atoms module not found at ${ATOMS_MODULE_PATH}.{ts,tsx}. Ensure your atoms are defined in src/atoms/index.{ts,tsx}`
    );
  }

  const tsx = require('tsx/cjs/api');

  const atomsModule = tsx.require(modulePath, __filename);
  const catalog = atomsModule.catalog ?? atomsModule.default?.catalog;
  if (!catalog)
    throw new Error(
      `Atoms module at ${modulePath} does not export "catalog". Export the result of defineAtomsCatalog as "catalog".`
    );

  return catalog;
}

/**
 * Load the current atom definitions from the project's atoms module.
 * Uses tsx to import TypeScript at runtime.
 * Returns a map of atom name to { version, schemaHash }.
 * @param {CatalogLoadResult} [catalog] - Optional pre-loaded catalog. If omitted, the catalog is loaded from disk.
 * @internal
 */
export async function loadCurrentAtoms(catalog?: CatalogLoadResult): Promise<AtomsInfoMap> {
  const modulePath = resolveAtomsModulePath();
  if (!modulePath)
    throw new Error(
      `Atoms module not found at ${ATOMS_MODULE_PATH}.{ts,tsx}. Ensure your atoms are defined in src/atoms/index.{ts,tsx} and export a catalog.`
    );

  const resolvedCatalog = catalog ?? loadCatalog();
  const result: AtomsInfoMap = {};
  const componentNames = resolvedCatalog.componentNames ?? [];
  const components = resolvedCatalog.data?.components ?? {};

  for (const name of componentNames) {
    // Use the component's full data (props schema, slots, etc.) for schema hash except the version, which is pulled out separately.
    const { version: atomVersion, ...componentData } = components[name] ?? {};

    result[name] = {
      version: (atomVersion as string) ?? undefined,
      schemaHash: hashSchema(componentData),
    };
  }

  return result;
}
