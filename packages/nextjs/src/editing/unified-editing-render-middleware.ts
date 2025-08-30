import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
import { STATIC_PROPS_ID, SERVER_PROPS_ID } from 'next/constants';
import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  DesignLibraryRenderPreviewData,
  PREVIEW_KEY,
  isDesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { getEditingSecret } from '../utils/utils';
import { RenderMiddlewareBase } from './render-middleware';
import {
  getAllowedOriginsFromEnv,
  getEnforcedCorsHeaders,
  enforceCors,
} from '@sitecore-content-sdk/core/utils';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/core/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/core/site';
import {
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from './constants';
import { draftMode } from 'next/headers';
import { IncomingHttpHeaders } from 'http';

/**
 * Configuration for the Editing Render Middleware.
 */
export type EditingRenderMiddlewareConfig = {
  resolvePageUrl?: (itemPath: string) => string;
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
 * Unified middleware for editing render support in both App Router and Pages Router
 */
export class EditingRenderMiddleware extends RenderMiddlewareBase {
  private dataFetcher: NativeDataFetcher;

  constructor(public config?: EditingRenderMiddlewareConfig) {
    super();
    this.dataFetcher = new NativeDataFetcher({ debugger: debug.editing });
  }

  /**
   * Gets the Pages Router handler
   */
  public getHandler(): (req: EditingNextApiRequest, res: NextApiResponse) => Promise<void> {
    return this.pagesHandler;
  }

  /**
   * Gets the App Router handler
   */
  public appRouterGetHandler() {
    return async (req: NextRequest): Promise<Response> => {
      const result = await this.handlerCommon(req);

      if (result.error) {
        return new Response(`<html><body>${result.error}</body></html>`, {
          status: result.status || 500,
          headers: result.headers,
        });
      }

      if (result.redirect) {
        return Response.redirect(result.redirect);
      }

      return new Response(result.html, {
        status: 200,
        headers: { ...result.headers, 'Content-Type': 'text/html; charset=utf-8' },
      });
    };
  }

  private pagesHandler = async (
    req: EditingNextApiRequest,
    res: NextApiResponse
  ): Promise<void> => {
    const result = await this.handlerCommon(req, res);

    Object.keys(result.headers).forEach((key) => {
      res.setHeader(key, result.headers[key]);
    });

    if (result.error) {
      return res.status(result.status || 500).json({
        html: `<html><body>${result.error}</body></html>`,
      });
    }

    if (result.preflight) {
      return res.status(204).send(null);
    }

    if (result.invalidMethod) {
      return res.status(405).json({
        html: `<html><body>Invalid request method '${req.method}'</body></html>`,
      });
    }

    res.status(200).send(result.html);
  };

  private async handlerCommon(
    req: NextApiRequest | NextRequest,
    res?: NextApiResponse
  ): Promise<CommonHandlerResult> {
    const { body, method, headers } = req;

    // Detect router type and extract query parameters
    const isAppRouter = !!(req as NextRequest).nextUrl;
    let query: Record<string, any>;

    if (isAppRouter) {
      const appReq = req as NextRequest;
      query = {};
      appReq.nextUrl.searchParams.forEach((value, key) => {
        query[key] = value;
      });
    } else {
      query = (req as EditingNextApiRequest).query as Record<string, any>;
    }

    debug.editing('editing render middleware start: %o', {
      method,
      query,
      headers,
      body,
    });

    // Handle CORS
    const presetCorsHeader =
      (res?.getHeader('Access-Control-Allow-Origin') as string) ||
      this.getHeader(req.headers, 'Access-Control-Allow-Origin') ||
      undefined;
    const appCorsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method || 'GET',
      headers: req.headers,
      presetCorsHeader,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!appCorsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return {
        error: `Requests from origin not allowed`,
        status: 401,
        headers: {},
      };
    }

    // Validate secret
    const secret = query[QUERY_PARAM_EDITING_SECRET] ?? body?.jssEditingSecret;
    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return {
        error: 'Missing or invalid secret',
        status: 401,
        headers: appCorsHeaders,
      };
    }

    // Handle preflight (Pages Router only)
    if (!isAppRouter && req.method === 'OPTIONS') {
      debug.editing('preflight request');
      return {
        preflight: true,
        headers: appCorsHeaders,
      };
    }

    // Validate method (Pages Router only)
    if (!isAppRouter && req.method !== 'GET') {
      debug.editing('invalid method - sent %s expected GET', req.method);
      return {
        invalidMethod: true,
        headers: appCorsHeaders,
      };
    }

    return await this.editModeRequest(req, res, query, appCorsHeaders, isAppRouter);
  }

  private async editModeRequest(
    req: NextApiRequest | NextRequest,
    res: NextApiResponse | undefined,
    query: Record<string, any>,
    corsHeaders: Record<string, string>,
    isAppRouter: boolean
  ): Promise<CommonHandlerResult> {
    const startTimestamp = Date.now();
    const mode = query.mode;

    // Validate required parameters
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
    const missingQueryParams = requiredQueryParams.filter((param) => !query[param]);

    if (missingQueryParams.length) {
      debug.editing('missing required query parameters: %o', missingQueryParams);
      return {
        error: `Missing required query parameters: ${missingQueryParams.join(', ')}`,
        status: 400,
        headers: corsHeaders,
      };
    }

    // Enable draft mode for App Router
    if (isAppRouter) {
      const draft = await draftMode();
      draft.enable();
    }

    // Normalize query
    query = this.normalizeQuery(query);

    // Set headers
    let responseHeaders = { ...corsHeaders };
    responseHeaders['Content-Security-Policy'] = this.getSCPHeader();

    // Cookies with the SameSite=Lax policy set by Next.js setPreviewData function causes CORS issue
    // when Next.js preview mode is activated, resulting the page to render in normal mode instead.
    // By replacing it with "SameSite=None; Secure", we ensure cookies are correctly sent with
    // cross-origin requests, allowing the page to be editable. This change should be reverted
    // once vercel addresses this open issue: https://github.com/vercel/next.js/issues/49927
    const setCookieHeader = this.getHeader(req.headers, 'Set-Cookie');

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

      // Handle preview cookies
      if (mode === LayoutServicePageState.Preview) {
        const previewSite = `${SITE_KEY}=${query.get(
          'sc_site'
        )}; Path=/; HttpOnly; SameSite=None; Secure`;
        const previewCookie = `${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`;

        modifiedCookies.push(previewSite, previewCookie);
      }
      responseHeaders['Set-Cookie'] = modifiedCookies.join(',');

      // Prepare request
      const encodedRoute = encodeURI(query.route);
      const route = this.config?.resolvePageUrl?.(encodedRoute) || encodedRoute;
      const base = this.resolveServerUrl(req);
      const requestUrl = new URL(route, base);

      // Get parameters and headers
      const params = this.getParamsForPropagation(query);
      const propagatedHeaders = this.getHeadersForPropagation(req.headers);

      // Handle cookies
      if (isAppRouter) {
        const cookies = (req.headers as Headers).get?.('Set-Cookie')?.split(',') || [];
        propagatedHeaders.cookie = `${
          propagatedHeaders.cookie ? propagatedHeaders.cookie + ';' : ''
        }${cookies.join(';')}`;
      } else {
        const cookies = (res?.getHeader('Set-Cookie') as string[]) || [];
        propagatedHeaders.cookie = `${
          propagatedHeaders.cookie ? propagatedHeaders.cookie + ';' : ''
        }${cookies.join(';')}`;
      }

      // Add params to URL
      for (const key in params) {
        if (params[key]) requestUrl.searchParams.append(key, params[key]);
      }
      requestUrl.searchParams.append('timestamp', Date.now().toString());

      try {
        debug.editing('fetching page route for %s', query.route);

        const pageRes = await this.dataFetcher
          .get<string>(requestUrl.toString(), {
            credentials: 'include',
            headers: propagatedHeaders,
          })
          .catch((err) => {
            if (err.response?.status === 404) return err.response;
            throw err;
          });

        let html = pageRes.data;
        if (!html || html.length === 0) {
          throw new Error(`Failed to render html for ${query.route}`);
        }

        // Process HTML
        html = html.replace(/phkey/g, 'key');
        html = html.replace(STATIC_PROPS_ID, SERVER_PROPS_ID);

        // Clean up preview mode
        if (isAppRouter) {
          const draft = await draftMode();
          await draft.disable();
          responseHeaders = this.cleanAppRouterCookies(req as NextRequest, responseHeaders);
        } else {
          this.cleanPagesRouterCookies(res as NextApiResponse);
        }

        debug.editing('editing render middleware end in %dms: %o', Date.now() - startTimestamp, {
          status: 200,
          route,
        });

        return { html, headers: responseHeaders };
      } catch (err) {
        debug.editing('error fetching page route %s: %o', requestUrl, err);

        if (isAppRouter) {
          debug.editing('falling back to redirect method...');
          return { redirect: route, headers: responseHeaders };
        }

        console.error(err);
        return { error: `${err}`, status: 500, headers: responseHeaders };
      }
    }
  }

  private getHeader(headers: Headers | IncomingHttpHeaders, name: string) {
    return (headers as IncomingHttpHeaders)[name] || (headers as Headers).get(name);
  }

  private normalizeQuery(query: Record<string, any>): Record<string, any> {
    const mode = query.mode;
    if (isDesignLibraryMode(mode)) {
      return {
        ...query,
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
      };
    } else {
      return {
        ...query,
        site: query.sc_site,
        itemId: query.sc_itemid,
        language: query.sc_lang,
        variantIds: query.sc_variant?.split(',') || [DEFAULT_VARIANT],
        version: query.sc_version,
        mode: query.mode,
        layoutKind: query.sc_layoutKind,
      };
    }
  }

  private getSCPHeader(): string {
    return `frame-ancestors 'self' ${[
      ...getAllowedOriginsFromEnv(),
      ...EDITING_ALLOWED_ORIGINS,
    ].join(' ')}`;
  }

  private resolveServerUrl(req: NextApiRequest | NextRequest): string {
    const internalHostUrl =
      this.config?.sitecoreInternalEditingHostUrl || process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
    if (internalHostUrl) return internalHostUrl;

    if (process.env.SITECORE) return 'http://localhost:3000';

    const useHttps = !!(process.env.VERCEL || process.env.SITECORE || process.env.NETLIFY);
    const host = this.getHeader(req.headers, 'host');
    return `${useHttps ? 'https' : 'http'}://${host}`;
  }

  private getParamsForPropagation(
    query: Record<string, any>
  ): Record<string, string> {
    let params: Record<string, string> = {};

    if (query[QUERY_PARAM_VERCEL_PROTECTION_BYPASS]) {
      params[QUERY_PARAM_VERCEL_PROTECTION_BYPASS] = query[QUERY_PARAM_VERCEL_PROTECTION_BYPASS];
    }
    if (query[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]) {
      params[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE] = query[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE];
    }

    if (isDesignLibraryMode(query.mode)) {
      return {
        ...params,
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode: query.mode,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
      };
    } else {
      return {
        ...params,
        site: query.sc_site,
        itemId: query.sc_itemid,
        language: query.sc_lang,
        variantIds: Array.isArray(query.sc_variant)
          ? query.sc_variant.join(',')
          : query.sc_variant || DEFAULT_VARIANT,
        version: query.sc_version,
        mode: query.mode,
        layoutKind: query.sc_layoutKind,
      };
    }
  }

  private cleanAppRouterCookies(
    req: NextRequest,
    headers: Record<string, string>
  ): Record<string, string> {
    const setCookieHeader = req.headers.get('Set-Cookie');
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      const filteredCookies = setCookieHeader.filter(
        (cookie: string) =>
          !/^__next_preview_data=/.test(cookie) && !/^__prerender_bypass=/.test(cookie)
      );
      headers['Set-Cookie'] = filteredCookies.join(',');
    }
    return headers;
  }

  private cleanPagesRouterCookies(res: NextApiResponse): void {
    const setCookieHeader = res.getHeader('Set-Cookie');
    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      const filteredCookies = setCookieHeader.filter(
        (cookie: string) =>
          !/^__next_preview_data=/.test(cookie) && !/^__prerender_bypass=/.test(cookie)
      );
      res.setHeader('Set-Cookie', filteredCookies);
    }
  }
}

interface CommonHandlerResult {
  html?: string;
  error?: string;
  status?: number;
  headers: Record<string, string>;
  preflight?: boolean;
  invalidMethod?: boolean;
  redirect?: string;
}
