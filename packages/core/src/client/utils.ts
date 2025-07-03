import { SitecoreConfigInput } from '../config';
import { GraphQLRequestClient, GraphQLRequestClientFactoryConfig } from '../graphql-request-client';
import { getEdgeProxyContentUrl } from './edge-proxy';
import { FetchOptions } from '../models';

export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

export const createGraphQLClientFactory = (options: GraphQLClientOptions) => {
  let clientConfig: GraphQLRequestClientFactoryConfig | undefined;

  const { api } = options;
  const { edge, local } = api ?? {};
  const isBrowser = typeof window !== 'undefined';

  if (edge?.contextId) {
    // Real client for server-side rendering / API routes
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(edge.contextId, edge.edgeUrl),
    };
  } else if (edge?.clientContextId) {
    // Real client for client-side requests
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(edge.clientContextId, edge.edgeUrl),
    };
  } else if (local?.apiKey && local?.apiHost) {
    // Fallback to local XM GraphQL endpoint
    clientConfig = {
      endpoint: `${local.apiHost}${local.path}`,
      apiKey: local.apiKey,
    };
  } else if (isBrowser) {
    // Browser bundle has no IDs – initialise a dummy client and warn
    /* eslint-disable no-console */
    console.warn(
      'GraphQL client initialised in the browser without Edge or local API configuration; client-side requests may fail.'
    );
    clientConfig = { endpoint: '/api/graphql' };
  } else {
    // Server build mis-configured – hard fail
    throw new Error(
      'GraphQL client mis-configured. Provide one of:\n' +
        '  • api.edge.contextId\n' +
        '  • api.edge.clientContextId\n' +
        '  • api.local.{apiHost, apiKey}'
    );
  }

  return GraphQLRequestClient.createClientFactory({ ...clientConfig, ...options });
};
