export type PrimitiveType = string | number | boolean;

/**
 * Generic Search fields type.
 * @public
 */
export type GenericFields = {
  [key: string]: PrimitiveType | PrimitiveType[] | GenericFields | GenericFields[];
};

/**
 * Utility type to extract all possible dot-notation paths from a nested object type.
 * @internal
 */
export type PathsToStringProps<T> = T extends PrimitiveType
  ? never
  : {
      [K in keyof T]: K extends string
        ? T[K] extends PrimitiveType | PrimitiveType[]
          ? K
          : T[K] extends GenericFields | GenericFields[]
          ? K | `${K}.${PathsToStringProps<T[K]>}`
          : K
        : never;
    }[keyof T];
