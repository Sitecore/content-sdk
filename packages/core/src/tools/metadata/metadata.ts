import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

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

// Trailing @scope/name@version. Shared by bun and pnpm; $ keeps the match off pnpm store paths.
const PACKAGE_ENTRY = /(@[^\s/:\\]+\/[^\s/:\\]+)@([^\s]+)$/;

// Dependency trees of an app can be sizeable, the 1MB default of execSync is not enough.
const MAX_OUTPUT_BUFFER = 10 * 1024 * 1024;

/**
 * Get application metadata. Non-optional tracked peer dependencies are included as well.
 * npm installs those peers on its own; Yarn does not, so a peer such as
 * `@sitecore-content-sdk/personalize` would otherwise be missing from metadata.
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
  addMissingTrackedPeers(metadata.packages);

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
    if (isTrackedPackage(scPackage.name)) {
      packages[scPackage.name] = scPackage.version;
    }
  });

  return packages;
}

type PackageManifest = {
  version?: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
};

type Semver = {
  major: number;
  minor: number;
  patch: number;
  prerelease: boolean;
};

// Prints the published versions of METADATA_PACKAGE_NAME. The name stays in the environment so a
// caret range never has to be escaped for cmd.exe.
const PUBLISHED_VERSIONS_SCRIPT = `
const name = process.env.METADATA_PACKAGE_NAME || '';
const registry = (process.env.npm_config_registry || 'https://registry.npmjs.org').replace(/\\/$/, '');
fetch(registry + '/' + encodeURIComponent(name))
  .then((response) => (response.ok ? response.json() : {}))
  .then((doc) => {
    const versions = doc && doc.versions ? Object.keys(doc.versions) : [];
    process.stdout.write(JSON.stringify(versions));
  })
  .catch(() => process.stdout.write('[]'));
`;

/**
 * Add tracked peer dependencies that the package manager did not list.
 * An installed copy wins. Otherwise the highest published version of the peer range is used,
 * which is the version npm would have installed.
 * @param {Record<string, string>} packages tracked packages already discovered
 */
function addMissingTrackedPeers(packages: Record<string, string>): void {
  const seen = new Set<string>();
  const pending = Object.keys(packages);

  while (pending.length > 0) {
    const name = pending.pop();

    if (!name || seen.has(name)) {
      continue;
    }

    seen.add(name);

    const manifest = readInstalledManifest(name);

    if (!manifest) {
      continue;
    }

    getRequiredTrackedPeers(manifest).forEach((peer) => {
      if (packages[peer.name]) {
        return;
      }

      const version =
        readInstalledManifest(peer.name)?.version || resolvePublishedVersion(peer.name, peer.range);

      if (!version) {
        console.warn(
          `Unable to resolve peer dependency '${peer.name}@${peer.range}' for metadata`
        );
        return;
      }

      packages[peer.name] = version;
      pending.push(peer.name);
    });
  }
}

/**
 * Non-optional peer dependencies that belong to a tracked scope
 * @param {PackageManifest} manifest package manifest
 * @returns {{ name: string; range: string }[]} peers metadata should record
 */
function getRequiredTrackedPeers(manifest: PackageManifest): { name: string; range: string }[] {
  const peers = manifest.peerDependencies ?? {};
  const meta = manifest.peerDependenciesMeta ?? {};

  return Object.entries(peers).flatMap(([name, range]) => {
    const optional = meta[name]?.optional === true;

    return isTrackedPackage(name) && !optional && range ? [{ name, range }] : [];
  });
}

/**
 * Read an installed package manifest from the project node_modules.
 * Resolution stays at the project root so a workspace checkout of the SDK is not picked up
 * while tests run from a package directory.
 * @param {string} name package name
 * @returns {PackageManifest | undefined} the manifest, when it is installed
 */
function readInstalledManifest(name: string): PackageManifest | undefined {
  const manifestPath = path.join(process.cwd(), 'node_modules', name, 'package.json');

  try {
    if (!fs.existsSync(manifestPath)) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    return isPackageManifest(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Highest published version that satisfies a caret or exact peer range
 * @param {string} name package name
 * @param {string} range peer dependency range
 * @returns {string | undefined} the resolved version
 */
function resolvePublishedVersion(name: string, range: string): string | undefined {
  if (!/^\^?\d+\.\d+\.\d+$/.test(range.trim())) {
    return undefined;
  }

  return maxSatisfying(fetchPublishedVersions(name), range);
}

/**
 * Published versions of a package from the npm registry
 * @param {string} name package name
 * @returns {string[]} versions, empty when the registry could not be read
 */
function fetchPublishedVersions(name: string): string[] {
  try {
    const output = execFileSync(process.execPath, ['-e', PUBLISHED_VERSIONS_SCRIPT], {
      encoding: 'utf8',
      env: { ...process.env, METADATA_PACKAGE_NAME: name },
      maxBuffer: MAX_OUTPUT_BUFFER,
      timeout: 20000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const parsed: unknown = JSON.parse(output);

    return Array.isArray(parsed) ? parsed.filter((version) => typeof version === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * @param {string[]} versions published versions
 * @param {string} range caret or exact version range
 * @returns {string | undefined} the highest matching version
 */
function maxSatisfying(versions: string[], range: string): string | undefined {
  return versions.reduce<string | undefined>((best, version) => {
    if (!satisfiesRange(version, range)) {
      return best;
    }

    return !best || compareVersions(version, best) > 0 ? version : best;
  }, undefined);
}

/**
 * Caret and exact ranges cover the peer ranges the SDK packages declare.
 * Prereleases are excluded, so `^2.1.0` stays on releases.
 * @param {string} version published version
 * @param {string} range peer range
 * @returns {boolean} whether the version satisfies the range
 */
function satisfiesRange(version: string, range: string): boolean {
  const parsedVersion = parseVersion(version);
  const trimmed = range.trim();
  const caret = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(trimmed);
  const exact = /^(\d+)\.(\d+)\.(\d+)$/.exec(trimmed);

  if (!parsedVersion || parsedVersion.prerelease) {
    return false;
  }

  if (exact) {
    return compareVersions(version, `${exact[1]}.${exact[2]}.${exact[3]}`) === 0;
  }

  if (!caret) {
    return false;
  }

  const lowerBound = `${caret[1]}.${caret[2]}.${caret[3]}`;
  const major = Number(caret[1]);
  const minor = Number(caret[2]);

  if (compareVersions(version, lowerBound) < 0) {
    return false;
  }

  if (major > 0) {
    return parsedVersion.major === major;
  }

  if (minor > 0) {
    return parsedVersion.major === 0 && parsedVersion.minor === minor;
  }

  return (
    parsedVersion.major === 0 &&
    parsedVersion.minor === 0 &&
    parsedVersion.patch === Number(caret[3])
  );
}

/**
 * @param {string} version version string
 * @returns {Semver | undefined} parsed version
 */
function parseVersion(version: string): Semver | undefined {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+.*)?$/.exec(version);

  if (!match) {
    return undefined;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: Boolean(match[4]),
  };
}

/**
 * @param {string} left version
 * @param {string} right version
 * @returns {number} negative when left is older
 */
function compareVersions(left: string, right: string): number {
  const a = parseVersion(left);
  const b = parseVersion(right);

  if (!a || !b) {
    return 0;
  }

  if (a.major !== b.major) {
    return a.major - b.major;
  }

  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }

  return a.patch - b.patch;
}

/**
 * @param {string} name package name
 * @returns {boolean} whether the package belongs to a tracked scope
 */
function isTrackedPackage(name: string): boolean {
  return trackedScopes.some((trackedScope) => name.startsWith(trackedScope));
}

/**
 * @param {unknown} value parsed package.json
 * @returns {value is PackageManifest} whether the value can be read as a manifest
 */
function isPackageManifest(value: unknown): value is PackageManifest {
  if (!isRecord(value)) {
    return false;
  }

  const peers = value.peerDependencies;
  const meta = value.peerDependenciesMeta;

  return (
    (value.version === undefined || typeof value.version === 'string') &&
    (peers === undefined || isStringRecord(peers)) &&
    (meta === undefined || isPeerMeta(meta))
  );
}

/**
 * @param {unknown} value value to check
 * @returns {value is Record<string, string>} whether every property is a string
 */
function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === 'string');
}

/**
 * @param {unknown} value peerDependenciesMeta
 * @returns {value is Record<string, { optional?: boolean }>} whether the meta is usable
 */
function isPeerMeta(value: unknown): value is Record<string, { optional?: boolean }> {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (entry) =>
        isRecord(entry) && (entry.optional === undefined || typeof entry.optional === 'boolean')
    )
  );
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
      // Name filters silently drop packages (the original pnpm omission). Parseable --long lists
      // each install once with name@version. Depth 3 covers nested Sitecore packages (default is 0).
      query: `pnpm list --depth 3 --parseable --long${allowWorkspaces ? ' --recursive' : ''}`,
      parse: parsePackageList,
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
      parse: parsePackageList,
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
        (scPackage) => typeof scPackage?.name === 'string' && typeof scPackage?.version === 'string'
      )
    : [];
}

/**
 * Parse bun `pm ls` and pnpm `list --parseable --long` lines for trailing '@scope/name@version'
 * @param {string} output command output
 * @returns {Package[]} installed packages
 * @internal
 */
function parsePackageList(output: string): Package[] {
  return output.split(/\r?\n/).reduce<Package[]>((packages, line) => {
    const scPackage = PACKAGE_ENTRY.exec(line.trim());

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
