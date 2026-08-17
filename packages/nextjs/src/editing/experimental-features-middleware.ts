import { NextApiRequest, NextApiResponse } from 'next';
import {
  buildExperimentalFeaturesResponse,
  ExperimentalFeatureData,
} from '@sitecore-content-sdk/content/experimental';
import debug from '../debug';
import {
  authorizeEditingEndpointRequest,
  getEditingSecretQueryParamName,
} from './editing-endpoint-auth';

/**
 * Configuration for {@link ExperimentalFeaturesMiddleware}.
 * @public
 */
export type ExperimentalFeaturesMiddlewareConfig = {
  /**
   * Experimental features catalog. Defaults to the shared Content SDK catalog.
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
    const auth = authorizeEditingEndpointRequest({
      method: _req.method,
      headers: _req.headers,
      secret: _req.query[getEditingSecretQueryParamName()],
      presetCorsHeader: res?.getHeader('Access-Control-Allow-Origin') as string,
    });

    if (!auth.ok) {
      if (auth.corsHeaders) {
        Object.keys(auth.corsHeaders).forEach((key) => {
          res.setHeader(key, auth.corsHeaders![key]);
        });
      }
      return res.status(auth.status).json(auth.body);
    }

    Object.keys(auth.corsHeaders).forEach((key) => {
      res.setHeader(key, auth.corsHeaders[key]);
    });

    if (_req.method === 'OPTIONS') {
      debug.editing('preflight request');
      return res.status(204).send(null);
    }

    return res.status(200).json(buildExperimentalFeaturesResponse(this.config.features));
  };
}
