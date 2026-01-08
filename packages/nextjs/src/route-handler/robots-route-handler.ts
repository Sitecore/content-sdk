import { SitecoreClient } from '@sitecore-content-sdk/core/client';
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
 * Creates a route handler to serve the robots.txt file.
 * @param {RouteHandlerOptions} options - The options for the route handler.
 * @returns The route handler object with GET method.
 * @public
 */
export const createRobotsRouteHandler = (options: RouteHandlerOptions) => {
  const { client, sites, revalidate = 60 } = options;

  const siteResolver = new SiteResolver(sites);

  const getRobots = unstable_cache(
    async (site: string) => {
      return client.getRobots(site);
    },
    ['robots'],
    {
      revalidate,
      tags: ['robots'],
    }
  );

  const GET = async (req: NextRequest) => {
    try {
      const hostName =
        req.headers.get('x-forwarded-host') ||
        req.headers.get('host')?.split(':')[0] ||
        'localhost';
      const site = siteResolver.getByHost(hostName);

      // Access request data first, then capture timestamp for Next.js 16 compatibility
      const startTimestamp = Date.now();

      debug.robots('robots route handler start: %o', {
        hostName,
        siteName: site.name,
      });

      const robotsContent = await getRobots(site.name);

      if (!robotsContent) {
        debug.robots('robots route handler end in %dms', Date.now() - startTimestamp);

        return new Response('User-agent: *\nDisallow: /', {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      debug.robots('robots route handler end in %dms', Date.now() - startTimestamp);

      return new Response(robotsContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } catch (error) {
      // Re-throw prerender bail-out errors so Next.js can handle them properly
      if (error instanceof Error && (error as any).digest === 'NEXT_PRERENDER_INTERRUPTED') {
        throw error;
      }

      console.log('Robots route handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };

  return { GET };
};
