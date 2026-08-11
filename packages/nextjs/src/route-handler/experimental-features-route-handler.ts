import { NextRequest } from 'next/server';
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
 * Options for {@link createExperimentalFeaturesRouteHandler}.
 * @public
 */
export type ExperimentalFeaturesRouteHandlerOptions = {
  /**
   * Experimental features catalog. Defaults to the package `experimental.json` catalog.
   */
  features?: ExperimentalFeatureData[];
};

/**
 * Creates a route handler for the experimental features API route
 * (e.g. '/api/editing/experimental'). Exposes available experimental features
 * and whether each is currently enabled, for Sitecore AI / editing host consumers.
 * @param {ExperimentalFeaturesRouteHandlerOptions} [options] - The options for the route handler.
 * @returns The route handler with GET and OPTIONS methods.
 * @public
 */
export const createExperimentalFeaturesRouteHandler = (
  options: ExperimentalFeaturesRouteHandlerOptions = {}
) => {
  const { features } = options;

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
      debug.editing('experimental features route handler start');

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

      const responseData = buildExperimentalFeaturesResponse(features);

      debug.editing(
        'experimental features route handler end in %dms',
        Date.now() - startTimestamp
      );

      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.log('Experimental features route handler failed:');
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

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    } catch (error) {
      console.log('Experimental features OPTIONS route handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };

  return { GET, OPTIONS };
};
