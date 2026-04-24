import { StaticPath } from '@sitecore-content-sdk/content';
import {
  FetchOptions,
  Page,
  PageOptions,
  SitecoreClient,
  SitecoreClientInit,
} from '@sitecore-content-sdk/content/client';
import {
  ComponentPropsCollection,
  ComponentPropsError,
  NextjsContentSdkComponent,
} from '../sharedTypes/component-props';
import { GetServerSidePropsContext, GetStaticPropsContext, PreviewData } from 'next';
import { LayoutServiceData } from '@sitecore-content-sdk/content/layout';
import { ComponentPropsService } from '../services/component-props-service';
import {
  DesignLibraryRenderPreviewData,
  EditingPreviewData,
} from '@sitecore-content-sdk/content/editing';
import { getSiteRewriteData, normalizeSiteRewrite } from '@sitecore-content-sdk/content/site';
import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/content/personalize';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { StaticParams } from './models';
import { SitecoreConfig } from '../config';

type PreviewDataWithAuth<T> = T & {
  /**
   * The authorization header value to use for the request.
   * Provided only in Pages Router Preview mode.
   */
  authorization?: string;
};

/**
 * Init options for Sitecore Client that allows you to override services too
 * @public
 */
export type SitecoreNextjsClientInit = SitecoreClientInit & Pick<SitecoreConfig, 'multisite'>;

/**
 * The SitecoreNextjsClient class extends the SitecoreClient class to provide additional functionality for Next.js.
 * @public
 */
export class SitecoreNextjsClient extends SitecoreClient {
  protected componentPropsService: ComponentPropsService;
  constructor(protected initOptions: SitecoreNextjsClientInit) {
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
    // Get site name (from path rewritten in proxy)
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
   * Get design library page details for Design Library mode of your app
   * @param {PreviewData} designLibData preview data set in 'library' mode of the app
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests
   * @returns {Page} preview page for Design Library
   */
  async getDesignLibraryData(
    designLibData: PreviewData,
    fetchOptions?: FetchOptions
  ): Promise<Page> {
    const merged = this.mergePreviewAuthorization<DesignLibraryRenderPreviewData>(
      designLibData,
      fetchOptions
    );

    return super.getDesignLibraryData(merged.previewData, merged.fetchOptions);
  }

  /**
   * Retrieves preview page and layout details
   * @param {PreviewData} previewData - The editing preview data for metadata mode.
   * @param {FetchOptions} [fetchOptions] Additional fetch fetch options to override GraphQL requests (like retries and fetch)
   */
  async getPreview(previewData: PreviewData, fetchOptions?: FetchOptions): Promise<Page | null> {
    const merged = this.mergePreviewAuthorization<EditingPreviewData>(previewData, fetchOptions);

    return super.getPreview(merged.previewData, merged.fetchOptions);
  }

  /**
   * Builds FetchOptions for preview calls by extracting
   * propagation-eligible headers from the incoming request.
   *
   * Currently, only the `authorization` header is forwarded to Sitecore.
   * All other headers present on the input are ignored.
   *
   * If `fetchOptions` is provided, its values are preserved.
   * Headers are merged with the caller-supplied headers.
   *
   * **NOTE**: App Router only.
   * @param {Headers} headers - The headers from the incoming request.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {FetchOptions} The FetchOptions for the preview call.
   */
  getPreviewFetchOptions(headers: Headers, fetchOptions?: FetchOptions): FetchOptions {
    const authorization = headers.get('authorization');
    const mergedHeaders: Record<string, string> = { ...(fetchOptions?.headers ?? {}) };

    if (authorization) {
      mergedHeaders.Authorization = authorization;
    }
  
    return {
      ...fetchOptions,
      headers: mergedHeaders,
    };
  }

  /**
   * Generates static params for the Next.js App Router from Sitecore routes.
   *
   * Fetches routes for the specified `sites` and `languages`, then converts them into
   * objects consumable by `generateStaticParams`. Internal multisite segments are removed.
   * The `site` name is resolved from the path. If a route lacks a locale, the
   * client's `defaultLanguage` is used.
   *
   * **NOTE**: App Router only. For the Pages Router, use `getPagePaths`.
   * @param {string[]} sites - An array of site names to fetch routes for.
   * @param {string[]} [languages] - Language codes to generate params for.
   * @param {FetchOptions} [fetchOptions] - Additional fetch options.
   * @returns {Promise<StaticParams[]>} Array of `{ site, locale, path }` entries for `generateStaticParams`.
   */
  async getAppRouterStaticParams(
    sites: string[],
    languages?: string[],
    fetchOptions?: FetchOptions
  ): Promise<StaticParams[]> {
    const staticPaths = await super.getPagePaths(sites, languages, fetchOptions);

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
    const staticPaths = await super.getPagePaths(sites, languages, fetchOptions);

    if (!this.initOptions.multisite?.enabled) {
      // remove _site_ segments when multisite is disabled
      staticPaths.map((path) => {
        path.params.path = normalizeSiteRewrite(path.params.path.join('/')).split('/');
      });
    }

    return staticPaths;
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

  /**
   * Merges the authorization header from the preview data into the fetch options.
   * **NOTE**: Pages Router only.
   * @param {PreviewData} previewData - The preview data to merge the authorization header from.
   * @param {FetchOptions} [fetchOptions] - The fetch options to merge the authorization header into.
   * @returns The preview data and fetch options with the authorization header merged.
   */
  private mergePreviewAuthorization<T extends object>(
    previewData: PreviewData,
    fetchOptions?: FetchOptions
  ): { previewData: T; fetchOptions?: FetchOptions } {
    if (!previewData || typeof previewData !== 'object') {
      return { previewData: previewData as unknown as T, fetchOptions };
    }

    const { authorization, ...rest } = previewData as PreviewDataWithAuth<T>;

    if (!authorization) {
      return { previewData: previewData as T, fetchOptions };
    }

    const existing = fetchOptions?.headers ?? {};
    const mergedHeaders = {
      ...existing,
      Authorization: authorization,
    };

    return { previewData: rest as T, fetchOptions: { ...fetchOptions, headers: mergedHeaders } };
  }
}
