import debug from '../debug';
import { PageInfo } from '../client';
import { GraphQLClient, GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases } from '../i18n';
import { LayoutServiceData, LayoutServicePageState } from '../layout';
import { LayoutKind } from './models';
import { FetchOptions } from '../models';

/**
 * The dictionary query default page size.
 */
const PAGE_SIZE = 1000;

/**
 * GraphQL query for fetching editing data.
 */
export const query = /* GraphQL */ `
 query EditingQuery(
    $siteName: String!
    $itemId: String!
    $language: String!
    $version: String
    $after: String
    $pageSize: Int = ${PAGE_SIZE}
) {
    item(path: $itemId, language: $language, version: $version) {
      rendered
    }
    site {
      siteInfo(site: $siteName) {
        dictionary(language: $language, first: $pageSize, after: $after) {
          results {
            key
            value
          }
          pageInfo {
            endCursor
            hasNext
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query for fetching dictionary data.
 * This query is used when the dictionary data is paginated.
 */
export const dictionaryQuery = /* GraphQL */ `
  query EditingDictionaryQuery(
    $siteName: String!
    $language: String!
    $after: String
    $pageSize: Int = ${PAGE_SIZE}
  ) {
    site {
      siteInfo(site: $siteName) {
        dictionary(language: $language, first: $pageSize, after: $after) {
          results {
            key
            value
          }
          pageInfo {
            endCursor
            hasNext
          }
        }
      }
    }
  }
`;

/**
 * Response from the GraphQL Dictionary query.
 */
export type GraphQLDictionaryQueryResponse = {
  site: {
    siteInfo: { dictionary: { results: { key: string; value: string }[]; pageInfo: PageInfo } };
  };
};

/**
 * Response from the GraphQL Editing query.
 */
export type GraphQLEditingQueryResponse = GraphQLDictionaryQueryResponse & {
  item: { rendered: LayoutServiceData };
};

export interface GraphQLEditingServiceConfig {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
}

export type EditingOptions = {
  siteName: string;
  itemId: string;
  language: string;
  version?: string;
  layoutKind?: LayoutKind;
  mode: Exclude<LayoutServicePageState, 'Normal'>;
};

/**
 * Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
 * Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.
 */
export class GraphQLEditingService {
  private graphQLClient: GraphQLClient;

  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {GraphQLLayoutServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: GraphQLEditingServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  /**
   * Fetches editing data. Provides the layout data and dictionary phrases
   * @param {object} variables - The parameters for fetching editing data.
   * @param {string} variables.siteName - The site name.
   * @param {string} variables.itemId - The item id (path) to fetch layout data for.
   * @param {string} variables.language - The language to fetch layout data for.
   * @param {string} variables.mode - The editing mode to fetch layout data for.
   * @param {string} [variables.version] - The version of the item (optional).
   * @param {LayoutKind} [variables.layoutKind] - The final or shared layout variant.
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise} The layout data and dictionary phrases.
   */
  async fetchEditingData(
    { siteName, itemId, language, version, layoutKind = LayoutKind.Final, mode }: EditingOptions,
    fetchOptions?: FetchOptions
  ) {
    debug.editing(
      'fetching editing data for %s %s %s %s',
      siteName,
      itemId,
      language,
      version,
      layoutKind
    );

    if (!siteName) {
      throw new RangeError('The site name must be a non-empty string');
    }

    if (!language) {
      throw new RangeError('The language must be a non-empty string');
    }

    let initDictionary: { key: string; value: string }[] = [];
    let hasNext = true;
    let after = '';

    const editModeHeader = mode === 'edit' ? 'true' : 'false';

    const editingData = await this.graphQLClient.request<GraphQLEditingQueryResponse>(
      query,
      {
        siteName,
        itemId,
        version,
        language,
      },
      {
        ...fetchOptions,
        headers: {
          sc_layoutKind: layoutKind,
          sc_editMode: editModeHeader,
        },
      }
    );

    if (editingData?.site?.siteInfo?.dictionary) {
      initDictionary = editingData.site.siteInfo.dictionary.results;
      hasNext = editingData.site.siteInfo.dictionary.pageInfo.hasNext;
      after = editingData.site.siteInfo.dictionary.pageInfo.endCursor;
    } else {
      hasNext = false;
    }

    const dictionary = await this.fetchDictionaryData(
      {
        siteName,
        language,
        initDictionary,
        hasNext,
        after,
      },
      fetchOptions
    );

    return {
      layoutData: editingData?.item?.rendered || {
        sitecore: {
          context: { pageEditing: true, language },
          route: null,
        },
      },
      dictionary,
    };
  }

  async fetchDictionaryData(
    {
      siteName,
      language,
      initDictionary,
      hasNext,
      after,
    }: {
      siteName: string;
      language: string;
      hasNext?: boolean;
      initDictionary?: {
        key: string;
        value: string;
      }[];
      after?: string;
    },
    fetchOptions?: FetchOptions
  ) {
    hasNext = hasNext !== undefined ? hasNext : true;
    let dictionaryResults = initDictionary || [];
    const dictionary: DictionaryPhrases = {};
    while (hasNext) {
      const data = await this.graphQLClient.request<GraphQLDictionaryQueryResponse>(
        dictionaryQuery,
        {
          siteName,
          language,
          after,
        },
        fetchOptions
      );

      if (data?.site?.siteInfo?.dictionary) {
        dictionaryResults = dictionaryResults.concat(data.site.siteInfo.dictionary.results);
        hasNext = data.site.siteInfo.dictionary.pageInfo.hasNext;
        after = data.site.siteInfo.dictionary.pageInfo.endCursor;
      } else {
        hasNext = false;
      }
    }
    dictionaryResults.forEach((item) => (dictionary[item.key] = item.value));
    return dictionary;
  }

  /**
   * Gets a GraphQL client that can make requests to the API.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.serviceConfig.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.serviceConfig.clientFactory({
      debugger: debug.editing,
    });
  }
}
