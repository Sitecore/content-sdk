import { QUERY_PARAM_EDITING_SECRET, Metadata } from '@sitecore-content-sdk/core/editing';
import { debug } from '@sitecore-content-sdk/core';
import { EditMode } from '@sitecore-content-sdk/core/layout';
import { ComponentMap } from '../component-map.token';

/**
 * Default endpoint path for the editing config handler.
 * @public
 */
export const DEFAULT_EDITING_CONFIG_ENDPOINT = '/api/editing/config';

/**
 * Options for the editing config handler
 * @public
 */
export interface EditingConfigHandlerOptions {
  /**
   * Components available in the application
   */
  components: ComponentMap;
  /**
   * Application metadata
   */
  metadata: Metadata;
  /**
   * The editing secret used to authenticate requests from Sitecore Pages.
   * If not provided, falls back to SITECORE_EDITING_SECRET environment variable.
   */
  editingSecret?: string;
  /**
   * The endpoint path for the editing config handler.
   * @default '/api/editing/config'
   */
  endpoint?: string;
}

/**
 * Get the editing secret from options or environment variable
 */
function getEditingSecret(optionsSecret?: string): string {
  const secret = optionsSecret || process.env.SITECORE_EDITING_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error(
      'The editingSecret option or SITECORE_EDITING_SECRET environment variable is missing or invalid.'
    );
  }
  return secret;
}

/**
 * Create a JSON response
 */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Create an editing config handler middleware using the Web Fetch API.
 * This handler provides configuration information to determine feature compatibility on Pages side.
 * @param options - Handler options including the component map and metadata
 * @returns A function that handles Request and returns Response or null if path doesn't match
 * @example
 * ```typescript
 * import { createEditingConfigMiddleware } from '@sitecore-content-sdk/angular';
 *
 * const middleware = createEditingConfigMiddleware({
 *   components: componentMap,
 *   metadata: require('./.sitecore/metadata.json'),
 * });
 *
 * // In your server handler
 * export async function handler(request: Request): Promise<Response> {
 *   const configResponse = await middleware(request);
 *   if (configResponse) return configResponse;
 *
 *   // Handle other requests...
 * }
 * ```
 * @public
 */
export function createEditingConfigMiddleware(
  options: EditingConfigHandlerOptions
): (request: Request) => Promise<Response | null> {
  const {
    components,
    metadata,
    editingSecret: optionsSecret,
    endpoint = DEFAULT_EDITING_CONFIG_ENDPOINT,
  } = options;

  return async (request: Request): Promise<Response | null> => {
    const url = new URL(request.url);

    // Check if request matches the endpoint
    if (url.pathname !== endpoint) {
      return null;
    }

    try {
      if (request.method === 'GET') {
        const startTimestamp = Date.now();

        debug.editing('editing config handler start');

        const secret = url.searchParams.get(QUERY_PARAM_EDITING_SECRET);
        const expectedSecret = getEditingSecret(optionsSecret);

        if (secret !== expectedSecret) {
          debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, expectedSecret);
          return jsonResponse({ message: 'Missing or invalid editing secret' }, 401);
        }

        const componentNames = Array.from(components.keys());

        const responseData = {
          framework: 'angular',
          components: componentNames,
          packages: metadata.packages,
          editMode: EditMode.Metadata,
        };

        debug.editing('editing config handler end in %dms', Date.now() - startTimestamp);

        return jsonResponse(responseData, 200);
      } else if (request.method === 'OPTIONS') {
        debug.editing('preflight request');
        return new Response(null, { status: 204 });
      } else {
        // Method not allowed
        return jsonResponse({ message: 'Method not allowed' }, 405);
      }
    } catch (error) {
      console.log('Editing config handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };
}
