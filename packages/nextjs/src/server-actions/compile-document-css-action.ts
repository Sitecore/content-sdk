'use server';
import { getAtomsCssCompiler } from '@sitecore-content-sdk/core';

/**
 * Server Action that compiles CSS for a given set of class tokens extracted from an MMS
 * Document. Returns compiled CSS from the registered atoms compiler, or an empty string
 * when no compiler is registered.
 *
 * Register a compiler via `setAtomsCssCompiler` / `registerTailwindCssCompiler` in
 * `instrumentation.ts` before using this action. The action does not default to Tailwind;
 * apps choose their compiler explicitly.
 *
 * Intended to be passed as `atomsConfig.compileCssAction` in the app's `SitecoreProvider`.
 * @example
 * ```tsx
 * // instrumentation-node.ts
 * import { registerTailwindCssCompiler } from '@sitecore-content-sdk/nextjs/instrumentation';
 * await registerTailwindCssCompiler('src/app/globals.css');
 *
 * // src/Providers.tsx  ('use client')
 * import { compileCssForDocumentAction } from '@sitecore-content-sdk/nextjs/server-actions';
 *
 * <SitecoreProvider
 *   atomsConfig={{ catalog, registry, navigate, compileCssAction: compileCssForDocumentAction }}
 * />
 * ```
 * @param {string[]} classes - Class tokens to compile.
 * @returns {Promise<string>} Compiled CSS, or empty string if no classes or no compiler.
 * @public
 */
export async function compileCssForDocumentAction(classes: string[]): Promise<string> {
  if (!classes.length) return '';

  const compiler = getAtomsCssCompiler();
  if (!compiler) return '';

  return compiler(classes);
}
