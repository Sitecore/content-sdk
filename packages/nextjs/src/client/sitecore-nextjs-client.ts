import {
  FetchOptions,
  Page,
  PageOptions,
  SitecoreClient,
  SitecoreClientInit,
} from '@sitecore-content-sdk/core/client';
import { ComponentPropsCollection, ComponentPropsError } from '../sharedTypes/component-props';
import {
  GetServerSidePropsContext,
  GetStaticPropsContext,
  NextApiRequest,
  NextApiResponse,
  PreviewData,
} from 'next';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { ComponentPropsService } from '../services/component-props-service';
import { ModuleFactory } from '../sharedTypes/module-factory';
import { EditingPreviewData } from '@sitecore-content-sdk/core/editing';
import { SiteInfo } from '../site';
import {
  getSiteRewriteData,
  GraphQLSitemapXmlService,
  normalizeSiteRewrite,
} from '@sitecore-content-sdk/core/site';
import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/core/personalize';
import { NativeDataFetcher } from '@sitecore-content-sdk/core';

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};

export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  protected sitemapXmlService: GraphQLSitemapXmlService;
  constructor(protected initOptions: SitecoreClientInit) {
    super(initOptions);
    this.componentPropsService = this.getComponentPropsService();
    this.sitemapXmlService = this.getGraphqlSitemapXMLService();
  }

  // since path rewrite we rely on is only working in nextjs
  resolveSiteFromPath(path: string | string[]): SiteInfo {
    const resolvedPath = super.parsePath(path);
    // Get site name (from path rewritten in middleware)
    const siteData = getSiteRewriteData(resolvedPath, this.initOptions.defaultSite);

    // Resolve site by name
    const site = this.siteResolver.getByName(siteData.siteName);
    return site;
  }
  /**
   * Normalizes a nextjs path that could have been rewritten
   * @param {string | string[]} path nextjs path
   * @returns path string without nextjs prefixes
   */
  parsePath(path: string | string[]) {
    const basePath = super.parsePath(path);
    return normalizeSiteRewrite(normalizePersonalizedRewrite(basePath));
  }

  async getPage(
    path: string | string[],
    pageOptions: PageOptions,
    options?: FetchOptions
  ): Promise<NextjsPage | null> {
    const resolvedPath = this.parsePath(path);
    // Get variant(s) for personalization (from path), must ensure path is of type string
    const personalizeData =
      pageOptions.personalize || getPersonalizedRewriteData(super.parsePath(path));
    const site = pageOptions.site || this.resolveSiteFromPath(path).name;
    const page = await super.getPage(
      resolvedPath,
      {
        locale: pageOptions.locale,
        site,
        personalize: personalizeData,
      },
      options
    );

    return page;
  }

  /**
   * Retrieves preview page and layout details
   * @param {PreviewData} previewData - The editing preview data for metadata mode.
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  async getPreview(
    previewData: PreviewData,
    fetchOptions?: FetchOptions
  ): Promise<NextjsPage | null> {
    return super.getPreview(previewData as EditingPreviewData, fetchOptions);
  }

  /**
   * Parses components from nextjs component factory and layoutData, executes getServerProps/getStaticProps methods
   * and returns resulting props from components
   * @param {LayoutServiceData} layoutData layout data to parse compnents from
   * @param {PreviewData} context Nextjs preview data
   * @param {ModuleFactory} moduleFactory module factory to use for component parsing
   * @returns {ComponentPropsCollection} component props
   */
  async getComponentData(
    layoutData: LayoutServiceData,
    context: GetServerSidePropsContext | GetStaticPropsContext,
    moduleFactory: ModuleFactory
  ): Promise<ComponentPropsCollection> {
    let componentProps: ComponentPropsCollection = {};
    if (!layoutData.sitecore.route) return componentProps;
    // Retrieve component props using side-effects defined on components level
    componentProps = await this.componentPropsService.fetchComponentProps({
      layoutData: layoutData,
      context,
      moduleFactory,
    });

    const errors = Object.keys(componentProps)
      .map((id) => {
        const component = componentProps[id] as ComponentPropsError;

        return component.error
          ? `\nUnable to get component props for ${component.componentName} (${id}): ${component.error}`
          : '';
      })
      .join('');

    if (errors.length) {
      throw new Error(errors);
    }

    return componentProps;
  }

  /**
   * Generates a sitemap XML response for the given request
   * @param {NextApiRequest} req - The Next.js API request object
   * @param {NextApiResponse} res - The Next.js API response object
   * @param {string} [id] - Optional sitemap ID (for sitemap-{n}.xml requests)
   * @returns {Promise<NextApiResponse | void>} - Promise that resolves with:
   *   - XML response for specific sitemap when id is provided
   *   - Sitemap index when no id is provided
   *   - 404 redirect if sitemap is not found or fetch fails
   */
  public async getSitemap(
    req: NextApiRequest,
    res: NextApiResponse,
    id?: string
  ): Promise<NextApiResponse | void> {
    const ABSOLUTE_URL_REGEXP = '^(?:[a-z]+:)?//';

    // The id is present if url has sitemap-{n}.xml type.
    // The id can be null if it's index sitemap.xml request
    const sitemapPath = await this.sitemapXmlService.getSitemap(id as string);

    // regular sitemap
    if (sitemapPath) {
      const isAbsoluteUrl = sitemapPath.match(ABSOLUTE_URL_REGEXP);
      const sitemapUrl = isAbsoluteUrl
        ? sitemapPath
        : `${this.initOptions.api.local.apiHost}${sitemapPath}`;
      res.setHeader('Content-Type', 'text/xml;charset=utf-8');

      try {
        const fetcher = new NativeDataFetcher();
        const xmlResponse = await fetcher.fetch<string>(sitemapUrl);

        return res.send(xmlResponse.data);
      } catch (error) {
        return res.redirect('/404');
      }
    }

    // index /sitemap.xml that includes links to all sitemaps
    const sitemaps = await this.sitemapXmlService.fetchSitemaps();

    if (!sitemaps.length) {
      return res.redirect('/404');
    }

    const reqtHost = req.headers.host;
    const reqProtocol = req.headers['x-forwarded-proto'] || 'https';
    const SitemapLinks = sitemaps
      .map((item: string) => {
        const parseUrl = item.split('/');
        const lastSegment = parseUrl[parseUrl.length - 1];

        return `<sitemap>
          <loc>${reqProtocol}://${reqtHost}/${lastSegment}</loc>
        </sitemap>`;
      })
      .join('');

    res.setHeader('Content-Type', 'text/xml;charset=utf-8');

    return res.send(`
    <sitemapindex xmlns="http://sitemaps.org/schemas/sitemap/0.9" encoding="UTF-8">${SitemapLinks}</sitemapindex>
    `);
  }

  protected getComponentPropsService(): ComponentPropsService {
    return new ComponentPropsService();
  }

  protected getGraphqlSitemapXMLService(): GraphQLSitemapXmlService {
    return new GraphQLSitemapXmlService({
      clientFactory: this.clientFactory,
      siteName: this.initOptions.defaultSite,
    });
  }
}
