import {
  FetchOptions,
  GraphQLClient,
  GraphQLRequestClient,
  GraphQLRequestClientFactory,
  GraphQLRequestClientFactoryConfig,
  debug,
} from '@sitecore-content-sdk/core';
import { SitecoreConfigInput } from '../config';
import { getEdgeProxyContentUrl } from './edge-proxy';

/**
 * GraphQL client options
 * @public
 */
export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

/**
 * No op client to be used in browser context, when client API settings and env variables are missing
 * @internal
 */
export class NoOpGraphQLClient implements GraphQLClient {
  request<T>(): Promise<T> {
    debug.common(
      'GraphQL client was initialized without a valid context ID in browser context. Using fallback client that returns empty results.'
    );
    return Promise.resolve({} as T);
  }
}

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param {GraphQLClientOptions} options content sdk config
 * @returns GraphQLRequestClientFactory instance
 * @public
 */
export const createGraphQLClientFactory = (options: GraphQLClientOptions) => {
  let clientConfig: GraphQLRequestClientFactoryConfig | undefined;

  const { api } = options;
  const { edge, local } = api ?? {};
  const isBrowser = typeof window !== 'undefined';

  if (edge?.contextId) {
    // Real client for server-side rendering / API routes
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(edge.edgeUrl),
      contextId: edge.contextId,
    };
  } else if (isBrowser && edge?.clientContextId) {
    // Real client for client-side requests
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(edge.edgeUrl),
      contextId: edge.clientContextId,
    };
  } else if (local?.apiKey && local?.apiHost) {
    // Fallback to local API settings
    clientConfig = {
      endpoint: `${local.apiHost}${local.path}`,
      apiKey: local.apiKey,
    };
  } else if (isBrowser) {
    // Browser bundle has no IDs – initialise a dummy client and warn
    /* eslint-disable no-console */
    console.warn(
      'GraphQL client initialized in the browser without Edge or local API configuration; client-side requests will return empty results.'
    );
    return (() => new NoOpGraphQLClient()) as unknown as GraphQLRequestClientFactory;
  } else {
    throw new Error(
      `GraphQL client misconfigured.
      Configure one of the following in sitecore.config or your .env file:
      Edge mode: set both sitecore.edge.contextId (server-side) and sitecore.edge.clientContextId (browser).
      Local API mode: set api.local.apiHost and api.local.apiKey.
      Supplying only api.edge.clientContextId will cause the application to fail at runtime.`
    );
  }

  return GraphQLRequestClient.createClientFactory({ ...clientConfig, ...options });
};
