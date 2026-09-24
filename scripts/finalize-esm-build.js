/*
 * Post-processes the `dist/esm` output of a package so it is loadable by Node's
 * native ESM resolver.
 *
 * `tsc` emits module specifiers exactly as they are written in the source, and the
 * ESM resolver requires a full path with a file extension. Source files use
 * extensionless relative imports (`./globalCache`), so without this step Node throws
 * ERR_MODULE_NOT_FOUND for every relative import as soon as a package is loaded
 * outside a bundler.
 *
 * This is currently wired into `@sitecore-content-sdk/core` only, because that is the
 * one SDK package apps put in the Next.js `serverExternalPackages` list (so that
 * instrumentation and Server Actions share one atoms CSS compiler registry). Every
 * other package stays bundled, and bundlers resolve extensionless imports on their
 * own. The script is package-agnostic, so it can be added to another package's build
 * if that package ever has to be external too.
 *
 * Specifiers are resolved against the emitted files on disk, so a directory import
 * becomes `<dir>/index.js` rather than a non-existent `<dir>.js`.
 */

const fs = require('fs');
const path = require('path');

// Static import/export statements are always emitted at the start of a line, which
// keeps these from matching `from './x'` inside comments or string literals. The
// `[^'"]*` segments cannot cross a quote, so no specifier can be skipped over.
const STATIC_SPECIFIER = /^([ \t]*(?:import|export)[^'"]*?\bfrom\s*)(['"])(\.[^'"]*)\2/gm;
const SIDE_EFFECT_IMPORT = /^([ \t]*import\s*)(['"])(\.[^'"]*)\2/gm;
// The closing paren is matched with a lookahead so all three patterns expose the same
// three capture groups, and the replacer never has to distinguish between them.
const DYNAMIC_IMPORT = /(\bimport\s*\(\s*)(['"])(\.[^'"]*)\2(?=\s*\))/g;

const EXPLICIT_EXTENSION = /\.(js|mjs|cjs|json|node|css)$/;

/**
 * Resolves a relative specifier to the emitted file it refers to.
 * @param {string} containingFile absolute path of the file holding the specifier
 * @param {string} specifier the relative specifier as written
 * @returns {string | null} the rewritten specifier, or null to leave it untouched
 */
const resolveSpecifier = (containingFile, specifier) => {
  if (EXPLICIT_EXTENSION.test(specifier)) return null;

  const target = path.resolve(path.dirname(containingFile), specifier);
  const normalized = specifier.replace(/\/$/, '');

  if (fs.existsSync(`${target}.js`)) return `${normalized}.js`;
  if (fs.existsSync(path.join(target, 'index.js'))) return `${normalized}/index.js`;

  return null;
};

/**
 * Rewrites every relative specifier in a single emitted file.
 * @param {string} file absolute path of the file to rewrite
 * @returns {number} how many specifiers were rewritten
 */
const rewriteFile = (file) => {
  const original = fs.readFileSync(file, 'utf8');
  let count = 0;

  const rewrite = (match, prefix, quote, specifier) => {
    const resolved = resolveSpecifier(file, specifier);
    if (!resolved) return match;
    count++;
    return `${prefix}${quote}${resolved}${quote}`;
  };

  const updated = original
    .replace(STATIC_SPECIFIER, rewrite)
    .replace(SIDE_EFFECT_IMPORT, rewrite)
    .replace(DYNAMIC_IMPORT, rewrite);

  if (count > 0) fs.writeFileSync(file, updated, 'utf8');

  return count;
};

/**
 * Collects every emitted `.js` file under a directory.
 * @param {string} dir directory to walk
 * @returns {string[]} absolute paths of the JavaScript files found
 */
const collectJsFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectJsFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.js') ? [entryPath] : [];
  });

/**
 * Pins the module format of a build output directory, so it no longer depends on
 * Node's syntax detection or on the `type` of the package that ships it.
 * @param {string} dir build output directory
 * @param {'module' | 'commonjs'} type module format of the files in that directory
 */
const writeTypeMarker = (dir, type) => {
  if (!fs.existsSync(dir)) return;
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    `${JSON.stringify({ type }, null, 2)}\n`,
    'utf8'
  );
};

const packageRoot = process.cwd();
const esmDir = path.join(packageRoot, 'dist', 'esm');

if (!fs.existsSync(esmDir)) {
  console.error('\x1b[31m%s\x1b[0m', `No ESM build found at ${esmDir}. Did the build run?`);
  process.exit(1);
}

const rewritten = collectJsFiles(esmDir).reduce((total, file) => total + rewriteFile(file), 0);

writeTypeMarker(esmDir, 'module');
writeTypeMarker(path.join(packageRoot, 'dist', 'cjs'), 'commonjs');

console.log('\x1b[32m%s\x1b[0m', `Finalized ESM build: ${rewritten} specifiers rewritten.`);
