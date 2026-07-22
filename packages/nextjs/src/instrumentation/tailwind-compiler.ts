import { compile } from '@tailwindcss/node';
import fs from 'fs';
import path from 'path';
import {
  atomsCssCacheKey,
  setAtomsCssCacheEntry,
} from './constants';
import { extractDocumentCssLayers } from './css-layers';

export type TailwindCompilerHandle = {
  /** Absolute path to the source CSS file. */
  cssPath: string;
  /** Directory used as the resolution base for `@import` / `@source`. */
  base: string;
  /** Raw CSS file contents (cached so we do not re-read on every compile). */
  css: string;
};

/**
 * Loads a CSS file and returns a handle used to compile Document class tokens.
 *
 * Resolves `cssFilePath` (relative to `process.cwd()` if not absolute) and reads
 * its contents once. Call {@link compileClassesFromHandle} for each class set —
 * do **not** reuse a single `@tailwindcss/node` `compiler.build()` across
 * different class sets, because `build()` accumulates candidates and never
 * drops previously seen classes.
 * @param {string} cssFilePath - Path to the CSS file, relative to `process.cwd()` or absolute.
 * @returns {TailwindCompilerHandle} Handle with cached CSS contents and paths.
 * @internal
 */
export function loadTailwindCssFile(cssFilePath: string): TailwindCompilerHandle {
  const cssPath = path.isAbsolute(cssFilePath)
    ? cssFilePath
    : path.join(process.cwd(), cssFilePath);

  if (!fs.existsSync(cssPath)) {
    throw new Error(
      `loadTailwindCssFile: CSS file not found at "${cssPath}". ` +
        'Pass the path to your app stylesheet (e.g. "src/app/globals.css") to ' +
        'registerTailwindCssCompiler / compileCssForDocumentAction.'
    );
  }

  return {
    cssPath,
    base: path.dirname(cssPath),
    css: fs.readFileSync(cssPath, 'utf-8'),
  };
}

/**
 * Compiles theme + utilities CSS for exactly the given class tokens.
 *
 * Creates a **fresh** Tailwind compiler for every call so output contains only
 * the requested classes (Tailwind's `build()` is additive on a reused instance).
 * @param {TailwindCompilerHandle} handle - CSS file handle from {@link loadTailwindCssFile}.
 * @param {string[]} classes - Class tokens to compile.
 * @returns {Promise<string>} Compiled `@layer theme` + `@layer utilities` CSS.
 * @internal
 */
export async function compileClassesFromHandle(
  handle: TailwindCompilerHandle,
  classes: string[]
): Promise<string> {
  if (!classes.length) return '';

  const compiler = await compile(handle.css, {
    base: handle.base,
    onDependency: () => {},
  });

  return extractDocumentCssLayers(compiler.build(classes));
}

/**
 * Returns an atoms CSS compiler that caches results per class-set and always
 * uses a fresh Tailwind `compile()` on cache miss (avoids candidate accumulation).
 * @param {string} cssFilePath - Path to the app stylesheet.
 * @returns {(classes: string[]) => Promise<string>} Cached compiler function.
 * @internal
 */
export function createCachedTailwindCssCompiler(
  cssFilePath: string
): (classes: string[]) => Promise<string> {
  const handle = loadTailwindCssFile(cssFilePath);
  const cache = new Map<string, string>();

  return async (classes: string[]) => {
    if (!classes.length) return '';

    const key = atomsCssCacheKey(classes);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const css = await compileClassesFromHandle(handle, classes);
    setAtomsCssCacheEntry(cache, key, css);
    return css;
  };
}
