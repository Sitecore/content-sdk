import fs from 'fs';
import path from 'path';
import type { CapabilityFilterContext } from '@sitecore-content-sdk/core';

const SOURCE_DIRECTORY = 'src';
const SOURCE_FILE = /\.[jt]s$/;
const EXCLUDED_FILE = /\.(d|spec|test)\.[jt]s$/;

/**
 * Tests whether any application source file under `src` satisfies a predicate.
 * Declaration and test files are skipped, and the scan stops at the first match.
 * @param {CapabilityFilterContext} context filter context
 * @param {Function} predicate test applied to each file's source code
 * @returns {boolean} whether any source file matches
 */
export const someSourceFile = (
  { appRoot, readFile }: CapabilityFilterContext,
  predicate: (source: string) => boolean
) => {
  let entries: string[];
  try {
    entries = fs.readdirSync(path.join(appRoot, SOURCE_DIRECTORY), { recursive: true }) as string[];
  } catch {
    return false;
  }

  return entries
    .filter((entry) => SOURCE_FILE.test(entry) && !EXCLUDED_FILE.test(entry))
    .some((entry) => predicate(readFile(path.join(SOURCE_DIRECTORY, entry)) ?? ''));
};

// import { A, B as C } from '<module>'. Type-only imports (`import type { ... }`) don't match.
const NAMED_IMPORT = /import\s+(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]([^'"]+)['"]/g;

/**
 * Gets the imported (not local) names from a named import list, skipping inline type imports.
 * @param {string} namedImports contents of the import braces
 * @returns {string[]} imported names
 */
const getImportedNames = (namedImports: string) =>
  namedImports
    .split(',')
    .map((specifier) => specifier.trim())
    .filter((specifier) => specifier && !specifier.startsWith('type '))
    .map((specifier) => specifier.split(/\s+as\s+/)[0]);

/**
 * Tests whether source code imports any of the given names from a matching module.
 * @param {string} source source code
 * @param {RegExp} modulePattern pattern the module specifier must match
 * @param {string[]} names exported names to look for
 * @returns {boolean} whether any of the names is imported
 */
export const importsNamedExport = (
  source: string,
  modulePattern: RegExp,
  names: readonly string[]
) =>
  Array.from(source.matchAll(NAMED_IMPORT)).some(
    ([, namedImports, moduleName]) =>
      modulePattern.test(moduleName) &&
      getImportedNames(namedImports).some((name) => names.includes(name))
  );
