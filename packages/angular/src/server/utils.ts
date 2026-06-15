import { LOADER_DATA_ENDPOINT } from './constants';
import type { CsdkRequestData, LoaderPayload, LoaderRunnerInit } from '../loaders/models';
import { extractRequestData } from '../loaders/utils';
import type { CsdkExpressRequest } from './models';

/**
 * Whether the request is a browser loader navigation to the `/_data` endpoint (rather than a
 * regular SSR page request). Such requests carry their routing data in the loader payload, not in
 * `req.path`/`req.query`.
 * @param {CsdkExpressRequest} req - Incoming request.
 * @param {string} [dataEndpoint] - Loader data endpoint (default `/_data`).
 * @returns {boolean} True for `/_data` requests.
 * @public
 */
export function isDataLoaderRequest(
  req: CsdkExpressRequest,
  dataEndpoint = LOADER_DATA_ENDPOINT
): boolean {
  return req.path === dataEndpoint;
}

/**
 * Parses a `/_data` request (POST body or GET query) into a {@link LoaderRunnerInit}, or a
 * validation error. `csdkRequestData` is always server-derived via {@link extractRequestData}, so
 * request-data-shaped values in the payload can't spoof site/variant resolution.
 * @param {CsdkExpressRequest} req - Incoming `/_data` request.
 * @returns {LoaderRunnerInit | { status: number; message: string }} Parsed payload or error.
 * @public
 */
export function parseLoaderRequest(
  req: CsdkExpressRequest
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
}

/**
 * Resolves the inputs the multisite/personalize middlewares should use, hiding the difference
 * between regular page requests and browser loader navigations. For `/_data` requests the route and
 * query come from the loader payload (via {@link parseLoaderRequest}); otherwise from the request
 * itself. Headers/cookies/hostname always come from {@link extractRequestData}, so resolution reads
 * the same shape either way and can then enrich `req.scParams` with site/variants.
 * @param {CsdkExpressRequest} req - Incoming request.
 * @param {string} [dataEndpoint] - Loader data endpoint (default `/_data`).
 * @returns {MiddlewareRequest} Normalized path/query/data.
 * @public
 */
export function getMiddlewareRequest(
  req: CsdkExpressRequest,
  dataEndpoint = LOADER_DATA_ENDPOINT
): MiddlewareRequest {
  if (isDataLoaderRequest(req, dataEndpoint)) {
    const parsed = parseLoaderRequest(req);
    if ('loaderId' in parsed) {
      return {
        path: (parsed.url || req.path).split('?')[0],
        query: parsed.query ?? {},
        data: parsed.csdkRequestData ?? extractRequestData(req),
      };
    }
  }
  return { path: req.path, query: req.query ?? {}, data: extractRequestData(req) };
}

/**
 * Reads `process.env` when running under Node; otherwise returns an empty object.
 * process.env is only available on the server in Angular
 * @param {string} name - The name of the environment variable to read.
 * @returns {Record<string, string | undefined>} Environment map for merging into config.
 * @internal
 */
export function readProcessEnv(name: string) {
  // Use globalThis so we do not need @types/node (lib tsconfig uses "types": []).
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  if (env) {
    return env[name];
  }
  return undefined;
}
