import fs from 'fs';
import path from 'path';

const SDK_SCOPE = '@sitecore-content-sdk';

/**
 * True when an installed `@sitecore-content-sdk` package is a symlink into this source checkout.
 * A published install is a real directory, or a link into a package-manager store, and is still tracked.
 * @param {string} start Directory to walk up from
 * @returns {boolean} Whether the directory uses this Content SDK checkout
 */
export function isContentSdkCheckout(start: string): boolean {
  return walkParents(start, installedSdkTargetsCheckout);
}

/**
 * Skips telemetry for an explicit opt-out and for runs inside this repo.
 * @param {boolean} [noTelemetry] Per-run opt-out
 * @param {string} [cwd] Working directory. Defaults to `process.cwd()`
 * @returns {boolean} Whether this run should not be tracked
 */
export function shouldSkipCliTelemetry(
  noTelemetry?: boolean,
  cwd: string = process.cwd()
): boolean {
  return noTelemetry === true || isContentSdkCheckout(cwd);
}

/**
 * @param {string} start Directory to walk up from
 * @param {(dir: string) => boolean} matches Check applied to each directory
 * @returns {boolean} Whether a directory on the way to the filesystem root matched
 */
function walkParents(start: string, matches: (dir: string) => boolean): boolean {
  let current = path.resolve(start);
  const filesystemRoot = path.parse(current).root;

  while (true) {
    if (matches(current)) {
      return true;
    }

    if (current === filesystemRoot) {
      return false;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return false;
    }

    current = parent;
  }
}

/**
 * @param {string} dir Directory that may contain `node_modules`
 * @returns {boolean} Whether a scope package there links into this source checkout
 */
function installedSdkTargetsCheckout(dir: string): boolean {
  const scopeDir = path.join(dir, 'node_modules', SDK_SCOPE);
  let entries: string[];

  try {
    entries = fs.readdirSync(scopeDir);
  } catch {
    return false;
  }

  return entries.some((entry) => {
    const installed = path.join(scopeDir, entry);
    try {
      if (!fs.lstatSync(installed).isSymbolicLink()) {
        return false;
      }

      return isSdkSourceTree(fs.realpathSync(installed));
    } catch {
      return false;
    }
  });
}

/**
 * @param {string} packageDir Real path of an installed package
 * @returns {boolean} Whether that package lives in this source checkout
 */
function isSdkSourceTree(packageDir: string): boolean {
  return walkParents(packageDir, (dir) => {
    return (
      fs.existsSync(path.join(dir, 'lerna.json')) &&
      fs.existsSync(path.join(dir, 'packages', 'create-content-sdk-app', 'package.json'))
    );
  });
}
