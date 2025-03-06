import * as models from './models';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { SitecoreConfig } from '../config';
import { SitecoreServiceBase } from '../models';

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
export abstract class LayoutServiceBase extends SitecoreServiceBase {
  abstract fetchLayoutData(
    itemPath: string,
    language?: string,
    site?: string
  ): Promise<models.LayoutServiceData>;
}
