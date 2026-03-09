import { LoaderFn } from '../loaders/models';

/**
 * Minimal Express Request interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressRequest {
  method: string;
  path: string;
  url: string;
  body: unknown;
  query: Record<string, string | string[] | undefined>;
  /**
   * Cookies from the request (requires cookie-parser middleware)
   */
  cookies?: Record<string, string>;
  /**
   * Headers from the request
   */
  headers?: Record<string, string | string[] | undefined>;
}

/**
 * Minimal Express Response interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(data: unknown): void;
}

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

/**
 * Express next function type
 * @public
 */
export type ExpressNextFunction = (error?: unknown) => void;

/**
 * Express-compatible middleware type
 * @public
 */
export type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => void | Promise<void>;

/**
 * Loader registry type - maps loader IDs to loader functions
 * @public
 */
export type LoaderRegistry = Record<string, LoaderFn>;

/**
 * Options for the Express data handler
 * @public
 */
export interface ExpressDataHandlerOptions extends DataHandlerConfig {
  /**
   * The loader registry containing all registered loaders
   */
  loaders: LoaderRegistry;
}
