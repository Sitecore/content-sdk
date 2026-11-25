import { inspect } from 'util';
import { expect, type MockInstance } from 'vitest';

/**
 * Serializes every argument of every call to a mocked debug function, including nested
 * objects (a plain `String(arg)` turns objects into `[object Object]` and would hide a leak).
 * @param {MockInstance} mock - Spied/mocked debug function
 * @returns {string} All logged arguments as one string
 */
export function serializeDebugCalls(mock: MockInstance): string {
  return mock.mock.calls
    .map((args: unknown[]) => args.map((arg) => inspect(arg, { depth: null })).join(' '))
    .join('\n');
}

/**
 * Asserts that none of the given secrets appear anywhere in the debug output.
 * @param {MockInstance} mock - Spied/mocked debug function
 * @param {string[]} secrets - Values that must never be logged (e.g. sent and expected secrets)
 * @param {object} [options] - Assertion options
 * @param {boolean} [options.requireOutput] - Fail when nothing was logged at all, which would make
 * the check pass vacuously (default `true`)
 */
export function expectSecretsNotLogged(
  mock: MockInstance,
  secrets: string[],
  { requireOutput = true }: { requireOutput?: boolean } = {}
): void {
  if (requireOutput) {
    expect(mock.mock.calls.length, 'expected debug output to be produced').toBeGreaterThan(0);
  }
  const output = serializeDebugCalls(mock);
  for (const secret of secrets) {
    expect(output, `debug output leaked "${secret}"`).not.toContain(secret);
  }
}
