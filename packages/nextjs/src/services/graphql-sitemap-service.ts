import {
  FetchOptions,
  GraphQLClient,
  GraphQLRequestClientFactory,
  PageInfo,
} from '@sitecore-content-sdk/core/client';
import { debug, StaticPath } from '@sitecore-content-sdk/core';
import { getPersonalizedRewrite } from '@sitecore-content-sdk/core/personalize';
import { getSiteRewrite, SiteInfo } from '@sitecore-content-sdk/core/site';

/** @private */
export const languageError = 'The list of languages cannot be empty';
export const siteError = 'The service needs a site name';
export const sitesError = 'The list of sites cannot be empty';

/**
 * @param {string} siteName to inject into error text
 * @private
 */
export function getSiteEmptyError(siteName: string) {
  return `Site "${siteName}" does not exist or site item tree is missing`;
}

/**
 * GQL query made dynamic based whether personalization is enabled or not
 * @param {boolean} usesPersonalize flag to detrmine which variation of a query to run
 * @returns GraphQL query to fetch site paths with
 */
const defaultQuery = (usesPersonalize?: boolean) => /* GraphQL */ `
query ${usesPersonalize ? 'PersonalizeSitemapQuery' : 'DefaultSitemapQuery'}(
  $siteName: String!
  $language: String!
  $includedPaths: [String]
  $excludedPaths: [String]
  $pageSize: Int = 100
  $after: String
) {
  site {
    siteInfo(site: $siteName) {
      routes(
        language: $language
        includedPaths: $includedPaths
        excludedPaths: $excludedPaths
        first: $pageSize
        after: $after
      ){
        total
        pageInfo {
          endCursor
          hasNext
        }
        results {
          path: routePath
          ${
            usesPersonalize
              ? `
              route {
                personalization {
                  variantIds
                }
              }`
              : ''
          }
        }
      }
    }
  }
}
`;
/**
 * type for input variables for the site routes query
 */
interface SiteRouteQueryVariables {
  /**
   * Required. Name of a site to fetch sitemap for
   */
  siteName: string;
  /**
   * Required. The language to return routes/pages for.
   */
  language: string;
  /**
   * Optional. Only paths starting with these provided prefixes will be returned.
   */
  includedPaths?: string[];
  /**
   * Optional. Paths starting with these provided prefixes will be excluded from returned results.
   */
  excludedPaths?: string[];

  /**
   * common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 100
   */
  pageSize?: number;
}

/**
 * Schema of data returned in response to a "site" query request
 * @template T The type of objects being requested.
 */
export interface SiteRouteQueryResult<T> {
  site: {
    siteInfo: {
      routes: {
        /**
         * Data needed to paginate the site results
         */
        pageInfo: PageInfo;
        results: T[];
      };
    };
  };
}

/**
 * The schema of data returned in response to a routes list query request
 */
export type RouteListQueryResult = {
  path: string;
  route?: {
    personalization?: {
      variantIds: string[];
    };
  };
};

/**
 * Configuration options for @see GraphQLSitemapService instances
 */
export interface GraphQLSitemapServiceConfig
  extends Omit<SiteRouteQueryVariables, 'language' | 'siteName'> {
  /**
   * A flag for whether to include personalized routes in service output.
   * Only works on XM Cloud for pages using Embedded Personalization (not Component A/B testing).
   * Turned off by default.
   */
  includePersonalizedRoutes?: boolean;
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
  sites: SiteInfo[];
}

/**
 * Service that fetches the list of site pages using Sitecore's GraphQL API.
 * Used to handle a single site
 * This list is used for SSG and Export functionality.
 * @mixes SearchQueryService<PageListQueryResult>
 */
export class GraphQLSitemapService {
  private _graphQLClient: GraphQLClient;

  /**
   * Creates an instance of graphQL sitemap service with the provided options
   * @param {GraphQLSitemapServiceConfig} options instance
   */
  constructor(public options: GraphQLSitemapServiceConfig) {
    this._graphQLClient = this.getGraphQLClient();
  }

  /**
   * GraphQL client accessible by descendant classes when needed
   */
  protected get graphQLClient() {
    return this._graphQLClient;
  }

  /**
   * Gets the default query used for fetching the list of site pages
   */
  protected get query(): string {
    return defaultQuery(this.options.includePersonalizedRoutes);
  }

  /**
   * Fetch a flat list of all pages that belong to all the requested sites and have a
   * version in the specified language(s).
   * @param {string[]} languages Fetch pages that have versions in this language(s).
   * @param {FetchOptions} fetchOptions Options to override graphQL client details like retries and fetch implementation
   * @returns list of pages
   * @throws {RangeError} if the list of languages is empty.
   * @throws {RangeError} if the any of the languages is an empty string.
   */
  async fetchSitemap(languages: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]> {
    const formatPath = (path: string[], locale: string) => ({
      params: {
        path,
      },
      locale,
    });
    const paths = new Array<StaticPath>();
    if (!languages.length) {
      throw new RangeError(languageError);
    }
    // Get all sites
    const sites = this.options.sites;
    if (!sites || !sites.length) {
      throw new RangeError(sitesError);
    }

    // Fetch paths for each site
    for (let i = 0; i < sites.length; i++) {
      for (const language of languages) {
        const siteName = sites[i].name;
        // Fetch paths using all locales
        const sitePaths = await this.fetchLanguageSitePaths(language, siteName, fetchOptions);
        const transformedPaths = await this.transformLanguageSitePaths(
          sitePaths,
          formatPath,
          language
        );

        paths.push(...transformedPaths);
      }
    }

    return ([] as StaticPath[]).concat(...paths);
  }

  protected async transformLanguageSitePaths(
    sitePaths: RouteListQueryResult[],
    formatStaticPath: (path: string[], language: string) => StaticPath,
    language: string
  ): Promise<StaticPath[]> {
    const formatPath = (path: string) =>
      formatStaticPath(path.replace(/^\/|\/$/g, '').split('/'), language);

    const aggregatedPaths: StaticPath[] = [];

    sitePaths.forEach((item) => {
      if (!item) return;

      aggregatedPaths.push(formatPath(item.path));

      const variantIds = item.route?.personalization?.variantIds?.filter(
        (variantId) => !variantId.includes('_') // exclude component A/B test variants
      );
      if (variantIds?.length) {
        aggregatedPaths.push(
          ...variantIds.map((varId) => formatPath(getPersonalizedRewrite(item.path, [varId])))
        );
      }
    });

    return aggregatedPaths;
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.options.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.options.clientFactory({
      debugger: debug.sitemap,
    });
  }

  /**
   * Fetch and return site paths for multisite implementation, with prefixes included
   * @param {string} language path language
   * @param {string} siteName site name
   * @param {FetchOptions} fetchOptions Options to override graphQL client details like retries and fetch implementation
   * @returns modified paths
   */
  protected async fetchLanguageSitePaths(
    language: string,
    siteName: string,
    fetchOptions?: FetchOptions
  ): Promise<RouteListQueryResult[]> {
    const args: SiteRouteQueryVariables = {
      siteName: siteName,
      language: language,
      pageSize: this.options.pageSize,
      includedPaths: this.options.includedPaths,
      excludedPaths: this.options.excludedPaths,
    };
    let results: RouteListQueryResult[] = [];
    let hasNext = true;
    let after = '';
    debug.sitemap('fetching sitemap data for %s %s', language, siteName);
    while (hasNext) {
      const fetchResponse = await this.graphQLClient.request<
        SiteRouteQueryResult<RouteListQueryResult>
      >(
        this.query,
        {
          ...args,
          after,
        },
        fetchOptions
      );

      if (!fetchResponse?.site?.siteInfo) {
        throw new RangeError(getSiteEmptyError(siteName));
      } else {
        results = results.concat(fetchResponse.site.siteInfo.routes?.results);
        hasNext = fetchResponse.site.siteInfo.routes?.pageInfo.hasNext;
        after = fetchResponse.site.siteInfo.routes?.pageInfo.endCursor;
      }
    }
    results.forEach((item) => {
      if (item) {
        item.path = getSiteRewrite(item.path, { siteName: siteName });
      }
    });

    return results;
  }
}
