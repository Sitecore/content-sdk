import {
  createGraphQLClientFactory,
  FetchOptions,
  Page,
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

export type SitecoreNexjtsClientInit = SitecoreClientInit & {
  moduleFactory: ModuleFactory;
};

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
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

  async getPage(path: string, locale?: string, options?: FetchOptions): Promise<NextjsPage> {
    return super.getPage(path, locale, options);
  }

  async getPreview(previewData: PreviewData, options?: FetchOptions): Promise<NextjsPage> {
    return super.getPreview(previewData as EditingPreviewData, options);
  }

  // TODO: consider making generic and moving to core
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
