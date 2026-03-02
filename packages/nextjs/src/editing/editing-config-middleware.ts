import { NextApiRequest, NextApiResponse } from 'next';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import debug from '../debug';
import { Metadata } from '@sitecore-content-sdk/core/node-tools';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import { EditMode } from '@sitecore-content-sdk/content/layout';
import { getEditingSecret } from '../utils/utils';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { NextjsContentSdkComponent } from '../sharedTypes/component-props';

/**
 * The interface for the EditingConfigMiddleware configuration.
 * @public
 */
export type EditingConfigMiddlewareConfig = {
  /**
   * Components available in the application
   */
  components: ComponentMap<NextjsContentSdkComponent>;
  /**
   * Application metadata
   */
  metadata: Metadata;
};

/**
 * Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
 * provides configuration information to determine feature compatibility on Pages side.
 * @public
 */
export class EditingConfigMiddleware {
  /**
   * @param {EditingConfigMiddlewareConfig} [config] Editing configuration middleware config
   */
  constructor(protected config: EditingConfigMiddlewareConfig) {}

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

    // Handle preflight request
    if (_req.method === 'OPTIONS') {
      debug.editing('preflight request');

      return res.status(204).send(null);
    }

    const components = Array.from(this.config.components.keys());

    return res.status(200).json({
      components,
      packages: this.config.metadata.packages,
      editMode: EditMode.Metadata,
    });
  };
}
