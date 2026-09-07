import { SitecoreClient } from '@sitecore-content-sdk/content/client';
import {
  SiteInfo,
  SiteResolver,
  LLMS_TXT_CONTENT_TYPE,
  DEFAULT_LLMS_TXT,
} from '@sitecore-content-sdk/content/site';
import { NextRequest } from 'next/server';
import { unstable_cache } from 'next/cache';
import debug from '../debug';

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
 * Creates a route handler to serve the llms.txt file.
 * @param {RouteHandlerOptions} options - The options for the route handler.
 * @returns The route handler object with GET method.
 * @public
 */
export const createLlmsTxtRouteHandler = (options: RouteHandlerOptions) => {
  const { client, sites, revalidate = 60 } = options;

  const siteResolver = new SiteResolver(sites);

  const getLlmsTxt = unstable_cache(
    async (site: string) => {
      return client.getLlmsTxt({ siteName: site });
    },
    ['llms-txt'],
    {
      revalidate,
      tags: ['llms-txt'],
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

      debug.llmsTxt('llms.txt route handler start: %o', {
        hostName,
        siteName: site.name,
      });

      const llmsTxtContent = await getLlmsTxt(site.name);

      if (!llmsTxtContent) {
        debug.llmsTxt('llms.txt route handler end in %dms', Date.now() - startTimestamp);

        return new Response(DEFAULT_LLMS_TXT, {
          status: 404,
          headers: {
            'Content-Type': LLMS_TXT_CONTENT_TYPE,
          },
        });
      }

      debug.llmsTxt('llms.txt route handler end in %dms', Date.now() - startTimestamp);

      return new Response(llmsTxtContent, {
        status: 200,
        headers: {
          'Content-Type': LLMS_TXT_CONTENT_TYPE,
        },
      });
    } catch (error) {
      // Re-throw prerender bail-out errors so Next.js can handle them properly
      if (error instanceof Error && (error as any).digest === 'NEXT_PRERENDER_INTERRUPTED') {
        throw error;
      }

      console.log('Llms.txt route handler failed:');
      console.log(error);

      return new Response('Internal Server Error', {
        status: 500,
      });
    }
  };

  return { GET };
};
