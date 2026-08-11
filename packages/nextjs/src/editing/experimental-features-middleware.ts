import { NextApiRequest, NextApiResponse } from 'next';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import debug from '../debug';
import {
  buildExperimentalFeaturesResponse,
  ExperimentalFeatureData,
} from '../experimental-features';
import { getEditingSecret } from '../utils/utils';

/**
 * Configuration for {@link ExperimentalFeaturesMiddleware}.
 * @public
 */
export type ExperimentalFeaturesMiddlewareConfig = {
  /**
   * Experimental features catalog. Defaults to the package `experimental.json` catalog.
   */
  features?: ExperimentalFeatureData[];
};

/**
 * Middleware / handler used in the experimental features API route
 * (e.g. '/api/editing/experimental'). Exposes available experimental features
 * and whether each is currently enabled, for Sitecore AI / editing host consumers.
 * @public
 */
export class ExperimentalFeaturesMiddleware {
  /**
   * @param {ExperimentalFeaturesMiddlewareConfig} [config] Experimental features middleware config
   */
  constructor(protected config: ExperimentalFeaturesMiddlewareConfig = {}) {}

  /**
   * Gets the Next.js API route handler
   * @returns middleware handler
   */
  public getHandler(): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
    return this.handler;
  }

  private handler = async (_req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const secret = _req.query[QUERY_PARAM_EDITING_SECRET];
    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: _req.method,
      headers: _req.headers,
      presetCorsHeader: res?.getHeader('Access-Control-Allow-Origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!corsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return res.status(401).json({ message: 'Invalid origin' });
    }

    Object.keys(corsHeaders).forEach((key) => {
      res.setHeader(key, corsHeaders[key]);
    });

    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return res.status(401).json({ message: 'Missing or invalid editing secret' });
    }

    if (_req.method === 'OPTIONS') {
      debug.editing('preflight request');
      return res.status(204).send(null);
    }

    return res.status(200).json(buildExperimentalFeaturesResponse(this.config.features));
  };
}
