import {
  DesignLibraryRenderPreviewData,
  EditingPreviewData,
  GraphQLEditingService,
  RestComponentLayoutService,
} from '../editing';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases, GraphQLDictionaryService } from '../i18n';
import {
  getDesignLibraryStylesheetLinks,
  getContentStylesheetLink,
  GraphQLLayoutService,
  LayoutServiceData,
  RouteOptions,
} from '../layout';
import { HTMLLink, FetchOptions, StaticPath, RetryStrategy } from '../models';
import { getGroomedVariantIds, PersonalizedRewriteData } from '../personalize/utils';
import { personalizeLayout } from '../personalize/layout-personalizer';
import {
  ErrorPages,
  SiteInfo,
  SiteResolver,
  GraphQLErrorPagesService,
  GraphQLSitePathService,
} from '../site';
import { SitecoreClientInit } from './models';
import { createGraphQLClientFactory, GraphQLClientOptions } from './utils';

/**
 * Represent a Page model returned from Edge endpoint
 */
export type Page = {
  /**
   * Layout details and props for the page
   */
  layout: LayoutServiceData;
  /**
   * Site info for current page / route
   */
  site?: SiteInfo;
  /**
   * Route locale
   */
  locale: string;
};

export type PageOptions = Partial<RouteOptions> & {
  personalize?: PersonalizedRewriteData;
};

/**
 * Contract for the Sitecore Client implementations
 */
export interface BaseSitecoreClient {
  /**
   * Resolves site by request hostaname
   * @param {string} hostname incoming request host name
   * @returns {SiteInfo} site details including name, language and hostname
   */
  resolveSite(hostname: string): SiteInfo;
  /**
   * Retrieves page layoutData and returns page details like language, layoutData and site info for current request
   * @param {string} path current request path
   * @param {PageOptions} pageOptions additional overrides like language, site name and personalization variants
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {Page | null} page details when page layout is found and null when not
   */
  getPage(
    path: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  /**
   * Get dictionary data for a given site and locale.
   * Can retrieve dictionary phrases for default site and language when page options not provided
   * @param {RouteOptions} [routeOptions] language and site to load dictionary data for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  getDictionary(
    routeOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases>;
  /**
   * Get error pages configured by SXA for a given site and locale
   * @param {RouteOptions} [routeOptions] language and site to load error pages for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null>;
  /**
   * Get preview layout details based on details from EditingPreviewData input
   * @param {EditingPreviewData | undefined} previewData preview details like route, site, language etc used to retrieve preview page and layout
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  getPreview(
    previewData: EditingPreviewData | undefined,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  /**
   * Get route paths for all pages in the site. Can be used for static site generation.
   * @param {string[]} [languages] languages to fetch routes in
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  getPagePaths(languages?: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]>;
  /**
   * Retrieves the links to be loaded in app's <head> element for each page.
   * @param {LayoutServiceData} layoutData - The layout data containing styles and themes.
   * @param {object} [options] - Optional configuration for enabling styles and themes.
   * @param {boolean} [options.enableStyles] - Whether to include content styles.
   * @param {boolean} [options.enableThemes] - Whether to include theme styles.
   * @returns {HTMLLink[]} An array of `<link>` elements.
   */
  getHeadLinks(
    layoutData: LayoutServiceData,
    options: { enableStyles?: boolean; enableThemes?: boolean }
  ): HTMLLink[];
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
  protected sitePathService: GraphQLSitePathService;

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
    this.sitePathService = this.getSitePathService();
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
   * @param {PageOptions} [pageOptions] site, language and personalization variant details for route
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {Page | null} page details
   */
  async getPage(
    path: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const computedPath = this.parsePath(path);
    const locale = pageOptions?.locale ?? this.initOptions.defaultLanguage;
    const site = pageOptions?.site ?? this.initOptions.defaultSite;
    // Fetch layout data, passing on req/res for SSR
    const layout = await this.layoutService.fetchLayoutData(
      computedPath,
      {
        locale,
        site,
      },
      fetchOptions
    );
    if (!layout.sitecore.route) {
      return null;
    } else {
      const siteInfo = this.siteResolver.getByName(site);
      // Initialize links to be inserted on the page
      if (pageOptions?.personalize?.variantId) {
        // Modify layoutData to use specific variant(s) instead of default
        // This will also set the variantId on the Sitecore context so that it is accessible here
        personalizeLayout(
          layout,
          pageOptions.personalize.variantId,
          pageOptions.personalize.componentVariantIds
        );
      }
      return {
        layout,
        site: siteInfo,
        locale,
      };
    }
  }

  /**
   * Retrieves the head `<link>` elements for Sitecore styles and themes.
   * @param {LayoutServiceData} layoutData - The layout data containing styles and themes.
   * @param {object} [options] - Optional configuration for enabling styles and themes.
   * @param {boolean} [options.enableStyles] - Whether to include content styles.
   * @param {boolean} [options.enableThemes] - Whether to include theme styles.
   * @returns {HTMLLink[]} An array of `<link>` elements for stylesheets.
   */
  getHeadLinks(
    layoutData: LayoutServiceData,
    options: { enableStyles?: boolean; enableThemes?: boolean } = {}
  ): HTMLLink[] {
    const { enableStyles = true, enableThemes = true } = options;
    const { contextId, edgeUrl } = this.initOptions.api.edge;
    const headLinks: HTMLLink[] = [];

    if (enableStyles) {
      const contentStyles = getContentStylesheetLink(layoutData, contextId, edgeUrl);
      if (contentStyles) headLinks.push(contentStyles);
    }

    if (enableThemes) {
      headLinks.push(...getDesignLibraryStylesheetLinks(layoutData, contextId, edgeUrl));
    }

    return headLinks;
  }

  /**
   * Retrieves dictionary phrases for a given site and locale.
   * @param {RouteOptions} routeOptions - Route options containing language and site name to load dictionary for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {DictionaryPhrases} A promise that resolves to the dictionary phrases.
   */
  async getDictionary(
    routeOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    const locale = routeOptions?.locale || this.initOptions.defaultLanguage;
    const site = routeOptions?.site || this.initOptions.defaultSite;
    return await this.dictionaryService.fetchDictionaryData(locale, site, fetchOptions);
  }

  /**
   * Retrieves error pages for a given site and locale.
   * @param {RouteOptions} routeOptions - Route options containing language and site name to load error pages
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {ErrorPages | null} A promise that resolves to the error pages or null if not found.
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
      dictionary: data.dictionary,
      site: data.layoutData.sitecore.context.site as SiteInfo,
    } as Page;
    const personalizeData = getGroomedVariantIds(variantIds);
    personalizeLayout(page.layout, personalizeData.variantId, personalizeData.componentVariantIds);

    return page;
  }

  /**
   * Get design library page details for Design Library mode of your app
   * @param {DesignLibraryRenderPreviewData} designLibData preview data set in 'library' mode of the app
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   * @returns {Page} preview page for Design Library
   */
  async getDesignLibraryData(
    designLibData: DesignLibraryRenderPreviewData,
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
    } = designLibData;

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
      throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(designLibData)}`);
    }
    const page = {
      locale: designLibData.language,
      layout: componentData,
      dictionary: dictionaryData,
    } as Page;
    return page;
  }

  /**
   * Retrieves the static paths for pages based on the given languages.
   * @param {string[]} [languages] - An optional array of language codes to generate paths for.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getPagePaths(languages?: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]> {
    return this.sitePathService.fetchSiteRoutes(languages || [], fetchOptions);
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

  protected getSitePathService(): GraphQLSitePathService {
    return new GraphQLSitePathService({
      clientFactory: this.clientFactory,
      sites: this.siteResolver.sites,
    });
  }
}
