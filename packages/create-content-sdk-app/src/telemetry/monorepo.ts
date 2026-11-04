import path from 'path';
import { isDevEnvironment } from '../common/utils/helpers';

/**
 * Arguments that can turn scaffold telemetry off before a request is built.
 */
export type ScaffoldTelemetryArgs = {
  destination?: string;
  noTelemetry?: boolean;
};

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

  if (isDevEnvironment(cwd)) {
    return true;
  }

  if (args.destination && isDevEnvironment(path.resolve(cwd, args.destination))) {
    return true;
  }

  return false;
}
