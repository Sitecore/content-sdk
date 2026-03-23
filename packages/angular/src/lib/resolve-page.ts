import type { Page, PageOptions } from '@sitecore-content-sdk/content/client';
import type { SitecoreClient } from '@sitecore-content-sdk/content/client';

/**
 * Options for `resolvePage`.
 * @public
 */
export interface ResolvePageOptions {
  /** Language / locale for the page request. Defaults to the client's configured defaultLanguage. */
  locale?: string;
  /** Site name for the page request. Defaults to the client's configured defaultSite. */
  site?: string;
}

/**
 * Resolves a page from the Sitecore layout service using the provided client.
 *
 * Mirrors the Next.js pattern: `client.getPage(path, { site, locale })`.
 *
 * @param client - A `SitecoreClient` instance (injected via `SITECORE_CLIENT_TOKEN`).
 * @param path - The route path (e.g. `'/'` or `'/about'`).
 * @param options - Optional site and locale overrides.
 * @returns The resolved `Page`, or `null` when the route does not exist.
 * @public
 */
export async function resolvePage(
  client: SitecoreClient,
  path: string,
  options?: ResolvePageOptions
): Promise<Page | null> {
  const pageOptions: PageOptions = {};

  if (options?.locale) {
    pageOptions.locale = options.locale;
  }
  if (options?.site) {
    pageOptions.site = options.site;
  }

  return client.getPage(path, pageOptions);
}
