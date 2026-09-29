import { Argv } from 'yargs';
import {
  CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG,
  ExperimentalFeatureData,
  ExperimentalFeatureStatus,
  isExperimentalFeaturesGloballyEnabled,
  resolveExperimentalFeatureStatuses,
} from '@sitecore-content-sdk/content/experimental';
import { loadAppModule, resolveFrameworkPackageName } from '../../../utils/framework-package';

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
 * Loads the experimental features catalog exported by the app's framework package.
 * @param {string} frameworkPackage - Framework package name, e.g. `@sitecore-content-sdk/nextjs`.
 * @returns {ExperimentalFeatureData[] | undefined} The catalog, or `undefined` when the installed
 * package version does not expose one.
 */
function loadCatalog(frameworkPackage: string): ExperimentalFeatureData[] | undefined {
  const { experimentalFeaturesCatalog } = loadAppModule<{
    experimentalFeaturesCatalog?: ExperimentalFeatureData[];
  }>(`${frameworkPackage}/experimental`);

  return Array.isArray(experimentalFeaturesCatalog) ? experimentalFeaturesCatalog : undefined;
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

  if (isExperimentalFeaturesGloballyEnabled()) {
    console.log(
      `All experimental features are enabled because ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG} is set to "true".`
    );
  } else {
    console.log(
      `Set an environment variable to "true" to enable a single feature, or ${CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG}="true" to enable all of them.`
    );
  }
}

/**
 * Handler for the `experimental list` command.
 */
export function handler() {
  const frameworkPackage = resolveFrameworkPackageName();

  if (!frameworkPackage) {
    console.error(
      'Content SDK app not found. Run this command from the root folder of a Content SDK app.'
    );
    return;
  }

  let catalog: ExperimentalFeatureData[] | undefined;

  try {
    catalog = loadCatalog(frameworkPackage);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `Failed to read the experimental features of ${frameworkPackage}. Make sure the app dependencies are installed. ${errorMessage}`
    );
    return;
  }

  if (!catalog) {
    console.error(
      `The installed version of ${frameworkPackage} does not report experimental features. Update the package to use this command.`
    );
    return;
  }

  if (!catalog.length) {
    console.log(`There are no experimental features available in ${frameworkPackage}.`);
    return;
  }

  printFeatures(frameworkPackage, resolveExperimentalFeatureStatuses(catalog));
}
