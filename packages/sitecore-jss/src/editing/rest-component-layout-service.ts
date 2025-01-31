import { LayoutServiceData, EditMode } from '../layout/models';
import { IncomingMessage, ServerResponse } from 'http';
import { debug, NativeDataFetcher, NativeDataFetcherConfig } from '..';
import { fetchData, HttpDataFetcher } from '../data-fetcher';

/**
 * Data fetcher resolver in order to provide custom data fetcher
 * @param {IncomingMessage} [req] Request instance
 * @param {ServerResponse} [res] Response instance
 */
export type DataFetcherResolver = <T>(
  req?: IncomingMessage,
  res?: ServerResponse
) => HttpDataFetcher<T>;

export type RestLayoutServiceConfig = {
  /**
   * Your Sitecore instance hostname that is the backend for JSS
   */
  apiHost: string;
  /**
   * The Sitecore SSC API key your app uses
   */
  apiKey: string;
  /**
   * The JSS application name
   */
  siteName: string;
  /**
   * Enables/disables analytics tracking for the Layout Service invocation (default is true).
   * More than likely, this would be set to false for SSG/hybrid implementations, and the
   * JSS tracker would instead be used on the client-side: {@link https://jss.sitecore.com/docs/fundamentals/services/tracking}
   * @default true
   */
  tracking?: boolean;
  /**
   * Function that handles fetching API data
   */
  dataFetcherResolver?: DataFetcherResolver;

  /**
   * Layout Service "named" configuration
   */
  configurationName?: string;
};

/**
 * Params for requesting component data from service in Component Library mode
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
   * edit mode to be rendered component in. Component is rendered in normal mode by default
   */
  editMode?: EditMode;
  /**
   * site name to be used as context for rendering the component
   */
  siteName?: string;
}

/**
 * REST service that enables Component Library functioality
 * Makes a request to /sitecore/api/layout/component in 'library' mode in Pages.
 * Returns layoutData for one single rendered component
 */
export class RestComponentLayoutService {
  constructor(private config: RestLayoutServiceConfig) {}

  fetchComponentData(
    params: ComponentLayoutRequestParams,
    req?: IncomingMessage,
    res?: ServerResponse
  ): Promise<LayoutServiceData> {
    params.siteName = params.siteName || this.config.siteName;
    const querystringParams = this.getComponentFetchParams(params);
    debug.layout(
      'fetching component with uid %s for %s %s %s',
      params.componentUid,
      params.itemId,
      params.language,
      params.siteName
    );
    const fetcher = this.getFetcher(req, res);

    const fetchUrl = this.resolveLayoutServiceUrl('component');

    return fetchData(fetchUrl, fetcher, querystringParams).catch((error) => {
      if (error.response?.status === 404) {
        return error.response.data;
      }

      throw error;
    });
  }

  protected getFetcher = (req?: IncomingMessage, res?: ServerResponse) => {
    return this.config.dataFetcherResolver
      ? this.config.dataFetcherResolver<LayoutServiceData>(req, res)
      : this.getDefaultFetcher<LayoutServiceData>(req);
  };

  /**
   * Resolves layout service url
   * @param {string} apiType which layout service API to call ('render' or 'placeholder')
   * @returns the layout service url
   */
  protected resolveLayoutServiceUrl(apiType: string): string {
    const { apiHost = '', configurationName = 'jss' } = this.config;

    return `${apiHost}/sitecore/api/layout/${apiType}/${configurationName}`;
  }

  /**
   * Provides default @see NativeDataFetcher data fetcher
   * @param {IncomingMessage} [req] Request instance
   * @returns default fetcher
   */
  protected getDefaultFetcher = <T>(req?: IncomingMessage) => {
    const config = {
      debugger: debug.editing,
    } as NativeDataFetcherConfig;
    const nativeFetcher = new NativeDataFetcher(config);
    const headers = req && {
      ...req.headers,
      ...(req.socket?.remoteAddress ? { 'X-Forwarded-For': req.socket.remoteAddress } : {}),
    };
    const fetcher = (url: string, data?: RequestInit) => {
      data = { ...data, ...{ headers: headers as HeadersInit } };
      return nativeFetcher.fetch<T>(url, data);
    };

    return fetcher;
  };

  protected getComponentFetchParams(params: ComponentLayoutRequestParams) {
    // exclude undefined params with this one simple trick
    return JSON.parse(
      JSON.stringify({
        sc_apikey: this.config.apiKey,
        item: params.itemId,
        uid: params.componentUid,
        dataSourceId: params.dataSourceId,
        renderingItemId: params.renderingId,
        version: params.version,
        sc_site: params.siteName,
        sc_lang: params.language || 'en',
        sc_mode: params.editMode,
      })
    );
  }
}
