import { FetchOptions, GraphQLClient } from '../client';
import debug from '../debug';
import { CacheClient, CacheOptions, MemoryCacheClient } from '../cache-client';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { SiteInfo } from './models';

const siteQuery = /* GraphQL */ `
  query {
    site {
      siteInfoCollection {
        name
        hostName: hostname
        language
      }
    }
  }
`;

export type GraphQLSiteInfoServiceConfig = CacheOptions & {
  /**
   * common variable for all GraphQL queries
   * it will be used for every type of query to regulate result batch size
   * Optional. How many result items to fetch in each GraphQL call. This is needed for pagination.
   * @default 10
   */
  pageSize?: number;
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
};

type GraphQLSiteInfoResponse = {
  site: {
    siteInfoCollection: GraphQLSiteInfoResult[];
  };
};

export type GraphQLSiteInfoResult = {
  name: string;
  hostName: string;
  language: string;
};

export class GraphQLSiteInfoService {
  private graphQLClient: GraphQLClient;
  private cache: CacheClient<SiteInfo[]>;

  /**
   * Creates an instance of graphQL service to retrieve site configuration list from Sitecore
   * @param {GraphQLSiteInfoServiceConfig} config instance
   */
  constructor(private config: GraphQLSiteInfoServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
    this.cache = this.getCacheClient();
  }

  /**
   * site query is available on XM Cloud and XP 10.4+
   */
  protected get siteQuery(): string {
    return siteQuery;
  }

  async fetchSiteInfo(fetchOptions?: FetchOptions): Promise<SiteInfo[]> {
    const cachedResult = this.cache.getCacheValue(this.getCacheKey());
    if (cachedResult) {
      return cachedResult;
    }
    if (process.env.SITECORE) {
      debug.multisite('Skipping site information fetch (building on XM Cloud)');
      return [];
    }

    const response = await this.graphQLClient.request<GraphQLSiteInfoResponse>(
      this.siteQuery,
      {},
      fetchOptions
    );
    const results = response?.site?.siteInfoCollection?.reduce<SiteInfo[]>((result, current) => {
      // filter out built in website
      current.name !== 'website' &&
        result.push({
          name: current.name,
          hostName: current.hostName,
          language: current.language,
        });
      return result;
    }, []);

    this.cache.setCacheValue(this.getCacheKey(), results);
    return results;
  }

  /**
   * Gets cache client implementation
   * Override this method if custom cache needs to be used
   * @returns CacheClient instance
   */
  protected getCacheClient(): CacheClient<SiteInfo[]> {
    return new MemoryCacheClient<SiteInfo[]>({
      cacheEnabled: this.config.cacheEnabled ?? true,
      cacheTimeout: this.config.cacheTimeout ?? 10,
    });
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.config.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.config.clientFactory({
      debugger: debug.multisite,
    });
  }

  private getCacheKey(): string {
    return 'siteinfo-service-cache';
  }
}
