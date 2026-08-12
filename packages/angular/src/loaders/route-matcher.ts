import {
  defaultUrlMatcher,
  PRIMARY_OUTLET,
  UrlSegmentGroup,
  type Params,
  type Route,
  type Routes,
  type UrlSegment,
} from '@angular/router';

/**
 * A single level of a matched route chain: the `Route` config entry that matched and the
 * params it contributed (path params + custom matcher `posParams`).
 * @internal
 */
export interface MatchedRouteSegment {
  route: Route;
  params: Params;
}

/**
 * True when `url` is an absolute or protocol-relative URL rather than an app-internal path:
 * it carries a scheme (`https:`, `mailto:`, `tel:`, `javascript:`, …) or starts with `//`
 * (protocol-relative). Such URLs point off-app or are handled directly by the browser, so
 * there is no in-app route to resolve loaders for.
 *
 * The `scRouterLink`/`scRichText` directives already skip these via `EXTERNAL_HREF_PREFIXES`
 * before calling {@link ClientPreLoaderDataService.prefetchForUrl}; this is the service-level
 * backstop for direct callers
 * @param {string} url - Candidate navigation URL (e.g. an anchor's `href`).
 * @returns {boolean} `true` for absolute/protocol-relative URLs, `false` for app-internal paths.
 * @internal
 */
export function isAbsoluteUrl(url: string): boolean {
  // `scheme:` (RFC 3986 scheme chars) or a leading `//` (protocol-relative).
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//');
}

/**
 * Matches a `Route` against the given segments the same way Angular's own recognizer does:
 * a custom `route.matcher` when present, otherwise `defaultUrlMatcher` (static segments,
 * `:param` segments, `**`). Routes we cannot safely evaluate without side effects
 * (`redirectTo`, `canMatch`, named outlets) are treated as non-matching.
 * @param {Route} route - Candidate route config entry.
 * @param {UrlSegment[]} segments - Remaining URL segments to match against this route.
 * @returns {{ consumed: UrlSegment[]; posParams: Params } | null} Match result, or `null` when the route does not match.
 */
function matchRoute(
  route: Route,
  segments: UrlSegment[]
): { consumed: UrlSegment[]; posParams: Params } | null {
  if (route.redirectTo !== undefined || route.canMatch?.length) {
    return null;
  }
  if (route.outlet && route.outlet !== PRIMARY_OUTLET) {
    return null;
  }
  // defaultUrlMatcher requires a string `path`; a route with neither `matcher` nor `path`
  // is not a valid config we can evaluate here (Angular's own config validation would
  // normally have already rejected it at bootstrap).
  if (!route.matcher && route.path === undefined) {
    return null;
  }

  const matcher = route.matcher ?? defaultUrlMatcher;
  const segmentGroup = new UrlSegmentGroup(segments, {});
  const result = matcher(segments, segmentGroup, route);
  if (!result) {
    return null;
  }
  if (route.pathMatch === 'full' && result.consumed.length !== segments.length) {
    return null;
  }

  const posParams: Params = {};
  for (const [key, segment] of Object.entries(result.posParams ?? {})) {
    posParams[key] = segment.path;
  }
  // Matches Angular's own `parameters` computation: matrix params from only the *last*
  // consumed segment are merged in, not every consumed segment.
  const lastConsumed = result.consumed[result.consumed.length - 1];
  const params: Params =
    result.consumed.length > 0 ? { ...posParams, ...lastConsumed.parameters } : posParams;

  return { consumed: result.consumed, posParams: params };
}

/**
 * Recursively matches `routes` against `segments`, first-match-wins in declaration order —
 * mirroring Angular Router's own matching semantics using only public Router primitives
 * (`defaultUrlMatcher`, custom `route.matcher`s). Used to determine, from a raw href, which
 * loader-bearing routes apply without triggering an actual navigation.
 *
 * Known v1 limitations (routes are skipped rather than matched incorrectly):
 * - `redirectTo` routes are not followed.
 * - `canMatch`-gated routes are skipped without invoking the guard (prefetching data behind
 *   an unevaluated auth check would be unsafe).
 * - Named/auxiliary outlets are not supported.
 * - Routes with `loadChildren` and no static `children` are treated as a matching boundary;
 *   matching stops there rather than dynamically importing the lazy module.
 * @param {Routes} routes - Route config to match against (e.g. `Router.config`).
 * @param {UrlSegment[]} segments - URL segments to match (e.g. from `Router.parseUrl(url)`).
 * @returns {MatchedRouteSegment[] | null} Root-to-leaf matched route chain, or `null` when no route matches.
 * @internal
 */
export function matchRouteChain(routes: Routes, segments: UrlSegment[]): MatchedRouteSegment[] | null {
  for (const route of routes) {
    const matched = matchRoute(route, segments);
    if (!matched) {
      continue;
    }
 
    const remaining = segments.slice(matched.consumed.length);
    const level: MatchedRouteSegment = { route, params: matched.posParams };

    // Try children first, even when `remaining` is already empty — a `**` or `path: ''`
    // child (e.g. the catchall page route sitting under a pass-through locale matcher)
    // can itself match zero remaining segments. Only fall back to treating *this* route
    // as the leaf when it has no children, or its children don't match.
    if (route.children?.length) {
      const childChain = matchRouteChain(route.children, remaining);
      if (childChain) {
        return [level, ...childChain];
      }
      if (remaining.length === 0) {
        return [level];
      }
      continue;
    }

    if (remaining.length === 0) {
      return [level];
    }

    if (route.loadChildren) {
      // Lazy-loaded children can't be matched synchronously without triggering a chunk
      // load as a side effect of hover; treat this route as the matching boundary.
      return [level];
    }

    // Route matched but left segments unconsumed and has nowhere to send them.
    continue;
  }

  return null;
}
