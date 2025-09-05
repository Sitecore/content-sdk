import {
  FetchOptions,
  Page,
  PageOptions,
  SitecoreClient,
  SitecoreClientInit,
} from '@sitecore-content-sdk/core/client';
import {
  ComponentPropsCollection,
  ComponentPropsError,
  NextjsContentSdkComponent,
} from '../sharedTypes/component-props';
import { GetServerSidePropsContext, GetStaticPropsContext, PreviewData } from 'next';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { ComponentPropsService } from '../services/component-props-service';
import { EditingPreviewData } from '@sitecore-content-sdk/core/editing';
import { getSiteRewriteData, normalizeSiteRewrite } from '@sitecore-content-sdk/core/site';
import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/core/personalize';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { StaticParams } from '../models';

export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  constructor(protected initOptions: SitecoreClientInit) {
    super(initOptions);
    this.componentPropsService = this.getComponentPropsService();
  }

  /**
   * Gets site name based on the provided path
   * @param {string | string[]} path path to get site name from
   * @returns site name, or default site info if not found
   */
  getSiteNameFromPath(path: string | string[]) {
    const resolvedPath = super.parsePath(path);
    // Get site name (from path rewritten in middleware)
    const siteData = getSiteRewriteData(resolvedPath, this.initOptions.defaultSite);

    return siteData.siteName;
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
  ): Promise<Page | null> {
    const resolvedPath = this.parsePath(path);
    // Get variant(s) for personalization (from path), must ensure path is of type string
    const personalizeData =
      pageOptions.personalize || getPersonalizedRewriteData(super.parsePath(path));
    const site = pageOptions.site || this.getSiteNameFromPath(path);
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
  async getPreview(previewData: PreviewData, fetchOptions?: FetchOptions): Promise<Page | null> {
    return super.getPreview(previewData as EditingPreviewData, fetchOptions);
  }

  /**
   * Retrieves the static params for pages based on the given languages and sites.
   * @param {string[]} sites - An array of site names to fetch routes for.
   * @param {string[]} [languages] - An optional array of language codes to generate paths for.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticParams[]>} A promise that resolves to an array of static params for app router.
   */
  async getAppRouterStaticParams(
    sites: string[],
    languages?: string[],
    fetchOptions?: FetchOptions
  ): Promise<StaticParams[]> {
    const staticPaths = await this.sitePathService.fetchSiteRoutes(
      sites,
      languages || [],
      fetchOptions
    );

    const params = new Array<StaticParams>();

    staticPaths.map((path) => {
      // remove _site_ segments
      const normalizedPath = normalizeSiteRewrite(path.params.path.join('/')).split('/');

      params.push({
        locale: path.locale ?? this.initOptions.defaultLanguage,
        site: this.getSiteNameFromPath(path.params.path),
        path: normalizedPath,
      });
    });

    return params;
  }

  /**
   * Parses components from nextjs component map and layoutData, executes getServerProps/getStaticProps methods
   * and returns resulting props from components
   * @param {LayoutServiceData} layoutData layout data to parse compnents from
   * @param {PreviewData} context Nextjs preview data
   * @param {ComponentMap<NextjsContentSdkComponent>} components component map to get props for
   * @returns {ComponentPropsCollection} component props
   */
  async getComponentData(
    layoutData: LayoutServiceData,
    context: GetServerSidePropsContext | GetStaticPropsContext,
    components: ComponentMap<NextjsContentSdkComponent>
  ): Promise<ComponentPropsCollection> {
    let componentProps: ComponentPropsCollection = {};
    if (!layoutData.sitecore.route) return componentProps;
    // Retrieve component props using side-effects defined on components level
    componentProps = await this.componentPropsService.fetchComponentProps({
      layoutData: layoutData,
      context,
      components,
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

  protected getComponentPropsService(): ComponentPropsService {
    return new ComponentPropsService();
  }
}
