import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import {
  eventsPlugin,
  botPageView,
  isBot,
  BOT_DETECTION_COOKIE,
} from '@sitecore-content-sdk/events';
import { ProxyBase, ProxyBaseConfig } from './proxy';
import debug from '../debug';
import { analyticsProxyAdapter } from '../initialization/proxy/analytics-adapter';

/**
 * Configuration for BotTrackingProxy.
 * @public
 */
export type BotTrackingProxyConfig = SitecoreConfig['api']['edge'] &
  Pick<ProxyBaseConfig, 'sites' | 'defaultHostname'> & {
    waitUntil?: (promise: Promise<void>) => void;
    /**
     * When `false`, bot tracking is disabled for every request.
     * Default `true`. Local runs (`next dev` or loopback host) still skip automatically.
     */
    enabled?: boolean;
  };

/**
 * Next.js proxy that runs bot detection once per request and sets the bot cookie.
 * Run first in the proxy chain to ensure that the bot cookie is set before other proxies run.
 * @public
 */
export class BotTrackingProxy extends ProxyBase {
  constructor(protected config: BotTrackingProxyConfig) {
    super(config);
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    event?: NextFetchEvent
  ): Promise<NextResponse> => {
    try {
      if (!(this.config.enabled ?? true)) {
        debug.common('skipped (bot tracking proxy is disabled)');
        return res;
      }

      if (this.shouldSkipForLocalEnvironment(req)) {
        debug.common('bot tracking proxy skipped (local environment)');
        return res;
      }

      debug.common('bot tracking proxy start: %o', {
        pathname: req.nextUrl.pathname,
        headers: this.extractDebugHeaders(req.headers),
      });

      if (!isBot(req.headers.get('user-agent'))) {
        debug.common('bot tracking proxy skipped (not a bot)');
        return res;
      }

      if (this.isPrefetch(req)) {
        debug.common('bot tracking proxy skipped (prefetch)');
        return res;
      }

      const waitUntil = event?.waitUntil || this.config.waitUntil;

      const site = this.getSite(req, res);

      const botTracking = async () => {
        await initContentSdk({
          config: {
            contextId: this.config.contextId,
            edgeUrl: this.config.edgeUrl,
            siteName: site.name,
          },
          plugins: [
            analyticsPlugin({
              options: {
                enableCookie: false,
              },
              adapter: analyticsProxyAdapter(req, res),
            }),
            eventsPlugin(),
          ],
        });

        await botPageView();
      };

      res.cookies.set(BOT_DETECTION_COOKIE, '1', {
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      if (waitUntil) {
        waitUntil(botTracking());
      } else {
        await botTracking();
      }

      debug.common('bot tracking proxy end: %o', {
        pathname: req.nextUrl.pathname,
        cookies: res.cookies,
      });

      return res;
    } catch (error) {
      debug.common('bot tracking proxy error: %o', error);
      return res;
    }
  };

  /**
   * @param {NextRequest} req - Incoming request
   * @returns True when bot tracking should be skipped for a local / dev environment.
   * @internal
   */
  protected shouldSkipForLocalEnvironment(req: NextRequest): boolean {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    const hostName = (
      this.getHostHeader(req) ||
      req.nextUrl.hostname ||
      this.defaultHostname ||
      ''
    ).toLowerCase();

    return (
      hostName === 'localhost' ||
      hostName === '127.0.0.1' ||
      hostName === '::1' ||
      hostName === '[::1]'
    );
  }
}
