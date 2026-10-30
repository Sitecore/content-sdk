import { readFileSync, realpathSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS_PATH } from '../constants.ts';

/** The part of a changeset the scripts read. */
export interface ChangesetLike {
  id: string;
  releases: { name: string; type: string }[];
}

/**
 * Reads `.changeset/products.config.json`.
 * @param {string} cwd repository root
 * @returns {Record<string, string[]>} product name -> packages
 */
export function readProducts(cwd: string): Record<string, string[]> {
  return JSON.parse(readFileSync(path.join(cwd, PRODUCTS_PATH), 'utf8'));
}

/**
 * True when the calling module is the script being run (not imported, e.g. by tests).
 * @param {string} moduleUrl - the caller's `import.meta.url`
 */
export const isMainModule = (moduleUrl: string): boolean => {
  try {
    return (
      !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(moduleUrl))
    );
  } catch {
    return false;
  }
};

/**
 * Runs a script's `main` when the module is the script being run: an error is printed with its
 * stack trace and exits 1.
 * @param {string} moduleUrl - the caller's `import.meta.url`
 * @param {Function} main - the script's entry point
 */
export const runMain = (moduleUrl: string, main: () => Promise<void>): void => {
  if (!isMainModule(moduleUrl)) return;
  main().catch((error: unknown) => {
    console.error(
      'Error:',
      error instanceof Error ? { message: error.message, stack: error.stack } : error
    );
    process.exit(1);
  });
};
