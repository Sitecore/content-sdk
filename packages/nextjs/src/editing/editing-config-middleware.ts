import { NextApiRequest, NextApiResponse } from 'next';
import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/core/editing';
import { debug } from '@sitecore-content-sdk/core';
import { Metadata } from '@sitecore-content-sdk/core/editing';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
import { EditMode } from '@sitecore-content-sdk/core/layout';
import { getEditingSecret } from '../utils/utils';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { NextjsContentSdkComponent } from '../sharedTypes/component-props';
import { NextRequest } from 'next/server';

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

  public getAppRouterHandler() {
    return async (req: NextRequest) => {
      const result = await this.handlerCommon(req);
      if (result.error) {
        return Response.json(
          { message: result.error },
          { status: 401, headers: result.corsHeaders }
        );
      }
      return Response.json(result.data, { status: 200, headers: result.corsHeaders });
    };
  }

  private handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const result = await this.handlerCommon(req);
    Object.keys(result.corsHeaders).forEach((key) => {
      res.setHeader(key, result.corsHeaders[key]);
    });

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }
    if (result.preflight) {
      return res.status(204).send(null);
    }
    return res.status(200).json(result.data);
  };

  private async handlerCommon(
    req: NextApiRequest | NextRequest,
    res?: NextApiResponse
  ): Promise<CommonHandlerResult> {
    let secret = null;
    const reqQuery = (req as NextApiRequest).query;
    const reqUrl = (req as NextRequest).url;

    if (reqQuery) {
      // pages router
      secret = reqQuery[QUERY_PARAM_EDITING_SECRET];
    } else if (reqUrl) {
      // app router
      const url = new URL(reqUrl);
      secret = url.searchParams.get(QUERY_PARAM_EDITING_SECRET);
    }

    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method || 'GET',
      headers: req.headers,
      presetCorsHeader: res?.getHeader('Access-Control-Allow-Origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });
    if (!corsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return {
        corsHeaders: {},
        error: 'Invalid origin',
      };
    }

    if (req.method === 'OPTIONS') {
      debug.editing('preflight request');

      return {
        corsHeaders,
        preflight: true,
      };
    }

    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return {
        corsHeaders,
        error: 'Missing or invalid editing secret',
      };
    }

    const components = Array.from(this.config.components.keys());
    return {
      corsHeaders,
      data: {
        components,
        packages: this.config.metadata.packages,
        editMode: EditMode.Metadata,
      },
    };
  }
}

interface CommonHandlerResult {
  preflight?: boolean;
  error?: string;
  corsHeaders: Record<string, string>;
  data?: {
    components: string[];
    packages: Record<string, string>;
    editMode: string;
  };
}
