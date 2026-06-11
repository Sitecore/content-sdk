import { InjectionToken } from '@angular/core';
import { ComponentRendering, RouteData } from '@sitecore-content-sdk/content/layout';

/**
 * Context passed to {@link PlaceholderGuardResolver} and {@link PlaceholderDataResolver}.
 * @public
 */
export interface PlaceholderResolverContext {
  /** Placeholder key being rendered (e.g. `headless-main`). */
  name: string;
  /** Parent route or rendering node that owns the placeholder map. */
  rendering: ComponentRendering | RouteData;
}

/**
 * Synchronous filter applied after layout renderings are fetched and before components
 * are instantiated. Return the renderings that should mount — omit entries to block them.
 * @public
 */
export type PlaceholderGuardResolver = (
  renderings: ComponentRendering[],
  context: PlaceholderResolverContext
) => ComponentRendering[];

/**
 * Synchronous enrichment pass applied after the guard and before instantiation.
 * Use to decorate `fields` / `params` on renderings (e.g. personalization metadata).
 * Must remain synchronous; fetch async data in a loader and feed results here.
 * @public
 */
export type PlaceholderDataResolver = (
  renderings: ComponentRendering[],
  context: PlaceholderResolverContext
) => ComponentRendering[];

const defaultGuardResolver: PlaceholderGuardResolver = (renderings) => renderings;

const defaultDataResolver: PlaceholderDataResolver = (renderings) => renderings;

/**
 * Optional hook to filter placeholder renderings before {@link ScPlaceholderComponent}
 * instantiates child components. Defaults to an identity pass-through.
 * @public
 */
export const PLACEHOLDER_GUARD_RESOLVER = new InjectionToken<PlaceholderGuardResolver>(
  'PLACEHOLDER_GUARD_RESOLVER',
  { providedIn: 'root', factory: () => defaultGuardResolver }
);

/**
 * Optional hook to decorate placeholder renderings after the guard pass. Defaults to
 * an identity pass-through.
 * @public
 */
export const PLACEHOLDER_DATA_RESOLVER = new InjectionToken<PlaceholderDataResolver>(
  'PLACEHOLDER_DATA_RESOLVER',
  { providedIn: 'root', factory: () => defaultDataResolver }
);
