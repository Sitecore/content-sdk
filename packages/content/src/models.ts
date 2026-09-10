/**
 * Html <link> tag data model
 * @public
 */
export type HTMLLink = {
  [key: string]: unknown;
} & Pick<HTMLLinkElement, 'rel' | 'href'>;

/**
 * Html <script> tag data model
 * @public
 */
export type HTMLScript = {
  [key: string]: unknown;
} & Pick<HTMLScriptElement, 'type'> & {
  /** Serialized script body, safe to assign directly (e.g. via `dangerouslySetInnerHTML`). */
  innerHTML: string;
};

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
