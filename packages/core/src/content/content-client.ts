import { DocumentNode } from 'graphql';
import { GraphQLRequestClient } from '../graphql-request-client';
import { getContentUrl } from './utils';
import { FetchOptions } from '../models';
import debug from '../debug';
import {
  GET_LOCALE_QUERY,
  GET_LOCALES_QUERY,
  LocaleQueryResponse,
  LocalesQueryResponse,
} from './locales';
import {
  GET_TAXONOMY_QUERY,
  GET_TAXONOMIES_QUERY,
  Taxonomy,
  TaxonomyQueryResponse,
  TaxonomiesQueryResponse,
} from './taxonomies';

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
  preview?: boolean;
  /** The authentication token. */
  token: string;
}

/**
 * Class representing a client for interacting with the Content API.
 */
export class ContentClient {
  endpoint: string;
  graphqlClient: GraphQLRequestClient;

  constructor({ url, tenant, environment, preview = false, token }: ContentClientOptions) {
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
   * @param {boolean} [options.preview] - Indicates if preview mode is enabled. If not provided, it will be read from the SITECORE_CS_PREVIEW environment variable. Otherwise, it defaults to false
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

  /**
   * Retrieves the locale information for a given locale ID.
   * @param {string} id - The unique identifier of the locale item.
   * @returns A promise that resolves to the locale information associated with the specified locale ID.
   */
  async getLocale(id: string) {
    debug.content('Getting locale for id: %s', id);

    const response = await this.get<LocaleQueryResponse>(GET_LOCALE_QUERY, { id });
    return response.locale;
  }

  /**
   * Retrieves all available locales from the content service.
   * @returns A promise that resolves to an array of locales.
   */
  async getLocales() {
    debug.content('Getting all locales');

    const response = await this.get<LocalesQueryResponse>(GET_LOCALES_QUERY);
    return response.manyLocale;
  }

  /**
   * Retrieves all available taxonomies with optional pagination support.
   * @param {object} [options] - Optional pagination options.
   * @param {number} [options.pageSize] - Limits the number of taxonomies returned per page. Defaults to the API's default
   * @param {string} [options.after] - Cursor for pagination; use the `cursor` returned from the previous call to fetch the next page.
   * @returns A promise that resolves to an object containing taxonomies, their terms, and pagination info.
   */
  async getTaxonomies(options?: { pageSize?: number; after?: string }) {
    debug.content(
      'Getting taxonomies (pageSize: %s, after: %s)',
      options?.pageSize ?? 'API Default',
      options?.after ?? ''
    );

    const variables = {
      pageSize: options?.pageSize,
      after: options?.after ?? '',
    };

    const response = await this.get<TaxonomiesQueryResponse>(GET_TAXONOMIES_QUERY, variables);
    const data = response?.manyTaxonomy;

    return {
      results: (data?.results ?? []).map((taxonomy) => ({
        system: taxonomy.system,
        terms: taxonomy.terms?.results ?? [],
      })),
      cursor: data?.cursor,
      hasMore: data?.hasMore ?? false,
    };
  }

  /**
   * Retrieves a taxonomy by its ID, with optional pagination support for its terms.
   * @param {object} options - Options for fetching the taxonomy.
   * @param {string} options.id - The unique identifier of the taxonomy.
   * @param {object} [options.terms] - Optional pagination options for terms.
   * @param {number} [options.terms.pageSize] - Optional. Limits the number of terms returned per page.
   * @param {string} [options.terms.after] - Optional. Cursor for pagination. Used to fetch the next page of terms.
   * @returns A promise that resolves to the taxonomy object, including pagination metadata (`hasMore`, `cursor`) for its terms. Returns `null` if the taxonomy is not found.
   */
  async getTaxonomy({
    id,
    terms,
  }: {
    id: string;
    terms?: {
      pageSize?: number;
      after?: string;
    };
  }): Promise<Taxonomy | null> {
    debug.content(
      'Getting taxonomy for id: %s (termsPageSize: %s, termsAfter: %s)',
      id,
      terms?.pageSize ?? 'API Default',
      terms?.after ?? ''
    );

    const variables = {
      id,
      termsPageSize: terms?.pageSize,
      termsAfter: terms?.after,
    };

    const response = await this.get<TaxonomyQueryResponse>(GET_TAXONOMY_QUERY, variables);
    const taxonomy = response?.taxonomy;

    if (!taxonomy) return null;

    return {
      system: taxonomy.system,
      terms: {
        results: taxonomy.terms?.results ?? [],
        cursor: taxonomy.terms?.cursor,
        hasMore: taxonomy.terms?.hasMore ?? false,
      },
    };
  }
}
