import { GraphQLClient as Client, ClientError } from 'graphql-request';
import parse from 'url-parse';
import { DocumentNode } from 'graphql';
import debuggers, { Debugger } from './debug';
import TimeoutPromise from './utils/timeout-promise';
import { GenericGraphQLClientError, RetryStrategy, FetchOptions } from './models';
import { DefaultRetryStrategy } from './retries';

/**
 * An interface for GraphQL clients for Sitecore APIs
 */
export interface GraphQLClient {
  /**
   * Execute graphql request
   * @param {string | DocumentNode} query graphql query
   * @param {RequestOptions} [options] options and variables for configuring a GraphQL request.
   */
  request<T>(
    query: string | DocumentNode,
    variables?: { [key: string]: unknown },
    options?: FetchOptions
  ): Promise<T>;
}

/**
 * This type represents errors that can occur in a GraphQL client.
 * In cases where an error status was sent back from the server (`!response.ok`), the `response` will be populated with details. In cases where a response was never received, the `code` can be populated with the error code (e.g. Node's 'ECONNRESET', 'ETIMEDOUT', etc).
 */
export type GraphQLClientError = Partial<ClientError> & GenericGraphQLClientError;

/**
 * Minimum configuration options for classes that implement @see GraphQLClient
 */
export type GraphQLRequestClientConfig = {
  /**
   * The API key to use for authentication. This will be added as an 'sc_apikey' header.
   */
  apiKey?: string;
  /**
   * Override debugger for logging. Uses 'core:http' by default.
   */
  debugger?: Debugger;
  /**
   * Override fetch method. Uses 'graphql-request' library default otherwise ('cross-fetch').
   */
  fetch?: typeof fetch;
  /**
   * GraphQLClient request timeout (in milliseconds).
   */
  timeout?: number;
  /**
   * Number of retries for client. Will use the specified `retryStrategy`.
   */
  retries?: number;
  /**
   * Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
   * back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.
   */
  retryStrategy?: RetryStrategy;
  /**
   * Custom headers to be sent with each request.
   */
  headers?: Record<string, string>;
};

/**
 * A GraphQL Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
 * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
 * @param config - The configuration object that specifies how the GraphQL client should be set up.
 * @returns An instance of a GraphQL Request Client ready to send GraphQL requests.
 */
export type GraphQLRequestClientFactory = (
  config?: Omit<GraphQLRequestClientConfig, 'apiKey'>
) => GraphQLRequestClient;

/**
 * Configuration type for @type GraphQLRequestClientFactory
 */
export type GraphQLRequestClientFactoryConfig = {
  endpoint: string;
  apiKey?: string;
};

/**
 * A GraphQL client for Sitecore APIs that uses the 'graphql-request' library.
 * https://github.com/prisma-labs/graphql-request
 */
export class GraphQLRequestClient implements GraphQLClient {
  private client: Client;
  private headers: Record<string, string> = {};
  private debug: Debugger;
  private abortTimeout?: TimeoutPromise;
  private timeout?: number;
  private retries: number;
  private retryStrategy: RetryStrategy;

  /**
   * Provides ability to execute graphql query using given `endpoint`
   * @param {string} endpoint The Graphql endpoint
   * @param {GraphQLRequestClientConfig} [clientConfig] GraphQL request client configuration.
   */
  constructor(private endpoint: string, clientConfig: GraphQLRequestClientConfig = {}) {
    if (clientConfig.apiKey) {
      this.headers.sc_apikey = clientConfig.apiKey;
    }
    if (clientConfig.headers) {
      this.headers = { ...this.headers, ...clientConfig.headers };
    }

    if (!endpoint || !parse(endpoint).hostname) {
      throw new Error(
        `Invalid GraphQL endpoint '${endpoint}'. Verify that appropriate environment variable is set`
      );
    }

    this.timeout = clientConfig.timeout;
    this.retries = clientConfig.retries ?? 3;
    this.retryStrategy =
      clientConfig.retryStrategy ||
      new DefaultRetryStrategy({ statusCodes: [429, 502, 503, 504, 520, 521, 522, 523, 524] });
    this.client = new Client(endpoint, {
      headers: this.headers,
      fetch: clientConfig.fetch,
    });
    this.debug = clientConfig.debugger || debuggers.http;
  }

  /**
   * Factory method for creating a GraphQLRequestClientFactory.
   * @param {object} config - client configuration options.
   * @param {string} config.endpoint - endpoint
   * @param {string} [config.apiKey] - apikey
   */
  static createClientFactory({
    endpoint,
    apiKey,
  }: GraphQLRequestClientFactoryConfig): GraphQLRequestClientFactory {
    return (config: Omit<GraphQLRequestClientConfig, 'apiKey'> = {}) =>
      new GraphQLRequestClient(endpoint, { ...config, apiKey });
  }

  /**
   * Execute graphql request
   * @param {string | DocumentNode} query graphql query
   * @param {RequestOptions} [options] Options for configuring a GraphQL request.
   */
  async request<T>(
    query: string | DocumentNode,
    variables?: { [key: string]: unknown },
    options?: FetchOptions
  ): Promise<T> {
    let attempt = 1;

    const retryer = async (): Promise<T> => {
      const retries = options?.retries || this.retries;
      const retryStrategy = options?.retryStrategy || this.retryStrategy;
      const debug = options?.debugger || this.debug;
      // Note we don't have access to raw request/response with graphql-request
      // but we should log whatever we have.
      debug('request: %o', {
        url: this.endpoint,
        headers: { ...this.headers, ...options?.headers },
        query,
        variables,
        timeout: this.timeout,
      });
      const startTimestamp = Date.now();
      const headers = { ...this.headers, ...options?.headers };
      const fetchWithOptionalTimeout = [this.client.request(query, variables, headers)];
      if (this.timeout) {
        this.abortTimeout = new TimeoutPromise(this.timeout);
        fetchWithOptionalTimeout.push(this.abortTimeout.start);
      }

      return Promise.race(fetchWithOptionalTimeout).then(
        (data: unknown) => {
          this.abortTimeout?.clear();
          this.debug('response in %dms: %o', Date.now() - startTimestamp, data);
          return Promise.resolve(data as T);
        },
        async (error: GraphQLClientError) => {
          this.abortTimeout?.clear();
          debug('response error: %o', error.response || error.message || error);
          const status = error.response?.status || error.code;
          const shouldRetry = retryStrategy.shouldRetry(error, attempt, retries);

          if (shouldRetry) {
            const delayMs = retryStrategy.getDelay(error, attempt);
            debug('Error: %s. Retrying in %dms (attempt %d).', status, delayMs, attempt);

            attempt++;
            return new Promise((resolve) => setTimeout(resolve, delayMs)).then(retryer);
          } else {
            return Promise.reject(error);
          }
        }
      );
    };

    return retryer();
  }
}
