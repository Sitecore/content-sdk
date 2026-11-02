import fs from 'fs';
import path from 'path';

/**
 * Arguments that can turn scaffold telemetry off before a request is built.
 */
export type ScaffoldTelemetryArgs = {
  destination?: string;
  noTelemetry?: boolean;
};

/**
 * True when `start` is inside this Content SDK checkout.
 * Customer projects do not contain `packages/create-content-sdk-app`.
 * @param {string} start Directory to walk up from
 * @returns {boolean} Whether the directory belongs to the Content SDK repo
 */
export function isRunningInsideContentSdkRepo(start: string): boolean {
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
 * Skips telemetry for an explicit opt-out and for runs inside the monorepo.
 * That covers `yarn scaffold-samples`, template `yarn watch`, and local CLI runs from this repo.
 * @param {ScaffoldTelemetryArgs} args CLI arguments
 * @param {string} [cwd] Working directory. Defaults to `process.cwd()`
 * @returns {boolean} Whether this scaffold should not be tracked
 */
export function shouldSkipScaffoldTelemetry(
  args: ScaffoldTelemetryArgs,
  cwd: string = process.cwd()
): boolean {
  if (args.noTelemetry) {
    return true;
  }

  if (isRunningInsideContentSdkRepo(cwd)) {
    return true;
  }

  if (args.destination && isRunningInsideContentSdkRepo(args.destination)) {
    return true;
  }

  return false;
}
