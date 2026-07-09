/**
 * Shape of a single atom entry in the lock file.
 * @internal
 */
export interface AtomLockEntry {
  /** Semver version of this component. Absent when not declared on the component. */
  version?: string;
  /** Hash of the component's schema, used to detect changes in the schema. */
  hash: string;
}

/**
 * Shape of the lock file.
 * @internal
 */
export interface AtomVersionsLock {
  /** Catalog root version from `defineAtomsCatalog`. Absent when not declared. */
  version?: string;
  /** Timestamp of when the lock file was generated. */
  generated: string;
  /** Map of atom name to its lock entry. */
  atoms: Record<string, AtomLockEntry>;
}

/**
 * Atoms info extracted from the catalog, used for lock file generation and validation.
 * @internal
 */
export interface AtomInfo {
  /** Semver version of this component. Absent when not declared on the component. */
  version: string;
  /** Hash of the component's schema, used to detect changes in the schema. */
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
  /** Whether the lock file is valid (all hashes and versions match). */
  valid: boolean;
  /** List of issues found during validation, if any. */
  issues: string[];
}
