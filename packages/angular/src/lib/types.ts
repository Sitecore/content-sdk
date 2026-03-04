import { Type } from '@angular/core';
import type { Params } from '@angular/router';

/**
 * Angular component type used as a Sitecore rendering implementation.
 * The component should declare a `rendering` input of type `ComponentRendering`.
 * @public
 */
export type AngularContentSdkComponent = Type<unknown>;

/**
 * Map of Sitecore component names to their Angular component implementations.
 * @public
 */
export type ComponentMap = Map<string, AngularContentSdkComponent>;

/**
 * Context provided to loader functions.
 * Contains information about the current request including URL, params, and query.
 * @public
 */
export interface LoaderContext {
  /** The current URL path */
  url: string;
  /** Route parameters from matched segments */
  params: Params;
  /** Query string parameters */
  query: Record<string, string | string[]>;
}

/**
 * Loader function type.
 * A loader is an async function that receives context and returns data (e.g. page data from Sitecore).
 * Throw {@link LoaderNotFound} for 404, {@link LoaderRedirect} for redirects, {@link LoaderHttpError} for server errors.
 * @public
 */
export type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T>;
