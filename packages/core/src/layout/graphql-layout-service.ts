import { LayoutServiceData } from './models';
import debug from '../debug';
import { SitecoreConfigInput } from '../config';
import { GraphQLServiceConfig } from '../sitecore-service-base';
import { LayoutServiceBase } from './layout-service';
import { RouteOptions } from '../client';
import { FetchOptions } from '../models';

export const GRAPHQL_LAYOUT_QUERY_NAME = 'JssLayoutQuery';

export type GraphQLLayoutServiceConfig = GraphQLServiceConfig &
  Partial<SitecoreConfigInput['layout']>;
/**
 * Service that fetch layout data using Sitecore's GraphQL API.
 * @augments LayoutServiceBase
 * @mixes GraphQLRequestClient
 */
export class GraphQLLayoutService extends LayoutServiceBase {
  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {GraphQLLayoutServiceConfig} serviceConfig configuration
   */
  constructor(public serviceConfig: GraphQLLayoutServiceConfig) {
    super(serviceConfig);
  }

  /**
   * Fetch layout data for an item.
   * @param {string} itemPath item path to fetch layout data for.
   * @param {string} [language] the language to fetch layout data for.
   * @param {string} [site] site name to fetch data for.
   * @returns {Promise<LayoutServiceData>} layout service data
   */
  async fetchLayoutData(
    itemPath: string,
    routeOptions?: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<LayoutServiceData> {
    const site = routeOptions?.site || this.serviceConfig.defaultSite;
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
