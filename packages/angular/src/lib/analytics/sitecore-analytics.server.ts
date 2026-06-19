import { Injectable, REQUEST_CONTEXT, inject } from '@angular/core';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsPlugin, analyticsServerAdapter } from '@sitecore-content-sdk/analytics-core';
import { event, eventsPlugin, form, identity, pageView } from '@sitecore-content-sdk/events';
import type { EventData, IdentityData, PageViewData } from '@sitecore-content-sdk/events';
import { SITECORE_CONFIG_TOKEN } from '../tokens';
import { normalizeCookieDomain, type SitecoreAnalyticsWrapper } from './sitecore-analytics';
import debug from '../../debug';

/**
 * Minimal Node request shape the server analytics adapter reads from `REQUEST_CONTEXT`. Declared
 * locally (only the `headers` field we touch) to keep `@types/node` out of the browser-bundled lib
 * build; the real Express request/response objects flow through at runtime.
 */
interface NodeLikeRequest {
  headers: Record<string, string | string[] | undefined>;
}

/** Shape of the SSR request context passed to `AngularNodeAppEngine.handle(req, ctx)` in server.ts. */
interface SsrAnalyticsContext {
  req?: NodeLikeRequest;
  res?: object;
}

/** Server analytics adapter param types (node req/res), derived without importing node types. */
type AdapterRequest = Parameters<typeof analyticsServerAdapter>[0];
type AdapterResponse = Parameters<typeof analyticsServerAdapter>[1];

/**
 * Server-side {@link SitecoreAnalyticsWrapper} implementation. Unlike a no-op, it dispatches CDP
 * events from SSR using the **server** analytics provider: it lazily initializes the Content SDK
 * with `analyticsServerAdapter` (cookie-based visitor identity from the Node request/response) and
 * the events plugin, then forwards to the `@sitecore-content-sdk/events` functions. Failures are
 * swallowed at debug level so analytics never breaks rendering.
 *
 * The Node `req`/`res` are taken from `REQUEST_CONTEXT` — `server.ts` passes them via
 * `angularApp.handle(req, { cache, req, res })`. When they are absent (or Edge config is missing),
 * the wrapper degrades to a no-op.
 *
 * NOTE: `initContentSdk` writes the module-global core context. Per-request init in a long-lived
 * Node process can race under concurrency (same caveat as the personalize middleware); the
 * explicit-context engine API is the planned fix.
 * @public
 */
@Injectable()
export class SitecoreAnalyticsServer implements SitecoreAnalyticsWrapper {
  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  private readonly ssrContext = inject(REQUEST_CONTEXT, { optional: true }) as
    | SsrAnalyticsContext
    | undefined;
  /** Memoized one-time init for this request; resolves `false` when analytics is disabled. */
  private initPromise?: Promise<boolean>;

  pageView(data: PageViewData): Promise<void> {
    return this.dispatch(() => pageView(data));
  }

  event(data: EventData): Promise<void> {
    return this.dispatch(() => event(data));
  }

  identity(data: IdentityData): Promise<void> {
    return this.dispatch(() => identity(data));
  }

  form(
    formId: string,
    interactionType: 'VIEWED' | 'SUBMITTED',
    componentInstanceId: string
  ): Promise<void> {
    return this.dispatch(() => form(formId, interactionType, componentInstanceId));
  }

  /**
   * Ensure the SDK is initialized with server adapters, then run `send`; swallow failures.
   * @param {() => Promise<unknown>} send - Events dispatch call to run once initialized.
   */
  private async dispatch(send: () => Promise<unknown>): Promise<void> {
    try {
      const initialized = await this.ensureInit();
      if (!initialized) return;
      await send();
    } catch (e) {
      debug.common('server analytics dispatch failed: %o', e);
    }
  }

  private ensureInit(): Promise<boolean> {
    if (!this.initPromise) {
      this.initPromise = this.doInit();
    }
    return this.initPromise;
  }

  private async doInit(): Promise<boolean> {
    const edge = this.config?.api?.edge;
    if (!edge?.contextId) {
      debug.common('Edge contextId missing from configuration; server analytics disabled');
      return false;
    }
    const req = this.ssrContext?.req;
    const res = this.ssrContext?.res;
    if (!req || !res) {
      debug.common('Node req/res not available in REQUEST_CONTEXT; server analytics disabled');
      return false;
    }

    const hostHeader = req.headers['x-forwarded-host'] ?? req.headers.host;
    const hostname =
      (Array.isArray(hostHeader) ? hostHeader[0] : hostHeader)?.split(':')[0] || 'localhost';

    await initContentSdk({
      config: {
        contextId: edge.contextId,
        edgeUrl: edge.edgeUrl,
        siteName: this.config?.defaultSite ?? '',
      },
      plugins: [
        analyticsPlugin({
          options: {
            enableCookie: true,
            cookieDomain: normalizeCookieDomain(hostname),
          },
          adapter: analyticsServerAdapter(
            req as unknown as AdapterRequest,
            res as unknown as AdapterResponse
          ),
        }),
        eventsPlugin(),
      ],
    });
    return true;
  }
}
