﻿import { NextApiRequest, NextApiResponse } from 'next';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/core/editing';
import { debug } from '@sitecore-content-sdk/core';
import { Metadata } from '@sitecore-content-sdk/core/editing';
import { enforceCors } from '@sitecore-content-sdk/core/utils';
import { EditMode } from '@sitecore-content-sdk/core/layout';
import { getJssEditingSecret } from '../utils/utils';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { NextjsJssComponent } from '../sharedTypes/component-props';

export type EditingConfigMiddlewareConfig = {
  /**
   * Components available in the application
   */
  components: ComponentMap<NextjsJssComponent>;
  /**
   * Application metadata
   */
  metadata: Metadata;
};

/**
 * Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
 * provides configuration information to determine feature compatibility on Pages side.
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
    if (!enforceCors(_req, res, EDITING_ALLOWED_ORIGINS)) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return res.status(401).json({ message: 'Invalid origin' });
    }
    if (secret !== getJssEditingSecret()) {
      debug.editing(
        'invalid editing secret - sent "%s" expected "%s"',
        secret,
        getJssEditingSecret()
      );

      return res.status(401).json({ message: 'Missing or invalid editing secret' });
    }

    // Handle preflight request
    if (_req.method === 'OPTIONS') {
      debug.editing('preflight request');

      // CORS headers are set by enforceCors
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
