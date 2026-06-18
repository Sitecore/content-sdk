/**
 * Minimal Express Request interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressRequest {
  method: string;
  path: string;
  url: string;
  body: unknown;
  referrer?: string;
  query: Record<string, string | string[] | undefined>;
  /**
   * Cookies from the request (requires cookie-parser middleware)
   */
  cookies?: Record<string, string>;
  /**
   * Headers from the request
   */
  headers?: Record<string, string | string[] | undefined>;
  setHeader?: (name: string, value: string | string[] | undefined) => void;
}

/**
 * Minimal Express Response interface for type safety without requiring Express as a dependency
 * @public
 */
export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(data: unknown): void;
  /**
   * Send a raw response body (string, Buffer, null, etc.). Used for HTML
   * responses (editing render endpoint) and 204 no-content replies.
   */
  send?(body: unknown): void;
  /**
   * Set a response header. Used by editing middleware to apply CORS / CSP
   * headers without depending on Express types directly.
   */
  setHeader?(name: string, value: string | string[]): void;
  /**
   * Set a response cookie. Used by multisite middleware to set the site cookie.
   */
  cookie?(name: string, value: string, options?: CookieOptions): void;
}
export interface CookieOptions {
  /** Expiry relative to now, in milliseconds */
  maxAge?: number;
  /** Sign the cookie (needs cookie-parser with a secret) */
  signed?: boolean;
  /** GMT expiry date; omit for session cookie */
  expires?: Date;
  httpOnly?: boolean;
  path?: string; // default "/"
  domain?: string;
  secure?: boolean;
  encode?: (val: string) => string;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  priority?: 'low' | 'medium' | 'high';
  partitioned?: boolean;
}
