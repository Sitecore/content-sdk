import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import {
  buildExperimentalFeaturesResponse,
  ExperimentalFeatureData,
} from '@sitecore-content-sdk/content/experimental';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import { ExpressMiddleware, ExpressNextFunction, ExpressRequest, ExpressResponse } from './models';
import { resolveConfiguredEditingSecret } from './editing-config-middleware';
import debug from '../../debug';

const DEFAULT_ENDPOINT = '/api/editing/experimental';

/**
 * Options for {@link createExperimentalFeaturesMiddleware}.
 * @public
 */
export interface CreateExperimentalFeaturesMiddlewareOptions {
  /**
   * Experimental features catalog. Defaults to the shared Content SDK catalog.
   */
  features?: ExperimentalFeatureData[];
  /**
   * Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
   * environment variable.
   */
  editingSecret?: string;
  /** Endpoint path; default `/api/editing/experimental`. */
  endpoint?: string;
}

/**
 * Express middleware that serves the experimental features visibility endpoint
 * (default path: `/api/editing/experimental`). Returns available experimental
 * features and whether each is currently enabled.
 * @param {CreateExperimentalFeaturesMiddlewareOptions} [options] - Middleware options.
 * @returns {ExpressMiddleware} The middleware function.
 * @public
 */
export function createExperimentalFeaturesMiddleware(
  options: CreateExperimentalFeaturesMiddlewareOptions = {}
): ExpressMiddleware {
  const { features, endpoint = DEFAULT_ENDPOINT } = options;

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    if (req.path !== endpoint) {
      next();
      return;
    }

    debug.editing('experimental features middleware start: %o', {
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
      res.status(401).json({ message: 'Invalid origin' });
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
    const configuredSecret = resolveConfiguredEditingSecret(options.editingSecret);

    if (!configuredSecret || secret !== configuredSecret) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, configuredSecret);
      res.status(401).json({ message: 'Missing or invalid editing secret' });
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

    res.status(200).json(buildExperimentalFeaturesResponse(features));
  };
}
