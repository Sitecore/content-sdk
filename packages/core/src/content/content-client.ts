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
  ContentItemList,
  Taxonomy,
  TaxonomyQueryResponse,
  TaxonomiesQueryResponse,
  TermList,
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
   * Retrieves all available taxonomies.
   *
   * This method supports optional pagination for both taxonomies and their terms.
   * - If `taxonomyPageSize` is provided, it limits the number of taxonomies returned per request.
   * - If `termsPageSize` is provided, it limits the number of terms returned per taxonomy per request.
   * - If either is omitted, the API defaults are used (returns all results in a single request if no pagination is required).
   *
   * @param {number} [taxonomyPageSize] - Optional. The number of taxonomies per page.
   * @param {number} [termsPageSize] - Optional. The number of terms per page within each taxonomy.
   * @returns A promise that resolves to a paginated list of taxonomies, including pagination helpers (`fetchNext`) if applicable.
   */
  async getTaxonomies(
    taxonomyPageSize?: number,
    termsPageSize?: number
  ): Promise<ContentItemList<Taxonomy>> {
    const fetchTaxonomiesPage = async (after: string = ''): Promise<ContentItemList<Taxonomy>> => {
      debug.content(
        'Fetching taxonomies (pageSize: %s, after: %s)',
        taxonomyPageSize ?? 'API Default',
        after
      );

      const variables: Record<string, any> = {
        after: after || '',
        termsAfter: '', // Always provide for API requirements
      };

      if (taxonomyPageSize !== undefined) {
        variables.minimumPageSize = taxonomyPageSize;
      }

      if (termsPageSize !== undefined) {
        variables.termsPageSize = termsPageSize;
      }

      const response = await this.get<TaxonomiesQueryResponse>(GET_TAXONOMIES_QUERY, variables);
      const data = response?.manyTaxonomy;

      if (!data) {
        return {
          results: [],
          cursor: undefined,
          hasMore: false,
        };
      }

      const taxonomies = await Promise.all(
        data.results.map(async (taxonomy) => {
          const fetchTermsPage = async (termsAfter: string = ''): Promise<TermList> => {
            debug.content(
              'Fetching terms for taxonomy %s (pageSize: %s, after: %s)',
              taxonomy.system.id,
              termsPageSize ?? 'API Default',
              termsAfter
            );

            const termVariables: Record<string, any> = {
              after: after || '',
              termsAfter: termsAfter || '',
            };

            if (taxonomyPageSize !== undefined) {
              termVariables.minimumPageSize = taxonomyPageSize;
            }

            if (termsPageSize !== undefined) {
              termVariables.termsPageSize = termsPageSize;
            }

            const termResponse = await this.get<TaxonomiesQueryResponse>(
              GET_TAXONOMIES_QUERY,
              termVariables
            );

            const termData = termResponse?.manyTaxonomy?.results.find(
              (r) => r.system.id === taxonomy.system.id
            )?.terms;

            return {
              results: termData?.results ?? [],
              cursor: termData?.cursor,
              hasMore: termData?.hasMore ?? false,
              fetchNext: termData?.hasMore
                ? () => fetchTermsPage(termData.cursor || '')
                : undefined,
            };
          };

          return {
            system: taxonomy.system,
            terms: {
              results: taxonomy.terms?.results ?? [],
              cursor: taxonomy.terms?.cursor,
              hasMore: taxonomy.terms?.hasMore ?? false,
              fetchNext: taxonomy.terms?.hasMore
                ? () => fetchTermsPage(taxonomy.terms.cursor || '')
                : undefined,
            },
          };
        })
      );

      return {
        results: taxonomies,
        cursor: data.cursor,
        hasMore: data.hasMore,
        fetchNext: data.hasMore ? () => fetchTaxonomiesPage(data.cursor || '') : undefined,
      };
    };

    return fetchTaxonomiesPage();
  }

  /**
   * Retrieves a single taxonomy by its ID.
   *
   * This method supports optional pagination for the terms within the taxonomy.
   * - If `termsPageSize` is provided, it limits the number of terms returned per request.
   * - If omitted, the API default is used (returns all terms in a single request).
   *
   * The returned taxonomy object includes the system metadata, the initial set of terms,
   * and a `fetchNext` function for retrieving additional terms if more are available.
   *
   * @param {string} id - The unique identifier of the taxonomy.
   * @param {number} [termsPageSize] - Optional. The number of terms per page.
   * @returns A promise that resolves to the taxonomy object, or `null` if not found.
   */
  async getTaxonomy(id: string, termsPageSize?: number): Promise<Taxonomy | null> {
    debug.content('Getting taxonomy for id: %s', id);

    const fetchTermsPage = async (termsAfter: string = ''): Promise<TermList> => {
      debug.content(
        'Fetching terms for taxonomy %s (pageSize: %s, after: %s)',
        id,
        termsPageSize ?? 'API Default',
        termsAfter
      );

      const variables: Record<string, any> = { id, termsAfter };

      if (termsPageSize !== undefined) {
        variables.termsPageSize = termsPageSize;
      }

      const response = await this.get<TaxonomyQueryResponse>(GET_TAXONOMY_QUERY, variables);
      const terms = response?.taxonomy?.terms;

      return {
        results: terms?.results ?? [],
        cursor: terms?.cursor,
        hasMore: terms?.hasMore ?? false,
        fetchNext: terms?.hasMore ? () => fetchTermsPage(terms.cursor || '') : undefined,
      };
    };

    const initialVars: Record<string, any> = { id };
    if (termsPageSize !== undefined) {
      initialVars.termsPageSize = termsPageSize;
    }

    const response = await this.get<TaxonomyQueryResponse>(GET_TAXONOMY_QUERY, initialVars);
    const taxonomy = response?.taxonomy;

    if (!taxonomy) return null;

    return {
      system: taxonomy.system,
      terms: {
        results: taxonomy.terms?.results ?? [],
        cursor: taxonomy.terms?.cursor,
        hasMore: taxonomy.terms?.hasMore ?? false,
        fetchNext: taxonomy.terms?.hasMore
          ? () => fetchTermsPage(taxonomy.terms.cursor || '')
          : undefined,
      },
    };
  }
}
