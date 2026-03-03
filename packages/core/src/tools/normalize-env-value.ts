/**
 * Normalizes values that may come from environment variables.
 * In Node, setting `process.env.FOO = undefined` results in the string 'undefined',
 * which should be treated as if the variable is not set.
 * @param {string | undefined} value - Possibly undefined env-like value
 * @returns {string | undefined} A usable string value, or undefined if not meaningful
 * @internal
 */
export function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const lowered = trimmed.toLowerCase();
  if (lowered === 'undefined' || lowered === 'null') return undefined;

  return trimmed;
}
