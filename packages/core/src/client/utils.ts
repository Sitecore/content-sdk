import { GraphQLRequestClient, GraphQLRequestClientFactoryConfig } from '../graphql-request-client';
import { getEdgeProxyContentUrl } from './graphql-edge-proxy';
import { SitecoreClientInit } from './models';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (config: SitecoreClientInit) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  if (config.api.edge.contextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(config.api.edge.contextId, config.api.edge.edgeUrl),
    };
  } else if (config.api.local.apiKey && config.api.local.apiHost) {
    clientConfig = {
      endpoint: `${config.api.local.apiHost}${config.api.local.path}`,
      apiKey: config.api.local.apiKey,
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return GraphQLRequestClient.createClientFactory(clientConfig);
};
