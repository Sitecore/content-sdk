/**
 * Html <link> tag data model
 * @public
 */
export type HTMLLink = {
  [key: string]: unknown;
} & Pick<HTMLLinkElement, 'rel' | 'href'>;

/**
 * Object model of a sitemap's site page item.
 * @public
 */
export type StaticPath = {
  params: {
    path: string[];
  };
  locale?: string;
};

/**
 * Data needed to paginate results in graphql
 * @public
 */
export interface PageInfo {
  /**
   * string token that can be used to fetch the next page of results
   */
  endCursor: string;
  /**
   * a value that indicates whether more pages of results are available
   */
  hasNext: boolean;
}