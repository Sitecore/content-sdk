/**
 * A reusable type that accepts only basic types and arrays of those
 */
export type BasicTypes =
  | string
  | boolean
  | number
  | undefined
  | Array<string | boolean | number | { [key: string]: BasicTypes } | Array<BasicTypes>>;
