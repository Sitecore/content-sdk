import { GraphQLRequestClientFactory, constants } from '@sitecore-content-sdk/core';
import { FetchOptions, GraphQLClient } from '../client';
import debug from '../debug';

const { ERROR_MESSAGES } = constants;

// The default query for requesting llms.txt content
const defaultQuery = /* GraphQL */ `
  query LlmsTxtQuery($siteName: String!) {
    site {
      siteInfo(site: $siteName) {
        llmsTxt
      }
    }
  }
`;

/**
 * Content-Type header value to use when serving llms.txt (Markdown per https://llmstxt.org).
 * @public
 */
export const LLMS_TXT_CONTENT_TYPE = 'text/markdown; charset=utf-8';

/**
 * Default llms.txt content to serve when no content is configured for the resolved site.
 * Shaped as minimal valid llms.txt Markdown (H1 + blockquote) per https://llmstxt.org.
 * @public
 */
export const DEFAULT_LLMS_TXT = '# llms.txt\n\n> No llms.txt content configured for this site.';

/**
 * Configuration for @see LlmsTxtService instances
 * @public
 */
export type LlmsTxtServiceConfig = {
  /**
   * The Content SDK application name
   */
  siteName: string;
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
};

/**
 * The schema of data returned in response to llms.txt request
 * @public
 */
export type LlmsTxtQueryResult = { site: { siteInfo: { llmsTxt: string } } };

/**
 * Service that fetches the llms.txt content managed via Sitecore AI, using Sitecore's GraphQL API.
 * @public
 */
export class LlmsTxtService {
  private graphQLClient: GraphQLClient;

  /**
   * Creates an instance of graphQL llms.txt service with the provided options
   * @param {LlmsTxtServiceConfig} options instance
   */
  constructor(public options: LlmsTxtServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
  }

  protected get query(): string {
    return defaultQuery;
  }

  /**
   * Fetch a data of llms.txt from API
   * @param {FetchOptions} fetchOptions - The fetch options to be used for the request.
   * @returns text of llms.txt
   * @throws {Error} if the siteName is empty.
   */
  async fetchLlmsTxt(fetchOptions?: FetchOptions): Promise<string> {
    const siteName: string = this.options.siteName;

    if (!siteName) {
      throw new Error(ERROR_MESSAGES.MV_002);
    }

    const llmsTxtResult: Promise<LlmsTxtQueryResult> = this.graphQLClient.request(
      this.query,
      {
        siteName,
      },
      fetchOptions
    );
    try {
      return llmsTxtResult.then((result: LlmsTxtQueryResult) => {
        return result?.site?.siteInfo?.llmsTxt;
      });
    } catch (e) {
      return Promise.reject(e);
    }
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
      debugger: debug.llmsTxt,
    });
  }
}
