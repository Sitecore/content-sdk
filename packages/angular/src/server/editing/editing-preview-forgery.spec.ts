/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getEditingPreviewData } from './get-editing-preview-data';
import type { EditingRenderPreviewData } from './get-editing-preview-data';
import { createEditingRenderMiddleware } from '../middleware/editing-render-middleware';
import { createLoaderDataServiceMiddleware } from '../middleware/loader-data-service-middleware';
import type { ExpressRequest, ExpressResponse } from '../middleware/models';
import { LOADER_DATA_ENDPOINT } from '../constants';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';
import { extractRequestData } from '../../loaders/utils';
import { createLoaderCache } from '../cache/loader-cache';
import type { LoaderFn } from '../../loaders/models';
import { mockAngularSitecoreConfig, makeLoaderPayload } from '../../testing/loader-spec-helpers';

// A client-forged editing payload pointing at content the attacker should not see.
const FORGED_PREVIEW = JSON.stringify({
  site: 'attacker-site',
  itemId: 'unpublished-item',
  language: 'en',
  version: '2',
  mode: 'edit',
  variantId: '_default',
});

function baseQuery(overrides: Record<string, string> = {}): Record<string, string> {
  return {
    secret: 's',
    sc_site: 'demo',
    sc_itemid: '11111111-1111-1111-1111-111111111111',
    sc_lang: 'en',
    route: '/about',
    mode: 'edit',
    ...overrides,
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
    setHeader: vi.fn(),
  };
  res.status.mockImplementation((code: number) => {
    res.statusCode = code;
    return res;
  });
  res.json.mockImplementation((payload: unknown) => {
    res.body = payload;
    return res;
  });
  return res as unknown as ExpressResponse & typeof res;
}

describe('editing preview forgery (getEditingPreviewData must not be reachable by a forged header)', () => {
  const next = vi.fn();
  const mockConfig = mockAngularSitecoreConfig({ defaultSite: 'demo' });

  // Loader standing in for the template page loader: preview data switches the fetch
  // from published content (`getPage`) to preview content (`getPreview`).
  const previewFetches: EditingRenderPreviewData[] = [];
  const publishedFetches: string[] = [];
  const pageLoader: LoaderFn = async (ctx) => {
    const previewData = getEditingPreviewData(ctx.csdkRequestData);
    if (previewData) {
      previewFetches.push(previewData); // stands in for client.getPreview(previewData)
      return { source: 'preview' };
    }
    publishedFetches.push(ctx.url); // stands in for client.getPage(...)
    return { source: 'published' };
  };

  function createPipeline() {
    return {
      editing: createEditingRenderMiddleware({ editingSecret: 's' }),
      data: createLoaderDataServiceMiddleware(mockConfig, {
        loaders: { page: pageLoader },
        cache: createLoaderCache({ enabled: false }),
      }),
    };
  }

  beforeEach(() => {
    next.mockClear();
    previewFetches.length = 0;
    publishedFetches.length = 0;
  });

  it('forged header on /_data falls through to published fetching, not getPreview', async () => {
    const { editing, data } = createPipeline();
    const req: ExpressRequest = {
      method: 'POST',
      path: LOADER_DATA_ENDPOINT,
      url: LOADER_DATA_ENDPOINT,
      body: makeLoaderPayload({ loaderId: 'page', url: '/about' }),
      query: {},
      headers: { [EDITING_PARAMS_HEADER]: FORGED_PREVIEW },
    };
    const res = createMockRes();

    // The editing middleware runs first in the chain and strips the forged header.
    await editing(req, res, next);
    await data(req, res, next);

    expect(req.headers![EDITING_PARAMS_HEADER]).toBeUndefined();
    expect(previewFetches).toHaveLength(0);
    expect(publishedFetches).toEqual(['/about']);
    expect(res.json).toHaveBeenCalledWith({ kind: 'data', data: { source: 'published' } });
  });

  it('forged header on an SSR page request does not survive to the SSR request extraction', async () => {
    const { editing } = createPipeline();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/about',
      url: '/about',
      body: undefined,
      query: {},
      headers: { [EDITING_PARAMS_HEADER]: FORGED_PREVIEW },
    };
    const res = createMockRes();

    await editing(req, res, next);
    expect(req.headers![EDITING_PARAMS_HEADER]).toBeUndefined();

    // Angular converts the Express request into a web Request for SSR; only headers
    // survive. The stripped header means the SSR loader resolver sees no preview data.
    const ssrRequest = new Request('http://localhost/about', {
      headers: req.headers as Record<string, string>,
    });
    const csdkRequestData = extractRequestData(ssrRequest);
    expect(getEditingPreviewData(csdkRequestData)).toBeUndefined();
  });

  it('a legitimate editing request still reaches preview fetching after the secret check', async () => {
    const { editing } = createPipeline();
    const req: ExpressRequest = {
      method: 'GET',
      path: '/api/editing/render',
      url: '/api/editing/render',
      body: undefined,
      query: baseQuery(),
      headers: { origin: 'https://pages.sitecorecloud.io' },
    };
    const res = createMockRes();

    await editing(req, res, next);

    // The middleware set a trusted header from the secret-validated query. Reading it
    // back over the SSR boundary yields the preview data (client.getPreview reached).
    const headerValue = req.headers![EDITING_PARAMS_HEADER] as string;
    expect(headerValue).toBeTypeOf('string');
    const ssrRequest = new Request('http://localhost' + req.url, {
      headers: { [EDITING_PARAMS_HEADER]: headerValue },
    });
    const preview = getEditingPreviewData(extractRequestData(ssrRequest));
    expect(preview).toBeDefined();
    expect(preview!.site).toBe('demo');
    expect(preview!.itemId).toBe('11111111-1111-1111-1111-111111111111');
  });
});
