import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { eventsPlugin, botPageView } from '@sitecore-content-sdk/events';
import { isBot, BOT_DETECTION_COOKIE } from '@sitecore-content-sdk/analytics-core/internal';
import { ProxiesContext, ProxyBase, ProxyBaseConfig } from './proxy';
import debug from '../debug';
import { analyticsProxyAdapter } from '../initialization/proxy/analytics-adapter';
import { FailedProxyExecution, SuccessfulProxyExecution } from './types';

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution with details about the bot tracking that was applied
 * @public
 */
export interface SuccessfulBotTrackingProxyExecution extends SuccessfulProxyExecution {
  botDetected: boolean;
}

/**
 * Configuration for BotTrackingProxy.
 * @public
 */
export type BotTrackingProxyConfig = SitecoreConfig['api']['edge'] &
  Omit<ProxyBaseConfig, 'defaultLanguage'> & {
    /**
     * Fetch event to run the bot tracking in the background to not block the request.
     * If not provided, the bot tracking will run synchronously.
     * Read more about `fetchEvent` in the [Next.js documentation](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#waituntil-and-nextfetchevent)
     * @param {NextFetchEvent} fetchEvent - Fetch event to run the bot tracking in the background.
     */
    fetchEvent?: NextFetchEvent;
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

  /**
   * Name of the proxy, used as a key in the context to store information about executed proxies
   */
  get name() {
    return 'BotTrackingProxy';
  }

  handle = async (
    req: NextRequest,
    res: NextResponse,
    context?: ProxiesContext
  ): Promise<NextResponse> => {
    try {
      const isDisabled = (this.config.skip && this.config.skip(req, res)) || false;

      debug.common('bot tracking proxy start: %o', {
        pathname: req.nextUrl.pathname,
        headers: this.extractDebugHeaders(req.headers),
      });

      if (isDisabled) {
        debug.common('bot tracking proxy skipped (disabled)');
        return res;
      }

      if (this.isPreview(req)) {
        debug.common('bot tracking proxy skipped (preview)');
        return res;
      }

      if (this.shouldSkipForLocalEnvironment(req)) {
        debug.common('bot tracking proxy skipped (local environment)');
        return res;
      }

      const userAgent = req.headers.get('user-agent');
      if (!userAgent) {
        debug.common('bot tracking proxy skipped (no user-agent)');
        return res;
      }

      if (!isBot(userAgent)) {
        debug.common('bot tracking proxy skipped (not a bot)');
        return res;
      }

      if (this.isPrefetch(req)) {
        debug.common('bot tracking proxy skipped (prefetch)');
        return res;
      }

      const site = this.getSite(req, res);
      const language = this.getLanguage(req, res);

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

        await botPageView({
          page: req.nextUrl.pathname,
          language: language,
          userAgent,
        });
      };

      res.cookies.set(BOT_DETECTION_COOKIE, '1', {
        secure: true,
        sameSite: 'lax',
        path: '/',
      });

      debug.common('bot tracking proxy (visitor is a bot)');

      if (this.config.fetchEvent) {
        this.config.fetchEvent.waitUntil(botTracking());
      } else {
        await botTracking();
      }

      debug.common('bot tracking proxy end: %o', {
        pathname: req.nextUrl.pathname,
        cookies: res.cookies,
      });

      const successfulExecution: SuccessfulBotTrackingProxyExecution = {
        executedSuccessfully: true,
        error: null,
        botDetected: true,
      };

      context?.set(this.name, successfulExecution);

      return res;
    } catch (error) {
      debug.common('bot tracking proxy error: %o', error);

      const failedExecution: FailedProxyExecution = {
        executedSuccessfully: false,
        error,
      };

      context?.set(this.name, failedExecution);

      return res;
    }
  };

  /**
   * @param {NextRequest} req - Incoming request
   * @returns True when bot tracking should be skipped for a local / dev environment.
   * @internal
   */
  protected shouldSkipForLocalEnvironment(req: NextRequest): boolean {
    // Allow bot tracking in local environment for development purposes
    if (process.env.SITECORE_ENABLE_BOT_TRACKING === 'true') {
      return false;
    }

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
