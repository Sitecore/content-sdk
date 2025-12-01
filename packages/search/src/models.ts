export type PrimitiveType = string | number | boolean;

/**
 * Generic Search document type.
 * @public
 */
export type SearchDocument = {
  [key: string]: PrimitiveType | PrimitiveType[] | SearchDocument | SearchDocument[];
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
          : T[K] extends SearchDocument | SearchDocument[]
          ? K | `${K}.${PathsToStringProps<T[K]>}`
          : K
        : never;
    }[keyof T];
