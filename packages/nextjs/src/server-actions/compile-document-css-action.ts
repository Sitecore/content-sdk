'use server';
import { getAtomsCssCompiler } from '@sitecore-content-sdk/core';
import { DEFAULT_ATOMS_CSS_FILE } from '../instrumentation/constants';
import { createCachedTailwindCssCompiler } from '../instrumentation/tailwind-compiler';

// Lazy-initialized fallback compiler. Used when no compiler is registered
// via setAtomsCssCompiler / registerTailwindCssCompiler.
let _lazyCompiler: ((classes: string[]) => Promise<string>) | null = null;

/**
 * Returns the lazily-initialized fallback Tailwind compiler, creating it from
 * the default App Router stylesheet on first call and reusing it on subsequent calls.
 * @returns {(classes: string[]) => Promise<string>} Cached Tailwind compiler function.
 * @internal
 */
function getLazyCompiler(): (classes: string[]) => Promise<string> {
  if (!_lazyCompiler) {
    _lazyCompiler = createCachedTailwindCssCompiler(DEFAULT_ATOMS_CSS_FILE);
  }
  return _lazyCompiler;
}

/**
 * Server Action that compiles Tailwind CSS for a given set of class tokens extracted
 * from an MMS Document. Returns the `@layer theme` block (CSS custom property
 * definitions) and the `@layer utilities` block (utility class rules). The `@layer
 * base` reset rules are omitted since they are already present in the app's main
 * CSS bundle.
 *
 * Uses a registered compiler (via `setAtomsCssCompiler` / `registerTailwindCssCompiler`)
 * if one exists, otherwise lazily initializes a compiler from `src/app/globals.css`.
 * No instrumentation setup is required for the editing (Design Library) path.
 *
 * Output contains CSS for **only** the classes passed in this call (not classes from
 * earlier Document updates), because each compile uses a fresh Tailwind compiler.
 *
 * Intended to be passed as `atomsConfig.compileCssAction` in the app's
 * `SitecoreProvider`.
 * @example
 * ```tsx
 * // src/Providers.tsx  ('use client')
 * import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';
 *
 * <SitecoreProvider
 *   atomsConfig={{ catalog, registry, navigate, compileCssAction: compileCssForDocumentAction }}
 * />
 * ```
 * @param {string[]} classes - Tailwind class tokens to compile.
 * @returns {Promise<string>} Compiled theme + utilities CSS, or empty string if no classes.
 * @public
 */
export async function compileCssForDocumentAction(classes: string[]): Promise<string> {
  if (!classes.length) return '';

  const registeredCompiler = getAtomsCssCompiler();
  if (registeredCompiler) return registeredCompiler(classes);

  return getLazyCompiler()(classes);
}
