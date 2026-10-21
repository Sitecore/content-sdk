import { initContentSdk } from '@sitecore-content-sdk/core';
import { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import { SITE_KEY } from '@sitecore-content-sdk/content/site';
import { analyticsPlugin, analyticsServerAdapter } from '@sitecore-content-sdk/analytics-core';
import { BOT_DETECTION_COOKIE, isBot } from '@sitecore-content-sdk/analytics-core/internal';
import { botPageView, eventsPlugin } from '@sitecore-content-sdk/events';
import {
  BaseMiddlewareOptions,
  CsdkExpressRequest,
  ExpressMiddleware,
  ExpressNextFunction,
  ExpressRequest,
  ExpressResponse,
} from './models';
import { getMiddlewareRequest, shouldProcessPath, toNodeAdapterPair } from './utils';
import { isEditingPreview } from '../utils';
import { splitLocaleFromPath } from '../../i18n/locale-utils';
import debug from '../../debug';

/**
 * Configuration for the bot tracking middleware.
 * @public
 */
export type BotTrackingMiddlewareOptions = Omit<BaseMiddlewareOptions, 'enabled'> &
  SitecoreConfig['api']['edge'] & {
    /** Locales used to extract the language from the request path */
    locales?: string[];
    /** Fallback language when the request path has no locale prefix. Default is `'en'` */
    defaultLanguage?: string;
    /** Fallback site name when not resolved by the multisite middleware or site cookie */
    defaultSite?: string;
  };

const isPrefetch = (req: ExpressRequest): boolean =>
  [req.headers?.purpose, req.headers?.['sec-purpose']].some(
    (header) => typeof header === 'string' && header.includes('prefetch')
  );

/**
 * Whether bot tracking should be skipped for a local / development environment.
 * @param {string} hostname - Resolved request hostname (without port).
 * @returns {boolean} True when bot tracking should be skipped.
 * @internal
 */
export function shouldSkipForLocalEnvironment(hostname: string): boolean {
  if (process.env.SITECORE_ENABLE_BOT_TRACKING === 'true') {
    return false;
  }
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const host = hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
}

/**
 * Middleware that runs bot detection once per request. When the request is from a bot it marks the
 * request/response with the `sc_bot` cookie (so downstream middlewares — e.g. personalize — and the
 * SSR analytics adapters detect the bot within the same request) and dispatches a dedicated
 * `botPageView` event.
 *
 * Must run before the personalize middleware so the bot cookie is set before personalize reads it.
 * The `botPageView` dispatch is awaited (not backgrounded): `initContentSdk` writes the module-global
 * core context, and the SSR render re-inits it after `next()`, so awaiting sequences init + dispatch
 * before that happens. The extra latency lands on bot requests only.
 * @param {BotTrackingMiddlewareOptions} options bot tracking middleware options
 * @returns {ExpressMiddleware} Express middleware
 * @public
 */
export function createBotTrackingMiddleware(
  options: BotTrackingMiddlewareOptions
): ExpressMiddleware {
  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    try {
      // For browser loader navigations (/_data) routing data comes from the loader payload, not
      // the request; getMiddlewareRequest normalizes both into path/query/data.
      const { path, data } = getMiddlewareRequest(req);

      if (isEditingPreview(data.headers)) {
        debug.common('bot tracking skipped (editing/preview mode)');
        return next();
      }

      if (!shouldProcessPath(path, options.matcher)) {
        debug.common('bot tracking skipped (path does not match)');
        return next();
      }

      if (options.skip?.(req)) {
        debug.common('bot tracking skipped (skip predicate)');
        return next();
      }

      const hostHeader = data.headers?.['x-forwarded-host'] ?? data.headers?.host;
      const hostname =
        (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)?.split(':')[0] || 'localhost';

      if (shouldSkipForLocalEnvironment(hostname)) {
        debug.common('bot tracking skipped (local environment)');
        return next();
      }

      const userAgentHeader = data.headers?.['user-agent'];
      const userAgent = Array.isArray(userAgentHeader) ? userAgentHeader[0] : userAgentHeader;
      if (!userAgent) {
        debug.common('bot tracking skipped (no user-agent)');
        return next();
      }

      if (!isBot(userAgent)) {
        debug.common('bot tracking skipped (not a bot)');
        return next();
      }

      if (isPrefetch(req)) {
        debug.common('bot tracking skipped (prefetch)');
        return next();
      }

      // Mark the request as a bot. The response cookie persists it across requests; mutating
      // req.cookies makes it visible to later middlewares (personalize skipForBot) and the SSR
      // analytics adapters within this same request.
      if (res.cookie) {
        res.cookie(BOT_DETECTION_COOKIE, '1', { secure: true, sameSite: 'lax', path: '/' });
      }
      req.cookies = { ...(req.cookies ?? {}), [BOT_DETECTION_COOKIE]: '1' };

      const { locale, nonLocalePath } = splitLocaleFromPath(path, options.locales ?? []);
      const language = locale || options.defaultLanguage || 'en';
      const siteName =
        (req as CsdkExpressRequest).scParams?.siteName ||
        data.cookies?.[SITE_KEY] ||
        options.defaultSite ||
        '';

      const startTimestamp = Date.now();
      debug.common('bot tracking (visitor is a bot): %o', {
        path: nonLocalePath,
        language,
        siteName,
        hostname,
      });

      // Express req/res are http.IncomingMessage/ServerResponse at runtime; cast for the cookie-based
      // server adapters.
      const { req: httpReq, res: httpRes } = toNodeAdapterPair(req, res);
      await initContentSdk({
        config: {
          contextId: options.contextId,
          edgeUrl: options.edgeUrl,
          siteName,
        },
        plugins: [
          analyticsPlugin({
            options: { enableCookie: false },
            adapter: analyticsServerAdapter(httpReq, httpRes),
          }),
          eventsPlugin(),
        ],
      });

      await botPageView({ page: path, language, userAgent });

      debug.common('bot tracking end in %dms: %o', Date.now() - startTimestamp, {
        path: nonLocalePath,
      });
    } catch (error) {
      debug.common('bot tracking middleware failed: %o', error);
    }
    next();
  };
}
