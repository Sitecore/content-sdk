/**
 * Operators supported for string fields.
 */
type StringOperator = 'eq' | 'ne';

/**
 * Operators supported for numeric fields (Int, Double).
 */
type NumericOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le';

/**
 * Operators supported for boolean fields.
 */
type BooleanOperator = 'eq' | 'ne';

/**
 * Operators supported for DateTime fields.
 */
type DateTimeOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'ge' | 'le';

/**
 * Facet filter for string fields.
 */
type StringFacetFilter = {
  operator: StringOperator;
  value: string | string[]; // Array for multiple 'eq' values
};

/**
 * Facet filter for numeric fields.
 */
type NumericFacetFilter = {
  operator: NumericOperator;
  value: number;
};

/**
 * Facet filter for boolean fields.
 */
type BooleanFacetFilter = {
  operator: BooleanOperator;
  value: boolean;
};

/**
 * Facet filter for DateTime fields.
 */
type DateTimeFacetFilter = {
  operator: DateTimeOperator;
  value: string;
};

/**
 * Union of all facet filter types.
 * The operator and value combination must match the field's data type.
 */
export type FacetFilter =
  | StringFacetFilter
  | NumericFacetFilter
  | BooleanFacetFilter
  | DateTimeFacetFilter;
