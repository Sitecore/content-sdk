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
// Removed old pagination utilities - using dynamic pagination instead
import {
  executeDynamicPagination,
  simpleDynamicPagination,
  autoDetectPagination,
  DynamicPaginationConfig,
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

    const result = await this.simpleDynamicPagination(
      `query GetLocales($pageSize: Int, $after: String) {
        manyLocale(minimumPageSize: $pageSize, after: $after) {
          results { system { id name } }
          cursor hasMore
        }
      }`,
      'manyLocale',
      options
    );

    return result.map((entry: any) => entry.system);
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
   * @returns A promise that resolves to an array of all taxonomies with their terms.
   */
  async getAllTaxonomies(options?: { pageSize?: number; maxPages?: number }) {
    debug.content('Getting all taxonomies with dynamic pagination');

    const result = await this.simpleDynamicPagination(
      `query GetTaxonomies($pageSize: Int, $after: String) {
        manyTaxonomy(minimumPageSize: $pageSize, after: $after) {
          results { 
            system { id name }
            terms { results { system { id name } } }
          }
          cursor hasMore
        }
      }`,
      'manyTaxonomy',
      options
    );

    return result.map((taxonomy: any) => ({
      system: taxonomy.system,
      terms: taxonomy.terms?.results ?? [],
    }));
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

  /**
   * Retrieves a taxonomy by its ID with all terms using dynamic pagination.
   * This method automatically fetches all pages of terms and returns the complete taxonomy.
   * @param {object} options - Options for fetching the taxonomy.
   * @param {string} options.id - The unique identifier of the taxonomy.
   * @param {object} [options.termsOptions] - Optional pagination options for terms.
   * @param {number} [options.termsOptions.pageSize] - Items per page
   * @param {number} [options.termsOptions.maxPages] - Maximum pages to fetch
   * @returns A promise that resolves to the taxonomy object with all terms. Returns `null` if the taxonomy is not found.
   */
  async getTaxonomyWithAllTerms({
    id,
    termsOptions,
  }: {
    id: string;
    termsOptions?: { pageSize?: number; maxPages?: number };
  }): Promise<Taxonomy | null> {
    debug.content('Getting taxonomy with all terms for id: %s', id);

    // First, get the taxonomy structure
    const taxonomy = await this.getTaxonomy({ id });
    if (!taxonomy) return null;

    // If the taxonomy has terms with pagination, fetch all terms using dynamic pagination
    if (taxonomy.terms.hasMore) {
      const allTerms = await this.simpleDynamicPagination(
        `query GetTaxonomyTerms($pageSize: Int, $after: String, $taxonomyId: ID!) {
          taxonomy(id: $taxonomyId) {
            terms(minimumPageSize: $pageSize, after: $after) {
              results { system { id name } }
              cursor hasMore
            }
          }
        }`,
        'taxonomy.terms',
        termsOptions
      );

      return {
        system: taxonomy.system,
        terms: {
          results: allTerms as any,
          cursor: undefined,
          hasMore: false,
        },
      };
    }

    return taxonomy;
  }

  /**
   * Retrieves all taxonomies with all their terms using dynamic nested pagination.
   * This method demonstrates how to handle nested pagination scenarios.
   * @param {object} [options] - Optional pagination options for both taxonomies and terms.
   * @param {number} [options.pageSize] - Items per page for taxonomies
   * @param {number} [options.maxPages] - Maximum pages for taxonomies
   * @param {object} [options.nested] - Options for nested terms pagination
   * @param {number} [options.nested.pageSize] - Items per page for terms
   * @param {number} [options.nested.maxPages] - Maximum pages for terms
   * @returns A promise that resolves to an array of taxonomies with all their terms.
   */
  async getAllTaxonomiesWithAllTerms(options?: {
    pageSize?: number;
    maxPages?: number;
    nested?: { pageSize?: number; maxPages?: number };
  }) {
    debug.content('Getting all taxonomies with all terms using dynamic nested pagination');

    const result = await this.executeDynamicPagination({
      query: `query GetTaxonomies($pageSize: Int, $after: String) {
        manyTaxonomy(minimumPageSize: $pageSize, after: $after) {
          results { 
            system { id name }
            terms { results { system { id name } } }
          }
          cursor hasMore
        }
      }`,
      paginatedFieldPath: 'manyTaxonomy',
      pagination: { pageSize: options?.pageSize, maxPages: options?.maxPages },
      nested: {
        fieldPath: 'allTerms',
        getParentId: (taxonomy) => taxonomy.system.id,
        nestedQuery: `query GetTaxonomyTerms($taxonomyId: ID!, $pageSize: Int, $after: String) {
          taxonomy(id: $taxonomyId) {
            terms(minimumPageSize: $pageSize, after: $after) {
              results { system { id name } }
              cursor hasMore
            }
          }
        }`,
        nestedVariables: (taxonomyId, args) => ({ taxonomyId, ...args }),
        pagination: options?.nested,
      },
    });

    return result.items.map((taxonomy: any) => ({
      system: taxonomy.system,
      terms: taxonomy.allTerms || [],
    }));
  }

  /**
   * Retrieves all taxonomies with conditional nested pagination using dynamic pagination.
   * This method demonstrates how to fetch nested items only for specific parent items.
   * @param {object} options - Options for conditional nested pagination.
   * @param {object} [options.pagination] - Pagination options for taxonomies.
   * @param {number} [options.pagination.pageSize] - Items per page
   * @param {number} [options.pagination.maxPages] - Maximum pages
   * @param {function} [options.shouldFetchTerms] - Predicate to determine if terms should be fetched for a taxonomy.
   * @returns A promise that resolves to an array of taxonomies with terms (if applicable).
   */
  async getAllTaxonomiesWithConditionalTerms(options?: {
    pagination?: { pageSize?: number; maxPages?: number };
    shouldFetchTerms?: (taxonomy: any) => boolean;
  }) {
    debug.content('Getting all taxonomies with conditional terms using dynamic pagination');

    // First get all taxonomies
    const taxonomies = await this.getAllTaxonomies(options?.pagination);

    // Then conditionally fetch terms for each taxonomy
    const shouldFetchTerms =
      options?.shouldFetchTerms || ((taxonomy: any) => taxonomy.terms.results.length > 10);

    const results = [];
    for (const taxonomy of taxonomies) {
      if (shouldFetchTerms(taxonomy)) {
        const taxonomyWithTerms = await this.getTaxonomyWithAllTerms({
          id: taxonomy.system.id,
        });
        results.push(taxonomyWithTerms);
      } else {
        results.push(taxonomy);
      }
    }

    return results;
  }

  /**
   * Execute dynamic pagination for any GraphQL query.
   * This method allows you to paginate through any query that returns paginated results.
   *
   * @param config - Configuration for the dynamic pagination
   * @returns Promise that resolves to paginated results with metadata
   *
   * @example
   * ```typescript
   * // Simple dynamic pagination
   * const result = await client.executeDynamicPagination({
   *   query: `
   *     query GetProducts($pageSize: Int, $after: String) {
   *       manyProduct(minimumPageSize: $pageSize, after: $after) {
   *         results { id name price }
   *         cursor hasMore
   *       }
   *     }
   *   `,
   *   paginatedFieldPath: 'manyProduct',
   *   pagination: { pageSize: 50 }
   * });
   *
   * console.log(`Fetched ${result.totalItems} items in ${result.totalPages} pages`);
   * console.log(`API calls: ${result.metadata.apiCalls}, Duration: ${result.metadata.duration}ms`);
   * ```
   */
  async executeDynamicPagination<T = any>(
    config: DynamicPaginationConfig
  ): Promise<DynamicPaginationResult<T>> {
    return executeDynamicPagination(this, config);
  }

  /**
   * Simplified dynamic pagination for common use cases.
   * Returns just the items array without metadata.
   *
   * @param query - The GraphQL query string
   * @param fieldPath - Path to the paginated field
   * @param options - Pagination options
   * @returns Promise that resolves to array of items
   *
   * @example
   * ```typescript
   * const products = await client.simpleDynamicPagination(
   *   `query GetProducts($pageSize: Int, $after: String) {
   *     manyProduct(minimumPageSize: $pageSize, after: $after) {
   *       results { id name }
   *       cursor hasMore
   *     }
   *   }`,
   *   'manyProduct',
   *   { pageSize: 50 }
   * );
   * ```
   */
  async simpleDynamicPagination<T = any>(
    query: string,
    fieldPath: string,
    options: { pageSize?: number; maxPages?: number } = {}
  ): Promise<T[]> {
    return simpleDynamicPagination(this, query, fieldPath, options);
  }

  /**
   * Auto-detect pagination for any GraphQL query.
   * This method automatically finds paginated fields in the response and paginates through them.
   *
   * @param query - The GraphQL query string
   * @param variables - Query variables
   * @param options - Pagination options
   * @returns Promise that resolves to paginated results
   *
   * @example
   * ```typescript
   * // Auto-detect pagination - useful for exploratory queries
   * const result = await client.autoDetectPagination(
   *   `query GetData {
   *     manyProduct { results { id name } cursor hasMore }
   *     manyCategory { results { id name } cursor hasMore }
   *   }`
   * );
   * ```
   */
  async autoDetectPagination<T = any>(
    query: string,
    variables: Record<string, any> = {},
    options: { pageSize?: number; maxPages?: number } = {}
  ): Promise<DynamicPaginationResult<T>> {
    return autoDetectPagination(this, query, variables, options);
  }
}
