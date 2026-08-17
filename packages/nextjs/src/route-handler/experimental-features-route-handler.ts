import { NextRequest } from 'next/server';
import {
  buildExperimentalFeaturesResponse,
  ExperimentalFeatureData,
} from '@sitecore-content-sdk/content/experimental';
import debug from '../debug';
import {
  authorizeEditingEndpointRequest,
  getEditingSecretQueryParamName,
} from '../editing/editing-endpoint-auth';

/**
 * Options for {@link createExperimentalFeaturesRouteHandler}.
 * @public
 */
export type ExperimentalFeaturesRouteHandlerOptions = {
  /**
   * Experimental features catalog. Defaults to the shared Content SDK catalog.
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

  const authorize = (req: NextRequest, requireSecret: boolean) =>
    authorizeEditingEndpointRequest({
      method: req.method,
      headers: req.headers,
      secret: req.nextUrl.searchParams.get(getEditingSecretQueryParamName()),
      requireSecret,
    });

  const GET = async (req: NextRequest) => {
    try {
      const startTimestamp = Date.now();
      debug.editing('experimental features route handler start');

      const auth = authorize(req, true);

      if (!auth.ok) {
        return new Response(JSON.stringify(auth.body), {
          status: auth.status,
          headers: {
            'Content-Type': 'application/json',
            ...(auth.corsHeaders ?? {}),
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
          ...auth.corsHeaders,
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

      // Match previous behavior: OPTIONS validates CORS only (secret not required).
      const auth = authorize(req, false);

      if (!auth.ok) {
        return new Response(JSON.stringify(auth.body), {
          status: auth.status,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return new Response(null, {
        status: 204,
        headers: auth.corsHeaders,
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
