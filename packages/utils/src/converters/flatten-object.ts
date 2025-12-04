import type { BasicTypes } from '../interfaces';

/**
 * A function that flattens an object, by combining the keys with an "_".
 * @param data - An object that has the required data to perform the flattening
 * @returns - A new flattened object
 * @example
 *
 * ```ts
 * const object = {order:{amount: 1, delivered: false}}
 * const flattenedObject = flattenObject(object)
 * // flattenedObject will be {order_amount: 1, order_delivered: false}
 * ```
 */
export function flattenObject(data: FlattenObjectDataParameters) {
  const { currentKey, object } = data;
  const newObject = data.newObject ?? {};

  for (const key in object) {
    const value = object[key];

    if (value === undefined) continue;

    if (typeof value === 'object' && !Array.isArray(value))
      flattenObject({
        currentKey: `${currentKey ? `${currentKey}_${key}` : key}`,
        newObject,
        object: value,
      });
    else newObject[currentKey ? `${currentKey}_${key}` : key] = value;
  }

  return newObject;
}

/**
 * Interface for the data object parameter of the flattenObject function
 */
interface FlattenObjectDataParameters {
  object: NestedObject;
  currentKey?: string;
  newObject?: FlattenedObject;
}

/**
 * Interface for the return object of the flattenObject function
 */
export interface FlattenedObject {
  [key: string]: BasicTypes;
}

/**
 * Interface of the object to flatten
 */
export interface NestedObject {
  [key: string]: BasicTypes | NestedObject;
}
