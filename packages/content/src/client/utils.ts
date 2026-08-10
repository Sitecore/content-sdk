import { Agent } from 'undici';
import {
  FetchOptions,
  GraphQLRequestClient,
  GraphQLRequestClientFactoryConfig,
} from '@sitecore-content-sdk/core';
import { SitecoreConfigInput } from '../config';
import { getEdgeProxyContentUrl } from './edge-proxy';

/**
 * GraphQL client options
 * @public
 */
export type GraphQLClientOptions = Pick<SitecoreConfigInput, 'api'> & FetchOptions;

export const createCliGraphQLClientFactory = (options: GraphQLClientOptions) => {
  const nonHangingFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Removes the chance of lingering connections after fetch has completed
    // This prevents CLI logic from crashing when process.exit is called explicitly after a fetch call
    const nonHangingAgent = new Agent({
      keepAliveTimeout: 1,
      keepAliveMaxTimeout: 1,
      connections: 1,
      pipelining: 0,
    });
    let res: Response;
    try {
      const customInit = { ...init, dispatcher: nonHangingAgent };
      const fetchFunction =
        options.fetch ??
        ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init));
      res = await fetchFunction(input, customInit);
    } finally {
      await nonHangingAgent.destroy();
    }
    return res;
  };
  return createGraphQLClientFactory({ ...options, fetch: nonHangingFetch });
};

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
      'GraphQL client initialised in the browser without Edge or local API configuration; client-side requests may fail.'
    );
    clientConfig = { endpoint: '/api/graphql' };
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
