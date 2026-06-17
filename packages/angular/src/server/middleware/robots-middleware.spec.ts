/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { SiteInfo } from '@sitecore-content-sdk/content/site';
import { constants } from '@sitecore-content-sdk/core';
import { createRobotsMiddleware } from './robots-middleware';
import type { ExpressRequest, ExpressResponse } from '../models';

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

describe('createRobotsMiddleware', () => {
  const sites: SiteInfo[] = [
    { name: 'test-site', hostName: 'example.com', language: 'en' },
    { name: 'fallback-site', hostName: 'localhost', language: 'da' },
  ];
  let client: SitecoreClient;
  let req: ExpressRequest;
  let res: ReturnType<typeof createMockRes>;
  let handler: ReturnType<typeof createRobotsMiddleware>;

  beforeEach(() => {
    client = { getRobots: vi.fn() } as unknown as SitecoreClient;
    req = {
      method: 'GET',
      path: '/',
      url: '/',
      body: {},
      query: {},
      headers: { host: 'example.com' },
    };
    res = createMockRes();
    handler = createRobotsMiddleware({ client, sites });
    vi.mocked(client.getRobots).mockResolvedValue('User-agent: *\nDisallow: /');
  });

  afterEach(() => vi.restoreAllMocks());

  it('returns robots content', async () => {
    await handler(req, res, vi.fn());

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(client.getRobots).toHaveBeenCalledWith('test-site');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('User-agent: *\nDisallow: /');
  });

  it('returns 404 fallback when content is missing', async () => {
    vi.mocked(client.getRobots).mockResolvedValue(undefined);
    await handler(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('User-agent: *\nDisallow: /');
  });

  it('returns 500 when getRobots throws', async () => {
    vi.mocked(client.getRobots).mockRejectedValue(new Error('fail'));
    await handler(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(`Internal Server Error. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
  });
});
