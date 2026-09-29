import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

/**
 * Content SDK framework packages that own an experimental features catalog.
 */
export const FRAMEWORK_PACKAGES = ['@sitecore-content-sdk/nextjs', '@sitecore-content-sdk/angular'];

/**
 * Determines which Content SDK framework package an app depends on by reading its `package.json`.
 * @param {string} [appPath] - Root directory of the Content SDK app. Defaults to the current working directory.
 * @returns {string | undefined} The framework package name, or `undefined` when the directory is not a Content SDK app.
 */
export function resolveFrameworkPackageName(appPath = process.cwd()): string | undefined {
  const packageJsonPath = path.resolve(appPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return undefined;
  }

  let packageJson: { dependencies?: object; devDependencies?: object };

  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch {
    return undefined;
  }

  const dependencies = { ...packageJson.devDependencies, ...packageJson.dependencies };

  return FRAMEWORK_PACKAGES.find((name) => name in dependencies);
}

/**
 * Lazily loads a module installed in the app, resolving it from the app's `node_modules`
 * rather than from the CLI location (the CLI may be installed globally).
 * @param {string} specifier - Module specifier to load, e.g. `@sitecore-content-sdk/nextjs/experimental`.
 * @param {string} [appPath] - Root directory of the Content SDK app. Defaults to the current working directory.
 * @returns {T} The loaded module.
 * @throws Will throw when the module is not installed or cannot be resolved.
 */
export function loadAppModule<T>(specifier: string, appPath = process.cwd()): T {
  const appRequire = createRequire(path.resolve(appPath, 'package.json'));

  return appRequire(specifier) as T;
}
