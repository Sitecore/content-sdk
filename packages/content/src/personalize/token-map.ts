import debug from '../debug';

/**
 * Flat map of dynamic content token keys to string values, as returned by Personalize executions.
 * @public
 */
export type TokenMap = Record<string, string>;

/**
 * Token keys allowed in authored `{{key}}` expressions and in Personalize output.
 * Anything else (for example `{{#each items}}` or `{{ a + b }}`) is not treated as a token.
 * @internal
 */
export const TOKEN_KEY_PATTERN = /^[A-Za-z0-9_.-]+$/;

/**
 * Returns the token value for a key when the map has a usable (own, non-empty string) value.
 * @param {TokenMap} tokens Token map
 * @param {string} key Token key
 * @returns {string | undefined} Token value
 * @internal
 */
export function getTokenValue(tokens: TokenMap, key: string): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(tokens, key)) {
    return undefined;
  }
  const value = tokens[key];
  return typeof value === 'string' && value !== '' ? value : undefined;
}

/**
 * Copies valid entries of an untrusted token object into a null-prototype map: own properties whose
 * key matches {@link TOKEN_KEY_PATTERN} and whose value is a non-empty string or a finite number.
 * Values are made well-formed (lone surrogates replaced) so they can always be URL-encoded.
 * @param {unknown} raw Untrusted token object
 * @param {TokenMap} [into] Destination map (mutated); a new map is created when omitted
 * @returns {TokenMap} The destination map
 * @internal
 */
export function normalizeTokens(raw: unknown, into: TokenMap = Object.create(null)): TokenMap {
  if (!isObject(raw)) {
    return into;
  }
  for (const key of Object.keys(raw)) {
    const value = raw[key];
    const text =
      typeof value === 'string'
        ? value
        : typeof value === 'number' && Number.isFinite(value)
        ? String(value)
        : '';
    if (text !== '' && TOKEN_KEY_PATTERN.test(key)) {
      into[key] = (text as WellFormedString).toWellFormed();
    }
  }
  return into;
}

/**
 * Runs Personalize executions concurrently and collects the selected variants and the tokens
 * they returned. A failed execution rejects the whole call, so the caller serves the default page.
 *
 * Tokens are kept from every execution, including ones that returned the default branch (no
 * `variantId`). An execution that returned a `variantId` outside its variant list is treated as
 * invalid and contributes neither a variant nor tokens. On a key collision the later execution wins.
 * @param {T[]} executions Executions in contractual order
 * @param {(execution: T) => Promise<unknown>} execute Execution runner
 * @returns {Promise<object>} Selected variants (`identifiedVariantIds`) and merged `tokens`
 * @internal
 */
export async function collectPersonalizeExecutionTokens<T extends { variantIds: string[] }>(
  executions: T[],
  execute: (execution: T) => Promise<unknown>
): Promise<{ identifiedVariantIds: string[]; tokens: TokenMap }> {
  const results = await Promise.all(executions.map(execute));
  const identifiedVariantIds: string[] = [];
  const tokens: TokenMap = Object.create(null);

  results.forEach((result, index) => {
    if (!isObject(result)) {
      return;
    }
    const variantId = result.variantId;
    if (typeof variantId === 'string' && variantId) {
      if (!executions[index].variantIds.includes(variantId)) {
        debug.personalize('invalid variant %s', variantId);
        return;
      }
      identifiedVariantIds.push(variantId);
    }
    normalizeTokens(result.tokens, tokens);
  });

  return { identifiedVariantIds, tokens };
}

// `String.prototype.toWellFormed` (Node 20+, all current browsers) is not in this package's TS lib yet.
type WellFormedString = string & { toWellFormed(): string };

/**
 * True for a non-null, non-array object.
 * @param {unknown} value Candidate value
 * @returns {boolean} Whether the value is an object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
