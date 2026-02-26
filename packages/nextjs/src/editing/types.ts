/**
 * Represents an allowed query parameter.
 * @public
 */
export interface AllowedQueryParam {
  /**
   * The name of the query parameter to allow.
   */
  name: string;
  /**
   * Whether the query parameter is required.
   */
  required?: boolean;
}

/**
 * Resolver function for allowed query parameters, which can be used to extract additional parameters from the query string beyond the required editing parameters.
 * @param {string[]} queryParams Array of query parameters from incoming URL.
 * @returns {Array<AllowedQueryParam | string>} Allowed query editing parameters.
 * @public
 */
export type AllowedQueryParamsResolver = (
  queryParams: string[]
) => Array<AllowedQueryParam | string>;

/**
 * Allowed query parameters which can be defined as an array of parameter names or objects, or a resolver function which can be used to extract additional parameters from the query string beyond the required editing parameters.
 * @public
 */
export type AllowedQueryParams = Array<AllowedQueryParam | string> | AllowedQueryParamsResolver;

/**
 * Result of processing allowed query parameters, including any missing required parameters and the set of allowed parameters that were extracted from the query string.
 * @internal
 */
export interface GetAllowedQueryParamsResult {
  missingAllowedParams: string[];
  allowedQueryParams: { [key: string]: unknown };
}
