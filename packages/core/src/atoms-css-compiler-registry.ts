/**
 * Registry for the atoms CSS compiler function.
 *
 * This module is intentionally free of React and any UI-framework dependencies
 * so it can be safely imported in server-only contexts such as
 * Next.js `instrumentation.ts`, Server Actions, and RSC.
 *
 * The compiler is stored on `globalThis` under a `Symbol.for` key. Next.js builds
 * instrumentation, RSC, and Server Actions as separate bundles, each with its own
 * copy of this module, but they all run in the same Node.js process and therefore
 * share one `globalThis`. `Symbol.for` returns the same symbol from every copy, so
 * the compiler registered during instrumentation is visible everywhere.
 */

/**
 * Async function that accepts CSS class tokens and returns compiled CSS.
 * @public
 */
export type AtomsCssCompiler = (classes: string[]) => Promise<string>;

const COMPILER_KEY = Symbol.for('sitecore-content-sdk.atomsCssCompiler');

const holder = globalThis as { [COMPILER_KEY]?: AtomsCssCompiler | null };

/**
 * Registers the CSS compiler used by `StudioComponentServerWrapper` (production)
 * and `compileCssForDocumentAction` (editing) to generate CSS for class names
 * that exist only in runtime MMS Document JSON.
 *
 * Call this in `instrumentation.ts` before the server handles any requests.
 * For Tailwind apps, prefer `registerTailwindCssCompiler` from
 * `@sitecore-content-sdk/nextjs/instrumentation`.
 * @param {AtomsCssCompiler} fn - Async function that accepts class tokens and returns compiled CSS.
 * @public
 */
export function setAtomsCssCompiler(fn: AtomsCssCompiler): void {
  holder[COMPILER_KEY] = fn;
}

/**
 * Returns the currently registered CSS compiler, or `null` if none has been set.
 * @returns {AtomsCssCompiler | null} The registered compiler, or `null`.
 * @public
 */
export function getAtomsCssCompiler(): AtomsCssCompiler | null {
  return holder[COMPILER_KEY] ?? null;
}

/**
 * Clears the registered CSS compiler. Intended for tests only.
 * @internal
 */
export function __resetAtomsCssCompiler(): void {
  delete holder[COMPILER_KEY];
}
