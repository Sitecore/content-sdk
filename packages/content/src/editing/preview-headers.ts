import { LayoutServicePageState } from '../layout';
import { DEFAULT_VARIANT } from '../personalize';
import { LayoutKind } from './models';

/**
 * Preview parameters that are scoped to the author's session. They describe *how* the author
 * is looking at content and hold the same value for every route visited during the session,
 * so they can safely be captured once and replayed on subsequent requests.
 * @public
 */
export const PREVIEW_SESSION_PARAMS = ['sc_layoutKind', 'sc_previewTime'] as const;

/**
 * Preview parameters that are scoped to a single route. They describe *which* item is being
 * looked at and are meaningless once the route changes, so they must be resolved per route
 * rather than carried across navigation.
 * @public
 */
export const PREVIEW_ROUTE_PARAMS = ['sc_itemid', 'sc_version', 'sc_variant'] as const;

/**
 * Options used to build the preview headers sent to Sitecore Experience Edge.
 * @public
 */
export type PreviewHeaderOptions = {
  /**
   * Page mode the request is made for. Determines the `sc_editMode` / `sc_previewMode` headers.
   */
  mode: Exclude<LayoutServicePageState, 'Normal'>;
  /**
   * The final or shared layout variant.
   */
  layoutKind?: LayoutKind;
  /**
   * The variant id. Falls back to the default variant when omitted.
   */
  variantId?: string;
  /**
   * Site context for the request.
   */
  site?: string;
  /**
   * Preview time for time based preview.
   */
  previewTime?: string;
};

/**
 * Builds the `sc_*` headers that instruct Experience Edge to resolve preview content.
 * Shared by every request made on a preview code path so that the headers cannot drift
 * between the editing query and the route resolution query.
 * @param {PreviewHeaderOptions} options preview details to build headers from
 * @returns {Record<string, string>} headers to send along with the GraphQL request
 * @public
 */
export const buildPreviewHeaders = ({
  mode,
  layoutKind = LayoutKind.Final,
  variantId,
  site,
  previewTime,
}: PreviewHeaderOptions): Record<string, string> => {
  return {
    sc_layoutKind: layoutKind,
    sc_editMode: mode === 'edit' ? 'true' : 'false',
    sc_previewMode: mode === 'preview' ? 'true' : 'false',
    sc_variant: !variantId || variantId === DEFAULT_VARIANT ? 'default' : variantId,
    ...(site && { sc_site: site }),
    ...(previewTime && { sc_previewTime: previewTime }),
  };
};
