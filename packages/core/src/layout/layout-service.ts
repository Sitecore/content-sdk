import { GraphQLClient } from '../graphql-request-client';
import * as models from './models';
import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import debug from '../debug';
import { SitecoreConfig } from '../config';

export interface LayoutService {
  /**
   * Fetch layout data for an item.
   * @param {string} itemPath
   * @param {string} [language]
   * @param {IncomingMessage} [req] Request instance
   * @param {ServerResponse} [res] Response instance
   * @returns {Promise<LayoutServiceData>} layout data
   */
  fetchLayoutData(
    itemPath: string,
    language?: string,
    site?: string,
    req?: IncomingMessage,
    res?: ServerResponse
  ): Promise<models.LayoutServiceData>;
}

export type GraphQLServiceConfig = Pick<SitecoreConfig, 'retries' | 'defaultSite'> & {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
};

/**
 * Base abstraction to implement custom layout service
 */
export abstract class LayoutServiceBase implements LayoutService {
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
   * @param {Debugger} [debuglog] debug stream to write debug messages to
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(debuglog?: debug.Debugger): GraphQLClient {
    if (!this.serviceConfig.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.serviceConfig.clientFactory({
      debugger: debuglog || debug.http,
      retries: this.serviceConfig.retries.count,
      retryStrategy: this.serviceConfig.retries.retryStrategy,
    });
  }

  abstract fetchLayoutData(
    itemPath: string,
    language?: string,
    site?: string,
    req?: IncomingMessage,
    res?: ServerResponse
  ): Promise<models.LayoutServiceData>;
}
