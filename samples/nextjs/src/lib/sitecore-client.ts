import { NextjsPage, SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import sites from '.sitecore/sites.json';
import scConfig from 'sitecore.config';
import {
  FetchOptions,
  GraphQLClientOptions,
  GraphQLRequestClient,
  GraphQLRequestClientConfig,
  SitecoreClientInit,
  GraphQLRequestClientFactory,
  GraphQLRequestClientFactoryConfig,
  getEdgeProxyContentUrl,
  PageOptions,
} from '@sitecore-content-sdk/core/client';
import { DocumentNode } from 'graphql';
import { GraphQLClient } from 'graphql-request';
type NextCacheOptions = {
  cache?: 'force-cache' | 'no-store';
  next?: { revalidate?: false | 0 | number; tags?: string[] };
};
type NextFetchOptions = FetchOptions & NextCacheOptions;

class NextJsGraphQLClient extends GraphQLRequestClient {
  private currentEndpoint: string;
  constructor(
    endpoint: string,
    protected clientConfig: GraphQLRequestClientConfig = {}
  ) {
    super(endpoint, clientConfig);
    this.currentEndpoint = endpoint;
  }

  request<T>(
    query: string | DocumentNode,
    variables?: { [key: string]: unknown },
    options?: NextFetchOptions
  ): Promise<T> {
    const headers = { ...this.clientConfig.headers, ...options?.headers };
    if (this.clientConfig.apiKey) {
      headers['sc_apikey'] = this.clientConfig.apiKey;
    }
    const nextOptions = this.extractNextCacheOptions(options);
    const cachedFetch: typeof fetch = (input, init) => {
      return fetch(input, { ...init, ...nextOptions });
    };

    const client = new GraphQLClient(this.currentEndpoint, {
      headers: headers,
      fetch: cachedFetch,
    });
    return client.request(query, variables, headers);
  }

  private extractNextCacheOptions(options?: NextFetchOptions): NextCacheOptions {
    return {
      cache: options?.cache,
      next: options?.next,
    };
  }
}

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

  return (config: Omit<GraphQLRequestClientConfig, 'apiKey'> = {}) =>
    new NextJsGraphQLClient(clientConfig.endpoint, { ...config, apiKey: clientConfig.apiKey });
};

class NextJsSitecoreClient extends SitecoreClient {
  constructor(initOptions: SitecoreClientInit) {
    super(initOptions);
  }

  protected getClientFactory(): GraphQLRequestClientFactory {
    const graphQLOptions: GraphQLClientOptions = {
      api: this.initOptions.api,
      retries: this.initOptions.retries.count,
      retryStrategy: this.initOptions.retries.retryStrategy,
    };

    return createGraphQLClientFactory(graphQLOptions);
  }

  getPage(
    path: string | string[],
    pageOptions: PageOptions,
    options?: NextFetchOptions
  ): Promise<NextjsPage | null> {
    return super.getPage(path, pageOptions, options);
  }
}

const client = new NextJsSitecoreClient({
  sites,
  ...scConfig,
});

export default client;
