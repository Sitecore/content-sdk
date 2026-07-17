/**
 * Registry for the atoms CSS compiler function.
 *
 * This module is intentionally free of React and any UI-framework dependencies
 * so it can be safely imported in server-only contexts such as
 * Next.js `instrumentation.ts`, Server Actions, and RSC.
 *
 * A plain module-level variable is used here. This works reliably because
 * `@sitecore-content-sdk/core` must be listed in the Next.js application's
 * `serverExternalPackages`. That tells Next.js to load it as a native Node.js
 * module rather than bundling it, so all imports across instrumentation code
 * and Server Actions resolve to the same cached module instance.
 */

type CssCompiler = (classes: string[]) => Promise<string>;

let _compiler: CssCompiler | null = null;

/**
 * Registers the CSS compiler function used by `StudioComponentServerWrapper`
 * (production) and `compileCssForDocumentAction` (editing) to generate Tailwind
 * CSS for class names that exist only in runtime MMS Document JSON.
 *
 * Call this in `instrumentation.ts` before the server handles any requests.
 * @param {CssCompiler} fn - Async function that accepts class tokens and returns compiled CSS.
 */
export function setAtomsCssCompiler(fn: CssCompiler): void {
  _compiler = fn;
}

/**
 * Returns the currently registered CSS compiler, or `null` if none has been set.
 */
export function getAtomsCssCompiler(): CssCompiler | null {
  return _compiler;
}

