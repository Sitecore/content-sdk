import {
  GraphQLClient,
  GraphQLRequestClientFactory,
  FetchOptions,
} from '@sitecore-content-sdk/core';
import debug from '../debug';
import { LayoutServiceData, LayoutServicePageState } from '../layout';
import { LayoutKind } from './models';

/**
 * GraphQL query for fetching editing data.
 */
export const query = /* GraphQL */ `
  query EditingQuery($itemId: String!, $language: String!, $version: String) {
    item(path: $itemId, language: $language, version: $version) {
      rendered
    }
  }
`;

/**
 * Response from the GraphQL Editing query.
 */
export type GraphQLEditingQueryResponse = {
  item: { rendered: LayoutServiceData };
};

/**
 * Configuration for the EditingService
 * @public
 */
export interface EditingServiceConfig {
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
}

/**
 * Options for fetching editing data
 * @public
 */
export type EditingOptions = {
  itemId: string;
  language: string;
  version?: string;
  layoutKind?: LayoutKind;
  mode: Exclude<LayoutServicePageState, 'Normal'>;
  site?: string;
};

/**
 * Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
 * Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.
 * @public
 */
export class EditingService {
  private graphQLClient: GraphQLClient;

  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {EditingServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: EditingServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  /**
   * Fetches editing data. Provides the layout data and dictionary phrases
   * @param {object} variables - The parameters for fetching editing data.
   * @param {string} variables.itemId - The item id (path) to fetch layout data for.
   * @param {string} variables.language - The language to fetch layout data for.
   * @param {string} variables.mode - The editing mode to fetch layout data for.
   * @param {string} [variables.version] - The version of the item (optional).
   * @param {LayoutKind} [variables.layoutKind] - The final or shared layout variant.
   * @param {string} [variables.site] - The site context for fetching layout data (optional).
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise} The layout data and dictionary phrases.
   */
  async fetchEditingData(
    { itemId, language, version, layoutKind = LayoutKind.Final, mode, site }: EditingOptions,
    fetchOptions?: FetchOptions
  ) {
    debug.editing('fetching editing data for %s %s %s %s', itemId, language, version, layoutKind);

    if (!language) {
      throw new RangeError('The language must be a non-empty string');
    }

    const editModeHeader = mode === 'edit' ? 'true' : 'false';
    const previewModeHeader = mode === 'preview' ? 'true' : 'false';

    const editingData = await this.graphQLClient.request<GraphQLEditingQueryResponse>(
      query,
      {
        itemId,
        version,
        language,
      },
      {
        ...fetchOptions,
        headers: {
          ...fetchOptions?.headers,
          sc_layoutKind: layoutKind,
          sc_editMode: editModeHeader,
          sc_previewMode: previewModeHeader,
          ...(site && { sc_site: site }),
        },
      }
    );

    const layoutData = editingData?.item?.rendered || {
      sitecore: {
        context: { pageEditing: true, language },
        route: null,
      },
    };

    return {
      layoutData,
    };
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
