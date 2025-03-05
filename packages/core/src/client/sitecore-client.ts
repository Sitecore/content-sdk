import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { DictionaryPhrases, GraphQLDictionaryService } from '../i18n';
import {
  getComponentLibraryStylesheetLinks,
  getContentStylesheetLink,
  GraphQLLayoutService,
  LayoutServiceData,
} from '../layout';
import { HTMLLink } from '../models';
import { normalizePersonalizedRewrite } from '../personalize';
import {
  ErrorPages,
  getSiteRewriteData,
  normalizeSiteRewrite,
  SiteInfo,
  SiteResolver,
  GraphQLErrorPagesService,
} from '../site';
import { FetchOptions, Page, SitecoreClientInit } from './models';
import { createGraphQLClientFactory } from './utils';

// contract for the sitecore client
export abstract class BaseSitecoreClient {
  abstract resolveSite(path: string | string[] | undefined): SiteInfo;
  abstract getPage(
    path: string | string[] | undefined,
    locale?: string,
    options?: FetchOptions
  ): Promise<Page | null>;
  abstract getDictionary(
    site: string,
    locale?: string,
    options?: FetchOptions
  ): Promise<DictionaryPhrases>;
  abstract getErrorPages(
    site: string,
    locale?: string,
    options?: FetchOptions
  ): Promise<ErrorPages | null>;
}
// TODO: consider the below
/**
 * // Data fetcher that is responsible for all XMCloud connections
 * // Will be initialized OOB
 * // or customers can provide custom one with custom credentials and pass it into:
 *  - SitecoreClient constructor
 *  - individual methods of SitecoreClient
 * class DataFetcher {
 *  constructor(private api: SitecoreConfig['api']) {
 *   // check for edge/local details. Similar to clientFactory
 *  }
 *  fetch<TInput,TOutput>(query) {
 *    // connect to XMCloud, get data
 *    // Service classes will call this and then transform response data as needed
 *  }
 * }
 */

// this is a generic content client, can be used by any framework
export class SitecoreClient implements BaseSitecoreClient {
  protected layoutService: GraphQLLayoutService;
  protected dictionaryService: GraphQLDictionaryService;
  protected siteResolver: SiteResolver;
  protected clientFactory: GraphQLRequestClientFactory;
  protected errorPagesService: GraphQLErrorPagesService;

  constructor(protected initOptions: SitecoreClientInit) {
    this.clientFactory = createGraphQLClientFactory(initOptions);
    this.siteResolver = new SiteResolver(initOptions.sites);
    const baseServiceOptions = {
      // TODO: consider reworking services to not depend on siteName
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
      siteName: initOptions.defaultSite,
      language: initOptions.defaultLanguage,
      clientFactory: this.clientFactory,
      retries: initOptions.retries.count,
    });
  }

  normalizePath(path: string) {
    // TODO: chaining call instead
    return normalizeSiteRewrite(normalizePersonalizedRewrite(path));
  }

  // TODO: use type string | string[] | undefined here
  resolveSite(path: string): SiteInfo {
    // Get site name (from path)
    const siteData = getSiteRewriteData(path, this.initOptions.defaultSite);

    // Resolve site by name
    const site = this.siteResolver.getByName(siteData.siteName);
    return site;
  }

  // TODO: allow getPage to return null when notFound
  async getPage(path: string, locale?: string, options?: FetchOptions): Promise<Page> {
    // TODO: utilize fetch options
    console.log(options);
    // TODO: explore this more, implement framework agnostic re: path rewrites
    const siteInfo = this.resolveSite([path].join(''));
    // Get normalized Sitecore item path
    const normalPath = this.normalizePath(path);

    // Use context locale if Next.js i18n is configured, otherwise use default site language
    locale = locale ?? .language;

    // Fetch layout data, passing on req/res for SSR
    const layout = await this.layoutService.fetchLayoutData(normalPath, locale, siteInfo.name);
    let notFound = false;
    if (!layout.sitecore.route) {
      // A missing route value signifies an invalid path, so set notFound.
      // Our page routes will return this in getStatic/ServerSideProps,
      // which will trigger our custom 404 page with proper 404 status code.
      // You could perform additional logging here to track these if desired.
      notFound = true;
      return {
        layout,
        notFound,
        site: siteInfo,
        locale,
        headLinks: [],
      };
    } else {
      // Fetch dictionary data if layout data was present
      const dictionary = await this.getDictionary(locale);
      // Initialize links to be inserted on the page
      const headLinks = this.getHeadLinks(layout);
      return {
        layout,
        notFound,
        dictionary,
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
   * @param {string} site - The name of the site for which to fetch dictionary data.
   * @param {string} [locale] - The locale for which to fetch dictionary data. Defaults to the site's default language if not provided.
   * @param {FetchOptions} [options] - Additional fetch options.
   * @returns {Promise<DictionaryPhrases>} A promise that resolves to the dictionary phrases.
   */
  async getDictionary(
    site: string,
    locale?: string,
    options?: FetchOptions
  ): Promise<DictionaryPhrases> {
    console.log(options);
    return await this.dictionaryService.fetchDictionaryData(site, locale);
  }

  /**
   * Retrieves error pages for a given site and locale.
   * @param {string} site - The name of the site for which to fetch error pages.
   * @param {string} [locale] - The locale for which to fetch error pages. Defaults to the site's default language if not provided.
   * @param {FetchOptions} [options] - Additional fetch options.
   * @returns {Promise<ErrorPages | null>} A promise that resolves to the error pages or null if not found.
   */
  async getErrorPages(
    site: string,
    locale?: string,
    options?: FetchOptions
  ): Promise<ErrorPages | null> {
    console.log(options);
    return await this.errorPagesService.fetchErrorPages(site, locale);
  }
}
