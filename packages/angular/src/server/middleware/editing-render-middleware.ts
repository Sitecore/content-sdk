import {
  EDITING_ALLOWED_ORIGINS,
  EditingPreviewData,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import { getAllowedOriginsFromEnv, getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import { ExpressMiddleware, ExpressNextFunction, ExpressRequest, ExpressResponse } from './models';
import { readProcessEnv } from '../utils';
import { resolveConfiguredEditingSecret } from './editing-config-middleware';
import debug from '../../debug';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';

const DEFAULT_ENDPOINT = '/api/editing/render';

/**
 * Specification for an additional query parameter to forward into the editing
 * preview data.
 * @public
 */
export interface AllowedQueryParam {
  name: string;
  required?: boolean;
}

/**
 * Resolver function: receives the names of every query parameter on the
 * incoming editing request and returns the list of parameters to forward.
 * @public
 */
export type AllowedQueryParamsResolver = (
  queryParams: string[]
) => Array<AllowedQueryParam | string>;

/**
 * Allowed query parameters configuration for {@link createEditingRenderMiddleware}.
 * Either an array of parameter names / specs, or a resolver function.
 * @public
 */
export type AllowedQueryParams = Array<AllowedQueryParam | string> | AllowedQueryParamsResolver;

/**
 * Options for {@link createEditingRenderMiddleware}.
 * @public
 */
export interface CreateEditingRenderMiddlewareOptions {
  /**
   * Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
   * environment variable.
   */
  editingSecret?: string;
  /** Endpoint path; default `/api/editing/render`. */
  endpoint?: string;
  /**
   * Allows apps to remap the editor's `route` query parameter to their own URL
   * shape (e.g. injecting a locale prefix).
   * @param {string} itemPath - Decoded route from the query parameter.
   * @param {EditingPreviewData} previewData - Preview data parsed from the request.
   * @returns {string} The route the Angular SSR engine should render.
   */
  resolvePageUrl?: (itemPath: string, previewData: EditingPreviewData) => string;
  /**
   * Extra query parameters propagated into the editing preview data
   * (e.g. deployment-protection bypass tokens).
   */
  allowedQueryParams?: AllowedQueryParams;
}

/**
 * Editing-aware request. The render middleware attaches `scEditing` to allow
 * downstream code to detect the editing branch without reparsing headers.
 * @public
 */
export interface ExpressEditingRequest extends ExpressRequest {
  scEditing?: EditingPreviewData;
}

const REQUIRED_PARAMS = ['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode'] as const;

/**
 * Build the {@link EditingPreviewData} payload from the request query string.
 * @param {Record<string, string | undefined>} query - Query parameters.
 * @param {Record<string, unknown>} allowedQueryParams - Extra forwarded parameters.
 * @returns {EditingPreviewData} Preview data for `SitecoreClient.getPreview`.
 * @internal
 */
function buildPreviewData(
  query: Record<string, string | undefined>,
  allowedQueryParams: Record<string, unknown>
): EditingPreviewData {
  const variantId = query.sc_variant ?? DEFAULT_VARIANT;
  return {
    site: String(query.sc_site ?? ''),
    itemId: String(query.sc_itemid ?? ''),
    language: String(query.sc_lang ?? ''),
    mode: String(query.mode ?? '') as EditingPreviewData['mode'],
    variantId,
    version: query.sc_version,
    layoutKind: query.sc_layoutKind as EditingPreviewData['layoutKind'],
    ...(query.sc_previewTime && { previewTime: query.sc_previewTime }),
    ...allowedQueryParams,
  };
}

/**
 * Resolve the list of additional query parameters to forward and the names of
 * any required ones that are missing.
 * @param {Record<string, string | string[] | undefined>} queryParams - Incoming query.
 * @param {AllowedQueryParams} [allowedParams] - Configuration.
 * @returns {{ allowedQueryParams: Record<string, unknown>; missingAllowedParams: string[] }} Result.
 * @internal
 */
function resolveAllowedQueryParams(
  queryParams: Record<string, string | string[] | undefined>,
  allowedParams?: AllowedQueryParams
): { allowedQueryParams: Record<string, unknown>; missingAllowedParams: string[] } {
  const list =
    typeof allowedParams === 'function'
      ? allowedParams(Object.keys(queryParams))
      : Array.isArray(allowedParams)
      ? allowedParams
      : [];

  const allowedQueryParams: Record<string, unknown> = {};
  const missingAllowedParams: string[] = [];

  for (const param of list) {
    const name = typeof param === 'string' ? param : param.name;
    const required = typeof param === 'string' ? false : param.required;
    const value = queryParams[name];
    if (value !== undefined) {
      allowedQueryParams[name] = value;
    } else if (required) {
      missingAllowedParams.push(name);
    }
  }

  return { allowedQueryParams, missingAllowedParams };
}

/**
 * Build the `Content-Security-Policy` value (`frame-ancestors …`) so the
 * editor iframe can frame our pages.
 * @returns {string} CSP header value.
 * @internal
 */
function buildCSPHeader(): string {
  return `frame-ancestors 'self' ${[...getAllowedOriginsFromEnv(), ...EDITING_ALLOWED_ORIGINS].join(
    ' '
  )}`;
}

/**
 * Express middleware that handles the editing render endpoint
 * (default path: `/api/editing/render`). On a valid editor request, it
 * validates CORS + secret + required params, stashes the preview data on the
 * request, sets the CSP header, rewrites `req.url` to the target route, and
 * hands the request off to the Angular SSR pipeline via `next()`.
 *
 * No internal HTTP fetch is performed - the editing
 * payload travels alongside the Express request through the existing
 * middleware chain.
 * @param {CreateEditingRenderMiddlewareOptions} [options] - Middleware options.
 * @returns {ExpressMiddleware} The middleware function.
 * @public
 */
export function createEditingRenderMiddleware(
  options?: CreateEditingRenderMiddlewareOptions
): ExpressMiddleware {
  const endpoint = options?.endpoint ?? DEFAULT_ENDPOINT;

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    if (req.path !== endpoint) {
      next();
      return;
    }

    try {
      debug.editing('editing render middleware start: %o', {
        method: req.method,
        query: req.query,
        headers: req.headers,
      });

      const corsHeaders = getEnforcedCorsHeaders({
        requestMethod: req.method,
        headers: (req.headers ?? {}) as Record<string, string | string[] | undefined>,
        allowedOrigins: EDITING_ALLOWED_ORIGINS,
      });

      if (!corsHeaders) {
        debug.editing(
          'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
        );
        const origin = (req.headers ?? {}).origin;
        res.status(401).json({ error: `Requests from origin ${origin} not allowed` });
        return;
      }

      if (typeof res.setHeader === 'function') {
        Object.keys(corsHeaders).forEach((key) => {
          res.setHeader!(key, corsHeaders[key]);
        });
      }

      const query = (req.query ?? {}) as Record<string, string | string[] | undefined>;
      const secretParam = query[QUERY_PARAM_EDITING_SECRET];
      const secret = Array.isArray(secretParam) ? secretParam[0] : secretParam;
      const configuredSecret =
        resolveConfiguredEditingSecret(options?.editingSecret) ??
        readProcessEnv('SITECORE_EDITING_SECRET');

      if (!configuredSecret || secret !== configuredSecret) {
        debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, configuredSecret);
        res.status(401).json({ error: 'Missing or invalid secret' });
        return;
      }

      if (req.method === 'OPTIONS') {
        debug.editing('preflight request');
        res.status(204);
        if (typeof res.send === 'function') {
          res.send(null);
        } else {
          res.json(null);
        }
        return;
      }

      if (req.method !== 'GET') {
        debug.editing('invalid method - sent %s expected GET', req.method);
        if (typeof res.setHeader === 'function') {
          res.setHeader('Allow', 'GET');
        }
        res.status(405).json({ error: `Invalid request method '${req.method}'` });
        return;
      }

      const startTimestamp = Date.now();

      const flatQuery: Record<string, string | undefined> = {};
      for (const [key, value] of Object.entries(query)) {
        flatQuery[key] = Array.isArray(value) ? value[0] : value;
      }

      const missingRequired = REQUIRED_PARAMS.filter((p) => !flatQuery[p]);
      const { allowedQueryParams, missingAllowedParams } = resolveAllowedQueryParams(
        query,
        options?.allowedQueryParams
      );

      if (missingRequired.length || missingAllowedParams.length) {
        const missing = [...missingRequired, ...missingAllowedParams];
        debug.editing('missing required query parameters: %o', missing);
        res.status(400).json({
          error: `Missing required query parameters: ${missing.join(', ')}`,
        });
        return;
      }

      const previewData = buildPreviewData(flatQuery, allowedQueryParams);

      if (typeof res.setHeader === 'function') {
        res.setHeader('Content-Security-Policy', buildCSPHeader());
      }

      const decodedRoute = flatQuery.route ?? '';
      const targetRoute =
        options?.resolvePageUrl?.(decodedRoute, previewData) ??
        `/${previewData.language}${decodedRoute.startsWith('/') ? '' : '/'}${decodedRoute}`;
      const encodedRoute = encodeURI(targetRoute);

      debug.editing('rewriting request to page route %s', targetRoute);

      const editingReq = req as ExpressEditingRequest;
      editingReq.scEditing = previewData;
      if (!editingReq.headers) {
        editingReq.headers = {};
      }
      editingReq.headers[EDITING_PARAMS_HEADER] = JSON.stringify(previewData);

      editingReq.url = encodedRoute;
      // Preserve method as GET for downstream Angular SSR.
      editingReq.method = 'GET';

      debug.editing('editing render middleware end in %dms: %o', Date.now() - startTimestamp, {
        route: targetRoute,
      });

      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      debug.editing('editing render middleware error: %o', err);
      // eslint-disable-next-line no-console
      console.error('[editing-render] failed to handle editing request', err);
      res.status(500).json({ error: message });
    }
  };
}
