import { Argv } from 'yargs';
import {
  CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG,
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  isExperimentalFeaturesGloballyEnabled,
  resolveExperimentalFeatureStatuses,
} from '@sitecore-content-sdk/content/experimental';
import {
  canResolveAppModule,
  loadAppModule,
  resolveContentSdkPackageNames,
} from '../../../utils/framework-package';

/**
 * @param {Argv} yargs
 */
export function builder(yargs: Argv) {
  return yargs.command(
    ['list', 'ls'],
    'Lists the experimental features available for this app',
    args,
    handler
  );
}

/**
 * @param {Argv} yargs
 */
export function args(yargs: Argv) {
  return yargs;
}

/**
 * Result of reading the experimental features catalog from a framework package.
 */
type LoadedCatalog =
  | { ok: true; catalog: ExperimentalFeatureData[] }
  | { ok: false; reason: 'missing' | 'invalid' };

/**
 * @param {string} frameworkPackage - Framework package name, e.g. `@sitecore-content-sdk/nextjs`.
 * @returns {string} Message shown when this version has no experimental features to list.
 */
function noExperimentalFeaturesMessage(frameworkPackage: string): string {
  return `There are no experimental features present in the current version of ${frameworkPackage}.`;
}

/**
 * Node throws this when a package `exports` map does not define the requested subpath.
 * Installed framework versions that predate the `./experimental` export fail this way.
 * @param {unknown} error - Error thrown while loading the catalog module.
 * @returns {boolean} `true` when the experimental export is missing from the installed package.
 */
function isMissingExperimentalExport(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED'
  );
}

/**
 * Packages without an `exports` map, such as `@sitecore-content-sdk/cli`, throw
 * `MODULE_NOT_FOUND` for a missing `./experimental` file instead of `ERR_PACKAGE_PATH_NOT_EXPORTED`.
 * @param {unknown} error - Error thrown while loading the catalog module.
 * @param {string} packageName - Content SDK package that was requested.
 * @returns {boolean} `true` when the installed package has no `./experimental` file.
 */
function isMissingExperimentalFile(error: unknown, packageName: string): boolean {
  return (
    error instanceof Error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'MODULE_NOT_FOUND' &&
    error.message.includes(`'${packageName}/experimental'`) &&
    canResolveAppModule(packageName)
  );
}

/**
 * Loads the experimental features catalog exported by the app's framework package.
 * @param {string} frameworkPackage - Framework package name, e.g. `@sitecore-content-sdk/nextjs`.
 * @returns {LoadedCatalog} The catalog, or a reason it cannot be listed.
 */
function loadCatalog(frameworkPackage: string): LoadedCatalog {
  const { experimentalFeaturesCatalog } = loadAppModule<{
    experimentalFeaturesCatalog?: unknown;
  }>(`${frameworkPackage}/experimental`);

  if (experimentalFeaturesCatalog === undefined) {
    return { ok: false, reason: 'missing' };
  }

  if (!Array.isArray(experimentalFeaturesCatalog)) {
    return { ok: false, reason: 'invalid' };
  }

  return { ok: true, catalog: experimentalFeaturesCatalog };
}

/**
 * Writes the resolved features to stdout.
 * @param {string} frameworkPackage - Framework package the catalog came from.
 * @param {ExperimentalFeatureStatus[]} features - Features with their current enabled status.
 */
function printFeatures(frameworkPackage: string, features: ExperimentalFeatureStatus[]) {
  console.log(`Experimental features available in ${frameworkPackage}:`);
  console.log('');

  features.forEach((feature) => {
    console.log(`  ${feature.displayName} (${feature.idName})`);
    console.log(`    Status:               ${feature.enabled ? 'enabled' : 'disabled'}`);
    console.log(`    Environment variable: ${feature.envVarName}`);
    console.log(`    ${feature.description}`);
    console.log('');
  });
}

/**
 * Writes how to enable the listed experimental features.
 */
function printUsageHint() {
  if (isExperimentalFeaturesGloballyEnabled()) {
    console.log(
      `All experimental features are enabled because ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG} is set to "true".`
    );
    return;
  }

  console.log(
    `Set an environment variable to "true" to enable a single feature, or ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG}="true" to enable all of them.`
  );
}

/**
 * Handler for the `experimental list` command.
 */
export function handler() {
  const packageNames = resolveContentSdkPackageNames();

  if (!packageNames?.length) {
    console.error(
      'Content SDK app not found. Run this command from the root folder of a Content SDK app.'
    );
    return;
  }

  const catalogs: { packageName: string; catalog: ExperimentalFeatureData[] }[] = [];

  for (const packageName of packageNames) {
    let loaded: LoadedCatalog;

    try {
      loaded = loadCatalog(packageName);
      console.log("sssssssssssssssss", packageName, loaded);
    } catch (error) {
      if (isMissingExperimentalExport(error) || isMissingExperimentalFile(error, packageName)) {
        continue;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        `Failed to read the experimental features of ${packageName}. Make sure the app dependencies are installed. ${errorMessage}`
      );
      return;
    }

    if (!loaded.ok) {
      if (loaded.reason === 'invalid') {
        console.error(
          `The experimental features catalog exported by ${packageName} is not an array.`
        );
        return;
      }

      continue;
    }

    catalogs.push({ packageName, catalog: loaded.catalog });
    console.log("CATAGLOGHESSS", catalogs);
  }

  if (!catalogs.length) {
    const packageName = packageNames.length === 1 ? packageNames[0] : undefined;
    console.error(
      packageName
        ? noExperimentalFeaturesMessage(packageName)
        : 'There are no experimental features present in the current version of the installed Content SDK packages.'
    );
    return;
  }

  let printedFeatures = false;

  for (const { packageName, catalog } of catalogs) {
    if (!catalog.length) {
      console.log(noExperimentalFeaturesMessage(packageName));
      continue;
    }

    printFeatures(packageName, resolveExperimentalFeatureStatuses(catalog));
    printedFeatures = true;
  }

  if (printedFeatures) {
    printUsageHint();
  }
}
