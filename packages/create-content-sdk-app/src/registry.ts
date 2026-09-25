import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import { Initializer } from './common';

/**
 * Shape a template package (e.g. `@sitecore-content-sdk/nextjs-templates`)
 * exposes to create-content-sdk-app.
 */
export interface TemplatePackageModule {
  /** Registry of template name -> initializer instance. */
  initializers: { [template: string]: Initializer };
  /** Content SDK package versions this package scaffolds into generated apps. */
  getVersions: () => { [key: string]: string };
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
 * Returns all template names known to the CLI.
 * @returns {string[]} template names
 */
export const getAllTemplates = (): string[] => Object.keys(TEMPLATE_PACKAGES);

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
 * @param {string} pkgName template package name
 * @param {string} [version] optional version to load
 * @returns {Promise<TemplatePackageModule>} the loaded template package module
 */
export const loadTemplatePackage = async (
  pkgName: string,
  version?: string
): Promise<TemplatePackageModule> => {
  const specifier = version ? installTemplatePackage(pkgName, version) : pkgName;
  const mod = (await import(specifier)) as TemplatePackageModule;
  return mod;
};

/**
 * Resolves the initializer for a template, lazily loading its template package.
 * @param {string} template template name
 * @param {string} [version] optional template package version to load
 * @returns {Promise<Initializer>} the template's initializer
 */
export const getInitializer = async (
  template: string,
  version?: string
): Promise<Initializer> => {
  const pkgName = TEMPLATE_PACKAGES[template];
  if (!pkgName) {
    throw new Error(`Unknown template provided: '${template}'`);
  }

  const mod = await loadTemplatePackage(pkgName, version);
  const initializer = mod.initializers[template];
  if (!initializer) {
    throw new Error(`Template '${template}' is not provided by '${pkgName}'`);
  }

  return initializer;
};
