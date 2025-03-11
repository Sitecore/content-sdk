import {
  ComponentLibraryRenderPreviewData,
  EditingPreviewData,
  GraphQLEditingService,
  RestComponentLayoutService,
} from '../editing';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases, GraphQLDictionaryService } from '../i18n';
import {
  getComponentLibraryStylesheetLinks,
  getContentStylesheetLink,
  GraphQLLayoutService,
  LayoutServiceData,
  RouteOptions,
} from '../layout';
import { HTMLLink, FetchOptions, RetryStrategy } from '../models';
import { getGroomedVariantIds } from '../personalize/utils';
import { personalizeLayout } from '../personalize/layout-personalizer';
import { ErrorPages, SiteInfo, SiteResolver, GraphQLErrorPagesService } from '../site';
import { SitecoreClientInit } from './models';
import { createGraphQLClientFactory, GraphQLClientOptions } from './utils';

// The same type returned from getPage and getPreviewPage
// represent a Page model returned from edge
export type Page = {
  layout: LayoutServiceData;
  site?: SiteInfo;
  locale: string;
  headLinks: HTMLLink[];
};

/**
 * contract for the Sitecore Client implementations
 */
export interface BaseSitecoreClient {
  resolveSite(hostname: string): SiteInfo;
  getPage(
    path: string | string[],
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  getDictionary(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases>;
  getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null>;
  getPreview(
    previewData: EditingPreviewData | undefined,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
}

export interface BaseServiceOptions {
  defaultSite: string;
  clientFactory: GraphQLRequestClientFactory;
  retries: {
    count: number;
    retryStrategy: RetryStrategy;
  };
}

/**
 * This is a generic content client that can be used by any framework.
 * Use it to retrieve pages, preview data, dictionary and other data
 */
export class SitecoreClient implements BaseSitecoreClient {
  protected layoutService: GraphQLLayoutService;
  protected dictionaryService: GraphQLDictionaryService;
  protected siteResolver: SiteResolver;
  protected editingService: GraphQLEditingService;
  protected clientFactory: GraphQLRequestClientFactory;
  protected errorPagesService: GraphQLErrorPagesService;
  protected componentService: RestComponentLayoutService;

  /**
   * Init SitecoreClient
   * @param {SitecoreClientInit} initOptions initOptions for the client, containing site and Sitecore connection details
   */
  constructor(protected initOptions: SitecoreClientInit) {
    this.clientFactory = this.getClientFactory();
    this.siteResolver = this.getSiteResolver();

    const baseServiceOptions = this.getBaseServiceOptions();

    this.layoutService = this.getLayoutService(baseServiceOptions);
    this.dictionaryService = this.getDictionaryService(baseServiceOptions);
    this.editingService = this.getEditingService();
    this.errorPagesService = this.getErrorPagesService();
    this.componentService = this.getComponentService();

    this.siteResolver = new SiteResolver(initOptions.sites);
    this.editingService = new GraphQLEditingService({ clientFactory: this.clientFactory });
  }

  /**
   * Resolve site by hostname
   * @param {string} hostname site hostname
   * @returns {SiteInfo} site details matching the hostname
   */
  resolveSite(hostname: string): SiteInfo {
    const site = this.siteResolver.getByHost(hostname);
    return site;
  }

  /**
   * Normalize path regardless of type
   * @param {string | string[]} path string or string array path
   * @returns {string} string path
   */
  parsePath(path: string | string[]): string {
    // join array path, while clearing extra slashes and ensure first slash
    return typeof path === 'string'
      ? path.startsWith('/')
        ? path
        : `/${path}`
      : `/${path
          .filter((part) => part !== '/')
          .map((part) => part.replace(/^\/+/, '').replace(/\/+$/, ''))
          .join('/')}`;
  }

  /**
   * Get page details for a route, with layout and other details
   * @param {string} path route path
   * @param {RouteOptions} [routeOptions] site and language details for route
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {Page | null} page details
   */
  async getPage(
    path: string | string[],
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const computedPath = this.parsePath(path);
    const locale = routeOptions?.locale ?? this.initOptions.defaultLanguage;
    const siteName = routeOptions?.site ?? this.initOptions.defaultSite;
    // Fetch layout data, passing on req/res for SSR
    const layout = await this.layoutService.fetchLayoutData(
      computedPath,
      {
        locale,
        site: siteName,
      },
      fetchOptions
    );
    if (!layout.sitecore.route) {
      return null;
    } else {
      const siteInfo = this.siteResolver.getByName(siteName);
      // Initialize links to be inserted on the page
      const headLinks = this.getHeadLinks(layout);
      return {
        layout,
        site: siteInfo,
        locale,
        headLinks,
      };
    }
  }

  /**
   * Get head links for extra Sitecore scripts and styles to be loaded on a page
   * @param {LayoutServiceData} layoutData layout data for the page
   * @returns {HTMLLink[]} list of head links
   */
  getHeadLinks(layoutData: LayoutServiceData): HTMLLink[] {
    const headLinks: HTMLLink[] = [];
    const contentStyles = getContentStylesheetLink(
      layoutData,
      this.initOptions.api.edge.contextId,
      this.initOptions.api.edge.edgeUrl
    );
    if (contentStyles) headLinks.push(contentStyles);
    headLinks.push(
      ...getComponentLibraryStylesheetLinks(
        layoutData,
        this.initOptions.api.edge.contextId,
        this.initOptions.api.edge.edgeUrl
      )
    );
    return headLinks;
  }

  /**
   * Retrieves dictionary phrases for a given site and locale.
   * @param {RouteOptions} routeOptions - Route options containing language and site name to load dictionary for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)   * @returns {DictionaryPhrases} A promise that resolves to the dictionary phrases.
   */
  async getDictionary(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    return await this.dictionaryService.fetchDictionaryData(
      routeOptions?.locale || this.initOptions.defaultLanguage,
      routeOptions?.site || this.initOptions.defaultSite,
      fetchOptions
    );
  }

  /**
   * Retrieves error pages for a given site and locale.
   * @param {RouteOptions} routeOptions - Route options containing language and site name to load error pages
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)   * @returns {ErrorPages | null} A promise that resolves to the error pages or null if not found.
   */
  async getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null> {
    const locale = routeOptions?.locale || this.initOptions.defaultLanguage;
    const site = routeOptions?.site || this.initOptions.defaultSite;
    return await this.errorPagesService.fetchErrorPages(site, locale, fetchOptions);
  }

  /**
   * Retrieves preview page and layout details
   * @param {EditingPreviewData | undefined} previewData - The editing preview data for metadata mode.
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {Page} preview page details
   */
  async getPreview(
    previewData: EditingPreviewData | undefined,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    if (!previewData) {
      console.error('Preview data missing');
      return null;
    }
    // If we're in Pages preview (editing) mode, prefetch the editing data
    const {
      site,
      itemId,
      language,
      version,
      variantIds,
      layoutKind,
    } = previewData as EditingPreviewData;

    const data = await this.editingService.fetchEditingData(
      {
        siteName: site,
        itemId,
        language,
        version,
        layoutKind,
      },
      fetchOptions
    );

    if (!data) {
      throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(previewData)}`);
    }
    const page = {
      locale: language,
      layout: data.layoutData,
      headLinks: this.getHeadLinks(data.layoutData),
      dictionary: data.dictionary,
      site: data.layoutData.sitecore.context.site as SiteInfo,
    } as Page;
    const personalizeData = getGroomedVariantIds(variantIds);
    personalizeLayout(page.layout, personalizeData.variantId, personalizeData.componentVariantIds);

    return page;
  }

  /**
   * Get component library page details for Component Library mode of your app
   * @param {ComponentLibraryRenderPreviewData} componentLibData preview data set in 'library' mode of the app
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)   * @returns {Page} preview page for Component Library
   */
  async getComponentLibraryData(
    componentLibData: ComponentLibraryRenderPreviewData,
    fetchOptions?: FetchOptions
  ): Promise<Page> {
    if (!this.initOptions.api.local) {
      throw new Error('Component Library requires Sitecore apiHost and apiKey to be provided');
    }

    const {
      itemId,
      componentUid,
      site,
      language,
      renderingId,
      dataSourceId,
      version,
    } = componentLibData;

    const componentData = await this.componentService.fetchComponentData({
      siteName: site,
      itemId,
      language,
      componentUid,
      renderingId,
      dataSourceId,
      version,
    });

    const dictionaryData = await this.editingService.fetchDictionaryData(
      {
        siteName: site,
        language,
      },
      fetchOptions
    );

    if (!componentData) {
      throw new Error(
        `Unable to fetch editing data for preview ${JSON.stringify(componentLibData)}`
      );
    }
    const page = {
      locale: componentLibData.language,
      layout: componentData,
      headLinks: this.getHeadLinks(componentData),
      dictionary: dictionaryData,
    } as Page;
    return page;
  }

  /**
   * Factory methods for creating dependencies
   * Subclasses can override these to provide custom implementations.
   */

  protected getBaseServiceOptions(): BaseServiceOptions {
    return {
      defaultSite: this.initOptions.defaultSite,
      clientFactory: this.clientFactory,
      retries: this.initOptions.retries,
    };
  }

  protected getClientFactory(): GraphQLRequestClientFactory {
    const graphQLOptions: GraphQLClientOptions = {
      api: this.initOptions.api,
      retries: this.initOptions.retries.count,
      retryStrategy: this.initOptions.retries.retryStrategy,
    };
    return createGraphQLClientFactory(graphQLOptions);
  }

  protected getSiteResolver(): SiteResolver {
    return new SiteResolver(this.initOptions.sites);
  }

  protected getLayoutService(baseOptions: BaseServiceOptions): GraphQLLayoutService {
    return new GraphQLLayoutService({
      ...baseOptions,
      formatLayoutQuery: this.initOptions.layout.formatLayoutQuery,
    });
  }

  protected getDictionaryService(baseOptions: BaseServiceOptions): GraphQLDictionaryService {
    return new GraphQLDictionaryService({
      ...baseOptions,
      cacheEnabled: this.initOptions.dictionary.caching.enabled,
      cacheTimeout: this.initOptions.dictionary.caching.timeout,
    });
  }

  protected getEditingService(): GraphQLEditingService {
    return new GraphQLEditingService({ clientFactory: this.clientFactory });
  }

  protected getErrorPagesService(): GraphQLErrorPagesService {
    return new GraphQLErrorPagesService({
      ...this.initOptions,
      language: this.initOptions.defaultLanguage,
      clientFactory: this.clientFactory,
    });
  }

  protected getComponentService(): RestComponentLayoutService {
    return new RestComponentLayoutService({
      apiHost: this.initOptions.api.local?.apiHost,
      apiKey: this.initOptions.api.local?.apiKey,
      siteName: this.initOptions.defaultSite,
    });
  }
}
