import type { EditingPreviewData } from '@sitecore-content-sdk/content/editing';
import type { CsdkRequestData } from '../../loaders/models';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';

/**
 * Read the editing preview data from the request context produced by the
 * SSR resolver (`extractRequestData`). Returns `undefined` when the
 * request did not flow through {@link createEditingRenderMiddleware}.
 *
 * Loaders use this to branch between published-content fetching
 * (`client.getPage`) and preview fetching (`client.getPreview`).
 * @param {RequestContext | undefined} requestContext - Loader request context.
 * @returns {EditingPreviewData | undefined} Parsed preview data or `undefined`.
 * @public
 */
export function getEditingPreviewData(
  csdkRequestData: CsdkRequestData | undefined
): EditingPreviewData | undefined {
  const raw = csdkRequestData?.headers?.[EDITING_PARAMS_HEADER];
  const headerValue = Array.isArray(raw) ? raw[0] : raw;
  if (!headerValue) {
    return undefined;
  }
  try {
    return JSON.parse(headerValue) as EditingPreviewData;
  } catch {
    return undefined;
  }
}
