import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

/**
 * Scope of Content SDK packages that may expose an `./experimental` catalog.
 * Product packages such as `nextjs` and `angular` own catalogs. Other packages in the
 * scope are probed and skipped when they do not export one.
 */
const CONTENT_SDK_PACKAGE_SCOPE = '@sitecore-content-sdk/';

/**
 * Reads the Content SDK packages an app depends on.
 * Every direct `@sitecore-content-sdk/*` dependency is included, so a new product
 * package is picked up without updating a curated framework list.
 * @param {string} [appPath] - Root directory of the Content SDK app. Defaults to the current working directory.
 * @returns {string[] | undefined} Sorted package names, an empty list when the app has none, or
 * `undefined` when the directory has no readable `package.json`.
 */
export function resolveContentSdkPackageNames(appPath = process.cwd()): string[] | undefined {
  const packageJsonPath = path.resolve(appPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return undefined;
  }

  let packageJson: {
    dependencies?: Record<string, unknown>;
    devDependencies?: Record<string, unknown>;
  };

  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch {
    return undefined;
  }

  const dependencies = { ...packageJson.devDependencies, ...packageJson.dependencies };

  return Object.keys(dependencies)
    .filter((name) => name.startsWith(CONTENT_SDK_PACKAGE_SCOPE))
    .sort();
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

/**
 * Reports whether a module can be resolved from the app without loading it.
 * @param {string} specifier - Module specifier to resolve, e.g. `@sitecore-content-sdk/cli`.
 * @param {string} [appPath] - Root directory of the Content SDK app. Defaults to the current working directory.
 * @returns {boolean} `true` when the module is installed in the app.
 */
export function canResolveAppModule(specifier: string, appPath = process.cwd()): boolean {
  try {
    const appRequire = createRequire(path.resolve(appPath, 'package.json'));
    appRequire.resolve(specifier);

    return true;
  } catch {
    return false;
  }
}
