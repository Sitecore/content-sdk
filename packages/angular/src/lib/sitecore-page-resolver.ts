import type { Page, PageOptions, SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { EditingPreviewData } from '@sitecore-content-sdk/content/editing';
import { AngularSitecoreConfig } from '../config/define-config';

/**
 * Resolves layout/page data for a route path using a {@link SitecoreClient} and Sitecore config.
 * Import your `sitecore.config` default and shared client (e.g. `getClient()`) from the app;
 * this stays usable from route loaders without Angular injection context.
 *
 * When `previewData` is supplied (typically read via `getEditingPreviewData()` from the
 * request context), the resolver calls `client.getPreview(previewData)` and `path`,
 * `locale`, and `site` are ignored — the editor's payload is authoritative.
 *
 * Future: add helpers for personalization and multisite alongside this call.
 * @param {string} path - Route path (e.g. `'/'` or `'/about'`).
 * @param {AngularSitecoreConfig} sitecoreConfig - Resolved Sitecore configuration (e.g. default export from `sitecore.config.ts`).
 * @param {SitecoreClient} client - Sitecore client instance (e.g. from a module singleton).
 * @param {{ locale?: string; site?: string; previewData?: EditingPreviewData }} [options] - Optional overrides.
 * @param {string} [options.locale] - Optional locale override (ignored when `previewData` is set).
 * @param {string} [options.site] - Optional site override (ignored when `previewData` is set).
 * @param {EditingPreviewData} [options.previewData] - Editing preview data; triggers `client.getPreview`.
 * @returns {Promise<Page | null>} Page layout data, or `null` if not found.
 * @public
 */
export async function resolveSitecorePage(
  path: string,
  sitecoreConfig: AngularSitecoreConfig,
  client: SitecoreClient,
  options?: { locale?: string; site?: string; previewData?: EditingPreviewData }
): Promise<Page | null> {
  if (options?.previewData) {
    return client.getPreview(options.previewData);
  }

  const pageOptions: PageOptions = {};
  if (options?.locale) {
    pageOptions.locale = options.locale || sitecoreConfig.defaultLanguage;
  }
  if (options?.site) {
    pageOptions.site = options.site || sitecoreConfig.defaultSite;
  }
  return client.getPage(path, pageOptions);
}
