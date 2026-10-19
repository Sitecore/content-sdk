/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { LLMS_TXT_CONTENT_TYPE, DEFAULT_LLMS_TXT } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { createLlmsTxtMiddleware } from './llms-txt-middleware';
import type { ExpressRequest, ExpressResponse } from './models';

const { ERROR_MESSAGES } = constants;

function createMockRes() {
  return {
    setHeader: vi.fn(),
    send: vi.fn(),
    status: vi.fn().mockReturnThis(),
  } as unknown as ExpressResponse & {
    setHeader: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };
}

describe('createLlmsTxtMiddleware', () => {
  const sites: SiteInfo[] = [
    { name: 'test-site', hostName: 'example.com', language: 'en' },
    { name: 'fallback-site', hostName: 'localhost', language: 'da' },
  ];
  const llmsTxtContent = '# Site\n\n> Summary';
  let client: SitecoreClient;
  let req: ExpressRequest;
  let res: ReturnType<typeof createMockRes>;
  let handler: ReturnType<typeof createLlmsTxtMiddleware>;

  beforeEach(() => {
    client = { getLlmsTxt: vi.fn() } as unknown as SitecoreClient;
    req = {
      method: 'GET',
      path: '/',
      url: '/',
      body: {},
      query: {},
      headers: { host: 'example.com' },
    };
    res = createMockRes();
    handler = createLlmsTxtMiddleware({ client, sites });
    vi.mocked(client.getLlmsTxt).mockResolvedValue(llmsTxtContent);
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns llms.txt content', async () => {
    await handler(req, res, vi.fn());

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', LLMS_TXT_CONTENT_TYPE);
    expect(client.getLlmsTxt).toHaveBeenCalledWith({ siteName: 'test-site' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(llmsTxtContent);
  });

  it('resolves the site from x-forwarded-host', async () => {
    req.headers = { host: 'example.com', 'x-forwarded-host': 'localhost' };
    await handler(req, res, vi.fn());

    expect(client.getLlmsTxt).toHaveBeenCalledWith({ siteName: 'fallback-site' });
  });

  it('ignores the port in the host header', async () => {
    req.headers = { host: 'localhost:3000' };
    await handler(req, res, vi.fn());

    expect(client.getLlmsTxt).toHaveBeenCalledWith({ siteName: 'fallback-site' });
  });

  it('returns 404 with the default llms.txt when content is missing', async () => {
    vi.mocked(client.getLlmsTxt).mockResolvedValue(null);
    await handler(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(DEFAULT_LLMS_TXT);
  });

  it('returns 500 when getLlmsTxt throws', async () => {
    vi.mocked(client.getLlmsTxt).mockRejectedValue(new Error('fail'));
    await handler(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
  });
});
