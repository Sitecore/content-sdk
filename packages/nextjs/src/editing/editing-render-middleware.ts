import { NextApiRequest, NextApiResponse } from 'next';
import { STATIC_PROPS_ID, SERVER_PROPS_ID } from 'next/constants';
import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  DesignLibraryRenderPreviewData,
  isDesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { getEditingSecret } from '../utils/utils';
import { RenderMiddlewareBase } from './render-middleware';
import { getAllowedOriginsFromEnv, getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
import {
  getPreviewCookies,
  getRequiredQueryParams,
  getEditingParams,
  getFilteredCookies,
} from './utils';

/**
 * Configuration for the Editing Render Middleware.
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
 * Type guard for Design Library mode
 * @param {object} data preview data to check
 * @returns true if the data is EditingPreviewData
 * @see EditingPreviewData
 */
export const isDesignLibraryPreviewData = (
  data: unknown
): data is DesignLibraryRenderPreviewData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'mode' in data &&
    isDesignLibraryMode((data as DesignLibraryRenderPreviewData).mode)
  );
};

/**
 * Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
 * which is required for Sitecore editing support.
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

  protected getEditingRequestHtml = async (
    requestUrl: URL,
    query: Partial<{ [key: string]: string | string[] }>,
    headers: { [key: string]: string | string[] | undefined },
    cookies: string[]
  ): Promise<string> => {
    // Get query string parameters to propagate on subsequent requests (e.g. for deployment protection bypass)
    const propagatedQsParams = this.getQueryParamsForPropagation(query);

    // Get headers to propagate on subsequent requests
    const propagatedHeaders = this.getHeadersForPropagation(headers);

    // Grab the Next.js preview cookies to send on to the render request
    propagatedHeaders.cookie = `${
      propagatedHeaders.cookie ? propagatedHeaders.cookie + ';' : ''
    }${cookies.join(';')}`;
    for (const key in propagatedQsParams) {
      if ({}.hasOwnProperty.call(propagatedQsParams, key)) {
        requestUrl.searchParams.append(key, propagatedQsParams[key]);
      }
    }
    requestUrl.searchParams.append('timestamp', Date.now().toString());

    const pageRes = await this.dataFetcher
      .get<string>(requestUrl.toString(), {
        credentials: 'include',
        headers: propagatedHeaders,
      })
      .catch((err) => {
        // We need to handle not found error provided by Vercel
        // for `fallback: false` pages
        if (err.response.status === 404) {
          return err.response;
        }

        throw err;
      });

    let html = pageRes.data;
    if (!html || html.length === 0) {
      throw new Error(`Failed to render html for ${requestUrl.toString()}`);
    }

    // replace phkey attribute with key attribute so that newly added renderings
    // show correct placeholders, so save and refresh won't be needed after adding each rendering
    html = html.replace(new RegExp('phkey', 'g'), 'key');

    // When SSG, Next will attempt to perform a router.replace on the client-side to inject the query string parms
    // to the router state. See https://github.com/vercel/next.js/blob/v10.0.3/packages/next/client/index.tsx#L169.
    // However, this doesn't really work since at this point we're in the editor and the location.search has nothing
    // to do with the Next route/page we've rendered. Beyond the extraneous request, this can result in a 404 with
    // certain route configurations (e.g. multiple catch-all routes).
    // The following line will trick it into thinking we're SSR, thus avoiding any router.replace.
    html = html.replace(STATIC_PROPS_ID, SERVER_PROPS_ID);

    return html;
  };

  /**
   * Gets the Content-Security-Policy header value
   * @returns Content-Security-Policy header value
   */
  protected getSCPHeader() {
    return `frame-ancestors 'self' ${[
      ...getAllowedOriginsFromEnv(),
      ...EDITING_ALLOWED_ORIGINS,
    ].join(' ')}`;
  }

  /**
   * Server URL Resolution order (highest to lowest priority):
   * 1. `config.sitecoreInternalEditingHostUrl` (explicitly set in config)
   * 2. Environment variable `SITECORE_INTERNAL_EDITING_HOST_URL`
   * 3. Fallbacks:
   *    - For XM Cloud deployments → `'http://localhost:3000'`
   *    - For all other cases → use the request `Host` header
   * Note we use https protocol on Vercel due to serverless function architecture.
   * In all other scenarios, including localhost (with or without a proxy e.g. ngrok)
   * and within a nodejs container, http protocol should be used.
   *
   * For information about the VERCEL environment variable, see
   * https://vercel.com/docs/environment-variables#system-environment-variables
   * @param {NextApiRequest} req
   */
  protected resolveServerUrl = (req: NextApiRequest) => {
    const internalHostUrl =
      this.config?.sitecoreInternalEditingHostUrl || process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    if (internalHostUrl) {
      return internalHostUrl;
    }

    // in xmc deployment we always use localhost:3000
    if (process.env.SITECORE) {
      return 'http://localhost:3000';
    }

    // to preserve auth headers, use https if we're in our 3 main hosting options
    const useHttps = (process.env.VERCEL || process.env.NETLIFY) !== undefined;
    // use https for requests with auth but also support unsecured http rendering hosts
    return `${useHttps ? 'https' : 'http'}://${req.headers.host}`;
  };

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
      presetCorsHeader: res.getHeader('Access-Control-Allow-Origin') as string,
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
        html: '<html><body>Missing or invalid secret</body></html>',
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

    const requiredQueryParams = getRequiredQueryParams(mode);

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

    res.setPreviewData(getEditingParams(query as { [key: string]: string }), {
      maxAge: 3,
    });

    // Set Preview mode identifier cookie, if the page is rendered in Sitecore Preview mode
    if (mode === LayoutServicePageState.Preview) {
      const previewCookies = getPreviewCookies(query.sc_site);

      res.setHeader('Set-Cookie', previewCookies);
    }

    // Restrict the page to be rendered only within the allowed origins
    res.setHeader('Content-Security-Policy', this.getSCPHeader());

    const encodedRoute = encodeURI(query.route);
    const route = this.config?.resolvePageUrl?.(encodedRoute) || encodedRoute;

    const base = this.resolveServerUrl(req);
    const requestUrl = new URL(route, base);
    const cookies = res.getHeader('Set-Cookie') as string[];

    // Make actual render request for page route, passing on preview cookies as well as any approved query string parameters.
    // Note timestamp effectively disables caching the request (no amount of cache headers seemed to do it)
    try {
      debug.editing('fetching page route for %s', query.route);

      const html = await this.getEditingRequestHtml(requestUrl, query, headers, cookies);
      
      // remove preview cookies to not leak them to the browser
      if (cookies && Array.isArray(cookies)) {
        const filteredCookies = getFilteredCookies(cookies);
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
