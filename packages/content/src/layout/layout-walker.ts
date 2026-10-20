/**
 * String transformer applied by {@link transformLayoutStrings}.
 * @param {string} value String found in the tree
 * @param {string | undefined} key Own property name the string was reached through (`undefined` for array items and the root)
 * @returns {string} Transformed string, or the same value when unchanged
 * @internal
 */
export type LayoutStringTransform = (value: string, key: string | undefined) => string;

/**
 * Walks a Layout Service (or any JSON-compatible) tree and applies `transform` to every string.
 * Shared by media URL rewriting and dynamic content token replacement so both follow the same traversal.
 *
 * Unchanged strings and subtrees keep their original references (structural sharing), and the input
 * is never mutated. Only arrays and plain objects are traversed; other objects are returned as-is.
 * @param {T} value Value to process
 * @param {LayoutStringTransform} transform String transformer
 * @returns {T} Transformed value, or the original reference when nothing changed
 * @internal
 */
export function transformLayoutStrings<T>(value: T, transform: LayoutStringTransform): T {
  return walk(value, undefined, transform);
}

/**
 * Recursive step of {@link transformLayoutStrings}.
 * @param {T} value Value to process
 * @param {string | undefined} key Own property name the value was reached through
 * @param {LayoutStringTransform} transform String transformer
 * @returns {T} Transformed value, or the original reference when unchanged
 */
function walk<T>(value: T, key: string | undefined, transform: LayoutStringTransform): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (typeof value === 'string') {
    return transform(value, key) as T;
  }
  if (Array.isArray(value)) {
    let changed = false;
    const result: unknown[] = [];
    result.length = value.length;
    for (let i = 0; i < value.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(value, i)) {
        continue;
      }
      const child = walk(value[i], undefined, transform);
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
      const child = walk(current, childKey, transform);
      if (child !== current) {
        changed = true;
      }
      result[childKey] = child;
    }
    return (changed ? result : value) as T;
  }
  return value;
}
