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
