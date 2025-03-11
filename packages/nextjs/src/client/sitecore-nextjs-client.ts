import {
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
import { GraphQLSitemapService } from '../services/graphql-sitemap-service';
import { EditingPreviewData } from '@sitecore-content-sdk/core/editing';
import { SiteInfo } from '../site';
import { getSiteRewriteData, normalizeSiteRewrite } from '@sitecore-content-sdk/core/site';
import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
  personalizeLayout,
} from '@sitecore-content-sdk/core/personalize';

export type SitecoreNextjsClientInit = SitecoreClientInit & {
  moduleFactory: ModuleFactory;
};

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};

export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  private sitemapService: GraphQLSitemapService;
  constructor(protected initOptions: SitecoreNextjsClientInit) {
    super(initOptions);
    this.componentPropsService = new ComponentPropsService();
    this.sitemapService = new GraphQLSitemapService({
      clientFactory: this.clientFactory,
      sites: this.siteResolver.sites,
    });
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
    routeOptions?: RouteOptions,
    options?: FetchOptions
  ): Promise<NextjsPage | null> {
    const site = routeOptions?.site || this.resolveSiteFromPath(path).name;
    const resolvedPath = this.parsePath(path);
    const page = await super.getPage(resolvedPath, { locale: routeOptions?.locale, site }, options);
    if (page) {
      // Get variant(s) for personalization (from path), must ensure path is of type strin
      const personalizeData = getPersonalizedRewriteData(super.parsePath(path));

      // Modify layoutData to use specific variant(s) instead of default
      // This will also set the variantId on the Sitecore context so that it is accessible here
      personalizeLayout(
        page.layout,
        personalizeData.variantId,
        personalizeData.componentVariantIds
      );
    }
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
   * @returns {ComponentPropsCollection} component props
   */
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
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticPath[]>} A promise that resolves to an array of static paths.
   */
  async getPagePaths(languages?: string[], fetchOptions?: FetchOptions): Promise<StaticPath[]> {
    return await this.sitemapService.fetchSitemap(languages || [], fetchOptions);
  }
}
