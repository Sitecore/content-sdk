/**
 * Atom versions lock file management per ADR-001.
 *
 * Lock file: `.sitecore/atom-versions.lock.json`
 *
 * Shape:
 * {
 *   "version": "1.0.0",        // catalog root version (from defineAtomsCatalog)
 *   "generated": "<ISO date>", // when last regenerated
 *   "atoms": {
 *     "<atomName>": {
 *       "version": "<semver>", // developer-managed atom version
 *       "hash": "<schema_sha256>"  // SHA-256 of the component's catalog schema definition
 *     }
 *   }
 * }
 *
 * Workflow:
 * - `atoms update`: regenerates the lock file from the current catalog
 * - `atoms verify`: compares current hashes to lock file; fails on mismatch
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const LOCK_FILE_DIR = '.sitecore';
const LOCK_FILE_NAME = 'atom-versions.lock.json';

/**
 * Shape of a single atom entry in the lock file.
 */
export interface AtomLockEntry {
  /** Semver version of this component. Absent when not declared on the component. */
  version?: string;
  hash: string;
}

/**
 * Shape of the lock file.
 */
export interface AtomVersionsLock {
  /** Catalog root version from `defineAtomsCatalog`. Absent when not declared. */
  version?: string;
  generated: string;
  atoms: Record<string, AtomLockEntry>;
}

/**
 * Result of a lock file verification.
 */
export interface VerifyResult {
  valid: boolean;
  issues: string[];
}

/**
 * Get the absolute path to the lock file.
 */
function getLockFilePath(): string {
  return path.resolve(process.cwd(), LOCK_FILE_DIR, LOCK_FILE_NAME);
}

/**
 * Compute a SHA-256 hash of a value serialized as JSON.
 */
function hashSchema(schema: unknown): string {
  const json = JSON.stringify(schema, null, 0);
  return crypto.createHash('sha256').update(json).digest('hex');
}

/**
 * Read the existing lock file. Returns null if it doesn't exist.
 */
function readLockFile(): AtomVersionsLock | null {
  const lockPath = getLockFilePath();
  if (!fs.existsSync(lockPath)) {
    return null;
  }
  const content = fs.readFileSync(lockPath, 'utf-8');
  return JSON.parse(content) as AtomVersionsLock;
}

/**
 * Write the lock file to disk.
 */
function writeLockFile(lock: AtomVersionsLock): void {
  const lockPath = getLockFilePath();
  const dir = path.dirname(lockPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf-8');
}

/**
 * Standard path for the atoms catalog module relative to the project root.
 */
const ATOMS_MODULE_PATH = 'src/atoms/index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsx = require('tsx/cjs/api');

/**
 * Resolve the absolute path to the atoms module, trying common extensions.
 */
function resolveAtomsModulePath(): string | null {
  const base = path.resolve(process.cwd(), ATOMS_MODULE_PATH);
  const extensions = ['.ts', '.tsx', '.js', '.mjs'];
  for (const ext of extensions) {
    if (fs.existsSync(base + ext)) {
      return base + ext;
    }
  }
  return null;
}

/**
 * Load the raw catalog object from the project's atoms module.
 * Exported so other commands (e.g. inspect) can access the catalog directly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadCatalog(): any {
  const modulePath = resolveAtomsModulePath();
  if (!modulePath) {
    throw new Error(
      `Atoms module not found at ${ATOMS_MODULE_PATH}.{ts,tsx,js,mjs}. ` +
        `Ensure your atoms are defined in src/atoms/index.ts`
    );
  }

  const atomsModule = tsx.require(modulePath, __filename);
  const catalog = atomsModule.catalog ?? atomsModule.default?.catalog;
  if (!catalog) {
    throw new Error(
      `Atoms module at ${modulePath} does not export "catalog". ` +
        `Export the result of defineAtomsCatalog as "catalog".`
    );
  }

  return catalog;
}

/**
 * Load the current atom definitions from the project's atoms module.
 * Uses tsx to import TypeScript at runtime.
 * Returns a map of atom name to { version, schemaHash }.
 */
async function loadCurrentAtoms(): Promise<
  Record<string, { version: string; schemaHash: string }>
> {
  const modulePath = resolveAtomsModulePath();
  if (!modulePath) {
    throw new Error(
      `Atoms module not found at ${ATOMS_MODULE_PATH}.{ts,tsx,js,mjs}. ` +
        `Ensure your atoms are defined in src/atoms/index.ts`
    );
  }

  const catalog = loadCatalog();

  // Extract component info from the catalog
  const result: Record<string, { version: string; schemaHash: string }> = {};

  const componentNames: string[] = catalog.componentNames ?? [];
  // catalog.data.components holds the per-component schema definitions
  const components: Record<string, Record<string, unknown>> = (
    catalog.data as Record<string, unknown>
  )?.components as Record<string, Record<string, unknown>>;

  for (const name of componentNames) {
    // Use the component's full data (props schema, version, slots, etc.) for schema hash
    const componentData = components?.[name] ?? { name };
    const componentVersion =
      typeof componentData.version === 'string' ? componentData.version : undefined;

    result[name] = {
      version: componentVersion ?? '',
      schemaHash: hashSchema(componentData),
    };
  }

  return result;
}

/**
 * Verify the lock file against current atom definitions.
 * Returns a result with issues if any atom hash or version does not match.
 */
export async function verifyLockFile(): Promise<VerifyResult> {
  const lock = readLockFile();
  if (!lock) {
    return {
      valid: false,
      issues: ['Lock file not found. Run `sitecore-tools project atoms update` to generate it.'],
    };
  }

  const currentAtoms = await loadCurrentAtoms();
  const catalog = loadCatalog();
  const catalogData = catalog.data as Record<string, unknown>;
  const catalogVersion = typeof catalogData?.version === 'string' ? catalogData.version : undefined;
  const issues: string[] = [];

  // Check catalog root version drift (skip only when neither side declares a version)
  if (lock.version !== undefined || catalogVersion !== undefined) {
    if (catalogVersion !== lock.version) {
      const lockSide = lock.version !== undefined ? `"${lock.version}"` : 'not set';
      const currentSide = catalogVersion !== undefined ? `"${catalogVersion}"` : 'not set';
      issues.push(
        `Catalog version mismatch: lock file has ${lockSide}, current is ${currentSide}. ` +
          `Run \`sitecore-tools project atoms update\` to sync.`
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
          `Atom "${name}" version mismatch: lock file has ${lockSide}, current is ${currentSide}. ` +
            `Run \`sitecore-tools project atoms update\` to sync.`
        );
      }
    }

    if (current.schemaHash !== entry.hash) {
      issues.push(
        `Atom "${name}" schema has changed. ` +
          `Bump the version and run \`sitecore-tools project atoms update\`.`
      );
    }
  }

  // Check for new atoms not in lock file
  for (const name of Object.keys(currentAtoms)) {
    if (!lock.atoms[name]) {
      issues.push(
        `Atom "${name}" is new and not in the lock file. ` +
          `Run \`sitecore-tools project atoms update\` to add it.`
      );
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Regenerate the lock file from current atom definitions.
 */
export async function updateLockFile(): Promise<void> {
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
}

