import { SitecoreClient, SitemapXmlOptions } from '@sitecore-content-sdk/core/client';
import { SiteInfo, SiteResolver } from '@sitecore-content-sdk/core/site';
import { debug } from '@sitecore-content-sdk/core';
import { NextRequest } from 'next/server';
import { unstable_cache } from 'next/cache';

type RouteHandlerOptions = {
  /**
   * Sitecore client instance.
   */
  client: SitecoreClient;
  /**
   * Sites configuration for resolving the site by host.
   */
  sites: SiteInfo[];
  /**
   * The number of seconds after which the cache should be revalidated.
   * Pass false to cache indefinitely.
   * Default is 60 seconds.
   */
  revalidate?: number | false;
};

/**
 * Creates a route handler to serve the sitemap.xml file.
 * @param {RouteHandlerOptions} options - The options for the route handler.
 * @returns The route handler.
 * @public
 */
export function createSitemapRouteHandler(options: RouteHandlerOptions) {
  const { client, sites, revalidate = 60 } = options;

  const siteResolver = new SiteResolver(sites);

  const getOptions = (req: NextRequest): SitemapXmlOptions => {
    const id = req.nextUrl.pathname.match(/^\/sitemap-(\d+)\.xml$/i)?.[1] || '';
    const reqHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
    const reqProtocol = req.headers.get('x-forwarded-proto') || 'https';
    const site = siteResolver.getByHost(reqHost);

    return { reqHost, reqProtocol, id, siteName: site.name };
  };

  const getSitemap = unstable_cache(
    async (options: SitemapXmlOptions) => {
      return client.getSiteMap(options);
    },
    ['sitemap'],
    {
      revalidate,
      tags: ['sitemap'],
    }
  );

  const GET = async (req: NextRequest) => {
    try {
      const options = getOptions(req);

      // Access request data first, then capture timestamp for Next.js 16 compatibility
      const startTimestamp = Date.now();

      debug.sitemap('sitemap route handler start: %o', {
        options,
      });

      const xml = await getSitemap(options);

      debug.sitemap('sitemap route handler end in %dms', Date.now() - startTimestamp);

      return new Response(xml, {
        headers: {
          'Content-Type': 'text/xml;charset=utf-8',
        },
      });
    } catch (error) {
      // Re-throw prerender bail-out errors so Next.js can handle them properly
      if (error instanceof Error && (error as any).digest === 'NEXT_PRERENDER_INTERRUPTED') {
        throw error;
      }

      console.log('Sitemap route handler failed:');
      console.log(error);

      if (error instanceof Error && error.message === 'REDIRECT_404') {
        return new Response('Not Found', { status: 404 });
      } else {
        return new Response('Internal Server Error', { status: 500 });
      }
    }
  };

  return { GET };
}
