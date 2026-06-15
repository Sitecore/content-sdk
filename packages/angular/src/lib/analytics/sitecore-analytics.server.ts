import { Injectable } from '@angular/core';
import type { SitecoreAnalyticsWrapper } from './sitecore-analytics';

/**
 * Server-side {@link SitecoreAnalyticsWrapper} implementation. Every method is an explicit
 * no-op: browser-originated CDP events do not exist during SSR, and server-side visitor cookie
 * state is owned by the personalize middleware. No-op (rather than throw) so callers never need
 * platform guards.
 * @public
 */
@Injectable()
export class SitecoreAnalyticsServer implements SitecoreAnalyticsWrapper {
  pageView(): Promise<void> {
    return Promise.resolve();
  }
  event(): Promise<void> {
    return Promise.resolve();
  }
  identity(): Promise<void> {
    return Promise.resolve();
  }
  form(): Promise<void> {
    return Promise.resolve();
  }
}
