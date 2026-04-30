import { NextRequest, NextResponse } from 'next/server';
import { MiddlewareBase } from './middleware';
import { EditingOptions } from '@sitecore-content-sdk/core/editing';
import { SitecoreClient } from '../client';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { Page } from '@sitecore-content-sdk/core/client';
import { SITE_KEY } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';

/**
 * Configuration for PreviewMiddleware
 * @public
 */
export type PreviewMiddlewareConfig = { client: SitecoreClient };

/**
 * Middleware for preview requests. Acts as a gateway for preview requests.
 * Currently it only supports internal editing hosts deployed on Sitecore AI.
 * @public
 */
export class PreviewMiddleware extends MiddlewareBase {
  protected client: SitecoreClient;

  constructor(config: PreviewMiddlewareConfig) {
    // PreviewMiddleware does not need site resolution
    super({ ...config, sites: [] });
    this.client = config.client;
  }

  handle = async (req: NextRequest, res: NextResponse): Promise<NextResponse> => {
    // Run only in internal editing host
    if (!process.env.SITECORE) {
      return res;
    }

    const previewParams = req.headers.get(EDITING_PARAMS_HEADER);
    const authHeader = req.headers.get('Authorization') ?? '';
    let editingOptions: EditingOptions | null = previewParams ? JSON.parse(previewParams) : null;

    debug.editing('preview middleware start');
    // Process only preview requests (e.g. non editing or design studio)
    if (editingOptions && editingOptions.mode !== 'preview') {
      debug.editing('preview middleware skipped (mode is not preview)');
      return res;
    }

    let pageData: Page | null = null;

    // Scenario when the request is coming from /api/editing/render endpoint
    if (editingOptions) {
      pageData = await this.client.getPreview(editingOptions, {
        headers: {
          Authorization: authHeader,
        },
      });
    } else {
      // Scenario when the page is requested using direct path or navigation is performed
      pageData = await this.client.getPage(
        req.nextUrl.pathname,
        {
          site: req.cookies.get(SITE_KEY)?.value,
          locale: this.getLanguage(req),
        },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
    }

    // Preview content is not found or access is denied
    if (!pageData) {
      debug.editing('preview content is not found or access is denied');
      return NextResponse.json(
        { html: 'Preview content is not found or access is denied' },
        { status: 403 }
      );
    }

    debug.editing('preview middleware end');

    return res;
  };
}
