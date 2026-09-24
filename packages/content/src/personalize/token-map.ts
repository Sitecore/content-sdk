import debug from '../debug';

/**
 * Flat map of dynamic content token keys to normalized string values.
 * Empty strings are retained so last-write-wins merge is preserved, but they
 * resolve as missing during replacement.
 * @public
 */
export type TokenMap = Record<string, string>;

/**
 * Expected token-enabled Personalize flow output after runtime validation.
 * Nested token objects are unsupported. Values may be strings or finite numbers.
 * @public
 */
export type PersonalizeExecutionResult = {
  variantId?: string;
  tokens?: Record<string, string | number>;
};

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Returns a fresh null-prototype token map for merge destinations.
 * @returns {TokenMap} Empty token map
 * @internal
 */
export function createEmptyTokenMap(): TokenMap {
  return Object.create(null) as TokenMap;
}

/**
 * True when the value is a plain, non-null, non-array object.
 * @param {unknown} value Candidate value
 * @returns {boolean} Whether the value is a plain object
 * @internal
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}

/**
 * Normalizes a raw Personalize token value.
 * Strings are unchanged. Finite numbers become `String(value)`.
 * Unsupported values are ignored.
 * @param {unknown} value Raw token value
 * @returns {string | undefined} Normalized string, or undefined when ignored
 * @internal
 */
export function normalizeTokenValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

/**
 * True when a map has an own, non-empty string value for the key.
 * @param {TokenMap} tokens Token map
 * @param {string} key Trimmed token key
 * @returns {boolean} Whether the value is usable at replacement time
 * @internal
 */
export function hasUsableTokenValue(tokens: TokenMap, key: string): boolean {
  return getUsableTokenValue(tokens, key) !== undefined;
}

/**
 * Returns the usable replacement value for a trimmed key, if any.
 * Empty strings remain in the map but resolve as missing.
 * @param {TokenMap} tokens Token map
 * @param {string} key Trimmed token key
 * @returns {string | undefined} Usable value
 * @internal
 */
export function getUsableTokenValue(tokens: TokenMap, key: string): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(tokens, key)) {
    return undefined;
  }
  const value = tokens[key];
  if (typeof value !== 'string' || value === '') {
    return undefined;
  }
  return value;
}

/**
 * True when the normalized map contains at least one usable non-empty visitor value.
 * @param {TokenMap} tokens Token map
 * @returns {boolean} Whether visitor-token HTTP cache restrictions apply
 * @internal
 */
export function tokenMapHasUsableVisitorValues(tokens: TokenMap): boolean {
  return Object.keys(tokens).some((key) => hasUsableTokenValue(tokens, key));
}

/**
 * Merges a raw Personalize token object into an existing map.
 * Reads own properties only, skips dangerous keys, and lets later normalized
 * values overwrite earlier ones (including `""` and `"0"`).
 * Callers should pass a fresh `Object.create(null)` map as `into`.
 * @param {TokenMap} into Destination map (mutated)
 * @param {unknown} raw Untrusted raw token object
 * @param {(key: string) => void} [onCollision] Called with the colliding key only
 * @returns {TokenMap} The mutated destination map
 * @public
 */
export function mergePersonalizeTokens(
  into: TokenMap,
  raw: unknown,
  onCollision?: (key: string) => void
): TokenMap {
  if (!isPlainObject(raw)) {
    return into;
  }

  for (const key of Object.keys(raw)) {
    if (DANGEROUS_KEYS.has(key)) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(raw, key)) {
      continue;
    }
    const normalized = normalizeTokenValue(raw[key]);
    if (normalized === undefined) {
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
 * Runtime-validates an untrusted Personalize execution result.
 * A valid selected variant is accepted even when `tokens` has an unsupported shape;
 * only the token object is ignored in that case.
 * @param {unknown} value Untrusted execution result
 * @returns {boolean} Whether the result has a usable object shape
 * @internal
 */
export function isPersonalizeExecutionResult(value: unknown): value is PersonalizeExecutionResult {
  if (!isPlainObject(value)) {
    return false;
  }
  return value.variantId === undefined || typeof value.variantId === 'string';
}

/**
 * Merges tokens from execution results in contractual execution order.
 * Results without a valid selected variant for the matching execution are dropped.
 * @param {Array<{ variantIds: string[] }>} executions Executions in contractual order
 * @param {unknown[]} results Results aligned with `executions` (not completion order)
 * @returns {TokenMap} Merged token map
 * @internal
 */
export function mergeExecutionTokenResults(
  executions: Array<{ variantIds: string[] }>,
  results: unknown[]
): TokenMap {
  const into = createEmptyTokenMap();
  const collided = new Set<string>();

  for (let i = 0; i < executions.length; i++) {
    const result = results[i];
    if (!isPersonalizeExecutionResult(result) || !result.variantId) {
      continue;
    }
    if (!executions[i].variantIds.includes(result.variantId)) {
      continue;
    }
    mergePersonalizeTokens(into, result.tokens, (key) => {
      collided.add(key);
    });
  }

  if (collided.size > 0) {
    debug.personalize('dynamic content token collision: %o', Array.from(collided));
  }

  return into;
}
