import type { Cookie } from './cookies/interfaces';

/**
 * A reusable type that accepts only basic types and arrays of those
 */
export type BasicTypes =
  | string
  | boolean
  | number
  | undefined
  | Array<string | boolean | number | { [key: string]: BasicTypes } | Array<BasicTypes>>;

/**
 * Interface for supporting request IncomingMessage http node type
 */
export interface HttpRequest {
  headers: {
    cookie?: string;
    'content-language'?: string;
    referer?: string;
    'user-agent'?: string;
  };
  url?: string;
}

/**
 * Interface for supporting response OutgoingMessage http node type
 */
export interface HttpResponse {
  setHeader(name: string, value: number | string | ReadonlyArray<string>): void;
}

export type Request = HttpRequest | MiddlewareRequest;

/**
 * Interface for supporting request from Edge Next.js
 * includes types compatible with both NextJS versions 12 & 13
 */
export interface MiddlewareRequest {
  cookies: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    set:
      | ((key: string, value: string, options: any) => any)
      | ((...args: [key: string, value: string] | [options: Cookie]) => any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    get: (key: string) => Cookie | string | undefined;
  };
  headers: {
    get: (name: string) => string | null;
  };
  url?: string;
  geo?: {
    city?: string;
    country?: string;
    region?: string;
  };
}

/**
 * Interface for Edge Next.js Response
 * includes types compatible with both NextJS versions 12 & 13
 */
export interface MiddlewareNextResponse {
  cookies: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    set:
      | ((key: string, value: unknown, options?: any) => any)
      | ((...args: [key: string, value: string] | [options: Cookie]) => any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  };
}

export type Response = HttpResponse | MiddlewareNextResponse;
