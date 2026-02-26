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
 * @returns {AllowedQueryParam[]} allowed query editing parameters.
 * @public
 */
export type AllowedQueryParamsResolver = (queryParams: string[]) => AllowedQueryParam[];

