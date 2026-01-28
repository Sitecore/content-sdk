import { execSync } from 'child_process';

type Package = {
  name: string;
  version: string;
};

/**
 * Application metadata
 * @public
 */
export interface Metadata {
  packages: { [key: string]: string };
}

const trackedScopes = ['@sitecore', '@sitecore-feaas', '@sitecore-content-sdk'];

/**
 * Get application metadata
 * @param {boolean} allowWorkspaces - Whether to allow workspaces in the metadata generation.
 * @returns {Metadata} The generated metadata.
 */
export function getMetadata(allowWorkspaces: boolean = false): Metadata {
  const metadata: Metadata = { packages: {} };

  let queryResult: Package[] = [];
  try {
    queryResult = JSON.parse(
      execSync(`npm query [name*=@sitecore] --workspaces ${allowWorkspaces}`).toString()
    );
  } catch (error) {
    console.error('Failed to retrieve sitecore packages using npm query', error);
    return metadata;
  }

  metadata.packages = getPackagesFromQueryResult(queryResult);

  return metadata;
}

/**
 * Retrieve all packages of the tracked scopes with their exact versions
 * @param {Package[]} scPackages list of packages
 * @returns {Record<string, string>} an object with the packages with their exact versions
 */
function getPackagesFromQueryResult(scPackages: Package[]): Record<string, string> {
  const packages: Record<string, string> = {};

  scPackages.forEach((scPackage) => {
    if (trackedScopes.some((trackedScope) => scPackage.name.startsWith(trackedScope))) {
      packages[scPackage.name] = scPackage.version;
    }
  });

  return packages;
}
