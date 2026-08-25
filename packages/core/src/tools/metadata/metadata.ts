import { execSync } from 'child_process';

type Package = {
  name: string;
  version: string;
};

/**
 * A package manager specific command to list installed packages, with a parser for its output.
 * @internal
 */
type PackagesQuery = {
  query: string;
  parse: (output: string) => Package[];
};

/**
 * Application metadata
 * @public
 */
export interface Metadata {
  packages: { [key: string]: string };
}

const trackedScopes = ['@sitecore', '@sitecore-feaas', '@sitecore-content-sdk'];

// yarn matches name patterns as globs, in which '*' does not cross the scope separator, so both
// segments are wildcarded to cover every '@sitecore*' scope.
const TRACKED_SCOPE_GLOB = '"@sitecore*/*"';

// Matches the 'name@version' entries of the tree printed by `bun pm ls`, e.g '├── @scope/pkg@1.0.0'
const BUN_PACKAGE_ENTRY = /^[\s│├└─]*((?:@[^\s@/]+\/)?[^\s@/]+)@([^\s]+)$/;

// Matches the trailing 'name@version' of the 'path:name@version' entries printed by
// `pnpm list --parseable --long`. The leading path is excluded from the match because it holds
// directory separators, and a drive letter followed by a colon on Windows.
const PNPM_PACKAGE_ENTRY = /:((?:@[^\s@:/\\]+\/)?[^\s@:/\\]+)@([^\s]+)$/;

// Dependency trees of an app can be sizeable, the 1MB default of execSync is not enough.
const MAX_OUTPUT_BUFFER = 10 * 1024 * 1024;

/**
 * Get application metadata
 * @param {boolean} allowWorkspaces - Whether to allow workspaces in the metadata generation.
 * @returns {Metadata} The generated metadata.
 */
export function getMetadata(allowWorkspaces: boolean = false): Metadata {
  const metadata: Metadata = { packages: {} };
  const packageManagement = getPackageManagement(allowWorkspaces);
  const { query, parse } = packageManagement[detectPackageManager(packageManagement)];

  let queryResult: Package[] = [];
  try {
    queryResult = parse(
      execSync(query, {
        maxBuffer: MAX_OUTPUT_BUFFER,
        stdio: ['ignore', 'pipe', 'pipe'],
      }).toString()
    );
  } catch (error) {
    console.error(`Failed to retrieve sitecore packages using '${query}'`, error);
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
 * Build the listing command and parser for each supported package manager.
 * Yarn classic is a dedicated entry because its command differs from yarn berry.
 * @param {boolean} allowWorkspaces whether packages of all workspaces should be included
 * @returns {Record<string, PackagesQuery>} query and parser per package manager
 * @internal
 */
function getPackageManagement(allowWorkspaces: boolean): Record<string, PackagesQuery> {
  return {
    pnpm: {
      // `pnpm list` silently drops packages from its result when it is given a name pattern, and
      // the tree it prints as JSON repeats every shared dependency, which overruns the output
      // buffer of real apps. Its parseable output lists each installed package once instead.
      query: `pnpm list --depth Infinity --parseable --long${
        allowWorkspaces ? ' --recursive' : ''
      }`,
      parse: parsePnpmList,
    },
    npm: {
      query: `npm query [name*=@sitecore] --workspaces ${allowWorkspaces}`,
      parse: parseNpmQuery,
    },
    yarn: {
      query: `yarn info --json --name-only --recursive ${
        allowWorkspaces ? '--all ' : ''
      }${TRACKED_SCOPE_GLOB}`,
      parse: parseYarnInfo,
    },
    yarnClassic: {
      query: `yarn list --json --depth 0 --pattern ${TRACKED_SCOPE_GLOB}`,
      parse: parseYarnClassicList,
    },
    bun: {
      // `bun pm ls` has no name filter and only recently gained JSON output, so the tree it
      // prints is parsed instead, and filtered by scope afterwards.
      query: 'bun pm ls --all',
      parse: parseBunPackageList,
    },
  };
}

/**
 * Detect the package manager that runs the current process. Package managers advertise themselves
 * through the environment they set up for the commands they run, so nothing has to be read from
 * disk - which matters because the app being built is not necessarily the project that declares
 * the package manager (workspaces).
 * @param {Record<string, PackagesQuery>} packageManagement supported package managers
 * @returns {string} the detected package manager, npm when it could not be determined
 * @internal
 */
function detectPackageManager(packageManagement: Record<string, PackagesQuery>): string {
  const managerNames = Object.keys(packageManagement).sort(
    (left, right) => right.length - left.length
  );
  const { npm_config_user_agent: userAgent, npm_execpath: execPath } = process.env;

  // e.g. 'pnpm/10.33.0 npm/? node/v22.11.0 win32 x64'
  if (userAgent) {
    const [descriptor] = userAgent.trim().split(/\s+/);
    const separatorIndex = descriptor.lastIndexOf('/');
    const name = (
      separatorIndex === -1 ? descriptor : descriptor.slice(0, separatorIndex)
    ).toLowerCase();
    const knownName = managerNames.find((candidate) => candidate === name);

    if (knownName) {
      const majorVersion = parseInt(descriptor.slice(separatorIndex + 1), 10);

      return knownName === 'yarn' && majorVersion === 1 ? 'yarnClassic' : knownName;
    }
  }

  // e.g. 'C:\\Users\\dev\\AppData\\Roaming\\npm\\node_modules\\pnpm\\bin\\pnpm.cjs', which does
  // not carry a version
  if (execPath) {
    const executable = execPath.toLowerCase().split(/[\\/]/).pop() as string;
    const knownName = managerNames.find((candidate) => executable.includes(candidate));

    if (knownName) {
      return knownName;
    }
  }

  return 'npm';
}

/**
 * Parse the output of `npm query`, which is a JSON array of package manifests
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
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
 * Parse the output of `pnpm list --parseable --long`, which is one 'path:name@version' entry per
 * installed package
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
 */
function parsePnpmList(output: string): Package[] {
  return output.split(/\r?\n/).reduce<Package[]>((packages, line) => {
    const scPackage = PNPM_PACKAGE_ENTRY.exec(line.trim());

    return scPackage ? [...packages, { name: scPackage[1], version: scPackage[2] }] : packages;
  }, []);
}

/**
 * Parse the output of `yarn info --json`, which is an NDJSON stream of package locators
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
 */
function parseYarnInfo(output: string): Package[] {
  return parseJsonLines(output).reduce<Package[]>((packages, entry) => {
    const locator = typeof entry === 'string' ? entry : getRecordString(entry, 'value');
    const scPackage = locator ? parsePackageLocator(locator) : undefined;

    return scPackage ? [...packages, scPackage] : packages;
  }, []);
}

/**
 * Parse the output of `yarn list --json` (yarn classic), which is an NDJSON stream in which the
 * 'tree' entry holds the hoisted dependency trees
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
 */
function parseYarnClassicList(output: string): Package[] {
  return parseJsonLines(output).reduce<Package[]>((packages, entry) => {
    const data = isRecord(entry) && entry.type === 'tree' ? entry.data : undefined;
    const trees = isRecord(data) && Array.isArray(data.trees) ? data.trees : undefined;

    if (!trees) {
      return packages;
    }

    return trees.reduce<Package[]>((treePackages, tree) => {
      const name = getRecordString(tree, 'name');
      const scPackage = name ? parsePackageLocator(name) : undefined;

      return scPackage ? [...treePackages, scPackage] : treePackages;
    }, packages);
  }, []);
}

/**
 * Parse the dependency tree printed by `bun pm ls`
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
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
 * @returns {unknown[]} parsed entries
 * @internal
 */
function parseJsonLines(output: string): unknown[] {
  return output.split(/\r?\n/).reduce<unknown[]>((entries, line) => {
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
 * Narrow an unknown value to a plain object record
 * @param {unknown} value value to check
 * @returns {value is Record<string, unknown>} whether the value is a non-null object
 * @internal
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Read a string property from an unknown object
 * @param {unknown} value object that may contain the property
 * @param {string} key property name
 * @returns {string | undefined} the string value, or undefined when it is missing or not a string
 * @internal
 */
function getRecordString(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const property = value[key];

  return typeof property === 'string' ? property : undefined;
}

/**
 * Split a package locator into name and version, e.g. '@scope/pkg@npm:1.0.0'. Yarn prefixes the
 * reference with the protocol it was resolved with, which is not part of the version.
 * @param {string} locator package locator
 * @returns {Package | undefined} the package, or undefined when the locator could not be parsed
 * @internal
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
