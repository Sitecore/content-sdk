import type { Page, PageOptions, SitecoreClient } from '@sitecore-content-sdk/content/client';
import { AngularSitecoreConfig } from '../config/define-config';

/**
 * Resolves layout/page data for a route path using a {@link SitecoreClient} and Sitecore config.
 * Import your `sitecore.config` default and shared client (e.g. `getClient()`) from the app;
 * this stays usable from route loaders without Angular injection context.
 *
 * Future: add helpers for personalization and multisite alongside this call.
 * @param {string} path - Route path (e.g. `'/'` or `'/about'`).
 * @param {AngularSitecoreConfig} sitecoreConfig - Resolved Sitecore configuration (e.g. default export from `sitecore.config.ts`).
 * @param {SitecoreClient} client - Sitecore client instance (e.g. from a module singleton).
 * @param {{ locale?: string; site?: string }} [options] - Optional `locale` / `site` overrides.
 * @param {string} [options.locale] - Optional locale override.
 * @param {string} [options.site] - Optional site override.
 * @returns {Promise<Page | null>} Page layout data, or `null` if not found.
 * @public
 */
export async function resolveSitecorePage(
  path: string,
  sitecoreConfig: AngularSitecoreConfig,
  client: SitecoreClient,
  options?: { locale?: string; site?: string }
): Promise<Page | null> {
  const pageOptions: PageOptions = {};
  if (options?.locale) {
    pageOptions.locale = options.locale || sitecoreConfig.defaultLanguage;
  }
  if (options?.site) {
    pageOptions.site = options.site || sitecoreConfig.defaultSite;
  }
  return client.getPage(path, pageOptions);
}
