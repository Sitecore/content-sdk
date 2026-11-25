import { inspect } from 'util';
import { expect } from 'chai';
import type { SinonStub } from 'sinon';

/**
 * Serializes every argument of every call to a stubbed debug function, including nested
 * objects (a plain `String(arg)` turns objects into `[object Object]` and would hide a leak).
 * @param {SinonStub} stub - Stubbed debug function
 * @returns {string} All logged arguments as one string
 */
export const serializeDebugCalls = (stub: SinonStub): string =>
  stub.getCalls().map((call) => call.args.map((arg) => inspect(arg, { depth: null })).join(' ')).join('\n');

/**
 * Asserts that none of the given secrets appear anywhere in the debug output.
 * @param {SinonStub} stub - Stubbed debug function
 * @param {string[]} secrets - Values that must never be logged (e.g. sent and expected secrets)
 * @param {object} [options] - Assertion options
 * @param {boolean} [options.requireOutput] - Fail when nothing was logged at all, which would make
 * the check pass vacuously (default `true`)
 */
export const expectSecretsNotLogged = (
  stub: SinonStub,
  secrets: string[],
  { requireOutput = true }: { requireOutput?: boolean } = {}
): void => {
  const output = serializeDebugCalls(stub);
  if (requireOutput) {
    expect(stub.called, 'expected debug output to be produced').to.equal(true);
  }
  secrets.forEach((secret) => {
    expect(output, `debug output leaked "${secret}"`).to.not.include(secret);
  });
};
