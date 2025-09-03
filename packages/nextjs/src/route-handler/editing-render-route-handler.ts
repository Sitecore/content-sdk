import { debug, NativeDataFetcher } from '@sitecore-content-sdk/core';
import {
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/core/editing';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/utils';
import { NextRequest } from 'next/server';
import { getEditingSecret } from '../utils/utils';
import { draftMode } from 'next/headers';
import {
  getEditingRequestHtml,
  getFilteredCookies,
  getHeadersForPropagation,
  getPreviewCookies,
  getQueryParamsForPropagation,
  getRequiredQueryParams,
  getSCPHeader,
  resolveServerUrl,
} from '../editing/utils';
import { LayoutServicePageState } from '@sitecore-content-sdk/react';

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
    const { body, method, headers } = req;
    // init query string values
    const query: EditingRenderQueryParams = {} as EditingRenderQueryParams;
    req.nextUrl.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    debug.editing('editing render middleware start: %o', {
      method,
      query,
      headers,
      body,
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
    const requiredQueryParams = getRequiredQueryParams(mode);

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

    let rawCookies = headers.get('cookie') || '';

    // Set Preview mode identifier cookie, if the page is rendered in Sitecore Preview mode
    if (mode === LayoutServicePageState.Preview) {
      const previewCookies = getPreviewCookies(query.sc_site);
      rawCookies = rawCookies.concat(previewCookies.join('; '));
    }
    responseHeaders['Set-Cookie'] = rawCookies;
    const cookies = req.cookies.getAll();

    const convertedCookies = cookies.map((c) => `${c.name}=${c.value}`);

    // Restrict the page to be rendered only within the allowed origins
    responseHeaders['Content-Security-Policy'] = getSCPHeader();

    const encodedRoute = encodeURI(query.route);
    const route = options?.resolvePageUrl?.(encodedRoute) || encodedRoute;

    const base = resolveServerUrl(req);
    const requestUrl = new URL(route, base);

    try {
      debug.editing('fetching page route for %s', query.route);
      // Get query string parameters to propagate on subsequent requests (e.g. for deployment protection bypass)
      const propagatedQsParams = getQueryParamsForPropagation(query as { [key: string]: string });

      // Get headers to propagate on subsequent requests
      const propagatedHeaders = getHeadersForPropagation(headers);
      const html = await getEditingRequestHtml(
        requestUrl,
        propagatedQsParams,
        propagatedHeaders,
        convertedCookies,
        dataFetcher
      );

      // disable draft mode after page is rendered
      await draft.disable();
      // remove nextjs preview cookies to not leak them to the browser
      const filteredCookies = getFilteredCookies(convertedCookies);
      responseHeaders['Set-Cookie'] = filteredCookies?.join('; ') || '';

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

  return { GET, OPTIONS };
};
