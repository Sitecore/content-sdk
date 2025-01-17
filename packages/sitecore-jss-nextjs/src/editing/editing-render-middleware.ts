import { NextApiRequest, NextApiResponse } from 'next';
import { debug } from '@sitecore-jss/sitecore-jss';
import { LayoutServicePageState } from '@sitecore-jss/sitecore-jss/layout';
import {
  QUERY_PARAM_EDITING_SECRET,
  EDITING_ALLOWED_ORIGINS,
  EditingRenderQueryParams,
  LayoutKind,
} from '@sitecore-jss/sitecore-jss/editing';
import { getJssEditingSecret } from '../utils/utils';
import { RenderMiddlewareBase } from './render-middleware';
import { enforceCors, getAllowedOriginsFromEnv } from '@sitecore-jss/sitecore-jss/utils';
import { DEFAULT_VARIANT } from '@sitecore-jss/sitecore-jss/personalize';

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
};

/**
 * Next.js API request with editing request query parameters.
 */
export type EditingNextApiRequest = NextApiRequest & {
  query: EditingRenderQueryParams;
};

/**
 * Data for Next.js Preview (Editing) Mode.
 */
export type EditingPreviewData = {
  site: string;
  itemId: string;
  language: string;
  pageState: Exclude<LayoutServicePageState, 'Normal'>;
  variantIds: string[];
  version?: string;
  layoutKind?: LayoutKind;
};

/**
 * Data for Component Library rendering mode
 */
export interface ComponentLibraryRenderPreviewData {
  site: string;
  itemId: string;
  renderingId: string;
  componentUid: string;
  language: string;
  pageState: LayoutServicePageState;
  mode?: 'library';
  variant?: string;
  version?: string;
  dataSourceId?: string;
}

/**
 * Type guard for Component Library mode
 * @param {object} data preview data to check
 * @returns true if the data is EditingPreviewData
 * @see EditingPreviewData
 */
export const isComponentLibraryPreviewData = (
  data: unknown
): data is ComponentLibraryRenderPreviewData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'mode' in data &&
    (data as ComponentLibraryRenderPreviewData).mode === 'library'
  );
};

/**
 * Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
 * which is required for Sitecore editing support.
 */
export class EditingRenderMiddleware extends RenderMiddlewareBase {
  /**
   * @param {EditingRenderMiddlewareConfig} [config] Editing render middleware config
   */
  constructor(public config?: EditingRenderMiddlewareConfig) {
    super();
  }

  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: EditingNextApiRequest, res: NextApiResponse) => Promise<void> {
    return this.handler;
  }

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

  private handler = async (req: EditingNextApiRequest, res: NextApiResponse): Promise<void> => {
    const { query, body, method, headers } = req;

    debug.editing('editing render middleware start: %o', {
      method,
      query,
      headers,
      body,
    });

    if (!enforceCors(req, res, EDITING_ALLOWED_ORIGINS)) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      return res.status(401).json({
        html: `<html><body>Requests from origin ${req.headers?.origin} not allowed</body></html>`,
      });
    }

    // Validate secret
    const secret = query[QUERY_PARAM_EDITING_SECRET] ?? body?.jssEditingSecret;
    if (secret !== getJssEditingSecret()) {
      debug.editing(
        'invalid editing secret - sent "%s" expected "%s"',
        secret,
        getJssEditingSecret()
      );
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
    const defaultRequiredParams = ['sc_site', 'sc_itemid', 'sc_lang', 'route', 'mode'];

    const componentRequiredParams = [
      'sc_site',
      'sc_itemid',
      'sc_renderingId',
      'sc_uid',
      'sc_lang',
      'mode',
    ];
    const requiredQueryParams =
      mode === 'library' ? componentRequiredParams : defaultRequiredParams;

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

    if (mode === 'library') {
      // dedicated route and layout to SSR component library
      query.route = '/component-library/render';
      res.setPreviewData(
        {
          itemId: query.sc_itemid,
          componentUid: query.sc_uid,
          renderingId: query.sc_renderingId,
          language: query.sc_lang,
          site: query.sc_site,
          pageState: LayoutServicePageState.Normal,
          mode: 'library',
          dataSourceId: query.sc_datasourceId,
          variant: query.sc_variant || DEFAULT_VARIANT,
          version: query.sc_version,
        } as ComponentLibraryRenderPreviewData,
        {
          maxAge: 3,
        }
      );
    } else {
      res.setPreviewData(
        {
          site: query.sc_site,
          itemId: query.sc_itemid,
          language: query.sc_lang,
          // for sc_variantId we may employ multiple variants (page-layout + component level)
          variantIds: query.sc_variant?.split(',') || [DEFAULT_VARIANT],
          version: query.sc_version,
          pageState: query.mode,
          layoutKind: query.sc_layoutKind,
        } as EditingPreviewData,
        // Cache the preview data for 3 seconds to ensure the page is rendered with the correct preview data not the cached one
        {
          maxAge: 3,
        }
      );
    }

    // Cookies with the SameSite=Lax policy set by Next.js setPreviewData function causes CORS issue
    // when Next.js preview mode is activated, resulting the page to render in normal mode instead.
    // By replacing it with "SameSite=None; Secure", we ensure cookies are correctly sent with
    // cross-origin requests, allowing the page to be editable. This change should be reverted
    // once vercel addresses this open issue: https://github.com/vercel/next.js/issues/49927
    const setCookieHeader = res.getHeader('Set-Cookie');

    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      const modifiedCookies = setCookieHeader.map((cookie) => {
        const cookieIdentifiers: { [key: string]: RegExp } = {
          __prerender_bypass: /^__prerender_bypass=/,
          __next_preview_data: /^__next_preview_data=/,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, regex] of Object.entries(cookieIdentifiers)) {
          if (cookie.match(regex)) {
            return cookie.replace(/SameSite=Lax/, 'SameSite=None; Secure');
          }
        }
        return cookie;
      });

      res.setHeader('Set-Cookie', modifiedCookies);
    }

    const route = this.config?.resolvePageUrl?.(query.route) || query.route;

    debug.editing(
      'editing render middleware end in %dms: redirect %o',
      Date.now() - startTimestamp,
      {
        status: 307,
        route,
      }
    );

    // Restrict the page to be rendered only within the allowed origins
    res.setHeader('Content-Security-Policy', this.getSCPHeader());

    res.redirect(route);
  };
}
