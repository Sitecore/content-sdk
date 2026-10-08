import debug from '../debug';
import { TokenMap } from './token-map';
import { replaceTokensInternal } from './token-replace';
import { TOKEN_URL_KEYS, validateTokenizedUrlProperty } from './token-url';

/**
 * Options for the preferred one-pass layout finalization walk.
 * @internal
 */
export type FinalizeSitecoreTreeOptions = {
  tokens?: TokenMap;
  transform?: (value: string) => string;
};

/**
 * Structural-sharing walk of a Layout Service JSON tree.
 * When tokens are supplied, resolves mustache tokens then validates changed
 * URL-sensitive own properties, then applies the content/media transformer.
 * Unchanged strings and subtrees keep their original references.
 * @param {T} value Layout-compatible value
 * @param {FinalizeSitecoreTreeOptions} options Walk options
 * @returns {T} Finalized value
 * @internal
 */
export function finalizeSitecoreTree<T>(value: T, options: FinalizeSitecoreTreeOptions): T {
  const unmatched = new Set<string>();
  const result = walkValue(value, undefined, options, unmatched);
  if (options.tokens !== undefined && unmatched.size > 0) {
    debug.personalize('unmatched dynamic content token %o', Array.from(unmatched));
  }
  return result;
}

/**
 * Token-only object walk. Same traversal and URL-key rules as page
 * finalization, without a content/media transformer. After a string
 * changes, own-key `href` / `src` / `url` / `srcSet` / `srcset` values
 * are URL-validated; rejected values become empty.
 * @param {T} obj Layout-compatible value
 * @param {TokenMap} tokens Normalized token map
 * @returns {T} Tokenized value with structural sharing
 * @public
 */
export function replaceTokensInObject<T>(obj: T, tokens: TokenMap): T {
  return finalizeSitecoreTree(obj, { tokens });
}

/**
 * Recursively finalizes a value from the layout tree.
 *
 * Uses structural sharing: when nothing below a node changes, the original
 * reference is returned rather than a clone, so untouched subtrees keep their
 * identity and React reference checks stay stable.
 * @param {T} value Value to finalize
 * @param {string | undefined} key Property name the value was reached through, or `undefined` at the root
 * @param {FinalizeSitecoreTreeOptions} options Finalization options
 * @param {Set<string>} unmatched Collects keys with no usable token, for deferred logging
 * @returns {T} Finalized value, or the original reference when unchanged
 */
function walkValue<T>(
  value: T,
  key: string | undefined,
  options: FinalizeSitecoreTreeOptions,
  unmatched: Set<string>
): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    return finalizeString(value, key, options, unmatched) as T;
  }

  if (Array.isArray(value)) {
    let changed = false;
    const result: unknown[] = [];
    result.length = value.length;
    for (let i = 0; i < value.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(value, i)) {
        continue;
      }
      const child = walkValue(value[i], undefined, options, unmatched);
      if (child !== value[i]) {
        changed = true;
      }
      result[i] = child;
    }
    return (changed ? result : value) as T;
  }

  if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    let changed = false;
    const result: Record<string, unknown> = {};
    for (const childKey of Object.keys(value as Record<string, unknown>)) {
      const current = (value as Record<string, unknown>)[childKey];
      const child = walkValue(current, childKey, options, unmatched);
      if (child !== current) {
        changed = true;
      }
      result[childKey] = child;
    }
    return (changed ? result : value) as T;
  }

  return value;
}

/**
 * Finalizes a single string leaf.
 *
 * Replaces tokens, revalidates the result when the property is a URL-bearing
 * key whose value actually changed, and applies any caller-supplied transform.
 * @param {string} value String to finalize
 * @param {string | undefined} key Property name the string was reached through
 * @param {FinalizeSitecoreTreeOptions} options Finalization options
 * @param {Set<string>} unmatched Collects keys with no usable token, for deferred logging
 * @returns {string} Finalized string, or the original when unchanged
 */
function finalizeString(
  value: string,
  key: string | undefined,
  options: FinalizeSitecoreTreeOptions,
  unmatched: Set<string>
): string {
  let next = value;
  if (options.tokens !== undefined && value.indexOf('{{') !== -1) {
    next = replaceTokensInternal(value, options.tokens, {
      onUnclosed: () => {
        debug.personalize('unclosed dynamic content token');
      },
      onUnmatched: (tokenKey) => {
        unmatched.add(tokenKey);
      },
    });
    if (next !== value && key && TOKEN_URL_KEYS.has(key)) {
      next = validateTokenizedUrlProperty(key, next);
    }
  }
  if (options.transform) {
    next = options.transform(next);
  }
  return next;
}
