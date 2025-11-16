import { NextRequest } from 'next/server';
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

export type EditingConfigRouteHandlerOptions = {
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
 * Creates a route handler for the editing config API route (e.g. '/api/editing/config')
 * Provides configuration information to determine feature compatibility on Pages side.
 * @param {EditingConfigRouteHandlerOptions} options - The options for the route handler.
 * @returns The route handler with GET and OPTIONS methods.
 * @public
 */
export const createEditingConfigRouteHandler = (options: EditingConfigRouteHandlerOptions) => {
  const { components, metadata } = options;

  const validateRequest = (req: NextRequest) => {
    const secret = req.nextUrl.searchParams.get(QUERY_PARAM_EDITING_SECRET);
    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: req.headers,
      presetCorsHeader: undefined,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    return { secret, corsHeaders };
  };

  const GET = async (req: NextRequest) => {
    try {
      const startTimestamp = Date.now();

      debug.editing('editing config route handler start');

      const { secret, corsHeaders } = validateRequest(req);

      if (!corsHeaders) {
        debug.editing(
          'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
        );
        return new Response(JSON.stringify({ message: 'Invalid origin' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (secret !== getEditingSecret()) {
        debug.editing(
          'invalid editing secret - sent "%s" expected "%s"',
          secret,
          getEditingSecret()
        );

        return new Response(JSON.stringify({ message: 'Missing or invalid editing secret' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      const componentNames = Array.from(components.keys());

      const responseData = {
        components: componentNames,
        packages: metadata.packages,
        editMode: EditMode.Metadata,
      };

      debug.editing('editing config route handler end in %dms', Date.now() - startTimestamp);

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.log('Editing config route handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };

  const OPTIONS = async (req: NextRequest) => {
    try {
      debug.editing('preflight request');

      const { corsHeaders } = validateRequest(req);

      if (!corsHeaders) {
        debug.editing(
          'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
        );
        return new Response(JSON.stringify({ message: 'Invalid origin' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      // CORS headers are set by corsHeaders
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    } catch (error) {
      console.log('Editing config OPTIONS route handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };

  return { GET, OPTIONS };
};
