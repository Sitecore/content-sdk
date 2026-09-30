import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import { CsdkVersions, Initializer, getVersions } from './common';

/**
 * Shape a template package (e.g. `@sitecore-content-sdk/nextjs-templates`)
 * exposes to create-content-sdk-app.
 */
export interface TemplatePackageModule {
  /** Registry of template name -> initializer instance. */
  initializers: { [template: string]: Initializer };
}

/**
 * Maps each template name to the npm package that provides it.
 * Kept static so the CLI can list templates without importing every package.
 */
const TEMPLATE_PACKAGES: { [template: string]: string } = {
  nextjs: '@sitecore-content-sdk/nextjs-templates',
  'nextjs-app-router': '@sitecore-content-sdk/nextjs-templates',
  'nextjs-app-router-cache-components': '@sitecore-content-sdk/nextjs-templates',
  angular: '@sitecore-content-sdk/angular-templates',
};

/**
 * Lowest template package version each package supports through this CLI.
 * Requests below these baselines are served by an earlier major of the CLI.
 */
const MIN_TEMPLATE_VERSIONS: { [pkgName: string]: string } = {
  '@sitecore-content-sdk/nextjs-templates': '2.4.0',
  '@sitecore-content-sdk/angular-templates': '1.0.0',
};

/** CLI to point users at for template versions below the supported baselines. */
const LEGACY_CLI_COMMAND = 'create-content-sdk-app@2';

/**
 * Returns all template names known to the CLI.
 * @returns {string[]} template names
 */
export const getAllTemplates = (): string[] => Object.keys(TEMPLATE_PACKAGES);

/**
 * Extracts the numeric `major.minor.patch` core from a version-like string,
 * ignoring range prefixes (`^`, `~`) and pre-release/build suffixes. Returns
 * null when no numeric version can be determined (e.g. a dist-tag like `latest`).
 * @param {string} version version, range, or tag
 * @returns {[number, number, number] | null} the parsed version core
 */
const parseVersionCore = (version: string): [number, number, number] | null => {
  const match = version.trim().match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)];
};

/**
 * Determines whether a requested version is below a minimum baseline, comparing
 * only the numeric core so pre-releases of the baseline (e.g. `2.4.0-canary.0`)
 * are not treated as below it. Non-numeric inputs (dist-tags) are never below.
 * @param {string} version requested version, range, or tag
 * @param {string} minimum minimum supported version
 * @returns {boolean} true when version is strictly below minimum
 */
const isBelowMinimum = (version: string, minimum: string): boolean => {
  const requested = parseVersionCore(version);
  const baseline = parseVersionCore(minimum);
  if (!requested || !baseline) {
    return false;
  }
  for (let i = 0; i < 3; i++) {
    if (requested[i] < baseline[i]) {
      return true;
    }
    if (requested[i] > baseline[i]) {
      return false;
    }
  }
  return false;
};

/**
 * Installs a specific version of a template package into a temporary directory
 * and returns the path from which it can be imported. Used only when the caller
 * requests a version other than the one bundled as a dependency.
 * @param {string} pkgName template package name
 * @param {string} version exact version or range to install
 * @returns {string} path to the installed package
 */
const installTemplatePackage = (pkgName: string, version: string): string => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-templates-'));
  const result = spawn.sync(
    'npm',
    ['install', `${pkgName}@${version}`, '--prefix', tmpRoot, '--no-audit', '--no-fund', '--no-save'],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    throw new Error(`Failed to install ${pkgName}@${version}`);
  }

  return path.join(tmpRoot, 'node_modules', pkgName);
};

/**
 * Lazily loads a template package. When no version is provided the package that
 * ships as a dependency of create-content-sdk-app is imported. When a version is
 * provided, that exact version is installed on demand and imported instead.
 *
 * Returns the loaded module together with the directory it was resolved from, so
 * the caller can read the package's own `package.json` (e.g. to compute the
 * Content SDK versions it scaffolds).
 * @param {string} pkgName template package name
 * @param {string} [version] optional version to load
 * @returns {Promise<{ mod: TemplatePackageModule; packageDir: string }>} the loaded module and its directory
 */
export const loadTemplatePackage = async (
  pkgName: string,
  version?: string
): Promise<{ mod: TemplatePackageModule; packageDir: string }> => {
  const packageDir = version
    ? installTemplatePackage(pkgName, version)
    : path.dirname(require.resolve(`${pkgName}/package.json`));
  const mod = (await import(packageDir)) as TemplatePackageModule;
  return { mod, packageDir };
};

/**
 * Resolves the initializer for a template, lazily loading its template package,
 * along with the Content SDK versions read from that package's package.json.
 * @param {string} template template name
 * @param {string} [version] optional template package version to load
 * @returns {Promise<{ initializer: Initializer; versions: CsdkVersions }>} the template's initializer and versions
 */
export const getInitializer = async (
  template: string,
  version?: string
): Promise<{ initializer: Initializer; versions: CsdkVersions }> => {
  const pkgName = TEMPLATE_PACKAGES[template];
  if (!pkgName) {
    throw new Error(`Unknown template provided: '${template}'`);
  }

  if (version) {
    const minimum = MIN_TEMPLATE_VERSIONS[pkgName];
    if (minimum && isBelowMinimum(version, minimum)) {
      throw new Error(
        `Template version '${version}' is no longer supported by create-content-sdk-app. ` +
          `To scaffold '${template}' below version ${minimum}, run \`${LEGACY_CLI_COMMAND}\` instead.`
      );
    }
  }

  let loaded: { mod: TemplatePackageModule; packageDir: string };
  try {
    loaded = await loadTemplatePackage(pkgName, version);
  } catch (error) {
    if (version) {
      throw new Error(
        `Could not load '${pkgName}@${version}'. Verify that the version exists. ` +
          `(${(error as Error).message})`
      );
    }
    throw error;
  }

  const { mod, packageDir } = loaded;
  const initializer = mod.initializers[template];
  if (!initializer) {
    throw new Error(`Template '${template}' is not provided by '${pkgName}'`);
  }

  return { initializer, versions: getVersions(packageDir) };
};
