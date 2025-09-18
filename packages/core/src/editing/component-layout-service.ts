import { LayoutServiceData } from '../layout/models';
import { NativeDataFetcher } from '../native-fetcher';
import debug from '../debug';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { resolveUrl } from '../utils';
import { DesignLibraryMode, DesignLibraryVariantGeneration } from './models';
import { FetchOptions } from '../models';

/**
 * Params for requesting component data in Design Library mode
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
   * site name to be used as context for rendering the component
   */
  siteName: string;
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
   * mode to be used for rendering the component
   */
  mode?: DesignLibraryMode;
  /**
   * design library variant generation mode
   */
  generation?: DesignLibraryVariantGeneration;
}

/**
 * Config for ComponentLayoutService.
 * Provide contextId (server) and optionally clientContextId (browser).
 */
export interface ComponentLayoutServiceConfig {
  /**
   * A unified identifier used to connect and retrieve data from XM Cloud instance used on the client
   */
  clientContextId?: string;
  /**
   * A unified identifier used to connect and retrieve data from XM Cloud instance used on the server
   */
  contextId: string;
  /**
   * XM Cloud endpoint that the app will communicate and retrieve data from
   * @default https://edge-platform.sitecorecloud.io
   */
  edgeUrl?: string;
}

/**
 * REST service that enables Design Library functionality.
 * Returns layout data for a single rendered component.
 */
export class ComponentLayoutService {
  constructor(private config: ComponentLayoutServiceConfig) {}

  fetchComponentData(
    params: ComponentLayoutRequestParams,
    fetchOptions?: FetchOptions
  ): Promise<LayoutServiceData> {
    const fetcher = new NativeDataFetcher({ debugger: debug.layout });

    debug.layout(
      'fetching component with uid %s for %s %s %s %s',
      params.componentUid,
      params.itemId,
      params.language,
      params.siteName,
      params.dataSourceId
    );

    return fetcher
      .get<LayoutServiceData>(this.getFetchUrl(params), {
        ...fetchOptions,
        headers: {
          ...fetchOptions?.headers,
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
    // Choose the correct Edge ID per environment
    const sitecoreContextId = this.config.contextId || this.config.clientContextId;

    if (!sitecoreContextId) {
      throw new Error(
        `ComponentLayoutService misconfigured: contextId is missing.
         Provide contextId on the server, and clientContextId in the browser if you need to full client-side functionality.`
      );
    }

    // strip undefined fields
    return JSON.parse(
      JSON.stringify({
        sitecoreContextId,
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
