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
    const language = routeOptions?.locale;
    const query = this.getLayoutQuery(itemPath, site, language);
    debug.layout('fetching layout data for %s %s %s', itemPath, language, site);
    const data = await this.graphQLClient.request<{
      layout: { item: { rendered: LayoutServiceData } };
    }>(query, this.getLayoutQueryVariables(itemPath, site, language), fetchOptions);

    // If `rendered` is empty -> not found
    const layoutData =
      data?.layout?.item?.rendered || {
        sitecore: { context: { pageEditing: false, language: routeOptions?.locale }, route: null },
      };

    return layoutData;
  }

  /**
   * Returns GraphQL Layout query.
   * The default query takes `site`, `routePath` and `language` as GraphQL variables
   * (see `getLayoutQueryVariables`), so request values never become part of the query text.
   * When `formatLayoutQuery` is set, it gets the values escaped for use inside a
   * double-quoted GraphQL string literal.
   * @param {string} itemPath page route
   * @param {string} [site] site name
   * @param {string} [language] language
   * @returns {string} GraphQL query
   */
  protected getLayoutQuery(itemPath: string, site: string, language?: string) {
    if (this.serviceConfig.formatLayoutQuery) {
      const layoutQuery = this.serviceConfig.formatLayoutQuery(
        escapeGraphQLString(site),
        escapeGraphQLString(itemPath),
        language === undefined ? undefined : escapeGraphQLString(language)
      );

      return `query ${GRAPHQL_LAYOUT_QUERY_NAME} {
      ${layoutQuery}{
        item {
          rendered
        }
      }
    }`;
    }

    const languageDefinition = language ? `, $language: String!` : '';
    const languageArgument = language ? `, language: $language` : '';

    return `query ${GRAPHQL_LAYOUT_QUERY_NAME}($site: String!, $routePath: String!${languageDefinition}) {
      layout(site: $site, routePath: $routePath${languageArgument}){
        item {
          rendered
        }
      }
    }`;
  }

  /**
   * Returns the variables for the GraphQL Layout query
   * @param {string} itemPath page route
   * @param {string} site site name
   * @param {string} [language] language
   * @returns {Record<string, string>} GraphQL query variables
   */
  protected getLayoutQueryVariables(
    itemPath: string,
    site: string,
    language?: string
  ): Record<string, string> {
    // A custom `formatLayoutQuery` declares no variables
    if (this.serviceConfig.formatLayoutQuery) return {};

    return {
      site,
      routePath: itemPath,
      ...(language ? { language } : {}),
    };
  }
}

/**
 * Escapes a value for use inside a double-quoted GraphQL string literal.
 * GraphQL string escapes (`\"`, `\\`, `\n`, `\uXXXX`, ...) match JSON's, so JSON.stringify does the work.
 * @param {string} value value to escape
 * @returns {string} escaped value, without the surrounding quotes
 */
const escapeGraphQLString = (value: string) => JSON.stringify(String(value)).slice(1, -1);