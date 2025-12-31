import {
  EditingPreviewData,
  DesignLibraryRenderPreviewData,
  DesignLibraryMode,
  LayoutKind,
  isDesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/core/layout';

/**
 * Query parameters type for editing mode requests
 */
export type EditingQueryParams = Record<string, string | string[] | undefined>;

/**
 * Checks if query parameters represent an editing mode request.
 * Expected format: sc_itemid=xxx&sc_lang=en&sc_site=basic&sc_layoutKind=final&mode=edit&secret=xxx&route=/
 * @param query - The query parameters from the incoming request
 * @returns true if the request has required editing mode parameters
 */
export function isEditingMode(query: EditingQueryParams): boolean {
  return !!(query.sc_itemid && query.sc_lang && query.sc_site && query.mode && query.secret);
}

/**
 * Checks if the editing mode is Design Library mode
 * @param mode - The mode from query parameters
 * @returns true if mode is a Design Library mode
 */
export function isDesignLibraryRequest(mode: string | string[] | undefined): boolean {
  const modeValue = Array.isArray(mode) ? mode[0] : mode;
  return isDesignLibraryMode(modeValue);
}

/**
 * Helper function to extract string value from query parameter
 * @param value - The query parameter value (can be string, array, or undefined)
 * @returns The string value or empty string
 */
function getString(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value ?? '';
}

/**
 * Parses query parameters into EditingPreviewData for edit/preview mode
 * @param query - The query parameters from the incoming request
 * @returns Parsed editing preview data
 */
export function parseEditingPreviewData(query: EditingQueryParams): EditingPreviewData {
  return {
    site: getString(query.sc_site),
    itemId: getString(query.sc_itemid),
    language: getString(query.sc_lang),
    mode: getString(query.mode) as Exclude<LayoutServicePageState, 'normal'>,
    variantIds: getString(query.sc_variant) || '',
    version: getString(query.sc_version),
    layoutKind: (getString(query.sc_layoutKind) as LayoutKind) || LayoutKind.Final,
  };
}

/**
 * Parses query parameters into DesignLibraryRenderPreviewData for design library mode
 * @param query - The query parameters from the incoming request
 * @returns Parsed design library preview data
 */
export function parseDesignLibraryPreviewData(
  query: EditingQueryParams
): DesignLibraryRenderPreviewData {
  return {
    site: getString(query.sc_site),
    itemId: getString(query.sc_itemid),
    renderingId: getString(query.sc_renderingId),
    componentUid: getString(query.sc_uid),
    language: getString(query.sc_lang),
    mode: getString(query.mode) as DesignLibraryMode,
    variant: getString(query.sc_variant),
    version: getString(query.sc_version),
    dataSourceId: getString(query.dataSourceId),
  };
}

