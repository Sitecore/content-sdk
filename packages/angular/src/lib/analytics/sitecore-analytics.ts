import { InjectionToken } from '@angular/core';
import type { EventData, IdentityData, PageViewData } from '@sitecore-content-sdk/events';

/**
 * Browser-only analytics façade for Sitecore CDP events. A single injectable token backed by
 * two platform implementations: the browser implementation lazily initializes the Content SDK
 * events runtime on first use and dispatches; the server implementation is a no-op so callers
 * never need platform guards. Resolve it with `inject(SITECORE_ANALYTICS)`.
 * @public
 */
export interface SitecoreAnalyticsWrapper {
  /** Dispatch a page view event. */
  pageView(data: PageViewData): Promise<void>;
  /** Dispatch a custom event. */
  event(data: EventData): Promise<void>;
  /** Dispatch an identity event. */
  identity(data: IdentityData): Promise<void>;
  /** Dispatch a form interaction event. */
  form(
    formId: string,
    interactionType: 'VIEWED' | 'SUBMITTED',
    componentInstanceId: string
  ): Promise<void>;
}

/**
 * DI token for the {@link SitecoreAnalyticsWrapper} façade. `provideSitecoreAngular` registers a
 * browser or server implementation based on the current platform.
 * @public
 */
export const SITECORE_ANALYTICS = new InjectionToken<SitecoreAnalyticsWrapper>(
  'SITECORE_ANALYTICS'
);

/**
 * Normalize a hostname into a cookie domain: strips the port and a leading `www.` so that
 * browser-side and server-side cookie writes resolve to the same domain. Divergent
 * normalization would mint duplicate visitor cookies on `www.` hosts.
 * @param {string} hostname - Hostname, optionally with a port (e.g. `www.example.com:3000`).
 * @returns {string} Normalized cookie domain (e.g. `example.com`).
 * @public
 */
export function normalizeCookieDomain(hostname: string): string {
  const withoutPort = hostname.split(':')[0];
  return withoutPort.replace(/^www\./i, '');
}