import { PREVIEW_TOKEN } from '@sitecore-content-sdk/content/editing';
import type { Page, SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { CsdkRequestData } from '../../loaders/models';
import { isDesignLibraryPreviewData, type EditingRenderPreviewData } from './get-editing-preview-data';

/**
 * Reads the bearer token authorizing preview / edit layout: the `Authorization`
 * header (initial editing render) or the {@link PREVIEW_TOKEN} cookie (later navigation).
 * @param {CsdkRequestData | undefined} csdkRequestData - Request data from the incoming request.
 * @returns {string | undefined} Token, or `undefined` when none is present.
 * @public
 */
export function getPreviewAuthToken(
  csdkRequestData: CsdkRequestData | undefined
): string | undefined {
  const header = csdkRequestData?.headers?.authorization;
  const headerValue = Array.isArray(header) ? header[0] : header;
  if (headerValue) return headerValue;
  const cookie = csdkRequestData?.cookies?.[PREVIEW_TOKEN];
  return cookie ? decodeURIComponent(cookie) : undefined;
}

/**
 * Fetches protected preview / edit layout, forwarding the preview token as the
 * `Authorization` header. Uses `getDesignLibraryData` for Design Library modes,
 * otherwise `getPreview`. Throws when access is denied or the page is not found.
 * @param {SitecoreClient} client - Content SDK client.
 * @param {EditingRenderPreviewData} previewData - Preview data from the editing request.
 * @param {CsdkRequestData} [csdkRequestData] - Request data used to read the preview token.
 * @returns {Promise<Page>} Preview page.
 * @throws {Error} When preview content is not found or access is denied.
 * @public
 */
export async function resolvePreviewPage(
  client: SitecoreClient,
  previewData: EditingRenderPreviewData,
  csdkRequestData?: CsdkRequestData
): Promise<Page> {
  const token = getPreviewAuthToken(csdkRequestData);
  const fetchOptions = { headers: { Authorization: token ?? '' } };

  const page = isDesignLibraryPreviewData(previewData)
    ? await client.getDesignLibraryData(previewData, fetchOptions)
    : await client.getPreview(previewData, fetchOptions);

  if (!page) {
    throw new Error('Preview content is not found or access is denied');
  }
  return page;
}

/**
 * Fetches preview layout for a follow-up navigation via `getPage`, forwarding the
 * preview token plus `sc_previewMode` / `sc_site` headers. Throws when access is
 * denied or the page is not found.
 * @param {SitecoreClient} client - Content SDK client.
 * @param {string} path - Route path to fetch.
 * @param {{ site: string; locale: string }} options - Resolved site and locale.
 * @param {string} options.site - Resolved site name.
 * @param {string} options.locale - Resolved locale.
 * @param {CsdkRequestData} [csdkRequestData] - Request data used to read the preview token.
 * @returns {Promise<Page>} Preview page.
 * @throws {Error} When preview content is not found or access is denied.
 * @public
 */
export async function resolvePreviewNavigation(
  client: SitecoreClient,
  path: string,
  options: { site: string; locale: string },
  csdkRequestData?: CsdkRequestData
): Promise<Page> {
  const token = getPreviewAuthToken(csdkRequestData);
  const page = await client.getPage(
    path,
    { site: options.site, locale: options.locale },
    {
      headers: {
        Authorization: token ?? '',
        sc_previewMode: 'true',
        sc_site: options.site,
      },
    }
  );

  if (!page) {
    throw new Error('Preview content is not found or access is denied');
  }
  return page;
}
