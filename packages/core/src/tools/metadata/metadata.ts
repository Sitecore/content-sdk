import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

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
    queryResult = queryInstalledPackages(allowWorkspaces);
  } catch (error) {
    console.error('Failed to retrieve sitecore packages using npm query', error);
    return metadata;
  }

  metadata.packages = getPackagesFromQueryResult(queryResult);

  return metadata;
}

/**
 * Query installed packages using the package manager that invoked this process.
 * `npm query` is npm-specific and fails with EBADDEVENGINES when a project
 * declares `devEngines.packageManager` for pnpm.
 * @param {boolean} allowWorkspaces - Whether to include workspace packages.
 * @returns {Package[]} Installed packages reported by the current package manager.
 */
function queryInstalledPackages(allowWorkspaces: boolean): Package[] {
  if (isPnpmContext()) {
    return collectPackagesFromNodeModules(process.cwd());
  }

  return JSON.parse(
    execSync(`npm query [name*=@sitecore] --workspaces ${allowWorkspaces}`).toString()
  );
}

/**
 * Detect pnpm from the environment set by package-manager shims/scripts.
 * `npm_execpath` points at the CLI entry file (e.g. pnpm.cjs); `npm_config_user_agent` is `pnpm/<version> ...`.
 */
function isPnpmContext(): boolean {
  const execPath = process.env.npm_execpath || '';
  const userAgent = process.env.npm_config_user_agent || '';
  return /pnpm/i.test(execPath) || userAgent.toLowerCase().startsWith('pnpm/');
}

/**
 * Collect tracked Sitecore packages from installed node_modules, walking up to the
 * install root so monorepo apps still see packages hoisted to the workspace root.
 * @param {string} startDir - Directory to start scanning from (typically `process.cwd()`).
 * @returns {Package[]} Installed tracked packages.
 */
function collectPackagesFromNodeModules(startDir: string): Package[] {
  const packages: Record<string, string> = {};
  let dir = path.resolve(startDir);

  while (true) {
    collectFromNodeModulesDir(path.join(dir, 'node_modules'), packages);

    if (isInstallRoot(dir)) {
      break;
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }

    dir = parent;
  }

  return Object.entries(packages).map(([name, version]) => ({ name, version }));
}

/**
 * True when this directory is the package-manager install root (has a lockfile).
 * @param {string} dir - Directory to inspect.
 * @returns {boolean} Whether scanning should stop after this directory.
 */
function isInstallRoot(dir: string): boolean {
  return (
    fs.existsSync(path.join(dir, 'pnpm-lock.yaml')) ||
    fs.existsSync(path.join(dir, 'yarn.lock')) ||
    fs.existsSync(path.join(dir, 'package-lock.json')) ||
    fs.existsSync(path.join(dir, 'npm-shrinkwrap.json')) ||
    fs.existsSync(path.join(dir, 'bun.lock')) ||
    fs.existsSync(path.join(dir, 'bun.lockb'))
  );
}

/**
 * Scan a node_modules directory for tracked Sitecore scopes, including pnpm's virtual store.
 * @param {string} nodeModulesDir - Path to a node_modules directory.
 * @param {Record<string, string>} packages - Accumulator of package name to version.
 */
function collectFromNodeModulesDir(
  nodeModulesDir: string,
  packages: Record<string, string>
): void {
  let entries: string[];
  try {
    entries = fs.readdirSync(nodeModulesDir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry === '.pnpm') {
      collectFromPnpmStore(path.join(nodeModulesDir, entry), packages);
      continue;
    }

    if (!trackedScopes.some((scope) => entry.startsWith(scope))) {
      continue;
    }

    collectFromScopeDir(path.join(nodeModulesDir, entry), packages);
  }
}

/**
 * Scan pnpm's virtual store, limited to folders that can contain tracked Sitecore packages.
 * @param {string} pnpmDir - Path to node_modules/.pnpm.
 * @param {Record<string, string>} packages - Accumulator of package name to version.
 */
function collectFromPnpmStore(pnpmDir: string, packages: Record<string, string>): void {
  let entries: string[];
  try {
    entries = fs.readdirSync(pnpmDir);
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!trackedScopes.some((scope) => entry.startsWith(scope))) {
      continue;
    }

    collectFromNodeModulesDir(path.join(pnpmDir, entry, 'node_modules'), packages);
  }
}

/**
 * Read each package in a scoped node_modules folder (e.g. node_modules/@sitecore-content-sdk).
 * @param {string} scopeDir - Path to a scoped package directory.
 * @param {Record<string, string>} packages - Accumulator of package name to version.
 */
function collectFromScopeDir(scopeDir: string, packages: Record<string, string>): void {
  let names: string[];
  try {
    names = fs.readdirSync(scopeDir);
  } catch {
    return;
  }

  for (const name of names) {
    readTrackedPackage(path.join(scopeDir, name), packages);
  }
}

/**
 * Read a package.json and record it when it belongs to a tracked Sitecore scope.
 * Closer installs win: existing entries are not overwritten.
 * @param {string} pkgDir - Directory that may contain a package.json.
 * @param {Record<string, string>} packages - Accumulator of package name to version.
 */
function readTrackedPackage(pkgDir: string, packages: Record<string, string>): void {
  try {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')
    ) as Package;

    if (
      !pkgJson.name ||
      !pkgJson.version ||
      packages[pkgJson.name] ||
      !trackedScopes.some((scope) => pkgJson.name.startsWith(scope))
    ) {
      return;
    }

    packages[pkgJson.name] = pkgJson.version;
  } catch {
    // not a package directory
  }
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
