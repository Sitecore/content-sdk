/**
 * Default path for the data endpoint used by loaders.
 * This path is used by both the client-side loader resolver and server-side handlers.
 * @public
 */
export const DEFAULT_DATA_ENDPOINT = '/_data';

/**
 * Configuration for server-side data handlers
 * @public
 */
export interface DataHandlerConfig {
  /**
   * The endpoint path for the data handler.
   * @default '/_data'
   */
  endpoint?: string;
}
