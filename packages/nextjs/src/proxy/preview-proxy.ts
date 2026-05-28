import { NextRequest, NextResponse } from 'next/server';
import { EditingOptions } from '@sitecore-content-sdk/content/editing';
import { Page } from '@sitecore-content-sdk/content/client';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { SitecoreClient } from '../client';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { PREVIEW_COOKIES } from '../editing/utils';
import debug from '../debug';
import { ProxiesContext, ProxyBase } from './proxy';
import { SuccessfulProxyExecution } from './types';

/**
 * Configuration for PreviewProxy
 * @public
 */
export type PreviewProxyConfig = { client: SitecoreClient };

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution with details about the preview that was applied
 * @public
 */
export interface SuccessfulPreviewProxyExecution extends SuccessfulProxyExecution {
  pageDataReceived: boolean;
}

/**
 * Proxy for preview requests. Acts as a gateway for preview requests.
 * Currently it only supports internal editing hosts deployed on Sitecore AI.
 * @public
 */
export class PreviewProxy extends ProxyBase {
  protected client: SitecoreClient;

  constructor(config: PreviewProxyConfig) {
    // PreviewProxy does not need site resolution
    super({ ...config, sites: [] });
    this.client = config.client;
  }

  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  get name() {
    return 'PreviewProxy';
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    context?: ProxiesContext
  ): Promise<NextResponse> => {
    // Run only in internal editing host
    if (!process.env.SITECORE) {
      return res;
    }

    const previewParams = req.headers.get(EDITING_PARAMS_HEADER);
    // 1. Authorization header comes from the editing render endpoint
    // 2. Token comes from cookies when navigating to the preview page
    const authHeader =
      req.headers.get('Authorization') ||
      req.cookies.get(PREVIEW_COOKIES.PREVIEW_TOKEN)?.value ||
      '';
    let editingOptions: EditingOptions | null = previewParams ? JSON.parse(previewParams) : null;

    debug.editing('preview proxy start');

    // Process only preview/editing requests
    if (editingOptions && !['preview', 'edit'].includes(editingOptions.mode)) {
      debug.editing('preview proxy skipped (mode is not preview or edit)');
      return res;
    }

    let pageData: Page | null = null;

    // Scenario when the request is coming from /api/editing/render endpoint
    if (editingOptions) {
      pageData = await this.client
        .getPreview(editingOptions, {
          headers: {
            Authorization: authHeader,
          },
        })
        .catch((error) => {
          debug.editing('preview proxy failed to get preview: %o', error);
          return null;
        });
    } else {
      const site = req.cookies.get(SITE_KEY)?.value || req.nextUrl.searchParams.get(SITE_KEY) || '';

      // Scenario when the page is requested using direct path or navigation is performed
      pageData = await this.client
        .getPage(
          req.nextUrl.pathname,
          {
            site,
            locale: this.getLanguage(req),
          },
          {
            headers: {
              Authorization: authHeader,
              sc_previewMode: 'true',
              sc_site: site,
            },
          }
        )
        .catch((error) => {
          debug.editing('preview proxy failed to get page: %o', error);
          return null;
        });
    }

    // Preview content is not found or access is denied
    if (!pageData) {
      debug.editing('preview content is not found or access is denied');

      const successfulExecution: SuccessfulPreviewProxyExecution = {
        executedSuccessfully: true,
        error: null,
        pageDataReceived: false,
      };

      context?.set(this.name, successfulExecution);

      return NextResponse.json(
        { html: 'Preview content is not found or access is denied' },
        { status: 403 }
      );
    }

    res.cookies.set(PREVIEW_COOKIES.PREVIEW_TOKEN, authHeader, {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      path: '/',
    });

    debug.editing('preview proxy end');

    const successfulExecution: SuccessfulPreviewProxyExecution = {
      executedSuccessfully: true,
      error: null,
      pageDataReceived: true,
    };

    context?.set(this.name, successfulExecution);

    return res;
  };
}
