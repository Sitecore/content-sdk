import { LOADER_DATA_ENDPOINT } from '../constants';
import type { CsdkRequestData, LoaderPayload, LoaderRunnerInit } from '../../loaders/models';
import { extractRequestData } from '../../loaders/utils';
import type { ExpressRequest, MiddlewareMatcher } from './models';
import { matches, type PathPattern } from '../utils';

/**
 * Whether the request is a browser loader navigation to the `/_data` endpoint (rather than a
 * regular SSR page request). Such requests carry their routing data in the loader payload, not in
 * `req.path`/`req.query`.
 * @param {ExpressRequest} req - Incoming request.
 * @param {string} [dataEndpoint] - Loader data endpoint (default `/_data`).
 * @returns {boolean} True for `/_data` requests.
 * @public
 */
export function isDataLoaderRequest(
  req: ExpressRequest,
  dataEndpoint = LOADER_DATA_ENDPOINT
): boolean {
  return req.path === dataEndpoint;
}

/**
 * Parses a `/_data` request (POST body or GET query) into a {@link LoaderRunnerInit}, or a
 * validation error. `csdkRequestData` is always server-derived via {@link extractRequestData}, so
 * request-data-shaped values in the payload can't spoof site/variant resolution.
 * @param {ExpressRequest} req - Incoming `/_data` request.
 * @returns {LoaderRunnerInit | { status: number; message: string }} Parsed payload or error.
 * @public
 */
export function parseLoaderRequest(
  req: ExpressRequest
): LoaderRunnerInit | { status: number; message: string } {
  if (req.method === 'POST') {
    const body = req.body as LoaderPayload;
    if (!body?.loaderId) return { status: 400, message: 'Missing loaderId' };
    return { ...body, csdkRequestData: extractRequestData(req) };
  }
  if (req.method === 'GET') {
    const loaderId = String(req.query?.loaderId ?? '');
    if (!loaderId) return { status: 400, message: 'Missing loaderId' };
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.query ?? {})) {
      if (key !== 'loaderId' && key !== 'url' && typeof value === 'string') query[key] = value;
    }
    return {
      loaderId,
      url: String(req.query?.url ?? ''),
      routeParams: {},
      query,
      csdkRequestData: extractRequestData(req) ?? null,
    };
  }
  return { status: 405, message: 'Method not allowed' };
}

/**
 * Normalized request inputs the multisite and personalize middlewares resolve against.
 * @public
 */
export interface MiddlewareRequest {
  /** Target route path (query string stripped). */
  path: string;
  /** Target route query parameters. */
  query: Record<string, string | string[] | undefined>;
  /** Server-derived request data: hostname, headers, cookies, scParams, preview data. */
  data: CsdkRequestData;
  /** Referrer URL from the request. */
  referrer?: string;
}

/**
 * Resolves the inputs the multisite/personalize middlewares should use, hiding the difference
 * between regular page requests and browser loader navigations. For `/_data` requests the route and
 * query come from the loader payload (via {@link parseLoaderRequest}); otherwise from the request
 * itself. Headers/cookies/hostname always come from {@link extractRequestData}, so resolution reads
 * the same shape either way and can then enrich `req.scParams` with site/variants.
 * @param {ExpressRequest} req - Incoming request.
 * @param {string} [dataEndpoint] - Loader data endpoint (default `/_data`).
 * @returns {MiddlewareRequest} Normalized path/query/data.
 * @public
 */
export function getMiddlewareRequest(
  req: ExpressRequest,
  dataEndpoint = LOADER_DATA_ENDPOINT
): MiddlewareRequest {
  const referrer = (req.headers?.referer as string | undefined) ?? req.referrer;
  if (isDataLoaderRequest(req, dataEndpoint)) {
    const parsed = parseLoaderRequest(req);
    if ('loaderId' in parsed) {
      return {
        path: (parsed.url || req.path).split('?')[0],
        query: parsed.query ?? {},
        referrer,
        data: parsed.csdkRequestData ?? extractRequestData(req),
      };
    }
  }
  return {
    path: req.path,
    query: req.query ?? {},
    referrer,
    data: extractRequestData(req),
  };
}

/**
 * Default patterns excluded from all middlewares. These are routes that never carry Sitecore
 * layout data, so site/variant resolution would only waste an Edge/CDP call.
 * @internal
 */
const DEFAULT_EXCLUDE_PATTERNS: PathPattern[] = [
  /^\/api(\/|$)/, // API routes
  /^\/sitecore(\/|$)/, // Sitecore-specific routes
  /\.[^/]+$/, // static files (final path segment has an extension, e.g. /assets/logo.png)
];

/**
 * Determine whether a middleware should process a request based on path matching.
 * Applies the default exclusions (API routes, Sitecore routes, static files) and then any custom
 * `excludePaths` / `includePaths` from the matcher. Editing/preview gating is handled separately by
 * each middleware (see {@link isEditingPreview}), not here.
 *
 * Precedence: default exclusions and `excludePaths` always win; when `includePaths` is provided the
 * path must additionally match at least one include pattern. Each pattern is a `string` (exact
 * match) or a `RegExp`.
 * @param {string} path - The normalized request path (query string stripped).
 * @param {MiddlewareMatcher} [matcher] - Custom include/exclude patterns.
 * @returns {boolean} True if the middleware should process this request.
 * @public
 */
export function shouldProcessPath(path: string, matcher?: MiddlewareMatcher): boolean {
  if (
    DEFAULT_EXCLUDE_PATTERNS.some((pattern) => matches(path, pattern)) ||
    (matcher?.excludePaths && matcher.excludePaths.some((pattern) => matches(path, pattern))) ||
    (matcher?.includePaths && !matcher.includePaths.some((pattern) => matches(path, pattern)))
  ) {
    return false;
  }
  return true;
}
