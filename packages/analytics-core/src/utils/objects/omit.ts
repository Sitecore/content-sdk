/**
 * Omits the provided keys from the given object.
 * @param {Data} data The source object.
 * @param {Keys[]} keys Keys to omit from the source object.
 * @returns {Omit<Data, Keys>} Object without the specified keys.
 * @internal
 */
export function omit<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Omit<Data, Keys> {
  const result = { ...data };

  for (const key of keys) delete result[key];

  return result;
}
