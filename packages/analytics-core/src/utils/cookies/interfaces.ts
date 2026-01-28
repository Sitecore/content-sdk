/**
 * Cookie properties
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
 */
export interface Cookie {
  name: string;
  value: string;
}
