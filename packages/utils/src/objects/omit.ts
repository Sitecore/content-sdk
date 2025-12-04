/**
 * Omitting keys/properties from an object
 *
 * @param data - The source object.
 * @param keys - An array of keys to omit.
 * @returns - An object without the keys passed.
 */
export function omit<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Omit<Data, Keys> {
  const result = { ...data };

  for (const key of keys) delete result[key];

  return result;
}
