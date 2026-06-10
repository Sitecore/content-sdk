/**
 * Shape of a single atom entry in the lock file.
 * @internal
 */
export interface AtomLockEntry {
  /** Semver version of this component. Absent when not declared on the component. */
  version?: string;
  hash: string;
}

/**
 * Shape of the lock file.
 * @internal
 */
export interface AtomVersionsLock {
  /** Catalog root version from `defineAtomsCatalog`. Absent when not declared. */
  version?: string;
  generated: string;
  atoms: Record<string, AtomLockEntry>;
}

/**
 * Atoms info extracted from the catalog, used for lock file generation and validation.
 * @internal
 */
export interface AtomInfo {
  version: string;
  schemaHash: string;
}

/**
 * Map of atom name to its info (version and schema hash) extracted from the catalog.
 * @internal
 */
export type AtomsInfoMap = Record<string, AtomInfo>;

/**
 * Load the raw catalog object from the project's atoms module.
 * @returns The raw catalog export from the atoms module, which should include component definitions and optionally a version.
 * @internal
 */
export interface CatalogLoadResult {
  data?: { components?: Record<string, Record<string, unknown>>; version?: string };
  componentNames?: string[];
}

/**
 * Result of a lock file validation.
 * @internal
 */
export interface ValidateResult {
  valid: boolean;
  issues: string[];
}

