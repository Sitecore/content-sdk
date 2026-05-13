/**
 * Cookie properties
 * @internal
 */
export interface CookieProperties {
  maxAge: number;
  sameSite: string;
  secure: boolean;
  path?: string;
  httpOnly?: boolean;
  expires?: Date;
  domain?: string;
}

/**
 * Cookie attributes
 * @internal
 */
export interface CookieAttributes {
  maxAge?: number;
  sameSite?: string;
  secure?: boolean;
  path?: string;
  httpOnly?: boolean;
  expires?: Date;
  domain?: string;
}

/**
 * Interface that represents a cookie (name, value)
 * @internal
 */
export interface Cookie {
  name: string;
  value: string;
}
