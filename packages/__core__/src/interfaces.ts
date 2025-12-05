/**
 * The response object that Sitecore EP returns.
 */
export interface EPResponse {
  ref: string;
  status: string;
  version: string;
  client_key: string;
  customer_ref: string;
}

export interface ProxySettings {
  browserId: string;
  guestId: string;
}

/**
 * Interface for supporting response `IncomingMessage` HTTP node type.
 */
export interface Infer {
  language: () => string | undefined;
  pageName: () => string;
}

/**
 * Interface for supporting the debug object.
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
