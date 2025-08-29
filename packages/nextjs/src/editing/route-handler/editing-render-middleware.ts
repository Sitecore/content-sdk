import { NextApiRequest } from 'next';
import { STATIC_PROPS_ID, SERVER_PROPS_ID } from 'next/constants';
import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  PREVIEW_KEY,
  isDesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { getEditingSecret } from '../../utils/utils';
import { RenderMiddlewareBase } from '../render-middleware';
import { getAllowedOriginsFromEnv, getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
// import { DEFAULT_VARIANT } from '@sitecore-content-sdk/core/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/core/site';
import { NextRequest } from 'next/server';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from '../constants';
import { draftMode } from 'next/headers';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/core/personalize';

/**
 * Configuration for the Editing Render Middleware.
 */
export type AppRouterEditingRenderMiddlewareConfig = {
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
 */
export class AppRouterEditingRenderMiddleware extends RenderMiddlewareBase {
  private dataFetcher: NativeDataFetcher;
  /**
   * @param {EditingRenderMiddlewareConfig} [config] Editing render middleware config
   */
  constructor(public config?: AppRouterEditingRenderMiddlewareConfig) {
    super();
    this.dataFetcher = new NativeDataFetcher({ debugger: debug.editing });
  }

  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: NextRequest) => Promise<Response> {
    return this.handler;
  }

  /**
   * Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)
   * @param {object} query Object of query parameters from incoming URL
   * @returns Object of approved query parameters
   */
  protected getUrlSearchParamsForPropagation = (
    query: URLSearchParams,
  ): { [key: string]: string | null } => {
    let params: { [key: string]: string | null } = {};
    if (query.get(QUERY_PARAM_VERCEL_PROTECTION_BYPASS)) {
      params[QUERY_PARAM_VERCEL_PROTECTION_BYPASS] = query.get(
        QUERY_PARAM_VERCEL_PROTECTION_BYPASS
      ) as string;
    }
    if (query.get(QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE)) {
      params[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE] = query.get(
        QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE
      ) as string;
    }
    if (isDesignLibraryMode(query.get('mode'))) {
      params = {
        ...params,
        itemId: query.get('sc_itemid'),
        componentUid: query.get('sc_uid'),
        renderingId: query.get('sc_renderingId'),
        language: query.get('sc_lang'),
        site: query.get('sc_site'),
        mode: query.get('mode'),
        dataSourceId: query.get('dataSourceId'),
        version: query.get('sc_version'),
      };
    } else {
      params = {
        ...params,
        site: query.get('sc_site'),
        itemId: query.get('sc_itemid'),
        language: query.get('sc_lang'),
        // for sc_variantId we may employ multiple variants (page-layout + component level)
        variantIds: query.get('sc_variant') || DEFAULT_VARIANT,
        version: query.get('sc_version'),
        mode: query.get('mode'),
        layoutKind: query.get('sc_layoutKind'),
      };
    }

    return params;
  };

  /**
   * Gets the Content-Security-Policy header value
   * @returns Content-Security-Policy header value
   */
  private getSCPHeader() {
    return `frame-ancestors 'self' ${[
      ...getAllowedOriginsFromEnv(),
      ...EDITING_ALLOWED_ORIGINS,
    ].join(' ')}`;
  }

  /**
   * Server URL resolution. Use config.sitecoreInternalEditingHostUrl if provided, else SITECORE_INTERNAL_EDITING_HOST_URL if provided, otherwise use host header
   * Note we use https protocol on Vercel due to serverless function architecture.
   * In all other scenarios, including localhost (with or without a proxy e.g. ngrok)
   * and within a nodejs container, http protocol should be used.
   *
   * For information about the VERCEL environment variable, see
   * https://vercel.com/docs/environment-variables#system-environment-variables
   * @param {NextApiRequest} req
   */
  private resolveServerUrl = (req: NextRequest) => {
    const internalHostUrl =
      this.config?.sitecoreInternalEditingHostUrl || process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    if (internalHostUrl) {
      return internalHostUrl;
    }

    // to preserve auth headers, use https if we're in our 3 main hosting options
    const useHttps =
      (process.env.VERCEL || process.env.SITECORE || process.env.NETLIFY) !== undefined;
    // use https for requests with auth but also support unsecured http rendering hosts
    return `${useHttps ? 'https' : 'http'}://${req.headers.get('host')}`;
  };

  private handler = async (req: NextRequest): Promise<Response> => {
    const { body, method, headers } = req;
    let query = req.nextUrl.searchParams;

    let responseHeaders: { [key: string]: string } = {};

    debug.editing('editing render middleware start: %o', {
      method,
      query,
      headers,
      body,
    });

    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: req.headers,
      presetCorsHeader: req.headers.get('access-control-allow-origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!corsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return new Response(
        `<html><body>Requests from origin ${req.headers.get('origin')} not allowed</body></html>`,
        { status: 401 }
      );
    }

    responseHeaders = { ...responseHeaders, ...corsHeaders };

    // Validate secret
    const secret = query.get(QUERY_PARAM_EDITING_SECRET);
    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return Response.json(
        {
          html: '<html><body>Missing or invalid secret</body></html>',
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const draft = await draftMode();
    draft.enable();

    const startTimestamp = Date.now();

    const mode = query.get('mode');
    const defaultRequiredParams = ['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode'];

    const componentRequiredParams = [
      'sc_site',
      'sc_itemid',
      'sc_renderingId',
      'sc_uid',
      'sc_lang',
      'mode',
    ];
    const requiredQueryParams = isDesignLibraryMode(mode)
      ? componentRequiredParams
      : defaultRequiredParams;

    const missingQueryParams = requiredQueryParams.filter((param) => !query.get(param));

    // Validate query parameters
    if (missingQueryParams.length) {
      debug.editing('missing required query parameters: %o', missingQueryParams);

      return Response.json(
        {
          html: `<html><body>Missing required query parameters: ${missingQueryParams.join(
            ', '
          )}</body></html>`,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Cookies with the SameSite=Lax policy set by Next.js setPreviewData function causes CORS issue
    // when Next.js preview mode is activated, resulting the page to render in normal mode instead.
    // By replacing it with "SameSite=None; Secure", we ensure cookies are correctly sent with
    // cross-origin requests, allowing the page to be editable. This change should be reverted
    // once vercel addresses this open issue: https://github.com/vercel/next.js/issues/49927
    const setCookieHeader = headers.get('Set-Cookie');

    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      const modifiedCookies = setCookieHeader.map((cookie) => {
        const cookieIdentifiers: { [key: string]: RegExp } = {
          __prerender_bypass: /^__prerender_bypass=/,
          __next_preview_data: /^__next_preview_data=/,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        for (const [_, regex] of Object.entries(cookieIdentifiers)) {
          if (cookie.match(regex)) {
            return cookie.replace(/SameSite=Lax/, 'SameSite=None; Secure');
          }
        }
        return cookie;
      });

      // Set Preview mode identifier cookie, if the page is rendered in Sitecore Preview mode
      if (mode === LayoutServicePageState.Preview) {
        const previewSite = `${SITE_KEY}=${query.get(
          'sc_site'
        )}; Path=/; HttpOnly; SameSite=None; Secure`;
        const previewCookie = `${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`;

        modifiedCookies.push(previewSite, previewCookie);
      }
      responseHeaders['Set-Cookie'] = modifiedCookies.join(',');
    }

    // Restrict the page to be rendered only within the allowed origins
    responseHeaders['Content-Security-Policy'] = this.getSCPHeader();

    const encodedRoute = encodeURI(query.get('route') as string);
    const route = this.config?.resolvePageUrl?.(encodedRoute) || encodedRoute;

    const base = this.resolveServerUrl(req);
    const requestUrl = new URL(route, base);

    // Get query string parameters to propagate on subsequent requests (e.g. for deployment protection bypass)
    const params = this.getUrlSearchParamsForPropagation(query);

    // Get headers to propagate on subsequent requests
    const propagatedHeaders = this.getHeadersForPropagation(headers);

    // Grab the Next.js preview cookies to send on to the render request
    const cookies = headers.get('Set-Cookie')?.split(',') as string[];
    propagatedHeaders.cookie = `${
      propagatedHeaders.cookie ? propagatedHeaders.cookie + ';' : ''
    }${cookies? cookies.join(';'): ''}`;

    // Make actual render request for page route, passing on preview cookies as well as any approved query string parameters.
    // Note timestamp effectively disables caching the request (no amount of cache headers seemed to do it)
    for (const key in params) {
      if ({}.hasOwnProperty.call(params, key)) {
        params[key] && requestUrl.searchParams.append(key, params[key]);
      }
    }
    requestUrl.searchParams.append('timestamp', Date.now().toString());

    try {
      debug.editing('fetching page route for %s', query.get('route'));

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
        throw new Error(`Failed to render html for ${query.get('route')}`);
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

      // remove preview cookies to not leak them to the browser
      const setCookieHeader = headers.get('Set-Cookie');
      if (setCookieHeader && Array.isArray(setCookieHeader)) {
        // Filter out Next.js preview cookies
        const filteredCookies = setCookieHeader.filter(
          (cookie: string) =>
            !/^__next_preview_data=/.test(cookie) && !/^__prerender_bypass=/.test(cookie)
        );

        responseHeaders['Set-Cookie'] = filteredCookies.join(',');
      }

      debug.editing('editing render middleware end in %dms: %o', Date.now() - startTimestamp, {
        status: 200,
        route,
      });

      responseHeaders['Content-Type'] = 'text/html; charset=utf-8';

      return new Response(html, { status: 200, headers: responseHeaders });
    } catch (err) {
      debug.editing('error fetching page route %s: %o', requestUrl, err);
      debug.editing('falling back to redirect method... ');

      debug.editing(
        'editing render middleware end in %dms: redirect %o',
        Date.now() - startTimestamp,
        {
          status: 307,
          route,
        }
      );

      return Response.redirect(route);
    }
  };
}
