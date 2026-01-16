import { QUERY_PARAM_EDITING_SECRET, Metadata } from '@sitecore-content-sdk/core/editing';
import { debug } from '@sitecore-content-sdk/core';
import { EditMode } from '@sitecore-content-sdk/core/layout';
import { ComponentMap } from '../component-map.token';
import {
  ExpressRequest,
  ExpressResponse,
  ExpressNextFunction,
  ExpressMiddleware,
} from './express-data-handler';
import { DEFAULT_EDITING_CONFIG_ENDPOINT } from './editing-config-handler';

/**
 * Options for the Express editing config handler
 * @public
 */
export interface ExpressEditingConfigHandlerOptions {
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
 * Create an Express middleware for the editing config endpoint.
 * This middleware provides configuration information to determine feature compatibility on Pages side.
 * @param options - Handler options including the component map and metadata
 * @returns Express middleware that handles the editing config endpoint
 * @example
 * ```typescript
 * import express from 'express';
 * import { createExpressEditingConfigMiddleware } from '@sitecore-content-sdk/angular';
 * import { componentMap } from './.sitecore/component-map';
 * import metadata from './.sitecore/metadata.json';
 *
 * const app = express();
 *
 * // Mount the editing config handler middleware
 * app.use(createExpressEditingConfigMiddleware({
 *   components: componentMap,
 *   metadata,
 * }));
 * ```
 * @public
 */
export function createExpressEditingConfigMiddleware(
  options: ExpressEditingConfigHandlerOptions
): ExpressMiddleware {
  const {
    components,
    metadata,
    editingSecret: optionsSecret,
    endpoint = DEFAULT_EDITING_CONFIG_ENDPOINT,
  } = options;

  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    // Check if request matches the endpoint
    if (req.path !== endpoint) {
      next();
      return;
    }

    try {
      if (req.method === 'GET') {
        const startTimestamp = Date.now();

        debug.editing('editing config handler start');

        const secret = String(req.query[QUERY_PARAM_EDITING_SECRET] || '');
        const expectedSecret = getEditingSecret(optionsSecret);

        if (secret !== expectedSecret) {
          debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, expectedSecret);
          res.status(401).json({ message: 'Missing or invalid editing secret' });
          return;
        }

        const componentNames = Array.from(components.keys());

        const responseData = {
          framework: 'angular',
          components: componentNames,
          packages: metadata.packages,
          editMode: EditMode.Metadata,
        };

        debug.editing('editing config handler end in %dms', Date.now() - startTimestamp);

        res.status(200).json(responseData);
      } else if (req.method === 'OPTIONS') {
        debug.editing('preflight request');
        res.status(204).json(null);
      } else {
        // Method not allowed
        res.status(405).json({ message: 'Method not allowed' });
      }
    } catch (error) {
      console.log('Editing config handler failed:');
      console.log(error);

      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}
