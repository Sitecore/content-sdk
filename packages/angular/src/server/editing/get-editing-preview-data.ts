import {
  isDesignLibraryMode,
  type EditingPreviewData,
  type DesignLibraryRenderPreviewData,
} from '@sitecore-content-sdk/content/editing';
import type { CsdkRequestData } from '../../loaders/models';
import { EDITING_PARAMS_HEADER } from '../../editing/constants';

/**
 * Preview data carried by an editing render request: standard edit/preview data, or Design
 * Library data when the request is in a Design Library mode.
 * @public
 */
export type EditingRenderPreviewData = EditingPreviewData | DesignLibraryRenderPreviewData;

/**
 * Read the editing preview data from the request context produced by the
 * SSR resolver (`extractRequestData`). Returns `undefined` when the
 * request did not flow through {@link createEditingRenderMiddleware}.
 *
 * Loaders use this to branch between published-content fetching
 * (`client.getPage`), preview fetching (`client.getPreview`), and Design Library fetching
 * (`client.getDesignLibraryData`, guarded by {@link isDesignLibraryPreviewData}).
 * @param {CsdkRequestData | undefined} csdkRequestData - Loader request context.
 * @returns {EditingRenderPreviewData | undefined} Parsed preview data or `undefined`.
 * @public
 */
export function getEditingPreviewData(
  csdkRequestData: CsdkRequestData | undefined
): EditingRenderPreviewData | undefined {
  const raw = csdkRequestData?.headers?.[EDITING_PARAMS_HEADER];
  const headerValue = Array.isArray(raw) ? raw[0] : raw;
  if (!headerValue) {
    return undefined;
  }
  try {
    return JSON.parse(headerValue) as EditingRenderPreviewData;
  } catch {
    return undefined;
  }
}

/**
 * Type guard: whether preview data is Design Library data (mode `library` / `library-metadata`).
 * loaders use it to call `client.getDesignLibraryData` instead of `client.getPreview`.
 * @param {EditingRenderPreviewData | undefined} data - Preview data to check.
 * @returns {boolean} True when the data is {@link DesignLibraryRenderPreviewData}.
 * @public
 */
export function isDesignLibraryPreviewData(
  data: EditingRenderPreviewData | undefined
): data is DesignLibraryRenderPreviewData {
  return !!data && 'mode' in data && isDesignLibraryMode(data.mode);
}
