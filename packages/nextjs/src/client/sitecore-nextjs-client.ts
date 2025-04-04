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
  NextjsJssComponent,
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

export type NextjsPage = Page & {
  componentProps?: ComponentPropsCollection;
  notFound?: boolean;
};

export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  constructor(protected initOptions: SitecoreClientInit) {
    super(initOptions);
    this.componentPropsService = this.getComponentPropsService();
  }

  /**
   * Resolves site based on the provided path
   * @param {string | string[]} path path to resolve site from
   * @returns resolved site, or default site info if not found
   */
  resolveSiteFromPath(path: string | string[]) {
    const resolvedPath = super.parsePath(path);
    // Get site name (from path rewritten in middleware)
    const siteData = getSiteRewriteData(resolvedPath, this.initOptions.defaultSite);

    // Resolve site by name
    return (
      this.siteResolver.getByName(siteData.siteName) || {
        name: siteData.siteName,
        hostName: '',
        language: '',
      }
    );
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
    const site = pageOptions.site || this.resolveSiteFromPath(path)?.name;
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
   * Parses components from nextjs component map and layoutData, executes getServerProps/getStaticProps methods
   * and returns resulting props from components
   * @param {LayoutServiceData} layoutData layout data to parse compnents from
   * @param {PreviewData} context Nextjs preview data
   * @param {ComponentMap<NextjsJssComponent>} components component map to get props for
   * @returns {ComponentPropsCollection} component props
   */
  async getComponentData(
    layoutData: LayoutServiceData,
    context: GetServerSidePropsContext | GetStaticPropsContext,
    components: ComponentMap<NextjsJssComponent>
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
