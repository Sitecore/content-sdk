import { EditingPreviewData, DesignLibraryRenderPreviewData } from '@sitecore-content-sdk/core/editing';
/**
 * Query parameters type for editing mode requests
 * @public
 */
export type EditingQueryParams = Record<string, string | string[] | undefined>;
/**
 * Checks if query parameters represent an editing mode request.
 * Expected format: sc_itemid=xxx&sc_lang=en&sc_site=basic&sc_layoutKind=final&mode=edit&secret=xxx&route=/
 * @param query - The query parameters from the incoming request
 * @returns true if the request has required editing mode parameters
 * @public
 */
export declare function isEditingMode(query: EditingQueryParams): boolean;
/**
 * Checks if the editing mode is Design Library mode
 * @param mode - The mode from query parameters
 * @returns true if mode is a Design Library mode
 * @public
 */
export declare function isDesignLibraryRequest(mode: string | string[] | undefined): boolean;
/**
 * Parses query parameters into EditingPreviewData for edit/preview mode
 * @param query - The query parameters from the incoming request
 * @returns Parsed editing preview data
 * @public
 */
export declare function parseEditingPreviewData(query: EditingQueryParams): EditingPreviewData;
/**
 * Parses query parameters into DesignLibraryRenderPreviewData for design library mode
 * @param query - The query parameters from the incoming request
 * @returns Parsed design library preview data
 * @public
 */
export declare function parseDesignLibraryPreviewData(query: EditingQueryParams): DesignLibraryRenderPreviewData;
//# sourceMappingURL=editing-utils.d.ts.map