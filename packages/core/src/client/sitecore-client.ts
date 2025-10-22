import {
  DesignLibraryRenderPreviewData,
  EditingPreviewData,
  EditingService,
  ComponentLayoutService,
  DesignLibraryMode,
} from '../editing';
import { DocumentNode } from 'graphql';
import { GraphQLClient, GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases, DictionaryService } from '../i18n';
import {
  getDesignLibraryStylesheetLinks,
  getContentStylesheetLink,
  LayoutService,
  LayoutServiceData,
  RouteOptions,
  LayoutServicePageState,
} from '../layout';
import { HTMLLink, FetchOptions, StaticPath, RetryStrategy } from '../models';
import { getGroomedVariantIds, PersonalizedRewriteData } from '../personalize/utils';
import { personalizeLayout } from '../personalize/layout-personalizer';
import { ErrorPages, ErrorPagesService, SitePathService, SitemapXmlService } from '../site';
import { SitecoreClientInit } from './models';
import { createGraphQLClientFactory, GraphQLClientOptions } from './utils';
import { NativeDataFetcher } from '../native-fetcher';
import { RobotsService } from '../site/robots-service';
import { DesignLibraryVariantGeneration } from '../editing/models';

/**
 * Error page codes
 */
export enum ErrorPage {
  NotFound = '404',
  InternalServerError = '500',
}

/**
 * Page mode name
 */
type PageModeName = LayoutServicePageState | DesignLibraryMode;

/**
 * Represents the mode of the page
 */
export type PageMode = {
  /**
   * Page mode name.
   */
  name: PageModeName;
  /**
   * Design Library related properties. Only available in Design Library mode.
   */
  designLibrary: {
    /**
     * Whether the page is in variant generation mode
     */
    isVariantGeneration: boolean;
  };
  /**
   * Whether the page is in normal mode
   */
  isNormal: boolean;
  /**
   * Whether the page is in preview mode
   */
  isPreview: boolean;
  /**
   * Whether the page is in editing mode
   */
  isEditing: boolean;
  /**
   * Whether the page is in Design Library mode
   */
  isDesignLibrary: boolean;
};

/**
 * Represent a Page model returned from Edge endpoint
 */
export type Page = {
  /**
   * Layout details and props for the page
   */
  layout: LayoutServiceData;
  /**
   * Site name for current page / route
   */
  siteName?: string;
  /**
   * Route locale
   */
  locale: string;
  /**
   * Page mode
   */
  mode: PageMode;
};

export type PageOptions = Partial<RouteOptions> & {
  personalize?: PersonalizedRewriteData;
};

/**
 * Request options for the getSiteMap method
 */
export type SitemapXmlOptions = {
  /** The hostname from the request (e.g., 'example.com') */
  reqHost: string;
  /** The protocol from request headers (e.g., 'https' or 'http') */
  reqProtocol: string | string[];
  /** Optional sitemap identifier when requesting a specific sitemap */
  id?: string;
  /** The site name to resolve the sitemap for */
  siteName?: string;
};

/**
 * Options for fetching robots.txt content.
 */
export type RobotsOptions = {
  /**
   * The name of the site for which to fetch robots.txt content.
   */
  siteName: string;
};

/**
 * Contract for the Sitecore Client implementations
 */
export interface BaseSitecoreClient {
  /**
   * Execute a raw GraphQL request using the client's configured GraphQL endpoint(s).
   * This is a thin pass-through to the underlying {@link GraphQLClient.request},
   * @param query GraphQL string or DocumentNode
   * @param variables Optional variables bag
   * @param fetchOptions Optional fetch/retry overrides (headers, retries, fetch impl, debugger)
   */
  getData<T = unknown>(
    query: string | DocumentNode,
    variables?: Record<string, unknown>,
    fetchOptions?: FetchOptions
  ): Promise<T>;
  /**
   * Retrieves page layoutData and returns page details like language, layoutData and site info for current request
   * @param {string} path current request path
   * @param {PageOptions} pageOptions additional overrides like language, site name and personalization variants
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   * @returns {Page | null} page details when page layout is found and null when not
   */
  getPage(
    path: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  /**
   * Retrieves the robots.txt content for a given site name.
   * @param {string} siteName - The name of the site for which to fetch robots.txt content.
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   * @returns {Promise<string>} A promise that resolves to the robots.txt content.
   */
  getRobots(siteName: string, fetchOptions?: FetchOptions): Promise<string | null>;
  /*
   * Get dictionary data for a given site and locale.
   * Can retrieve dictionary phrases for default site and language when page options not provided
   * @param {RouteOptions} [routeOptions] language and site to load dictionary data for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   */
  getDictionary(
    routeOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases>;
  /**
   * Get error pages configured by SXA for a given site and locale
   * @param {RouteOptions} [routeOptions] language and site to load error pages for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   */
  getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null>;
  /**
   * Get preview layout details based on details from EditingPreviewData input
   * @param {EditingPreviewData | undefined} previewData preview details like route, site, language etc used to retrieve preview page and layout
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   */
  getPreview(
    previewData: EditingPreviewData | undefined,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  /**
   * Get error page details for a given error code
   * @param {ErrorPage} code - The error code to get the error page for
   * @param {Partial<RouteOptions>} [pageOptions] - The page options to get the error page for
   * @param {FetchOptions} [fetchOptions] - Additional fetch fetch options to override GraphQL requests
   * @returns {Promise<Page | null>} A promise that resolves to the error page details or null if not found
   */
  getErrorPage(
    code: ErrorPage,
    pageOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  /**
   * Get route paths for all pages in the site. Can be used for static site generation.
   * @param {string[]} sites - sites to fetch routes for
   * @param {string[]} [languages] languages to fetch routes in
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   */
  getPagePaths(
    sites: string[],
    languages?: string[],
    fetchOptions?: FetchOptions
  ): Promise<StaticPath[]>;
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
  /**
   * Retrieves sitemap XML content - either a specific sitemap or the index of all sitemaps.
   * @param { SitemapRequestConfig} reqOptions - Configuration for sitemap retrieval
   * @param {FetchOptions} [fetchOptions] - Additional fetchOptions Additional fetch options to override GraphQL requests
   * @returns {Promise<string>} Promise resolving to the sitemap XML content as string
   */
  getSiteMap(reqOptions: SitemapXmlOptions, fetchOptions?: FetchOptions): Promise<string>;
  /**
   * Retrieves the robots.txt content for a given site name.
   * @param {string} siteName - The name of the site for which to fetch robots.txt content.
   * @param {FetchOptions} fetchOptions Additional fetch options to override GraphQL requests
   * @returns {Promise<string>} A promise that resolves to the robots.txt content.
   */
  getRobots(siteName: string, fetchOptions?: FetchOptions): Promise<string | null>;
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
  protected layoutService: LayoutService;
  protected dictionaryService: DictionaryService;
  protected editingService: EditingService;
  protected clientFactory: GraphQLRequestClientFactory;
  protected errorPagesService: ErrorPagesService;
  protected componentService: ComponentLayoutService;
  protected sitePathService: SitePathService;
  protected graphQLClient: GraphQLClient;

  /**
   * Init SitecoreClient
   * @param {SitecoreClientInit} initOptions initOptions for the client, containing site and Sitecore connection details
   */
  constructor(protected initOptions: SitecoreClientInit) {
    this.clientFactory = this.getClientFactory();
    this.graphQLClient = this.getGraphQLClient();

    const baseServiceOptions = this.getBaseServiceOptions();

    this.layoutService =
      initOptions.custom?.layoutService ?? this.getLayoutService(baseServiceOptions);
    this.dictionaryService =
      initOptions.custom?.dictionaryService ?? this.getDictionaryService(baseServiceOptions);
    this.editingService = initOptions.custom?.editingService ?? this.getEditingService();
    this.errorPagesService = initOptions.custom?.errorPagesService ?? this.getErrorPagesService();
    this.sitePathService = initOptions.custom?.sitePathService ?? this.getSitePathService();
    this.componentService = this.getComponentService();
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
   * Execute a raw GraphQL request using the client's configured GraphQL endpoint(s).
   * This is a thin pass-through to the underlying {@link GraphQLClient.request},
   * @param {string | DocumentNode} query GraphQL query
   * @param {Record<string, unknown>} [variables] Optional variables bag
   * @param {FetchOptions} [fetchOptions] Optional fetch overrides (e.g. fetch, headers)
   */
  getData<T = unknown>(
    query: string | DocumentNode,
    variables?: Record<string, unknown>,
    fetchOptions?: FetchOptions
  ): Promise<T> {
    return this.graphQLClient.request<T>(query, variables, fetchOptions);
  }

  /**
   * Get page details for a route, with layout and other details
   * @param {string} path route path
   * @param {PageOptions} [pageOptions] site, language and personalization variant details for route
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
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
        siteName: layout.sitecore.context.site?.name || site,
        locale,
        mode: this.getPageMode(LayoutServicePageState.Normal),
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
    const { contextId: serverContextId, clientContextId, edgeUrl } = this.initOptions.api.edge;
    const headLinks: HTMLLink[] = [];

    const contextId = serverContextId || clientContextId;

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
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
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
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
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
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
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
    const { site, itemId, language, version, layoutKind, mode } = previewData as EditingPreviewData;

    const variantIds = Array.isArray(previewData.variantIds)
      ? previewData.variantIds
      : previewData.variantIds.split(',');

    const data = await this.editingService.fetchEditingData(
      {
        itemId,
        language,
        version,
        layoutKind,
        mode,
      },
      fetchOptions
    );

    if (!data) {
      throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(previewData)}`);
    }
    const page: Page = {
      locale: language,
      layout: data.layoutData,
      siteName: data.layoutData.sitecore.context.site?.name || site,
      mode: this.getPageMode(mode),
    };
    const personalizeData = getGroomedVariantIds(variantIds);
    personalizeLayout(page.layout, personalizeData.variantId, personalizeData.componentVariantIds);

    return page;
  }

  /**
   * Get design library page details for Design Library mode of your app
   * @param {DesignLibraryRenderPreviewData} designLibData preview data set in 'library' mode of the app
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
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
      mode,
      generation,
    } = designLibData;

    const componentData = await this.componentService.fetchComponentData(
      {
        siteName: site,
        itemId,
        language,
        componentUid,
        renderingId,
        dataSourceId,
        version,
        mode,
        ...(generation ? { generation } : {}),
      },
      fetchOptions
    );

    if (!componentData) {
      throw new Error(`Unable to fetch editing data for preview ${JSON.stringify(designLibData)}`);
    }
    const page: Page = {
      locale: designLibData.language,
      layout: componentData,
      siteName: componentData.sitecore.context.site?.name || site,
      mode: this.getPageMode(mode, generation),
    };
    return page;
  }

  /**
   * Get error page details for a given error code
   * @param {ErrorPage} code - The error code to get the error page for
   * @param {Partial<RouteOptions>} pageOptions - The page options to get the error page for
   * @param {FetchOptions} [fetchOptions] - Additional fetch fetch options to override GraphQL requests
   * @returns {Promise<Page | null>} A promise that resolves to the error page details or null if not found
   */
  async getErrorPage(
    code: ErrorPage,
    pageOptions?: Partial<RouteOptions>,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const locale = pageOptions?.locale || this.initOptions.defaultLanguage;
    const site = pageOptions?.site || this.initOptions.defaultSite;

    const result = await this.getErrorPages(
      {
        site,
        locale,
      },
      fetchOptions
    );

    let layout = null;

    switch (code) {
      case ErrorPage.NotFound:
        layout = result?.notFoundPage?.rendered || null;
        break;
      case ErrorPage.InternalServerError:
        layout = result?.serverErrorPage?.rendered || null;
        break;
      default:
        return null;
    }

    if (!layout) {
      return null;
    }

    return {
      layout,
      locale,
      mode: this.getPageMode(LayoutServicePageState.Normal),
      siteName: site,
    };
  }

  /**
   * Retrieves the static paths for pages based on the given languages.
   * @param {string[]} sites - An array of site names to fetch routes for.
   * @param {string[]} [languages] - An optional array of language codes to generate paths for.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getPagePaths(
    sites: string[],
    languages?: string[],
    fetchOptions?: FetchOptions
  ): Promise<StaticPath[]> {
    return this.sitePathService.fetchSiteRoutes(sites, languages || [], fetchOptions);
  }

  /**
   * Retrieves sitemap XML content - either a specific sitemap or the index of all sitemaps.
   * @param {SitemapXmlOptions} reqOptions - Options for sitemap retrieval
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<string>} Promise resolving to the sitemap XML content as string
   * @throws {Error} Throws 'REDIRECT_404' if requested sitemap is not found
   */
  async getSiteMap(reqOptions: SitemapXmlOptions, fetchOptions?: FetchOptions): Promise<string> {
    const { reqHost, reqProtocol, id, siteName } = reqOptions;

    // create sitemap graphql service
    const sitemapXmlService = this.getGraphqlSitemapXMLService(
      siteName || this.initOptions.defaultSite
    );

    // The id is present if url has sitemap-{n}.xml type.
    // The id can be null if it's index sitemap.xml request
    const sitemapPath = await sitemapXmlService.getSitemap(id as string);

    // regular sitemap
    if (sitemapPath) {
      try {
        const fetcher = new NativeDataFetcher();
        const xmlResponse = await fetcher.fetch<string>(sitemapPath);
        if (!xmlResponse.data) {
          throw new Error('REDIRECT_404');
        }
        return xmlResponse.data;
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        throw new Error('REDIRECT_404');
      }
    }

    // index /sitemap.xml that includes links to all sitemaps
    const sitemaps = await sitemapXmlService.fetchSitemaps(fetchOptions);

    if (!sitemaps.length) {
      throw new Error('REDIRECT_404');
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps
        .map((item: string) => {
          const parseUrl = item.split('/');
          const lastSegment = parseUrl[parseUrl.length - 1];
          const escapedUrl = `${reqProtocol}://${reqHost}/${lastSegment}`.replace(/&/g, '&amp;');
          return `<sitemap><loc>${escapedUrl}</loc></sitemap>`;
        })
        .join('')}
      </sitemapindex>`;
  }

  /**
   * Retrieves the robots.txt content for a given site name.
   * @param {string} siteName - The name of the site to retrieve the robots.txt for.
   * @param {FetchOptions} [fetchOptions] - Optional fetch options.
   * @returns {Promise<string | null>} A promise that resolves to the robots.txt content,
   * or null if no content is found.
   */
  async getRobots(siteName: string, fetchOptions?: FetchOptions): Promise<string | null> {
    const robotsService = this.getRobotsService(siteName || this.initOptions.defaultSite);
    const content = await robotsService.fetchRobots(fetchOptions);
    return content || null;
  }

  /**
   * Factory methods for creating dependencies
   * Subclasses can override these to provide custom implementations.
   */

  protected getGraphqlSitemapXMLService(siteName: string): SitemapXmlService {
    return new SitemapXmlService({
      clientFactory: this.clientFactory,
      siteName,
    });
  }

  protected getRobotsService(siteName: string): RobotsService {
    return new RobotsService({
      clientFactory: this.clientFactory,
      siteName,
    });
  }

  protected getBaseServiceOptions(): BaseServiceOptions {
    return {
      defaultSite: this.initOptions.defaultSite,
      clientFactory: this.clientFactory,
      retries: this.initOptions.retries,
    };
  }

  /**
   * Get page mode based on mode name
   * @param {PageModeName} mode - The mode name to get the page mode for
   * @param { DesignLibraryVariantGeneration} generation - The variant generation mode, if applicable
   * @returns {PageMode} The page mode
   */
  private getPageMode(mode: PageModeName, generation?: DesignLibraryVariantGeneration): PageMode {
    const pageMode: PageMode = {
      name: mode,
      isNormal: false,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    };

    switch (mode) {
      case LayoutServicePageState.Normal:
        pageMode.isNormal = true;
        break;

      case LayoutServicePageState.Preview:
        pageMode.isPreview = true;
        break;

      case LayoutServicePageState.Edit:
        pageMode.isEditing = true;
        break;

      case DesignLibraryMode.Normal:
        pageMode.isDesignLibrary = true;
        break;

      case DesignLibraryMode.Metadata:
        pageMode.isDesignLibrary = true;
        pageMode.isEditing = true;
        break;

      default:
        break;
    }

    if (pageMode.isDesignLibrary && generation === DesignLibraryVariantGeneration.Variant) {
      pageMode.designLibrary.isVariantGeneration = true;
      pageMode.isEditing = true;
    }

    return pageMode;
  }

  private getGraphQLClient(): GraphQLClient {
    return this.clientFactory({
      retries: this.initOptions.retries.count,
      retryStrategy: this.initOptions.retries.retryStrategy,
    });
  }

  private getClientFactory(): GraphQLRequestClientFactory {
    const graphQLOptions: GraphQLClientOptions = {
      api: this.initOptions.api,
      retries: this.initOptions.retries.count,
      retryStrategy: this.initOptions.retries.retryStrategy,
    };
    return createGraphQLClientFactory(graphQLOptions);
  }

  private getLayoutService(baseOptions: BaseServiceOptions): LayoutService {
    return new LayoutService({
      ...baseOptions,
      formatLayoutQuery: this.initOptions.layout.formatLayoutQuery,
    });
  }

  private getDictionaryService(baseOptions: BaseServiceOptions): DictionaryService {
    return new DictionaryService({
      ...baseOptions,
      cacheEnabled: this.initOptions.dictionary.caching.enabled,
      cacheTimeout: this.initOptions.dictionary.caching.timeout,
    });
  }

  private getEditingService(): EditingService {
    return new EditingService({ clientFactory: this.clientFactory });
  }

  private getErrorPagesService(): ErrorPagesService {
    return new ErrorPagesService({
      ...this.initOptions,
      language: this.initOptions.defaultLanguage,
      clientFactory: this.clientFactory,
    });
  }

  private getComponentService(): ComponentLayoutService {
    return new ComponentLayoutService(this.initOptions.api.edge);
  }

  private getSitePathService(): SitePathService {
    return new SitePathService({
      clientFactory: this.clientFactory,
    });
  }
}
