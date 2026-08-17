export type PrimitiveType = string | number | boolean;

/**
 * Allowed filter operators for a facet field.
 * Note: string and boolean fields only support 'eq'; numeric and datetime fields support all operators.
 * @public
 */
export type FacetFilterOperator = 'eq' | 'gt' | 'lt' | 'ge' | 'le';

/**
 * A filter to apply to a facet field, narrowing search results to items matching the given value(s).
 * @public
 */
export interface FacetFilter {
  /**
   * Comparison operator. Use 'eq' for strings, tags, and booleans.
   * Numeric and datetime fields additionally support 'gt', 'lt', 'ge', 'le'.
   */
  operator: FacetFilterOperator;
  /**
   * The value to filter by. Pass an array to match any of the given values (OR semantics).
   * Array values are only supported with the 'eq' operator.
   */
  value: string | number | boolean | Array<string | number | boolean>;
}

/**
 * A specific facet field to include in the request, with optional filters.
 * @public
 */
export interface FacetField {
  /**
   * The display name of the facet as configured in the search index (not the raw field name).
   */
  name: string;
  /**
   * Optional filters that narrow search results to items matching the given facet values.
   */
  filters?: FacetFilter[];
}

/**
 * Facet request configuration.
 * Use 'all: true' to retrieve counts for every enabled facet in the index config.
 * Use 'fields' to filter results by specific facet values.
 * Both can be combined: 'all: true' returns all facet counts while 'fields' filters the results.
 * @public
 */
export interface FacetRequest {
  /**
   * When true, returns value counts for all facets enabled in the index configuration.
   */
  all?: boolean;
  /**
   * Specific facet fields to request or filter by.
   */
  fields?: FacetField[];
}

/**
 * A single facet value with the number of matching results.
 * @public
 */
export interface FacetValue {
  /**
   * The facet value (e.g. a category name, a price, a boolean flag).
   */
  text: string | number | boolean;
  /**
   * The number of search results that have this facet value.
   */
  count: number;
}

/**
 * A facet result containing the facet's display name and its available values.
 * @public
 */
export interface FacetResult {
  /**
   * The display name of the facet.
   */
  name: string;
  /**
   * The list of values found for this facet, each with a result count.
   */
  value: FacetValue[];
}

/**
 * Generic Search document type.
 * @public
 */
export type SearchDocument = {
  [key: string]: PrimitiveType | PrimitiveType[] | SearchDocument | SearchDocument[];
};

/**
 * Query payload for the `/v1/search` API.
 * `keyphrase`, `seedItemId`, and `seedItemUrl` are mutually exclusive; provide at most one.
 * `seedItemId` and `seedItemUrl` are used for More Like This (MLT) queries and are not
 * supported by `/v1/search/suggest`.
 * @public
 */
export interface SearchQuery {
  /**
   * Text value to search for. If omitted or empty, the search returns all results.
   * Mutually exclusive with `seedItemId` and `seedItemUrl`.
   */
  keyphrase?: string;
  /**
   * Item ID used as the seed for More Like This (MLT) results.
   * Mutually exclusive with `keyphrase` and `seedItemUrl`. Not supported by `/v1/search/suggest`.
   */
  seedItemId?: string;
  /**
   * Item URL used as the seed for More Like This (MLT) results.
   * Mutually exclusive with `keyphrase` and `seedItemId`. Not supported by `/v1/search/suggest`.
   */
  seedItemUrl?: string;
}

/**
 * A single autocomplete completion from query suggestion mode.
 * @public
 */
export interface QuerySuggestionItem {
  /**
   * Completed term from autocomplete.
   */
  text: string;
  /**
   * Full query with the completion applied.
   */
  queryPlusText: string;
}

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
