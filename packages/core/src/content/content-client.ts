import { DocumentNode } from 'graphql';
import { GraphQLRequestClient } from '../graphql-request-client';
import { getContentUrl } from './utils';
import { FetchOptions } from '../models';
import debug from '../debug';

/**
 * Interface representing the options for the ContentClient.
 */
export interface ContentClientOptions {
  /** The base URL for the Content API. */
  url?: string;
  /** The tenant name. */
  tenant: string;
  /** The environment name. */
  environment: string;
  /** Indicates if preview mode is enabled. */
  preview: boolean;
  /** The authentication token. */
  token: string;
}

/**
 * Class representing a client for interacting with the Content API.
 */
export class ContentClient {
  endpoint: string;
  graphqlClient: GraphQLRequestClient;

  constructor({ url, tenant, environment, preview, token }: ContentClientOptions) {
    this.endpoint = getContentUrl({
      environment,
      preview,
      tenant,
      url,
    });

    this.graphqlClient = new GraphQLRequestClient(this.endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      debugger: debug.content,
    });
  }

  /**
   * Factory method for creating a ContentClient instance. This method allows you to create a client with the values populated from environment variables or provided as arguments.
   * @param {Partial<ContentClientOptions>} [options] - client configuration options
   * @param {string} [options.url] - Content base graphql endpoint url. If not provided, it will be read from the SITECORE_CS_URL environment variable. Otherwise, it defaults to https://cs-graphqlapi-staging.sitecore-staging.cloud.
   * @param {string} [options.tenant] - Tenant name. If not provided, it will be read from the SITECORE_CS_TENANT environment variable
   * @param {string} [options.environment] - Environment name. If not provided, it will be read from the SITECORE_CS_ENVIRONMENT environment variable. Otherwise, it defaults to 'main'
   * @param {boolean} [options.preview] - Indicates if preview mode is enabled. If not provided, it will be read from the SITECORE_CS_PREVIEW environment variable. Otherwise, it defaults to true
   * @param {string} [options.token] - Token for authentication. If not provided, it will be read from the SITECORE_CS_TOKEN environment variable.
   * @returns {ContentClient} ContentClient instance
   * @throws {Error} If tenant or token is not provided
   */
  static createClient({
    url,
    tenant,
    environment,
    preview,
    token,
  }: Partial<ContentClientOptions> = {}): ContentClient {
    const options = {
      url: url || process.env.SITECORE_CS_URL,
      tenant: tenant || process.env.SITECORE_CS_TENANT || '',
      environment: environment || process.env.SITECORE_CS_ENVIRONMENT || 'main',
      preview: preview || process.env.SITECORE_CS_PREVIEW === 'true',
      token: token || process.env.SITECORE_CS_TOKEN || '',
    };

    if (!options.tenant) {
      throw new Error(
        'Tenant is required to be provided as an argument or as a SITECORE_CS_TENANT environment variable'
      );
    }

    if (!options.token) {
      throw new Error(
        'Token is required to be provided as an argument or as a SITECORE_CS_TOKEN environment variable'
      );
    }

    return new ContentClient(options);
  }

  /**
   * Execute graphql request
   * @param {string | DocumentNode} query graphql query
   * @param {object} variables variables for the query
   * @param {FetchOptions} options options for configuring the request
   * @returns {T} response data
   */
  async get<T>(
    query: string | DocumentNode,
    variables: Record<string, unknown> = {},
    options: FetchOptions = {}
  ): Promise<T> {
    debug.content('fetching content data');

    return this.graphqlClient.request<T>(query, variables, options);
  }
}
