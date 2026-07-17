'use server';
import { getAtomsCssCompiler } from '@sitecore-content-sdk/core';
import { extractDocumentCssLayers } from '../instrumentation/css-layers';
import { createTailwindCompiler } from '../instrumentation/tailwind-compiler';

// Lazy-initialized fallback compiler. Used when no custom compiler is registered
// via setAtomsCssCompiler / registerTailwindCssCompiler.
let _lazyCompiler: Awaited<ReturnType<typeof createTailwindCompiler>> | null = null;

/**
 * Returns the lazily-initialized fallback Tailwind compiler, creating it from
 * `src/app/globals.css` on first call and reusing it on subsequent calls.
 * @returns {Promise<Awaited<ReturnType<typeof createTailwindCompiler>>>} The Tailwind compiler instance.
 * @internal
 */
async function getLazyCompiler(): Promise<Awaited<ReturnType<typeof createTailwindCompiler>>> {
  if (!_lazyCompiler) {
    _lazyCompiler = await createTailwindCompiler('src/app/globals.css');
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
 * @returns {Promise<string>} Compiled utilities-only CSS, or empty string if no classes.
 * @public
 */
export async function compileCssForDocumentAction(classes: string[]): Promise<string> {
  if (!classes.length) return '';

  // Use custom compiler if registered via setAtomsCssCompiler (non-standard setups)
  const customCompiler = getAtomsCssCompiler();
  if (customCompiler) return customCompiler(classes);

  // Default: lazily initialize from src/app/globals.css on first call
  const compiler = await getLazyCompiler();
  return extractDocumentCssLayers(compiler.build(classes));
}

