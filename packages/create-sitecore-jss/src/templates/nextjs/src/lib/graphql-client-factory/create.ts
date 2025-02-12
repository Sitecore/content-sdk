import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  getEdgeProxyContentUrl,
} from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { JssConfigInput } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (config: JssConfigInput) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;

  if (config.api?.contextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(config.api.contextId, config.api.edgeUrl),
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return GraphQLRequestClient.createClientFactory(clientConfig);
};
