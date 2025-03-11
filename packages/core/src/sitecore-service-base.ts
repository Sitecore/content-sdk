import { GraphQLClient, GraphQLRequestClientFactory } from './graphql-request-client';
import { SitecoreConfigInput } from './config';
import debug from './debug';

export type GraphQLServiceConfig = Pick<SitecoreConfigInput, 'retries'> &
  Required<Pick<SitecoreConfigInput, 'defaultSite'>> & {
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
      retries: this.serviceConfig.retries?.count,
      retryStrategy: this.serviceConfig.retries?.retryStrategy,
    });
  }
}
