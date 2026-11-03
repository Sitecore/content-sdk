const SDK_SCOPE = '@sitecore-content-sdk/';
const VERSION_VALUE = /^[\^~]?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const SNAKE_CASE = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
const MAX_VERSION_LENGTH = 64;

/**
 * Reads `@sitecore-content-sdk/*` versions as flat `<name>_version` strings.
 * Values that are not a version or a simple version range are left out.
 * @param {Record<string, unknown> | undefined} pkg Parsed package.json
 * @returns {Record<string, string>} Version attributes safe to put in event `data`
 * @public
 */
export function collectSdkPackageVersions(
  pkg: Record<string, unknown> | undefined
): Record<string, string> {
  const versions: Record<string, string> = {};
  if (!pkg) {
    return versions;
  }

  for (const sectionName of ['dependencies', 'devDependencies'] as const) {
    const section = pkg[sectionName];
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      continue;
    }

    for (const [name, version] of Object.entries(section as Record<string, unknown>)) {
      if (!name.startsWith(SDK_SCOPE) || typeof version !== 'string') {
        continue;
      }
      if (version.length > MAX_VERSION_LENGTH || !VERSION_VALUE.test(version)) {
        continue;
      }

      const shortName = name.slice(SDK_SCOPE.length);
      const key = `${toSnake(shortName)}_version`;
      if (!SNAKE_CASE.test(key)) {
        continue;
      }
      versions[key] = version;
    }
  }

  return versions;
}

/**
 * @param {string} value Package name segment
 * @returns {string} snake_case segment
 */
function toSnake(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}
