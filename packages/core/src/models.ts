import { Debugger } from 'debug';

/**
 * Html <link> tag data model
 */
export type HTMLLink = {
  [key: string]: unknown;
} & Pick<HTMLLinkElement, 'rel' | 'href'>;

/**
 * This type represents errors that can occur in a GraphQL client.
 * In cases where an error status was sent back from the server (`!response.ok`), the `response` will be populated with details. In cases where a response was never received, the `code` can be populated with the error code (e.g. Node's 'ECONNRESET', 'ETIMEDOUT', etc).
 */
export type GenericGraphQLClientError = Partial<Error> & {
  response?: {
    ok?: boolean;
    status?: number;
    headers?: Headers;
  };
  headers?: HeadersInit;
  code?: string;
};

/**
 * Defines the strategy for retrying GraphQL requests based on errors and attempts.
 */
export interface RetryStrategy {
  /**
   * Determines whether a request should be retried based on the given error and attempt count.
   * @param error - The error received from the GraphQL request.
   * @param attempt - The current attempt number.
   * @param retries - The number of retries configured.
   * @returns A boolean indicating whether to retry the request.
   */
  shouldRetry(error: GenericGraphQLClientError, attempt: number, retries: number): boolean;
  /**
   * Calculates the delay (in milliseconds) before the next retry based on the given error and attempt count.
   * @param error - The error received from the GraphQL request.
   * @param attempt - The current attempt number.
   * @returns The delay in milliseconds before the next retry.
   */
  getDelay(error: GenericGraphQLClientError, attempt: number): number;
}

/**
 * Object model of a sitemap's site page item.
 */
export type StaticPath = {
  params: {
    path: string[];
  };
  locale?: string;
};

/**
 * Data needed to paginate results in graphql
 */
export interface PageInfo {
  /**
   * string token that can be used to fetch the next page of results
   */
  endCursor: string;
  /**
   * a value that indicates whether more pages of results are available
   */
  hasNext: boolean;
}

export type FetchOptions = {
  /**
   * Number of retries GraphQL client will attempt on request error
   */
  retries?: number;
  /**
   * Retry strategy instance
   */
  retryStrategy?: RetryStrategy;
  /**
   * Override to replace default nodeJS fetch implementation
   */
  fetch?: typeof fetch;
  /**
   * Custom headers to be sent with each request.
   */
  headers?: Record<string, string>;
  /**
   * Override debugger for logging. Uses 'core:http' by default.
   */
  debugger?: Debugger;
};
