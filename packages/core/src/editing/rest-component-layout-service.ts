import { LayoutServiceData } from '../layout/models.js';
import { NativeDataFetcher, NativeDataFetcherConfig } from '../native-fetcher.js';
import debug from '../debug.js';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants.js';
import { resolveUrl } from '../utils/index.js';
import { DesignLibraryMode } from './models.js';

/**
 * Params for requesting component data from service in Design Library mode
 */
export interface ComponentLayoutRequestParams {
  /**
   * Item id to be used as context for rendering the component
   */
  itemId: string;
  /**
   * Component identifier. Can be either taken from item's layout details or
   * an arbitrary one (component renderingId and datasource would be used for identification then)
   */
  componentUid: string;
  /**
   * language to render component in
   */
  language?: string;
  /**
   * optional component datasource
   */
  dataSourceId?: string;
  /**
   * ID of the component definition rendering item in Sitecore
   */
  renderingId?: string;
  /**
   * version of the context item (latest by default)
   */
  version?: string;
  /**
   * site name to be used as context for rendering the component
   */
  siteName: string;
  /**
   * mode to be used for rendering the component
   */
  mode?: DesignLibraryMode;
}

/**
 * Config for the RestComponentLayoutService
 */
export interface RestComponentLayoutServiceConfig {
  /**
   * A unified identifier used to connect and retrieve data from XM Cloud instance
   */
  contextId: string;
  /**
   * XM Cloud endpoint that the app will communicate and retrieve data from
   * @default https://edge-platform.sitecorecloud.io
   */
  edgeUrl?: string;
}

/**
 * REST service that enables design Library functionality
 * Returns layoutData for one single rendered component
 */
export class RestComponentLayoutService {
  constructor(private config: RestComponentLayoutServiceConfig) {}

  fetchComponentData(params: ComponentLayoutRequestParams): Promise<LayoutServiceData> {
    const config: NativeDataFetcherConfig = { debugger: debug.layout };

    const fetcher = new NativeDataFetcher(config);

    debug.layout(
      'fetching component with uid %s for %s %s %s %s',
      params.componentUid,
      params.itemId,
      params.language,
      params.siteName,
      params.dataSourceId
    );

    const fetchUrl = this.getFetchUrl(params);

    return fetcher
      .get<LayoutServiceData>(fetchUrl, {
        headers: {
          sc_editMode: `${params.mode === DesignLibraryMode.Metadata}`,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        if (error.response?.status === 404) {
          return error.response.data;
        }

        throw error;
      });
  }

  protected getComponentFetchParams(params: ComponentLayoutRequestParams) {
    // exclude undefined params with this one simple trick
    return JSON.parse(
      JSON.stringify({
        sitecoreContextId: this.config.contextId,
        item: params.itemId,
        uid: params.componentUid,
        dataSourceId: params.dataSourceId,
        renderingItemId: params.renderingId,
        version: params.version,
        sc_site: params.siteName,
        sc_lang: params.language || 'en',
      })
    );
  }

  /**
   * Get the fetch URL for the partial layout data endpoint
   * @param {ComponentLayoutRequestParams} params - The parameters for the request
   * @returns {string} The fetch URL for the component data
   */
  private getFetchUrl(params: ComponentLayoutRequestParams) {
    return resolveUrl(
      `${this.config.edgeUrl || SITECORE_EDGE_URL_DEFAULT}/layout/component`,
      this.getComponentFetchParams(params)
    );
  }
}
