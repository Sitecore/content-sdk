import { setAtomsCssCompiler, getAtomsCssCompiler } from '@sitecore-content-sdk/core';
import { DEFAULT_ATOMS_CSS_FILE } from './constants';
import { createCachedTailwindCssCompiler } from './tailwind-compiler';

export { setAtomsCssCompiler, getAtomsCssCompiler };
export { DEFAULT_ATOMS_CSS_FILE } from './constants';

/**
 * Compiles Tailwind CSS from the app's main stylesheet and registers the result as the
 * atoms CSS compiler (via `setAtomsCssCompiler`) so that class names that exist only in
 * runtime MMS Document JSON get compiled and injected at request time.
 *
 * Intended to be called once at server startup from a Node.js-only
 * `instrumentation-node.ts` file (imported conditionally from `instrumentation.ts` when
 * `NEXT_RUNTIME === 'nodejs'`). Compiled CSS is cached per class-set; each cache miss
 * uses a fresh Tailwind `compile()` so previously used classes are not retained.
 * @param {string} [cssFilePath] - Path to the app's main CSS file
 * (e.g. `src/app/globals.css`), relative to `process.cwd()` or absolute.
 * Defaults to `DEFAULT_ATOMS_CSS_FILE`.
 * @returns {Promise<void>} Resolves once the compiler has been created and registered.
 * @public
 */
export async function registerTailwindCssCompiler(
  cssFilePath: string = DEFAULT_ATOMS_CSS_FILE
): Promise<void> {
  setAtomsCssCompiler(createCachedTailwindCssCompiler(cssFilePath));
}
