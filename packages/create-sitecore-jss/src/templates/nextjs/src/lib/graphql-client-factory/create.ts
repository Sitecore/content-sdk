import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  getEdgeProxyContentUrl,
} from '@sitecore-content-sdk/nextjs/graphql';
import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (config: SitecoreConfig) => {
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
