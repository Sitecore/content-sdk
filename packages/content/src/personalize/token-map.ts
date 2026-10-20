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

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

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
 * Copies valid entries of an untrusted token object into a null-prototype map.
 * Keeps own properties whose key matches {@link TOKEN_KEY_PATTERN} and whose value is a
 * non-empty string or a finite number (stringified). Later values overwrite earlier ones.
 * @param {unknown} raw Untrusted token object
 * @param {TokenMap} [into] Destination map (mutated); a new map is created when omitted
 * @param {(key: string) => void} [onCollision] Called when a key already exists in `into`
 * @returns {TokenMap} The destination map
 * @internal
 */
export function normalizeTokens(
  raw: unknown,
  into: TokenMap = Object.create(null),
  onCollision?: (key: string) => void
): TokenMap {
  if (!isPlainObject(raw)) {
    return into;
  }
  for (const key of Object.keys(raw)) {
    if (DANGEROUS_KEYS.has(key) || !TOKEN_KEY_PATTERN.test(key)) {
      continue;
    }
    const value = raw[key];
    const normalized =
      typeof value === 'string'
        ? value
        : typeof value === 'number' && Number.isFinite(value)
        ? String(value)
        : '';
    if (normalized === '') {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(into, key)) {
      onCollision?.(key);
    }
    into[key] = normalized;
  }
  return into;
}

/**
 * Runs Personalize executions concurrently and collects the selected variants and the tokens
 * they returned. A failed execution does not reject the others.
 *
 * Tokens are kept from every successful execution, including ones that returned the default
 * branch (no `variantId`). An execution that returned a `variantId` outside its variant list is
 * treated as invalid and contributes neither a variant nor tokens. Tokens are merged in
 * execution order, so on a key collision the later execution wins.
 * @param {T[]} executions Executions in contractual order
 * @param {(execution: T) => Promise<unknown>} execute Execution runner
 * @returns {Promise<object>} Selected variants (`identifiedVariantIds`) and merged `tokens`
 * @internal
 */
export async function collectPersonalizeExecutionTokens<T extends { variantIds: string[] }>(
  executions: T[],
  execute: (execution: T) => Promise<unknown>
): Promise<{ identifiedVariantIds: string[]; tokens: TokenMap }> {
  const results = await Promise.all(
    executions.map((execution) =>
      Promise.resolve()
        .then(() => execute(execution))
        .catch((error) => {
          debug.personalize(
            'personalize execution failed: %s',
            error instanceof Error ? error.message : 'unknown error'
          );
          return null;
        })
    )
  );

  const identifiedVariantIds: string[] = [];
  const tokens: TokenMap = Object.create(null);
  const collisions = new Set<string>();

  results.forEach((result, index) => {
    if (!isPlainObject(result)) {
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
    normalizeTokens(result.tokens, tokens, (key) => collisions.add(key));
  });

  if (collisions.size > 0) {
    debug.personalize('dynamic content token collision: %o', Array.from(collisions));
  }

  return { identifiedVariantIds, tokens };
}

/**
 * True for a non-null, non-array object whose prototype is `null` or a realm's `Object.prototype`.
 * @param {unknown} value Candidate value
 * @returns {boolean} Whether the value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  // Accept objects from another realm (for example JSON parsed in an Edge runtime sandbox).
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}
