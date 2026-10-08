import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import { ScaffoldInitData } from '@sitecore-content-sdk/cli/scaffolding';
import AngularInitializers from '@sitecore-content-sdk/angular-templates';
import NextJsTemplates from '@sitecore-content-sdk/nextjs-templates';
import { Question } from 'inquirer';

const curInits = [...AngularInitializers, ...NextJsTemplates];

/**
 * Shape a template package (e.g. `@sitecore-content-sdk/nextjs-templates`)
 * exposes to create-content-sdk-app.
 */
export interface TemplatePackageModule {
  /** Initializers provided by the package, one per template, keyed by `name`. */
  default: ScaffoldInitData<Question>[];
}

/** Matches the leading product prefix of a template name (e.g. `nextjs` in `nextjs-app-router`). */
export const templateFormat = /^([a-zA-Z]+)(-.*)?/;

/**
 * Extracts the product prefix from a template name. The product is the leading
 * framework segment before any variant suffix (e.g. `nextjs` from
 * `nextjs-app-router`, `angular` from `angular`).
 * @param {string} template template name
 * @returns {string | undefined} the product prefix, or undefined when none matches
 */
export const getProduct = (template: string): string | undefined =>
  template.match(templateFormat)?.[1];

/** CLI to point users at for template versions below the supported baselines. */
const LEGACY_CLI_COMMAND = 'npx create-content-sdk-app@1';

/**
 * Installs a specific version of a template package into a temporary directory
 * and returns the path from which it can be imported. Used only when the caller
 * requests a version other than the one bundled as a dependency.
 * @param {string} pkgName template package name
 * @param {number} version major version to install
 * @returns {string} path to the installed package
 */
const installTemplatePackage = (pkgName: string, version: number): string => {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'csdk-templates-'));
  const result = spawn.sync(
    'npm',
    [
      'install',
      `${pkgName}@${version}`,
      '--prefix',
      tmpRoot,
      '--no-audit',
      '--no-fund',
      '--no-save',
    ],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    throw new Error(`Failed to install ${pkgName}@${version}`);
  }

  return path.join(tmpRoot, 'node_modules', pkgName);
};

/**
 * Installs the requested major version of a template package on demand and imports
 * it, returning the loaded module. Used only when the caller requests a version
 * other than the one bundled as a dependency.
 * @param {string} product template product (e.g. `nextjs`, `angular`)
 * @param {number} version major version to install
 * @returns {Promise<TemplatePackageModule>} the loaded template package module
 */
export const loadTemplatePackage = async (
  product: string,
  version: number
): Promise<TemplatePackageModule> => {
  const pkgName = `@sitecore-content-sdk/${product}-templates`;
  const packageDir = installTemplatePackage(pkgName, version);
  const mod = (await import(packageDir)) as TemplatePackageModule;
  return mod;
};

/**
 * Resolves the initializer for a template, lazily loading its template package,
 * along with the Content SDK versions read from that package's package.json.
 * @param {string} template template name
 * @param {number} [majorVersion] optional template package major version to load
 * @returns {Promise<ScaffoldInitData<Question>>} the template's initializer and versions
 */
export const getInitializerData = async (
  template: string,
  majorVersion?: number
): Promise<ScaffoldInitData<Question>> => {
  if (majorVersion && majorVersion < 2 && template.startsWith('nextjs')) {
    throw new Error(
      `Nextjs template version '${majorVersion}' can only be scaffolded by legacy versions of create-content-sdk-app. ` +
        `To scaffold '${template}' at v1, run \`${LEGACY_CLI_COMMAND}\` instead.`
    );
  }
  // use default initializers from current deps by default
  let initializers = curInits;
  if (majorVersion) {
    // lazy load template package for another version
    const product = getProduct(template);
    if (!product) {
      throw new Error(
        `${template} does not belong to any known product. Please verify the input is correct.`
      );
    }
    try {
      const loadedMod = await loadTemplatePackage(product, majorVersion);
      initializers = loadedMod.default;
    } catch (error) {
      throw new Error(
        `Could not load '${product}@${majorVersion}'. Verify that the version exists. ` +
          `(${(error as Error).message})`
      );
    }
  }
  const initializer = initializers.find((x) => x.name === template);
  if (!initializer) {
    throw new Error(`Template '${template}' is not available in this version`);
  }
  return initializer;
};

export const getAllTemplates = () => {
  return curInits.map((x) => x.name);
};
