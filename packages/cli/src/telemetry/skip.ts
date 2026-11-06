import fs from 'fs';
import path from 'path';

/**
 * True when `start` is inside this Content SDK checkout.
 * A customer Lerna repo does not contain `packages/create-content-sdk-app`.
 * @param {string} start Directory to walk up from
 * @returns {boolean} Whether the directory belongs to the Content SDK repo
 */
export function isContentSdkCheckout(start: string): boolean {
  let current = path.resolve(start);
  const root = path.parse(current).root;

  while (true) {
    if (
      fs.existsSync(path.join(current, 'lerna.json')) &&
      fs.existsSync(path.join(current, 'packages', 'create-content-sdk-app', 'package.json'))
    ) {
      return true;
    }

    if (current === root) {
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
