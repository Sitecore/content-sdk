import { NextApiRequest, NextApiResponse } from 'next';
import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  INVALID_SECRET_HTML_MESSAGE,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
} from '@sitecore-content-sdk/core/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { getEditingSecret } from '../utils/utils';
import { RenderMiddlewareBase } from './render-middleware';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
import {
  getPreviewCookies,
  getRequiredEditingParamsList,
  mapEditingParams,
  cleanupNextPreviewCookies,
  getQueryParamsForPropagation,
  getHeadersForPropagation,
  getEditingRequestHtml,
  getCSPHeader,
  resolveServerUrl,
} from './utils';

/**
 * Configuration for the Editing Render Middleware.
 * @public
 */
export type EditingRenderMiddlewareConfig = {
  /**
   * Function used to determine route/page URL to render.
   * This may be necessary for certain custom Next.js routing configurations.
   * @param {string} itemPath The Sitecore relative item path e.g. '/styleguide'
   * @returns {string} The URL to render
   * @default `${itemPath}`
   */
  resolvePageUrl?: (itemPath: string) => string;
  /**
   * The internal host URL for the Next.js application, used for server-side requests for page rendering during editing.
   */
  sitecoreInternalEditingHostUrl?: string;
};

/**
 * Next.js API request with editing request query parameters.
 */
export type EditingNextApiRequest = NextApiRequest & {
  query: EditingRenderQueryParams;
};

/**
 * Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
 * which is required for Sitecore editing support.
 * @public
 */
export class EditingRenderMiddleware extends RenderMiddlewareBase {
  private dataFetcher: NativeDataFetcher;
  /**
   * @param {EditingRenderMiddlewareConfig} [config] Editing render middleware config
   */
  constructor(public config?: EditingRenderMiddlewareConfig) {
    super();
    this.dataFetcher = new NativeDataFetcher({ debugger: debug.editing });
  }

  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: EditingNextApiRequest, res: NextApiResponse) => Promise<void> {
    return this.handler;
  }

  private handler = async (req: EditingNextApiRequest, res: NextApiResponse): Promise<void> => {
    const { body, method, headers, query } = req;

    debug.editing('editing render middleware start: %o', {
      method,
      query,
      headers,
      body,
    });

    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: req.headers,
      presetCorsHeader: headers['Access-Control-Allow-Origin'] as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!corsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return res.status(401).json({
        html: `<html><body>Requests from origin ${req.headers?.origin} not allowed</body></html>`,
      });
    }
    Object.keys(corsHeaders).forEach((key) => {
      res.setHeader(key, corsHeaders[key]);
    });

    // Validate secret
    const secret = query[QUERY_PARAM_EDITING_SECRET];
    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return res.status(401).json({
        html: INVALID_SECRET_HTML_MESSAGE,
      });
    }

    if (req.method === 'OPTIONS') {
      debug.editing('preflight request');

      // CORS headers are set by enforceCors
      return res.status(204).send(null);
    }

    if (req.method !== 'GET') {
      debug.editing('invalid method - sent %s expected GET', req.method);

      res.setHeader('Allow', 'GET');

      return res.status(405).json({
        html: `<html><body>Invalid request method '${req.method}'</body></html>`,
      });
    }

    const startTimestamp = Date.now();

    const mode = query.mode;

    const requiredQueryParams = getRequiredEditingParamsList(mode);

    const missingQueryParams = requiredQueryParams.filter((param) => !query[param]);

    // Validate query parameters
    if (missingQueryParams.length) {
      debug.editing('missing required query parameters: %o', missingQueryParams);

      return res.status(400).json({
        html: `<html><body>Missing required query parameters: ${missingQueryParams.join(
          ', '
        )}</body></html>`,
      });
    }

    const previewDataParams = mapEditingParams(query as { [key: string]: string });

    res.setPreviewData(
      {
        ...previewDataParams,
        variantIds: previewDataParams.variantIds?.split(','),
      },
      {
        maxAge: 3,
      }
    );

    // Set Preview mode identifier cookie, if the page is rendered in Sitecore Preview mode
    if (mode === LayoutServicePageState.Preview) {
      const cookies = res.getHeader('Set-Cookie') as string[];
      const previewCookies = getPreviewCookies(query.sc_site);

      res.setHeader('Set-Cookie', [...cookies, ...previewCookies]);
    }

    // Restrict the page to be rendered only within the allowed origins
    res.setHeader('Content-Security-Policy', getCSPHeader());

    const encodedRoute = encodeURI(query.route);
    const route = this.config?.resolvePageUrl?.(encodedRoute) || encodedRoute;

    const base = this.config?.sitecoreInternalEditingHostUrl || resolveServerUrl(req);
    const requestUrl = new URL(route, base);
    const cookies = res.getHeader('Set-Cookie') as string[];

    // Make actual render request for page route, passing on preview cookies as well as any approved query string parameters.
    // Note timestamp effectively disables caching the request (no amount of cache headers seemed to do it)
    try {
      debug.editing('fetching page route for %s', query.route);

      // Get query string parameters to propagate on subsequent requests (e.g. for deployment protection bypass)
      const propagatedQsParams = getQueryParamsForPropagation(query);

      // Get headers to propagate on subsequent requests
      const propagatedHeaders = getHeadersForPropagation(headers);
      const html = await getEditingRequestHtml(
        requestUrl,
        propagatedQsParams,
        propagatedHeaders,
        cookies,
        this.dataFetcher
      );

      // remove preview cookies to not leak them to the browser
      if (cookies && Array.isArray(cookies)) {
        const filteredCookies = cleanupNextPreviewCookies(cookies);
        filteredCookies && res.setHeader('Set-Cookie', filteredCookies);
      }

      debug.editing('editing render middleware end in %dms: %o', Date.now() - startTimestamp, {
        status: 200,
        route,
      });

      res.status(200).send(html);
    } catch (err) {
      const error = err as Record<string, unknown>;

      console.error(error);

      if (error.response) {
        console.info(
          // eslint-disable-next-line quotes
          "Hint: for non-standard server or Next.js route configurations, you may need to override 'resolvePageUrl' or set the 'sitecoreInternalEditingHostUrl' (or SITECORE_INTERNAL_EDITING_HOST_URL env variable) available on the 'EditingRenderMiddleware' config."
        );
      }

      res.status(500).send(`<html><body>${error}</body></html>`);
    }
  };
}
