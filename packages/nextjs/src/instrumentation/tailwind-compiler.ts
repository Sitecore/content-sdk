import { compile } from '@tailwindcss/node';
import fs from 'fs';
import path from 'path';

/**
 * Creates a Tailwind CSS compiler instance from a CSS file on disk.
 *
 * Resolves `cssFilePath` (relative to `process.cwd()` if not absolute), reads its
 * contents, and compiles it via `@tailwindcss/node`'s `compile()`, using the CSS
 * file's directory as the resolution base for `@import`/`@source` directives.
 * @param {string} cssFilePath - Path to the CSS file, relative to `process.cwd()` or absolute.
 * @returns {Promise<Awaited<ReturnType<typeof compile>>>} The Tailwind compiler instance.
 * @internal
 */
export async function createTailwindCompiler(
  cssFilePath: string
): Promise<Awaited<ReturnType<typeof compile>>> {
  const cssPath = path.isAbsolute(cssFilePath)
    ? cssFilePath
    : path.join(process.cwd(), cssFilePath);
  const css = fs.readFileSync(cssPath, 'utf-8');

  return compile(css, {
    base: path.dirname(cssPath),
    onDependency: () => {},
  });
}
