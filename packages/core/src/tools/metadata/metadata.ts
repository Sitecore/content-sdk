import { execSync } from 'child_process';

type Package = {
  name: string;
  version: string;
};

type PackageManagerName = 'npm' | 'pnpm' | 'yarn' | 'bun';

type PackageManager = {
  name: PackageManagerName;
  /**
   * Commands differ between major versions, most notably between yarn classic (1.x) and yarn
   * berry (2 and above). Undefined when the version could not be determined.
   */
  majorVersion?: number;
};

/**
 * A package manager specific command to list installed packages, with a parser for its output.
 */
type PackagesQuery = {
  command: string;
  parse: (output: string) => Package[];
};

type PnpmDependencyNode = {
  version?: string;
  dependencies?: Record<string, PnpmDependencyNode>;
};

/**
 * Application metadata
 * @public
 */
export interface Metadata {
  packages: { [key: string]: string };
}

const trackedScopes = ['@sitecore', '@sitecore-feaas', '@sitecore-content-sdk'];

// Longest name first, since 'pnpm' contains 'npm' and would be matched by it.
const packageManagerNames: PackageManagerName[] = ['pnpm', 'yarn', 'bun', 'npm'];

// pnpm and yarn match name patterns as globs, in which '*' does not cross the scope separator,
// so both segments are wildcarded to cover every '@sitecore*' scope.
const TRACKED_SCOPE_GLOB = '"@sitecore*/*"';

const PNPM_DEPENDENCY_GROUPS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'unsavedDependencies',
] as const;

// Matches the 'name@version' entries of the tree printed by `bun pm ls`, e.g '├── @scope/pkg@1.0.0'
const BUN_PACKAGE_ENTRY = /^[\s│├└─]*((?:@[^\s@/]+\/)?[^\s@/]+)@([^\s]+)$/;

// Dependency trees of an app can be sizeable, the 1MB default of execSync is not enough.
const MAX_OUTPUT_BUFFER = 10 * 1024 * 1024;

/**
 * Get application metadata
 * @param {boolean} allowWorkspaces - Whether to allow workspaces in the metadata generation.
 * @returns {Metadata} The generated metadata.
 */
export function getMetadata(allowWorkspaces: boolean = false): Metadata {
  const metadata: Metadata = { packages: {} };
  const { command, parse } = getPackagesQuery(detectPackageManager(), allowWorkspaces);

  let queryResult: Package[] = [];
  try {
    queryResult = parse(
      execSync(command, {
        maxBuffer: MAX_OUTPUT_BUFFER,
        stdio: ['ignore', 'pipe', 'pipe'],
      }).toString()
    );
  } catch (error) {
    console.error(`Failed to retrieve sitecore packages using '${command}'`, error);
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

/**
 * Detect the package manager that runs the current process. Package managers advertise themselves
 * through the environment they set up for the commands they run, so nothing has to be read from
 * disk - which matters because the app being built is not necessarily the project that declares
 * the package manager (workspaces).
 * @returns {PackageManager} the detected package manager, npm when it could not be determined
 */
function detectPackageManager(): PackageManager {
  const { npm_config_user_agent: userAgent, npm_execpath: execPath } = process.env;

  // e.g. 'pnpm/10.33.0 npm/? node/v22.11.0 win32 x64'
  if (userAgent) {
    const [descriptor] = userAgent.trim().split(/\s+/);
    const separatorIndex = descriptor.lastIndexOf('/');
    const name = (
      separatorIndex === -1 ? descriptor : descriptor.slice(0, separatorIndex)
    ).toLowerCase();
    const knownName = packageManagerNames.find((candidate) => candidate === name);

    if (knownName) {
      const majorVersion = parseInt(descriptor.slice(separatorIndex + 1), 10);

      return {
        name: knownName,
        majorVersion: Number.isNaN(majorVersion) ? undefined : majorVersion,
      };
    }
  }

  // e.g. 'C:\\Users\\dev\\AppData\\Roaming\\npm\\node_modules\\pnpm\\bin\\pnpm.cjs', which does
  // not carry a version
  if (execPath) {
    const executable = execPath.toLowerCase().split(/[\\/]/).pop() as string;
    const knownName = packageManagerNames.find((candidate) => executable.includes(candidate));

    if (knownName) {
      return { name: knownName };
    }
  }

  return { name: 'npm' };
}

/**
 * Build the command that lists the installed sitecore packages with the given package manager
 * @param {PackageManager} packageManager package manager to build the command for
 * @param {boolean} allowWorkspaces whether packages of all workspaces should be included
 * @returns {PackagesQuery} the command and a parser for its output
 */
function getPackagesQuery(
  packageManager: PackageManager,
  allowWorkspaces: boolean
): PackagesQuery {
  switch (packageManager.name) {
    case 'pnpm':
      return {
        command: `pnpm list --depth Infinity --json ${
          allowWorkspaces ? '--recursive ' : ''
        }${TRACKED_SCOPE_GLOB}`,
        parse: parsePnpmList,
      };
    case 'yarn':
      return packageManager.majorVersion === 1
        ? {
            command: `yarn list --json --depth 0 --pattern ${TRACKED_SCOPE_GLOB}`,
            parse: parseYarnClassicList,
          }
        : {
            command: `yarn info --json --name-only --recursive ${
              allowWorkspaces ? '--all ' : ''
            }${TRACKED_SCOPE_GLOB}`,
            parse: parseYarnInfo,
          };
    case 'bun':
      // `bun pm ls` has no name filter and only recently gained JSON output, so the tree it
      // prints is parsed instead, and filtered by scope afterwards.
      return {
        command: 'bun pm ls --all',
        parse: parseBunPackageList,
      };
    default:
      return {
        command: `npm query [name*=@sitecore] --workspaces ${allowWorkspaces}`,
        parse: parseNpmQuery,
      };
  }
}

/**
 * Parse the output of `npm query`, which is a JSON array of package manifests
 * @param {string} output command output
 * @returns {Package[]} installed packages
 */
function parseNpmQuery(output: string): Package[] {
  const parsed = JSON.parse(output);

  return Array.isArray(parsed)
    ? parsed.filter(
        (scPackage) =>
          typeof scPackage?.name === 'string' && typeof scPackage?.version === 'string'
      )
    : [];
}

/**
 * Parse the output of `pnpm list --json`, which is a dependency tree per project
 * @param {string} output command output
 * @returns {Package[]} installed packages
 */
function parsePnpmList(output: string): Package[] {
  if (!output.trim()) {
    return [];
  }

  const parsed = JSON.parse(output);
  const projects = Array.isArray(parsed) ? parsed : [parsed];
  const packages: Package[] = [];
  const visited = new Set<string>();

  const collect = (dependencies?: Record<string, PnpmDependencyNode>) => {
    if (!dependencies) {
      return;
    }

    Object.entries(dependencies).forEach(([name, node]) => {
      if (!node) {
        return;
      }

      const key = `${name}@${node.version ?? ''}`;

      // the same package can be reached through many paths, walk it once
      if (visited.has(key)) {
        return;
      }
      visited.add(key);

      if (node.version) {
        packages.push({ name, version: node.version });
      }

      collect(node.dependencies);
    });
  };

  projects.forEach((project) =>
    PNPM_DEPENDENCY_GROUPS.forEach((group) => collect(project?.[group]))
  );

  return packages;
}

/**
 * Parse the output of `yarn info --json`, which is an NDJSON stream of package locators
 * @param {string} output command output
 * @returns {Package[]} installed packages
 */
function parseYarnInfo(output: string): Package[] {
  return parseJsonLines(output).reduce<Package[]>((packages, entry) => {
    const locator = typeof entry === 'string' ? entry : entry?.value;
    const scPackage = typeof locator === 'string' ? parsePackageLocator(locator) : undefined;

    return scPackage ? [...packages, scPackage] : packages;
  }, []);
}

/**
 * Parse the output of `yarn list --json` (yarn classic), which is an NDJSON stream in which the
 * 'tree' entry holds the hoisted dependency trees
 * @param {string} output command output
 * @returns {Package[]} installed packages
 */
function parseYarnClassicList(output: string): Package[] {
  return parseJsonLines(output).reduce<Package[]>((packages, entry) => {
    if (entry?.type !== 'tree' || !Array.isArray(entry.data?.trees)) {
      return packages;
    }

    return (entry.data.trees as { name?: string }[]).reduce<Package[]>((treePackages, tree) => {
      const scPackage = tree?.name ? parsePackageLocator(tree.name) : undefined;

      return scPackage ? [...treePackages, scPackage] : treePackages;
    }, packages);
  }, []);
}

/**
 * Parse the dependency tree printed by `bun pm ls`
 * @param {string} output command output
 * @returns {Package[]} installed packages
 */
function parseBunPackageList(output: string): Package[] {
  return output.split(/\r?\n/).reduce<Package[]>((packages, line) => {
    const match = BUN_PACKAGE_ENTRY.exec(line.trim());

    return match ? [...packages, { name: match[1], version: match[2] }] : packages;
  }, []);
}

/**
 * Parse an NDJSON stream, skipping lines that are not valid JSON - package managers mix
 * diagnostics into their output
 * @param {string} output command output
 * @returns {any[]} parsed entries
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJsonLines(output: string): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return output.split(/\r?\n/).reduce<any[]>((entries, line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      return entries;
    }

    try {
      return [...entries, JSON.parse(trimmed)];
    } catch {
      return entries;
    }
  }, []);
}

/**
 * Split a package locator into name and version, e.g. '@scope/pkg@npm:1.0.0'. Yarn prefixes the
 * reference with the protocol it was resolved with, which is not part of the version.
 * @param {string} locator package locator
 * @returns {Package | undefined} the package, or undefined when the locator could not be parsed
 */
function parsePackageLocator(locator: string): Package | undefined {
  const separatorIndex = locator.lastIndexOf('@');

  if (separatorIndex <= 0) {
    return undefined;
  }

  const reference = locator.slice(separatorIndex + 1);
  const version = reference.slice(reference.lastIndexOf(':') + 1);

  return version ? { name: locator.slice(0, separatorIndex), version } : undefined;
}
