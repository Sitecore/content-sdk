/**
 * Picking keys/properties from an object
 *
 * @param data - The source object.
 * @param keys - An array of keys to pick.
 * @returns - An object with the keys passed.
 */
export function pick<Data extends object, Keys extends keyof Data>(
  data: Data,
  keys: Keys[]
): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>;

  for (const key of keys) result[key] = data[key];

  return result;
}
