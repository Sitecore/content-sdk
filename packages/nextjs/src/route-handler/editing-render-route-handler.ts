import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  PREVIEW_KEY,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/core/editing';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';
import { NextRequest } from 'next/server';
import { getEditingSecret } from '../utils/utils';
import { draftMode, cookies as nextCokies } from 'next/headers';
import {
  mapEditingParams,
  getEditingRequestHtml,
  cleanupNextPreviewCookies,
  getHeadersForPropagation,
  getQueryParamsForPropagation,
  getRequiredEditingParamsList,
  getCSPHeader,
  resolveServerUrl,
  PreviewCookies,
} from '../editing/utils';
import { SITE_KEY } from '@sitecore-content-sdk/core/site';

/**
 * Helper function to handle cookie operations - can be mocked for testing
 * @returns {Promise<NextCookies>} Next cookies
 */
export async function getNextCookies() {
  // In test environment, use mock cookie store only if specifically provided
  if (process.env.TEST === 'true' && (global as any).__TEST_COOKIE_STORE__) {
    return (global as any).__TEST_COOKIE_STORE__;
  }
  return await nextCokies();
}

type EditingHandlerOptions = {
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

export const createEditingRenderRouteHandlers = (options: EditingHandlerOptions) => {
  const dataFetcher = new NativeDataFetcher({ debugger: debug.editing });

  const OPTIONS = (req: NextRequest) => {
    // init query string values
    const query: EditingRenderQueryParams = {} as EditingRenderQueryParams;
    req.nextUrl.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    const expectedCorsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: req.headers,
      presetCorsHeader: req.headers?.get('Access-Control-Allow-Origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!expectedCorsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return new Response(
        `<html><body>Requests from origin ${req.headers.get('origin')} not allowed</body></html>`,
        { status: 401 }
      );
    }
    debug.editing('preflight request');
    return new Response(null, { status: 204, headers: expectedCorsHeaders });
  };

  const GET = async (req: NextRequest) => {
    const { method, headers } = req;
    // init query string values
    const query: EditingRenderQueryParams = {} as EditingRenderQueryParams;
    req.nextUrl.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    debug.editing('editing render handler start: %o', {
      method,
      query,
      headers,
    });

    const expectedCorsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: headers,
      presetCorsHeader: headers.get('Access-Control-Allow-Origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!expectedCorsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return new Response(
        `<html><body>Requests from origin ${req.headers.get('origin')} not allowed</body></html>`,
        { status: 401 }
      );
    }

    const responseHeaders: { [key: string]: string } = expectedCorsHeaders;

    // Validate secret
    const secret = query[QUERY_PARAM_EDITING_SECRET];
    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return Response.json(
        {
          html: '<html><body>Missing or invalid secret</body></html>',
        },
        { status: 401, headers: responseHeaders }
      );
    }

    // enable preview
    const draft = await draftMode();
    draft.enable();

    const startTimestamp = Date.now();

    const mode = query.mode;
    const requiredQueryParams = getRequiredEditingParamsList(mode);

    const missingQueryParams = requiredQueryParams.filter((param) => !query[param]);

    // Validate query parameters
    if (missingQueryParams.length) {
      debug.editing('missing required query parameters: %o', missingQueryParams);

      return Response.json(
        {
          html: `<html><body>Missing required query parameters: ${missingQueryParams.join(
            ', '
          )}</body></html>`,
        },
        { status: 400, headers: responseHeaders }
      );
    }

    const encodedRoute = encodeURI(query.route);
    const route = options?.resolvePageUrl?.(encodedRoute) || encodedRoute;

    const base = resolveServerUrl(req);
    const requestUrl = new URL(route, base);

    // Restrict the page to be rendered only within the allowed origins
    responseHeaders['Content-Security-Policy'] = getCSPHeader();

    const cookieStore = await getNextCookies();
    cookieStore.set(
      PreviewCookies.PRERENDER_BYPASS,
      cookieStore.get(PreviewCookies.PRERENDER_BYPASS)?.value || '',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      }
    );

    // Set Preview mode identifier cookies, if the page is rendered in Sitecore Preview mode
    if (mode === LayoutServicePageState.Preview) {
      cookieStore.set(PREVIEW_KEY, 'true', {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
      cookieStore.set(SITE_KEY, query.sc_site, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      });
    }

    const convertedCookies = cookieStore.getAll().map((c: NextCookie) => `${c.name}=${c.value}`);

    try {
      debug.editing('fetching page route for %s', query.route);
      // Get query string parameters to propagate on subsequent requests (e.g. for deployment protection bypass)
      // Additionally ,in app router preview data is passed through query string instead of preview data cookie
      const propagatedQsParams = {
        ...getQueryParamsForPropagation(query as { [key: string]: string }),
        ...mapEditingParams(query as { [key: string]: string }),
      };
      // Get headers to propagate on subsequent requests
      const propagatedHeaders = getHeadersForPropagation(headers);
      const html = await getEditingRequestHtml(
        requestUrl,
        propagatedQsParams,
        propagatedHeaders,
        convertedCookies,
        dataFetcher
      );

      // remove nextjs preview cookies to not leak them to the browser
      const filteredCookies = cleanupNextPreviewCookies(convertedCookies);
      responseHeaders['Set-Cookie'] = filteredCookies?.join('; ') || '';

      debug.editing('editing render handler end in %dms: %o', Date.now() - startTimestamp, {
        status: 200,
        route,
      });

      responseHeaders['Content-Type'] = 'text/html; charset=utf-8';

      return new Response(html, { status: 200, headers: responseHeaders });
    } catch (err) {
      debug.editing('error fetching page route %s: %o', requestUrl, err);
      debug.editing('falling back to redirect method... ');

      debug.editing(
        'editing render handler end in %dms: redirect %o',
        Date.now() - startTimestamp,
        {
          status: 307,
          route,
        }
      );

      return Response.redirect(route);
    } finally {
      await draft.disable();
    }
  };

  /**
   * This POST handler serves as proxy for server action call when Design Library is rendering server component.
   * When Design Library needs to dynamically update or render a generated variant of server component a server action {@link updateServerComponentAction} is called from the client side.
   * The way server functions work is that the action call is made to the same URL with POST method, which in normal page render is handled internally by Next.js.
   * However, in editing mode we are in an api route handler scenario so we need to proxy the POST request to be able to process the server action correctly.
   * @param {NextRequest} req - The incoming request
   */
  const POST = async (req: NextRequest) => {
    const expectedCorsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: req.headers,
      presetCorsHeader: req.headers.get('Access-Control-Allow-Origin') as string,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!expectedCorsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return new Response(
        `<html><body>Requests from origin ${req.headers.get('origin')} not allowed</body></html>`,
        { status: 401 }
      );
    }

    // Validate secret
    const secret = req.nextUrl.searchParams.get(QUERY_PARAM_EDITING_SECRET);
    if (secret !== getEditingSecret()) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, getEditingSecret());
      return Response.json(
        {
          html: '<html><body>Missing or invalid secret</body></html>',
        },
        { status: 401, headers: expectedCorsHeaders }
      );
    }

    const originalUrl = new URL(req.url);
    const queryString = originalUrl.search;
    const targetUrl = new URL(`/${queryString}`, req.url).toString();

    // enable draft mode in order to add prerender bypass cookie to request
    const draft = await draftMode();
    draft.enable();

    // add prerender bypass cookie to forwarded request in order to enable draft mode
    const cookieStore = await getNextCookies();
    const reqCookie = req.headers.get('cookie') || '';
    const prerenderBypassCookie = `${PreviewCookies.PRERENDER_BYPASS}=${
      cookieStore.get(PreviewCookies.PRERENDER_BYPASS)?.value || ''
    }`;
    const forwardCookie = reqCookie
      ? `${reqCookie}; ${prerenderBypassCookie}`
      : prerenderBypassCookie;

    const forwardHeaders = new Headers(req.headers);
    forwardHeaders.set('cookie', forwardCookie);

    const forwardedResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: req.body,
      duplex: 'half',
    } as any);

    // Filter out x-middleware headers since rewrites are not allowed in route handlers
    // Also filter out content-encoding and content-length to avoid issues when browser reads the payload
    const filteredHeaders = new Headers();
    forwardedResponse.headers.forEach((value, key) => {
      if (
        key !== 'x-middleware-next' &&
        key !== 'x-middleware-rewrite' &&
        key !== 'content-encoding' &&
        key !== 'content-length'
      ) {
        filteredHeaders.set(key, value);
      }
    });

    // Restrict the page to be rendered only within the allowed origins
    filteredHeaders.set('Content-Security-Policy', getCSPHeader());

    // add expected CORS headers to response
    Object.entries(expectedCorsHeaders as Record<string, string>).forEach(
      ([key, value]: [string, string]) => {
        filteredHeaders.set(key, value);
      }
    );

    // remove nextjs preview cookies to not leak them to the browser
    const filteredCookies = cleanupNextPreviewCookies(filteredHeaders.get('Set-Cookie'));
    filteredHeaders.set('Set-Cookie', filteredCookies?.join('; ') || '');

    const body = await forwardedResponse.text();

    return new Response(body, {
      status: forwardedResponse.status,
      statusText: forwardedResponse.statusText,
      headers: filteredHeaders,
    });
  };

  return { GET, POST, OPTIONS };
};

type NextCookie = {
  name: string;
  value: string;
};
