import { FetchOptions } from '@sitecore-content-sdk/core';
import { GraphQLServiceConfig, SitecoreServiceBase } from '../sitecore-service-base';
import { LayoutServiceData, RouteOptions } from './models';
import debug from '../debug';
import { SitecoreConfigInput } from '../config';

/**
 * GraphQL layout query name
 * @internal
 */
export const GRAPHQL_LAYOUT_QUERY_NAME = 'ContentSdkLayoutQuery';

/**
 * Layout service configuration
 * @public
 */
export type LayoutServiceConfig = GraphQLServiceConfig & Partial<SitecoreConfigInput['layout']>;

/**
 * Service that fetch layout data using Sitecore's GraphQL API.
 * @augments LayoutServiceBase
 * @mixes GraphQLRequestClient
 * @public
 */
export class LayoutService extends SitecoreServiceBase {
  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {LayoutServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: LayoutServiceConfig) {
    super(serviceConfig);
  }

  /**
   * Fetch layout data for an item.
   * @param {string} itemPath item path to fetch layout data for.
   * @param {RouteOptions} [routeOptions] Request options like language and site to retrieve data for
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise<LayoutServiceData>} layout service data
   */
  async fetchLayoutData(
    itemPath: string,
    routeOptions: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<LayoutServiceData> {
    const site = routeOptions.site;
    const query = this.getLayoutQuery(itemPath, site, routeOptions?.locale);
    debug.layout('fetching layout data for %s %s %s', itemPath, routeOptions?.locale, site);
    const data = await this.graphQLClient.request<{
      layout: { item: { rendered: LayoutServiceData } };
    }>(query, {}, fetchOptions);

    // If `rendered` is empty -> not found
    return (
      data?.layout?.item?.rendered || {
        sitecore: { context: { pageEditing: false, language: routeOptions?.locale }, route: null },
      }
    );
  }

  /**
   * Returns GraphQL Layout query
   * @param {string} itemPath page route
   * @param {string} [site] site name
   * @param {string} [language] language
   * @returns {string} GraphQL query
   */
  protected getLayoutQuery(itemPath: string, site: string, language?: string) {
    const languageVariable = language ? `, language:"${language}"` : '';

    const layoutQuery = this.serviceConfig.formatLayoutQuery
      ? this.serviceConfig.formatLayoutQuery(site, itemPath, language)
      : `layout(site:"${site}", routePath:"${itemPath}"${languageVariable})`;

    return `query ${GRAPHQL_LAYOUT_QUERY_NAME} {
      ${layoutQuery}{
        item {
          rendered
        }
      }
    }`;
  }
}