import { SitecoreConfigInput } from '../config';
import { GraphQLRequestClient, GraphQLRequestClientFactoryConfig } from '../graphql-request-client';
import { getEdgeProxyContentUrl } from './graphql-edge-proxy';
import { FetchOptions } from '../models';

export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param {FetchOptions} options jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (options: GraphQLClientOptions) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  if (options.api?.edge?.contextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(options.api.edge.contextId, options.api.edge.edgeUrl),
    };
  } else if (options.api?.local?.apiKey && options.api?.local?.apiHost) {
    clientConfig = {
      endpoint: `${options.api.local.apiHost}${options.api.local.path}`,
      apiKey: options.api.local.apiKey,
    };
  } else {
    throw new Error(
      'Please configure and use either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return GraphQLRequestClient.createClientFactory({ ...clientConfig, ...options });
};
