import { GraphQLClient } from './graphql-request-client';
import { GraphQLRequestClientFactory } from './graphql-request-client';
import debug from './debug';
import { SitecoreConfig } from './config';

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

export type FetchOptions = {
  retries?: number;
  retryStrategy?: RetryStrategy;
};

export type GraphQLServiceConfig = Pick<SitecoreConfig, 'retries' | 'defaultSite'> & {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
  /**
   * Optional debug logger override
   */
  debugger?: debug.Debugger;
};

/**
 * Base abstraction to implement custom layout service
 */
export abstract class SitecoreServiceBase {
  protected graphQLClient: GraphQLClient;

  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {GraphQLLayoutServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: GraphQLServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  /**
   * Gets a GraphQL client that can make requests to the API.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.serviceConfig.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.serviceConfig.clientFactory({
      debugger: this.serviceConfig.debugger || debug.http,
      retries: this.serviceConfig.retries.count,
      retryStrategy: this.serviceConfig.retries.retryStrategy,
    });
  }
}
