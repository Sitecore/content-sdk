import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  getEdgeProxyContentUrl,
} from '@sitecore-content-sdk/nextjs/graphql';
import { JssConfigInput } from '@sitecore-content-sdk/nextjs';

//TODO: better type handling
type EdgeApi = {
  contextId: string;
  edgeUrl?: string;
  path?: string;
};

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = (config: JssConfigInput) => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  const api = config.api as EdgeApi;
  if (api.contextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(api.contextId, api.edgeUrl),
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return GraphQLRequestClient.createClientFactory(clientConfig);
};
