/**
 * The response object that Sitecore Edge Proxy returns.
 * @public
 */
export interface EPResponse {
  ref: string;
  status: string;
  version: string;
  client_key: string;
  customer_ref: string;
}

/**
 * The visitor IDs returned from the Edge Proxy.
 * @public
 */
export interface VisitorIds {
  /**
   * The client ID associated with the visitor.
   */
  clientId: string;
  /**
   * The profile ID associated with the visitor.
   */
  profileId: string;
}

/**
 * Interface for supporting response `IncomingMessage` HTTP node type.
 * @internal
 */
export interface Infer {
  language: () => string | undefined;
  pageName: () => string;
}

/**
 * Interface for supporting the debug object.
 * @internal
 */
export interface DebugResponse {
  headers?: {
    [key: string]: string | string[] | [string, string][] | Record<string, string> | Headers;
  };
  redirected?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
  body?: unknown;
}
