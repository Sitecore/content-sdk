import { Injectable, inject, isDevMode } from '@angular/core';
import { initContentSdk } from '@sitecore-content-sdk/core';
import { analyticsBrowserAdapter, analyticsPlugin } from '@sitecore-content-sdk/analytics-core';
import { event, eventsPlugin, form, identity, pageView } from '@sitecore-content-sdk/events';
import type { EventData, IdentityData, PageViewData } from '@sitecore-content-sdk/events';
import { SITECORE_CONFIG_TOKEN } from '../tokens';
import { normalizeCookieDomain, type SitecoreAnalyticsWrapper } from './sitecore-analytics';
import debug from '../../debug';

/** Dedup window for identical page-view fingerprints (hydration replay, transfer-state restore). */
const DEDUP_WINDOW_MS = 1000;

/**
 * Browser {@link SitecoreAnalyticsWrapper} implementation. Lazily initializes the Content SDK
 * events runtime on first dispatch — memoized so concurrent first callers await the same promise
 * — then forwards to the `@sitecore-content-sdk/events` functions. Failures are swallowed at debug
 * level: analytics must never break the app.
 * @public
 */
@Injectable()
export class SitecoreAnalyticsBrowser implements SitecoreAnalyticsWrapper {
  private readonly config = inject(SITECORE_CONFIG_TOKEN, { optional: true });
  /** Memoized one-time init; resolves `false` when analytics is disabled (dev / missing Edge). */
  private initPromise?: Promise<boolean>;
  /** Last page-view fingerprint + timestamp, for same-payload dedup. */
  private lastPageView?: { fingerprint: string; at: number };

  pageView(data: PageViewData): Promise<void> {
    const fingerprint = `${data.page ?? ''}|${data.pageVariantId ?? ''}|${data.language ?? ''}`;
    const now = Date.now();
    if (
      this.lastPageView?.fingerprint === fingerprint &&
      now - this.lastPageView.at < DEDUP_WINDOW_MS
    ) {
      debug.common('analytics pageView deduped: %s', fingerprint);
      return Promise.resolve();
    }
    this.lastPageView = { fingerprint, at: now };
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
   * Ensure the SDK is initialized, then run `send`; swallow any failure at debug level.
   * @param {() => Promise<unknown>} send - Events dispatch call to run once initialized.
   */
  private async dispatch(send: () => Promise<unknown>): Promise<void> {
    try {
      const initialized = await this.ensureInit();
      if (!initialized) return;
      await send();
    } catch (e) {
      debug.common('analytics dispatch failed: %o', e);
    }
  }

  private ensureInit(): Promise<boolean> {
    if (!this.initPromise) {
      this.initPromise = this.doInit();
    }
    return this.initPromise;
  }

  /**
   * Whether Angular is running in development mode; analytics stays disabled in dev so local work
   * doesn't emit CDP events. Wraps `@angular/core`'s `isDevMode` as an overridable seam, since that
   * export can't be spied on directly in unit tests.
   * @returns {boolean} True when running in development mode.
   */
  protected isDevMode(): boolean {
    return isDevMode();
  }

  private async doInit(): Promise<boolean> {
    if (this.isDevMode()) {
      debug.common('Browser Events SDK is not initialized in development environment');
      return false;
    }
    const edge = this.config?.api?.edge;
    if (!edge?.clientContextId) {
      debug.common('Client Edge API settings missing from configuration; analytics disabled');
      return false;
    }
    await initContentSdk({
      config: {
        contextId: edge.clientContextId,
        edgeUrl: edge.edgeUrl,
        siteName: this.config?.defaultSite ?? '',
      },
      plugins: [
        analyticsPlugin({
          options: {
            enableCookie: true,
            cookieDomain: normalizeCookieDomain(window.location.hostname),
          },
          adapter: analyticsBrowserAdapter(),
        }),
        eventsPlugin(),
      ],
    });
    return true;
  }
}
