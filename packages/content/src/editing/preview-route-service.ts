import { FetchOptions } from '@sitecore-content-sdk/core';
import { GraphQLServiceConfig, SitecoreServiceBase } from '../sitecore-service-base';
import { LayoutServicePageState } from '../layout';
import debug from '../debug';
import { LayoutKind } from './models';
import { buildPreviewHeaders } from './preview-headers';

/**
 * GraphQL query used to resolve the item id of a route while in preview.
 * The editing query is item based, so navigating to another route in an active preview
 * session requires the item id of the destination route.
 * @internal
 */
export const previewRouteQuery = /* GraphQL */ `
  query PreviewRouteQuery($site: String!, $routePath: String!, $language: String!) {
    layout(site: $site, routePath: $routePath, language: $language) {
      item {
        id
      }
    }
  }
`;

/**
 * Response from the preview route GraphQL query.
 * @internal
 */
export type PreviewRouteQueryResponse = {
  layout: { item: { id: string } | null } | null;
};

/**
 * Options for resolving the item id of a route in preview.
 * @public
 */
export type PreviewRouteOptions = {
  /**
   * Site the route belongs to.
   */
  site: string;
  /**
   * Route path to resolve the item id for.
   */
  routePath: string;
  /**
   * Language to resolve the route in.
   */
  language: string;
  /**
   * Page mode the route is being resolved for.
   */
  mode: Exclude<LayoutServicePageState, 'Normal'>;
  /**
   * The final or shared layout variant.
   */
  layoutKind?: LayoutKind;
  /**
   * Preview time for time based preview.
   */
  previewTime?: string;
};

/**
 * Service that resolves the item id of a route while a preview session is active.
 *
 * The preview / editing pipeline queries Experience Edge by item id, but client side
 * navigation only knows the route path. This service bridges the two. The preview headers
 * are forwarded so that routes which only exist in an unpublished state still resolve.
 * @public
 */
export class PreviewRouteService extends SitecoreServiceBase {
  /**
   * @param {GraphQLServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: GraphQLServiceConfig) {
    super(serviceConfig);
  }

  /**
   * Resolves the item id for a route path.
   * @param {PreviewRouteOptions} options route and preview details to resolve the item for
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise<string | null>} the item id, or null when the route cannot be resolved
   */
  async resolveItemId(
    { site, routePath, language, mode, layoutKind, previewTime }: PreviewRouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<string | null> {
    if (!language) {
      throw new RangeError('The language must be a non-empty string');
    }

    debug.editing('resolving preview item id for %s %s %s', site, routePath, language);

    const data = await this.graphQLClient.request<PreviewRouteQueryResponse>(
      previewRouteQuery,
      {
        site,
        routePath,
        language,
      },
      {
        ...fetchOptions,
        headers: {
          ...fetchOptions?.headers,
          // The variant is route scoped, so it is deliberately left at the default here.
          ...buildPreviewHeaders({ mode, layoutKind, site, previewTime }),
        },
      }
    );

    const itemId = data?.layout?.item?.id || null;

    if (!itemId) {
      debug.editing('preview item id not found for %s %s %s', site, routePath, language);
    }

    return itemId;
  }
}
