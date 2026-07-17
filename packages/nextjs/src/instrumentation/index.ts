import { setAtomsCssCompiler, getAtomsCssCompiler } from '@sitecore-content-sdk/core';
import { extractDocumentCssLayers } from './css-layers';
import { createTailwindCompiler } from './tailwind-compiler';

export { setAtomsCssCompiler, getAtomsCssCompiler };

/**
 * Compiles Tailwind CSS from the app's main stylesheet and registers the result as the
 * atoms CSS compiler (via `setAtomsCssCompiler`) so that class names that exist only in
 * runtime MMS Document JSON get compiled and injected at request time.
 *
 * Intended to be called once at server startup from a Node.js-only
 * `instrumentation-node.ts` file (imported conditionally from `instrumentation.ts` when
 * `NEXT_RUNTIME === 'nodejs'`). The compiler is created once and reused across requests.
 * @param {string} cssFilePath - Path to the app's main CSS file (e.g. `src/app/globals.css`),
 * relative to `process.cwd()` or absolute.
 * @returns {Promise<void>} Resolves once the compiler has been created and registered.
 * @public
 */
export async function registerTailwindCssCompiler(cssFilePath: string): Promise<void> {
  const compiler = await createTailwindCompiler(cssFilePath);

  setAtomsCssCompiler((classes: string[]) =>
    Promise.resolve(extractDocumentCssLayers(compiler.build(classes)))
  );
}
