import { FetchOptions, GraphQLClient } from '../client';
import { siteNameError } from '../constants';
import debug from '../debug';
import { LayoutServiceData } from '../layout';
import { GraphQLRequestClientFactory } from '../graphql-request-client';
import { GraphQLServiceConfig } from '../sitecore-service-base';

// The default query for request error handling
const defaultQuery = /* GraphQL */ `
  query ErrorPagesQuery($siteName: String!, $language: String!) {
    site {
      siteInfo(site: $siteName) {
        errorHandling(language: $language) {
          notFoundPage {
            rendered
          }
          notFoundPagePath
          serverErrorPage {
            rendered
          }
          serverErrorPagePath
        }
      }
    }
  }
`;

export interface GraphQLErrorPagesServiceConfig extends GraphQLServiceConfig {
  /**
   * The language
   */
  language: string;
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
}

/**
 * Object model of Error Pages result
 */
export type ErrorPages = {
  notFoundPage: { rendered: LayoutServiceData };
  notFoundPagePath: string;
  serverErrorPage: { rendered: LayoutServiceData };
  serverErrorPagePath: string;
};

/**
 * The schema of data returned in response to error pages link request
 */
type ErrorPagesQueryResult = {
  site: { siteInfo: { errorHandling: ErrorPages } };
};

/**
 * Service that fetch the error pages data using Sitecore's GraphQL API.
 */
export class GraphQLErrorPagesService {
  private graphQLClient: GraphQLClient;

  /**
   * Creates an instance of graphQL error pages service with the provided options
   * @param {GraphQLErrorPagesServiceConfig} options instance
   */
  constructor(public options: GraphQLErrorPagesServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  protected get query(): string {
    return defaultQuery;
  }

  /**
   * Fetch list of error pages for the site
   * @param {string} siteName  The site name
   * @param {string} locale  The language
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {ErrorPages} list of url's error pages
   * @throws {Error} if the siteName is empty.
   */
  async fetchErrorPages(
    siteName: string,
    locale?: string,
    fetchOptions?: FetchOptions
  ): Promise<ErrorPages | null> {
    const language: string = locale || this.options.language;

    if (!siteName) {
      throw new Error(siteNameError);
    }

    return (<Promise<ErrorPagesQueryResult>>this.graphQLClient.request(
      this.query,
      {
        siteName,
        language,
      },
      fetchOptions
    ))
      .then((result: ErrorPagesQueryResult) =>
        result.site.siteInfo ? result.site.siteInfo.errorHandling : null
      )
      .catch((e) => Promise.reject(e));
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLClient {
    if (!this.options.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }

    return this.options.clientFactory({
      debugger: debug.errorpages,
      retries: this.options.retries?.count,
      retryStrategy: this.options.retries?.retryStrategy,
    });
  }
}
