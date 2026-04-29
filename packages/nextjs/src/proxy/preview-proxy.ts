import { NextRequest, NextResponse } from 'next/server';
import { ProxyBase } from './proxy';
import { PREVIEW_KEY, EditingOptions } from '@sitecore-content-sdk/content/editing';
import { SitecoreClient } from '../client';
import { EDITING_PARAMS_HEADER } from '../editing/constants';
import { Page } from '@sitecore-content-sdk/content/client';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';

export type PreviewProxyConfig = { client: SitecoreClient };

export class PreviewProxy extends ProxyBase {
  protected client: SitecoreClient;

  constructor(config: PreviewProxyConfig) {
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

    // Process only preview requests (e.g. non editing or design studio)
    if (editingOptions && editingOptions.mode !== 'preview') {
      return res;
    }
    
    let pageData: Page | null = null;

    if (editingOptions) {
      pageData = await this.client.getPreview(editingOptions, {
        headers: {
          Authorization: authHeader,
        },
      });
    } else {
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

    console.log('EditingOptions:', editingOptions);
    console.log('AuthHeader:', authHeader);
    console.log('PageData:', pageData);
    console.log('IsPreview by PREVIEW_KEY Header:', req.cookies.get(PREVIEW_KEY)?.value);
    console.log('IsSitecore:', process.env.SITECORE);

    // Preview content is not found or access is denied
    if (!pageData) {
      return NextResponse.json(
        { error: 'Preview content is not found or access is denied' },
        { status: 403 }
      );
    }

    return res;
  };
}
