import {
  DesignLibraryRenderPreviewData,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  isDesignLibraryMode,
  PREVIEW_KEY,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import { DEFAULT_VARIANT } from '@sitecore-content-sdk/content/personalize';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import {
  EDITING_PASS_THROUGH_HEADERS,
  QUERY_PARAM_VERCEL_PROTECTION_BYPASS,
  QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE,
} from './constants';
import { IncomingHttpHeaders } from 'http';
import { SERVER_PROPS_ID, STATIC_PROPS_ID } from 'next/constants';
import { NativeDataFetcher } from '@sitecore-content-sdk/core';
import { getAllowedOriginsFromEnv } from '@sitecore-content-sdk/core/tools';
import { AllowedQueryParams, GetAllowedQueryParamsResult } from './types';

/**
 * Gets editing secret value from request
 * @param {NextApiRequest | NextRequest} req incoming request
 * @returns {string | undefined} editing secret value if present
 */
export const getEditingSecretFromRequest = (req: NextApiRequest | NextRequest) => {
  const reqQuery = (req as NextApiRequest).query;
  const reqUrl = (req as NextRequest).url;

  let secret = undefined;

  if (reqQuery) {
    // pages router
    secret = reqQuery[QUERY_PARAM_EDITING_SECRET];
  } else if (reqUrl) {
    // app router
    const url = new URL(reqUrl);
    secret = url.searchParams.get(QUERY_PARAM_EDITING_SECRET);
  }

  return secret;
};

/**
 * Parses query string and its parameters to required editing parameters
 * @param {{ [key: string]: string | undefined }} query query string values
 * @returns {EditingRenderQueryParams} editing parameters
 */
export const mapEditingParams = (query: {
  [key: string]: string | undefined;
}): { [key: string]: string | undefined } => {
  const params = isDesignLibraryMode(query.mode)
    ? {
        itemId: query.sc_itemid,
        componentUid: query.sc_uid,
        renderingId: query.sc_renderingId,
        language: query.sc_lang,
        site: query.sc_site,
        mode: query.mode,
        dataSourceId: query.dataSourceId,
        version: query.sc_version,
        generation: query.generation,
      }
    : {
        site: query.sc_site,
        itemId: query.sc_itemid,
        language: query.sc_lang,
        variantId: query.sc_variant || DEFAULT_VARIANT,
        version: query.sc_version,
        mode: query.mode,
        layoutKind: query.sc_layoutKind,
      };
  return params;
};

/**
 * Parses the query parameters based on the provided allowed parameters or a resolver function, to extract additional parameters that should be allowed.
 * @param {{ [key: string]: string | undefined }} queryParams Object of query parameters from incoming URL.
 * @param {AllowedQueryParams} allowedParams Allowed parameters to map.
 * @returns Object containing the list of missing required parameters and the allowed query parameters that were extracted.
 * @internal
 */
export const getAllowedQueryParams = (
  queryParams: { [key: string]: unknown },
  allowedParams?: AllowedQueryParams
): GetAllowedQueryParamsResult => {
  const allowedQueryParamsList =
    typeof allowedParams === 'function'
      ? allowedParams(Object.keys(queryParams))
      : Array.isArray(allowedParams)
      ? allowedParams
      : [];

  if (!allowedQueryParamsList.length) return { missingAllowedParams: [], allowedQueryParams: {} };

  return allowedQueryParamsList.reduce(
    (acc, param) => {
      const name = typeof param === 'string' ? param : param.name;
      const required = typeof param === 'string' ? false : param.required;

      const value = queryParams[name];
      if (value !== undefined) {
        acc.allowedQueryParams[name] = value;

        return acc;
      }

      if (required) acc.missingAllowedParams.push(name);

      return acc;
    },
    { missingAllowedParams: [], allowedQueryParams: {} } as GetAllowedQueryParamsResult
  );
};

/**
 * Preview cookies constants referenced within the sdk
 * @public
 */
export const PREVIEW_COOKIES = {
  PREVIEW_DATA: '__next_preview_data',
  PRERENDER_BYPASS: '__prerender_bypass',
  PREVIEW_TOKEN: 'sc_preview_token',
};

/**
 * Filters out Next.js preview cookies from a cookie string or array
 * @param {string | string[] | null} cookies cookie header value
 * @returns {string[] | null} filtered cookies
 */
export const cleanupNextPreviewCookies = (cookies: string | string[] | null) => {
  if (!cookies) {
    return null;
  }
  if (!Array.isArray(cookies)) {
    cookies = cookies.split(',');
  }
  // Filter out Next.js preview cookies
  const filteredCookies = cookies.filter(
    (cookie: string) =>
      !new RegExp(`^${PREVIEW_COOKIES.PREVIEW_DATA}=`).test(cookie) &&
      !new RegExp(`^${PREVIEW_COOKIES.PRERENDER_BYPASS}=`).test(cookie)
  );
  return filteredCookies;
};

/**
 * Gets the Next.js preview cookies to enable preview mode
 * @param {string} site current site name
 * @returns {string[]} list of cookies to set
 */
export const getPreviewCookies = (site: string) => {
  const previewSite = `${SITE_KEY}=${site}; Path=/; HttpOnly; SameSite=None; Secure`;
  const previewCookie = `${PREVIEW_KEY}=true; Path=/; HttpOnly; SameSite=None; Secure`;
  return [previewSite, previewCookie];
};

/**
 * Returns the list of required query parameters based on the page editing mode
 * @param {DesignLibraryMode | LayoutServicePageState.Preview | LayoutServicePageState.Edit} mode current page mode
 * @returns {string[]} list of required parameters for validation
 */
export const getRequiredEditingParamsList = (mode: EditingRenderQueryParams['mode']) => {
  const baseRequiredParams = ['sc_site', 'sc_itemid', 'sc_lang'];
  const editingRequiredParams = [...baseRequiredParams, 'route', 'mode'];
  const componentRequiredParams = [...baseRequiredParams, 'sc_uid', 'mode'];
  return isDesignLibraryMode(mode) ? componentRequiredParams : editingRequiredParams;
};

/**
 * Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)
 * @param {object} query Object of query parameters from incoming URL
 * @returns Object of approved query parameters
 * @internal
 */
export const getQueryParamsForPropagation = (
  query: Partial<{ [key: string]: string | string[] }>
): { [key: string]: string } => {
  const params: { [key: string]: string } = {};
  if (query[QUERY_PARAM_VERCEL_PROTECTION_BYPASS]) {
    params[QUERY_PARAM_VERCEL_PROTECTION_BYPASS] = query[
      QUERY_PARAM_VERCEL_PROTECTION_BYPASS
    ] as string;
  }
  if (query[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE]) {
    params[QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE] = query[
      QUERY_PARAM_VERCEL_SET_BYPASS_COOKIE
    ] as string;
  }
  return params;
};

/**
 * Get headers that should be passed along to subsequent requests
 * @param {IncomingHttpHeaders} headers Incoming HTTP Headers
 * @returns Object of approved headers
 * @internal
 */
export const getHeadersForPropagation = (
  headers: IncomingHttpHeaders | Headers
): { [key: string]: string } => {
  // Filter and normalize headers
  const filteredHeaders = EDITING_PASS_THROUGH_HEADERS.reduce((acc, header) => {
    const value = (headers as Headers).get
      ? (headers as Headers).get(header)
      : (headers as IncomingHttpHeaders)[header];
    if (value) {
      acc[header] = Array.isArray(value) ? value.join(', ') : value;
    }
    return acc;
  }, {} as Record<string, string>);

  return filteredHeaders;
};

/**
 * Performs an internal request to get the HTML for the editing mode
 * @param {string} requestUrl URL to send request to
 * @param {object} propagatedQsParams query string params to use with request
 * @param {object} propagatedHeaders headers to use with request
 * @param {string[]} cookies cookies to use with request
 * @param {NativeDataFetcher} dataFetcher NativeFetcher instance to send request with
 * @returns {string} HTML with editing markup
 */
export const getEditingRequestHtml = async (
  requestUrl: URL,
  propagatedQsParams: { [key: string]: string | undefined },
  propagatedHeaders: { [key: string]: string },
  cookies: string[],
  dataFetcher: NativeDataFetcher
): Promise<string> => {
  // Grab the Next.js preview cookies to send on to the render request
  propagatedHeaders.cookie = `${
    propagatedHeaders.cookie ? propagatedHeaders.cookie + ';' : ''
  }${cookies.join(';')}`;
  // enable content sdk preview
  propagatedHeaders.__content_sdk_preview = '1';

  for (const key in propagatedQsParams) {
    if ({}.hasOwnProperty.call(propagatedQsParams, key)) {
      propagatedQsParams[key] && requestUrl.searchParams.append(key, propagatedQsParams[key]);
    }
  }
  requestUrl.searchParams.append('timestamp', Date.now().toString());

  const pageRes = await dataFetcher
    .get<string>(requestUrl.toString(), {
      credentials: 'include',
      headers: propagatedHeaders,
    })
    .catch((err) => {
      // We need to handle not found error provided by Vercel
      // for `fallback: false` pages
      // Or preview content is not found or access is denied
      if (
        err.response.status === 404 ||
        err.response.status === 403 ||
        err.response.status === 500
      ) {
        return err.response;
      }

      throw err;
    });

  // pageRes.data.html can be passed by middleware
  let html = typeof pageRes.data === 'string' ? pageRes.data : pageRes.data?.html || '';
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
 * Type guard for Design Library mode
 * @param {object} data preview data to check
 * @returns true if the data is EditingPreviewData
 * @see EditingPreviewData
 * @public
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
export const resolveServerUrl = (req: NextApiRequest | NextRequest) => {
  const internalHostUrl = process.env.SITECORE_INTERNAL_EDITING_HOST_URL;
  if (internalHostUrl) {
    return internalHostUrl;
  }

  // in xmc deployment we always use localhost:3000
  if (process.env.SITECORE) {
    return 'http://localhost:3000';
  }

  // to preserve auth headers, use https if we're in our 3 main hosting options
  const useHttps = (process.env.VERCEL || process.env.NETLIFY) !== undefined;
  const host = (req.headers as Headers).get
    ? (req.headers as Headers).get('x-forwarded-host') || (req.headers as Headers).get('host')
    : (req as NextApiRequest).headers['x-forwarded-host'] || (req as NextApiRequest).headers.host;

  // use https for requests with auth but also support unsecured http rendering hosts
  return `${useHttps ? 'https' : 'http'}://${host}`;
};

/**
 * Gets the Content-Security-Policy header value
 * @returns Content-Security-Policy header value
 */
export const getCSPHeader = () => {
  return `frame-ancestors 'self' ${[...getAllowedOriginsFromEnv(), ...EDITING_ALLOWED_ORIGINS].join(
    ' '
  )}`;
};
