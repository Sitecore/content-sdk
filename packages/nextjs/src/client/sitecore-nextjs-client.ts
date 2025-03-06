import {
  createGraphQLClientFactory,
  FetchOptions,
  Page,
  RouteOptions,
  SitecoreClient,
  SitecoreClientInit,
} from '@sitecore-content-sdk/core/client';
import { ComponentPropsCollection, ComponentPropsError } from '../sharedTypes/component-props';
import { GetServerSidePropsContext, GetStaticPropsContext, PreviewData } from 'next';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { ComponentPropsService } from '../services/component-props-service';
import { ModuleFactory } from '../sharedTypes/module-factory';
import { StaticPath } from '@sitecore-content-sdk/core';
import { MultisiteGraphQLSitemapService } from '../services/mutisite-graphql-sitemap-service';
import { EditingPreviewData } from '@sitecore-content-sdk/core/editing';
import { SiteInfo } from '../site';
import { getSiteRewriteData, normalizeSiteRewrite } from '@sitecore-content-sdk/core/site';
import { normalizePersonalizedRewrite } from '@sitecore-content-sdk/core/personalize';

export type SitecoreNexjtsClientInit = SitecoreClientInit & {
  moduleFactory: ModuleFactory;
};

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};

export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  private graphqlSitemapService: MultisiteGraphQLSitemapService;
  constructor(protected initOptions: SitecoreNexjtsClientInit) {
    super(initOptions);
    this.componentPropsService = new ComponentPropsService();
    this.graphqlSitemapService = new MultisiteGraphQLSitemapService({
      clientFactory: this.clientFactory,
      sites: this.siteResolver.sites,
    });
  }

  // since path rewrite we rely on is only working in nextjs
  resolveSiteFromPath(path: string | string[]): SiteInfo {
    const resolvedPath = typeof path === 'string' ? path : this.parsePath(path);
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
    return normalizeSiteRewrite(normalizePersonalizedRewrite(super.parsePath(path)));
  }

  async getPage(
    path: string | string[],
    routeOptions?: RouteOptions,
    options?: FetchOptions
  ): Promise<NextjsPage | null> {
    const site = routeOptions?.site || this.resolveSiteFromPath(path).name;
    const resolvedPath = this.parsePath(path);
    return super.getPage(resolvedPath, { locale: routeOptions?.locale, site }, options);
  }

  async getPreview(previewData: PreviewData, options?: FetchOptions): Promise<NextjsPage> {
    return super.getPreview(previewData as EditingPreviewData, options);
  }

  async getComponentData(
    layoutData: LayoutServiceData,
    context: GetServerSidePropsContext | GetStaticPropsContext
  ): Promise<ComponentPropsCollection> {
    let componentProps: ComponentPropsCollection = {};
    if (!layoutData.sitecore.route) return componentProps;
    // Retrieve component props using side-effects defined on components level
    componentProps = await this.componentPropsService.fetchComponentProps({
      layoutData: layoutData,
      context,
      moduleFactory: this.initOptions.moduleFactory,
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
   * Retrieves the static paths for pages based on the given languages.
   * @param {string[]} [languages] - An optional array of language codes to generate paths for.
   * @param {FetchOptions} [options] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getPagePaths(languages?: string[], options?: FetchOptions): Promise<StaticPath[]> {
    const sitePathsService = options
      ? new MultisiteGraphQLSitemapService({
          sites: this.siteResolver.sites,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...options }),
        })
      : this.graphqlSitemapService;
    return await sitePathsService.fetchSSGSitemap(languages || []);
  }

  /**
   * Retrieves the static paths nextjs export mode.
   * @param {string} [language] - Language to export site paths in.
   * @param {FetchOptions} [options] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getExportSitemap(language?: string, options?: FetchOptions): Promise<StaticPath[]> {
    const sitePathsService = options
      ? new MultisiteGraphQLSitemapService({
          sites: this.siteResolver.sites,
          clientFactory: createGraphQLClientFactory({ api: this.initOptions.api, ...options }),
        })
      : this.graphqlSitemapService;
    return await sitePathsService.fetchExportSitemap(language || this.initOptions.defaultLanguage);
  }
}
