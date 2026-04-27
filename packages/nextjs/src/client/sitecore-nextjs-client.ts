import { StaticPath } from '@sitecore-content-sdk/core';
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
import {
  DesignLibraryRenderPreviewData,
  EditingPreviewData,
} from '@sitecore-content-sdk/core/editing';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { getSiteRewriteData, normalizeSiteRewrite } from '@sitecore-content-sdk/core/site';
import {
  getPersonalizedRewriteData,
  normalizePersonalizedRewrite,
} from '@sitecore-content-sdk/core/personalize';
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
   * **NOTE**: App Router only.
   *
   * Builds the inputs for the Preview mode based on incoming request headers.
   *
   * - Reads editing preview data from the `x-sitecore-editing-params` header.
   * - Reads the `authorization` header from the request and merges it as
   *   `Authorization` into `fetchOptions.headers`. The request value takes
   *   precedence over any `Authorization` (case-insensitive) supplied via
   *   `extra.headers`; existing case-variant keys are removed so the result
   *   never contains duplicates. An empty `Authorization` is never emitted.
   *
   * Other headers present on the input are ignored. Non-`headers` fields of
   * `extra` are preserved as-is. Extra headers are merged into `fetchOptions.headers`.
   * @param {Headers} headers - The headers from the incoming request.
   * @param {FetchOptions} [extra] - Optional base fetch options to merge with.
   * @returns The `previewData` and `fetchOptions` to forward
   */
  getPreviewInputs(
    headers: Headers,
    extra?: FetchOptions
  ): { previewData: PreviewData; fetchOptions: FetchOptions } {
    const previewData = this.parsePreviewDataFromHeader(headers);
    const fetchOptions = this.mergeAuthorizationHeader(headers, extra);

    return { previewData, fetchOptions };
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
   * **NOTE**: Pages Router only.
   *
   * Merges the authorization header from the preview data into the fetch options.
   * The `authorization` field is always stripped from the returned preview data
   * to avoid leaking it back into request payloads.
   *
   * The value stashed in preview data takes precedence over any caller-supplied
   * `Authorization` header. Existing `Authorization` keys are removed
   * case-insensitively before the merged value is set, so the result never
   * contains duplicate keys.
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
      return { previewData: rest as T, fetchOptions };
    }

    const mergedHeaders = this.applyAuthorizationHeader(fetchOptions?.headers, authorization);

    return { previewData: rest as T, fetchOptions: { ...fetchOptions, headers: mergedHeaders } };
  }

  /**
   * Reads and JSON-parses the editing preview data propagated via
   * `EDITING_PARAMS_HEADER`. Returns an empty object when the header is
   * missing or its value is not valid JSON.
   * @param {Headers} headers - The incoming request headers.
   * @returns {PreviewData} The parsed preview data, or an empty object.
   */
  private parsePreviewDataFromHeader(headers: Headers): PreviewData {
    const packed = headers.get(EDITING_PARAMS_HEADER);
    if (!packed) return {} as PreviewData;
    try {
      return JSON.parse(packed) as PreviewData;
    } catch {
      return {} as PreviewData;
    }
  }

  /**
   * Builds `FetchOptions` by merging the `Authorization` header from the
   * incoming request headers into `extra`. The request value takes precedence
   * over any caller-supplied `Authorization` header (case-insensitive). An
   * empty `Authorization` is never emitted.
   * @param {Headers} headers - The incoming request headers.
   * @param {FetchOptions} [extra] - Optional base fetch options to merge with.
   * @returns {FetchOptions} The merged fetch options.
   */
  private mergeAuthorizationHeader(headers: Headers, extra?: FetchOptions): FetchOptions {
    const authorization = headers.get('authorization');
    const mergedHeaders = this.applyAuthorizationHeader(extra?.headers, authorization);

    return { ...extra, headers: mergedHeaders };
  }

  /**
   * Returns a shallow-cloned headers record with `Authorization` set to
   * `authorization` (when truthy). Any pre-existing `Authorization` key is
   * removed case-insensitively to avoid emitting both `authorization` and
   * `Authorization` in the same record.
   * @param {Record<string, string> | undefined} headers - Existing headers, if any.
   * @param {string | null | undefined} authorization - The authorization value to apply, or null/undefined to leave headers unchanged.
   * @returns {Record<string, string>} The merged headers.
   */
  private applyAuthorizationHeader(
    headers: Record<string, string> | undefined,
    authorization: string | null | undefined
  ): Record<string, string> {
    const merged: Record<string, string> = { ...((headers ?? {}) as Record<string, string>) };
    if (!authorization) return merged;

    for (const key of Object.keys(merged)) {
      if (key.toLowerCase() === 'authorization') {
        delete merged[key];
      }
    }

    merged.Authorization = authorization;

    return merged;
  }
}
