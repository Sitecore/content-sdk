import {
  ComponentLibraryRenderPreviewData,
  EditingPreviewData,
  GraphQLEditingService,
  RestComponentLayoutService,
} from '../editing';
import * as pathUtil from 'path';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases, GraphQLDictionaryService } from '../i18n';
import {
  getComponentLibraryStylesheetLinks,
  getContentStylesheetLink,
  GraphQLLayoutService,
  LayoutServiceData,
} from '../layout';
import { HTMLLink } from '../models';
import { getGroomedVariantIds, personalizeLayout } from '../personalize';
import { ErrorPages, SiteInfo, SiteResolver, GraphQLErrorPagesService } from '../site';
import { FetchOptions, Page, SitecoreClientInit } from './models';
import { createGraphQLClientFactory, GraphQLClientOptions } from './utils';

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

export type RouteOptions = {
  site?: string;
  locale?: string;
};

// this is a generic content client, can be used by any framework
export class SitecoreClient implements BaseSitecoreClient {
  protected layoutService: GraphQLLayoutService;
  protected dictionaryService: GraphQLDictionaryService;
  protected siteResolver: SiteResolver;
  protected editingService: GraphQLEditingService;
  protected clientFactory: GraphQLRequestClientFactory;
  protected errorPagesService: GraphQLErrorPagesService;

  constructor(protected initOptions: SitecoreClientInit) {
    const graphQLOptions: GraphQLClientOptions = {
      api: this.initOptions.api,
      retries: initOptions.retries.count,
      retryStrategy: initOptions.retries.retryStrategy,
    };

    this.clientFactory = createGraphQLClientFactory(graphQLOptions);
    this.siteResolver = new SiteResolver(initOptions.sites);
    this.editingService = new GraphQLEditingService({ clientFactory: this.clientFactory });

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
  }

  resolveSite(hostname: string): SiteInfo {
    // Resolve site by name
    const site = this.siteResolver.getByHost(hostname);
    return site;
  }

  parsePath(path: string | string[]) {
    return typeof path === 'string' ? path : pathUtil.join(...path);
  }

  async getPage(
    path: string | string[],
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<Page | null> {
    const computedPath = typeof path === 'string' ? path : this.parsePath(path);
    const layoutService = fetchOptions
      ? new GraphQLLayoutService({
          ...this.initOptions,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
        })
      : this.layoutService;

    const locale = routeOptions?.locale ?? this.initOptions.defaultLanguage;
    const siteName = routeOptions?.site ?? this.initOptions.defaultSite;
    // Fetch layout data, passing on req/res for SSR
    const layout = await layoutService.fetchLayoutData(computedPath, locale, siteName);
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

  getHeadLinks(layoutData: LayoutServiceData) {
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
   * @param {FetchOptions} [fetchOptions] - Additional fetch fetchOptions.
   * @returns {Promise<DictionaryPhrases>} A promise that resolves to the dictionary phrases.
   */
  async getDictionary(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<DictionaryPhrases> {
    const dictionaryService = fetchOptions
      ? new GraphQLDictionaryService({
          ...this.initOptions,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
        })
      : this.dictionaryService;
    return await dictionaryService.fetchDictionaryData(
      routeOptions?.locale || this.initOptions.defaultLanguage,
      routeOptions?.site || this.initOptions.defaultSite
    );
  }

  /**
   * Retrieves error pages for a given site and locale.
   * @param {RouteOptions} routeOptions - Route options containing language and site name to load error pages
   * @param {FetchOptions} [fetchOptions] - Additional fetch fetchOptions.
   * @returns {Promise<ErrorPages | null>} A promise that resolves to the error pages or null if not found.
   */
  async getErrorPages(
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null> {
    const locale = routeOptions?.locale || this.initOptions.defaultLanguage;
    const site = routeOptions?.site || this.initOptions.defaultSite;
    const errorPagesService = fetchOptions
      ? new GraphQLErrorPagesService({
          ...this.initOptions,
          language: locale,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
        })
      : this.errorPagesService;
    return await errorPagesService.fetchErrorPages(site, locale);
  }

  async getPreview(previewData: EditingPreviewData | undefined, fetchOptions?: FetchOptions) {
    if (!previewData) {
      console.error('Preview data missing');
    }
    const editingService = fetchOptions
      ? new GraphQLEditingService({
          ...this.initOptions,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
        })
      : this.editingService;
    // If we're in Pages preview (editing) mode, prefetch the editing data
    const {
      site,
      itemId,
      language,
      version,
      variantIds,
      layoutKind,
    } = previewData as EditingPreviewData;

    const data = await editingService.fetchEditingData({
      siteName: site,
      itemId,
      language,
      version,
      layoutKind,
    });

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

  async getComponentLibraryData(
    componentLibData: ComponentLibraryRenderPreviewData,
    fetchOptions?: FetchOptions
  ) {
    if (!this.initOptions.api.local) {
      throw new Error('Component Library requires Sitecore apiHost and apiKey to be provided');
    }
    const editingService = fetchOptions
      ? new GraphQLEditingService({
          ...this.initOptions,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...fetchOptions }),
        })
      : this.editingService;
    const {
      itemId,
      componentUid,
      site,
      language,
      renderingId,
      dataSourceId,
      version,
    } = componentLibData;

    const componentService = new RestComponentLayoutService({
      apiHost: this.initOptions.api.local?.apiHost,
      apiKey: this.initOptions.api.local?.apiKey,
      siteName: site,
    });

    const componentData = await componentService.fetchComponentData({
      siteName: site,
      itemId,
      language,
      componentUid,
      renderingId,
      dataSourceId,
      version,
    });

    const dictionaryData = await editingService.fetchDictionaryData({
      siteName: site,
      language,
    });

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
}
