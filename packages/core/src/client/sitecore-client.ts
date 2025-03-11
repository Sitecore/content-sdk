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
import { HTMLLink, FetchOptions, StaticPath } from '../models';
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
  /**
   * Head links for extra Sitecore scripts and styles to be loaded on a page
   */
  headLinks: HTMLLink[];
};

type PageOptions = Partial<RouteOptions> & {
  personalize?: PersonalizedRewriteData;
};

/**
 * Contract for the Sitecore Client implementations
 */
export interface BaseSitecoreClient {
  resolveSite(hostname: string): SiteInfo;
  getPage(
    path: string | string[],
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  getDictionary(pageOptions?: PageOptions, fetchOptions?: FetchOptions): Promise<DictionaryPhrases>;
  getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null>;
  getPreview(
    previewData: EditingPreviewData | undefined,
    fetchOptions?: FetchOptions
  ): Promise<Page | null>;
  getPagePaths(languages?: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]>;
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
    const graphQLOptions: GraphQLClientOptions = {
      api: this.initOptions.api,
      retries: initOptions.retries.count,
      retryStrategy: initOptions.retries.retryStrategy,
    };

    this.clientFactory = createGraphQLClientFactory(graphQLOptions);
    this.siteResolver = new SiteResolver(initOptions.sites);
    this.editingService = new GraphQLEditingService({ clientFactory: this.clientFactory });
    this.sitePathService = new GraphQLSitePathService({
      clientFactory: this.clientFactory,
      sites: this.siteResolver.sites,
    });

    const baseServiceOptions = {
      defaultSite: initOptions.defaultSite,
      clientFactory: this.clientFactory,
      /*
          GraphQL endpoint may reach its rate limit with the amount of requests it receives and throw a rate limit error.
          GraphQL Dictionary and Layout Services can handle rate limit errors from server and attempt a retry on requests.
          For this, specify the number of 'retries' the GraphQL client will attempt.
          By default it is set to 3. You can disable it by configuring it to 0 for this service.
          Additionally, you have the flexibility to customize the retry strategy by passing a 'retryStrategy'.
          By default it uses the `DefaultRetryStrategy` with exponential back-off factor of 2 and handles error codes 429,
          502, 503, 504, 520, 521, 522, 523, 524, 'ECONNRESET', 'ETIMEDOUT' and 'EPROTO' . You can use this class or your own implementation of `RetryStrategy`.
        */
      retries: initOptions.retries,
    };
    this.layoutService = new GraphQLLayoutService({
      ...baseServiceOptions,
      formatLayoutQuery: initOptions.layout.formatLayoutQuery,
    });
    this.dictionaryService = new GraphQLDictionaryService({
      ...baseServiceOptions,
      cacheEnabled: initOptions.dictionary.caching.enabled,
      cacheTimeout: initOptions.dictionary.caching.timeout,
    });
    this.errorPagesService = new GraphQLErrorPagesService({
      ...this.initOptions,
      language: initOptions.defaultLanguage,
      clientFactory: this.clientFactory,
    });

    this.componentService = new RestComponentLayoutService({
      apiHost: this.initOptions.api.local?.apiHost,
      apiKey: this.initOptions.api.local?.apiKey,
      siteName: this.initOptions.defaultSite,
    });
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
      const headLinks = this.getHeadLinks(layout);
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
   * @param {PageOptions} pageOptions - Route options containing language and site name to load dictionary for
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)   * @returns {DictionaryPhrases} A promise that resolves to the dictionary phrases.
   */
  async getDictionary(
    pageOptions?: PageOptions,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    const locale = pageOptions?.locale || this.initOptions.defaultLanguage;
    const site = pageOptions?.site || this.initOptions.defaultSite;
    return await this.dictionaryService.fetchDictionaryData(locale, site, fetchOptions);
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
   * Retrieves the static paths for pages based on the given languages.
   * @param {string[]} [languages] - An optional array of language codes to generate paths for.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getPagePaths(languages?: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]> {
    return this.sitePathService.fetchSiteRoutes(languages || [], fetchOptions);
  }

  /**
   * Returns an instance of the requested service.
   * If `fetchOptions` are provided, a new instance is created; otherwise, the default instance is used.
   * @param {new (config: any) => T} ServiceConstructor - The constructor for the service class.
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)   * @returns {T} An instance of the requested service.
   */
  protected getServiceInstance<T>(
    ServiceConstructor: new (config: any) => T,
    fetchOptions?: FetchOptions
  ): T {
    return new ServiceConstructor({
      ...this.initOptions,
      clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
    });
  }
}
