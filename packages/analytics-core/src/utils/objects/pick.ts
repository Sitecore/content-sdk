/**
 * Picks the provided keys from the given object.
 * @param {Data} data The source object.
 * @param {Keys[]} keys Keys to retain from the source object.
 * @returns {Pick<Data, Keys>} Object containing only the specified keys.
 * @internal
 */
export function pick<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>;

  for (const key of keys) result[key] = data[key];

  return result;
}
