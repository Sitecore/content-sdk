import { SitecoreConfigInput } from '../config/index.js';
import {
  GraphQLRequestClient,
  GraphQLRequestClientFactoryConfig,
} from '../graphql-request-client.js';
import { getEdgeProxyContentUrl } from './graphql-edge-proxy.js';
import { FetchOptions } from '../models.js';

export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param {GraphQLClientOptions} options content sdk config
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
  } else if (typeof window !== 'undefined') {
    // In browser, create a client that won't be used for real requests
    console.warn(
      'GraphQL client created without proper configuration - client-side requests may fail'
    );
    clientConfig = {
      endpoint: '/api/graphql', // Dummy endpoint for browser initialization
    };
  } else {
    throw new Error(
      'Please configure and use either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }

  return GraphQLRequestClient.createClientFactory({ ...clientConfig, ...options });
};
