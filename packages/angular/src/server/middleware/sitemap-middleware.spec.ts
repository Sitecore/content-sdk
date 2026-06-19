/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { createSitemapMiddleware } from './sitemap-middleware';
import type { ExpressRequest, ExpressResponse } from './models';

const { ERROR_MESSAGES } = constants;

function createMockRes() {
  return {
    setHeader: vi.fn(),
    send: vi.fn(),
    redirect: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as ExpressResponse & {
    setHeader: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
    redirect: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };
}

describe('createSitemapMiddleware', () => {
  const sites: SiteInfo[] = [
    { name: 'test-site', hostName: 'example.com', language: 'en' },
    { name: 'fallback-site', hostName: '*', language: 'da' },
  ];
  let client: SitecoreClient;
  let req: ExpressRequest;
  let res: ReturnType<typeof createMockRes>;
  let handler: ReturnType<typeof createSitemapMiddleware>;

  beforeEach(() => {
    client = { getSiteMap: vi.fn() } as unknown as SitecoreClient;
    req = {
      method: 'GET',
      path: '/',
      url: '/',
      body: {},
      query: {},
      headers: { host: 'example.com', 'x-forwarded-proto': 'https' },
    };
    res = createMockRes();
    handler = createSitemapMiddleware({ client, sites });
    vi.mocked(client.getSiteMap).mockResolvedValue('<sitemapindex/>');
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns sitemap xml', async () => {
    await handler(req, res, vi.fn());

    expect(client.getSiteMap).toHaveBeenCalledWith({
      reqHost: 'example.com',
      reqProtocol: 'https',
      id: undefined,
      siteName: 'test-site',
    });
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/xml;charset=utf-8');
    expect(res.send).toHaveBeenCalledWith('<sitemapindex/>');
  });

  it('uses id from Express route params', async () => {
    req.params = { id: '2' };
    await handler(req, res, vi.fn());
    expect(client.getSiteMap).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }));
  });

  it('redirects to /404 when REDIRECT_404 is thrown', async () => {
    vi.mocked(client.getSiteMap).mockRejectedValue(new Error('REDIRECT_404'));
    await handler(req, res, vi.fn());
    expect(res.redirect).toHaveBeenCalledWith('/404');
  });

  it('returns 500 for unexpected errors', async () => {
    vi.mocked(client.getSiteMap).mockRejectedValue(new Error('fail'));
    await handler(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
  });
});
