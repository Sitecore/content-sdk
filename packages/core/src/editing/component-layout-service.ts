import { LayoutServiceData } from '../layout/models';
import { NativeDataFetcher } from '../native-fetcher';
import debug from '../debug';
import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { resolveUrl } from '../utils';
import { DesignLibraryMode } from './models';

/**
 * Params for requesting component data in Design Library mode
 */
export interface ComponentLayoutRequestParams {
  itemId: string; // context item ID
  componentUid: string; // component UID
  language?: string; // language to render in
  dataSourceId?: string; // optional datasource ID
  renderingId?: string; // component definition item ID
  version?: string; // item version (latest by default)
  siteName: string; // site context
  mode?: DesignLibraryMode; // render mode
}

/**
 * Config for ComponentLayoutService.
 * Provide contextId (server) and optionally clientContextId (browser).
 */
export interface ComponentLayoutServiceConfig {
  contextId?: string; // server-side Edge context ID
  clientContextId?: string; // browser-side Edge context ID
  edgeUrl?: string; // XM Cloud endpoint (default provided)
}

/**
 * REST service that enables Design Library functionality.
 * Returns layout data for a single rendered component.
 */
export class ComponentLayoutService {
  constructor(private config: ComponentLayoutServiceConfig) {}

  fetchComponentData(params: ComponentLayoutRequestParams): Promise<LayoutServiceData> {
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
        headers: { sc_editMode: `${params.mode === DesignLibraryMode.Metadata}` },
      })
      .then((r) => r.data)
      .catch((err) => {
        if (err.response?.status === 404) {
          return err.response.data;
        }
        throw err;
      });
  }

  /** Assemble query-string parameters for the component endpoint */
  protected getComponentFetchParams(params: ComponentLayoutRequestParams) {
    const isBrowser = typeof window !== 'undefined';

    // Choose the correct Edge ID per environment
    const sitecoreContextId =
      this.config.contextId ?? (isBrowser ? this.config.clientContextId : undefined);

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

  /** Build the HTTP URL for the partial-layout endpoint */
  private getFetchUrl(params: ComponentLayoutRequestParams) {
    return resolveUrl(
      `${this.config.edgeUrl || SITECORE_EDGE_URL_DEFAULT}/layout/component`,
      this.getComponentFetchParams(params)
    );
  }
}
