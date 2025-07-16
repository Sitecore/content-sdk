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
// Dynamic pagination utilities
import {
  dynamicPagination,
  DynamicPaginationVariables,
  DynamicPaginationResult,
} from './dynamic-pagination';

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
   * Dynamic pagination for many GraphQL calls
   * @param {string} query - The GraphQL query string
   * @param {DynamicPaginationVariables} variables - Pagination variables
   * @returns Promise that resolves to pagination result with cursor control
   *
   * @example
   * ```typescript
   * // Single page with manual control
   * const result = await client.dynamicPagination(
   *   `query GetProducts($pageSize: Int, $after: String) {
   *     manyProduct(minimumPageSize: $pageSize, after: $after) {
   *       results { id name price }
   *       cursor hasMore
   *     }
   *   }`,
   *   { pageSize: 50 }
   * );
   *
   * // Manual next page
   * if (result.hasMore) {
   *   const nextPage = await client.dynamicPagination(
   *     query,
   *     { pageSize: 50, after: result.cursor }
   *   );
   * }
   * ```
   */
  async dynamicPagination<T = any>(
    query: string,
    variables: DynamicPaginationVariables
  ): Promise<DynamicPaginationResult<T>> {
    return dynamicPagination(this, query, variables);
  }

  /**
   * Retrieves the locale information for a given locale ID.
   * @param {string} id - The unique identifier of the locale item.
   * @returns A promise that resolves to the locale information associated with the specified locale ID.
   */
  async getLocale(id: string) {
    debug.content('Getting locale for id: %s', id);

    const response = await this.get<LocaleQueryResponse>(GET_LOCALE_QUERY, { id });
    return response.locale?.system || null;
  }

  /**
   * Retrieves all available locales from the content service.
   * @returns A promise that resolves to an array of locales.
   */
  async getLocales() {
    debug.content('Getting all locales');

    const response = await this.get<LocalesQueryResponse>(GET_LOCALES_QUERY);
    return response?.manyLocale?.results?.map((entry) => entry.system) ?? [];
  }

  /**
   * Retrieves all available locales using dynamic pagination.
   * This method automatically fetches all pages and returns all locales.
   * @param {object} [options] - Optional pagination options.
   * @param {number} [options.pageSize] - Items per page
   * @param {number} [options.maxPages] - Maximum pages to fetch
   * @returns A promise that resolves to an array of all locales.
   */
  async getAllLocales(options?: { pageSize?: number; maxPages?: number }) {
    debug.content('Getting all locales with dynamic pagination');

    const result = await this.dynamicPagination(
      `query GetLocales($pageSize: Int, $after: String) {
        manyLocale(minimumPageSize: $pageSize, after: $after) {
          results { system { id name } }
          cursor hasMore
        }
      }`,
      {
        pagination: { pageSize: options?.pageSize },
        fetchAll: true,
        maxPages: options?.maxPages,
      }
    );

    return result.items.map((entry: any) => entry.system);
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
   * Retrieves all available taxonomies using dynamic pagination.
   * This method automatically fetches all pages and returns all taxonomies.
   * @param {object} [options] - Optional pagination options.
   * @param {number} [options.pageSize] - Items per page
   * @param {number} [options.maxPages] - Maximum pages to fetch
   * @returns A promise that resolves to an array of all taxonomies.
   */
  async getAllTaxonomies(options?: { pageSize?: number; maxPages?: number }) {
    debug.content('Getting all taxonomies with dynamic pagination');

    const result = await this.dynamicPagination(
      `query GetTaxonomies($pageSize: Int, $after: String) {
        manyTaxonomy(minimumPageSize: $pageSize, after: $after) {
          results { 
            system { id name }
            terms { results { system { id name } } }
          }
          cursor hasMore
        }
      }`,
      {
        pagination: { pageSize: options?.pageSize },
        fetchAll: true,
        maxPages: options?.maxPages,
      }
    );

    return result.items.map((taxonomy: any) => ({
      system: taxonomy.system,
      terms: {
        results: taxonomy.terms?.results || [],
        cursor: undefined,
        hasMore: false,
      },
    }));
  }

  /**
   * Retrieves a specific taxonomy by ID with optional terms pagination.
   * @param {object} params - Parameters for retrieving the taxonomy.
   * @param {string} params.id - The unique identifier of the taxonomy.
   * @param {object} [params.terms] - Optional pagination options for terms.
   * @param {number} [params.terms.pageSize] - Items per page for terms
   * @param {string} [params.terms.after] - Cursor for terms pagination
   * @returns A promise that resolves to the taxonomy or null if not found.
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
    debug.content('Getting taxonomy for id: %s', id);

    const variables = {
      id,
      termsPageSize: terms?.pageSize,
      termsAfter: terms?.after,
    };

    const response = await this.get<TaxonomyQueryResponse>(GET_TAXONOMY_QUERY, variables);
    const taxonomy = response?.taxonomy;

    if (!taxonomy) {
      return null;
    }

    return {
      system: taxonomy.system,
      terms: {
        results: taxonomy.terms?.results ?? [],
        cursor: taxonomy.terms?.cursor,
        hasMore: taxonomy.terms?.hasMore ?? false,
      },
    };
  }

  /**
   * Retrieves a specific taxonomy by ID with all its terms using dynamic pagination.
   * This method automatically fetches all terms pages.
   * @param {object} params - Parameters for retrieving the taxonomy.
   * @param {string} params.id - The unique identifier of the taxonomy.
   * @param {object} [params.termsOptions] - Optional pagination options for terms.
   * @param {number} [params.termsOptions.pageSize] - Items per page for terms
   * @param {number} [params.termsOptions.maxPages] - Maximum pages for terms
   * @returns A promise that resolves to the taxonomy with all terms or null if not found.
   */
  async getTaxonomyWithAllTerms({
    id,
    termsOptions,
  }: {
    id: string;
    termsOptions?: { pageSize?: number; maxPages?: number };
  }): Promise<Taxonomy | null> {
    debug.content('Getting taxonomy with all terms for id: %s', id);

    const taxonomy = await this.getTaxonomy({ id });

    if (!taxonomy) {
      return null;
    }

    // If terms are already paginated, fetch all pages
    if (taxonomy.terms && Array.isArray(taxonomy.terms)) {
      const allTerms = await this.dynamicPagination(
        `query GetTaxonomyTerms($pageSize: Int, $after: String) {
          taxonomy(id: "${id}") {
            terms(minimumPageSize: $pageSize, after: $after) {
              results { system { id name } }
              cursor hasMore
            }
          }
        }`,
        {
          pagination: { pageSize: termsOptions?.pageSize },
          fetchAll: true,
          maxPages: termsOptions?.maxPages,
        }
      );

      return {
        system: taxonomy.system,
        terms: {
          results: allTerms.items,
          cursor: undefined,
          hasMore: false,
        },
      };
    }

    return taxonomy;
  }
}
