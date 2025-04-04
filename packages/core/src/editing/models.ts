import { LayoutServicePageState } from '../layout';

/**
 * Query parameters appended to the page route URL
 * Appended when XMCloud Pages preview (editing) mode is used
 * `mode` is a special case as it serves editing and component library both
 */
export interface EditingRenderQueryParams {
  [key: string]: unknown;
  secret: string;
  sc_lang: string;
  sc_itemid: string;
  sc_site: string;
  route: string;
  mode: Exclude<LayoutServicePageState, 'normal'> | 'library';
  sc_layoutKind?: LayoutKind;
  sc_variant?: string;
  sc_version?: string;
}

/**
 * Query parameters appended for Component Library functionaity.
 * Used when a single component is rendered in Pages.
 */
export interface RenderComponentQueryParams {
  [key: string]: unknown;
  secret: string;
  sc_lang: string;
  sc_itemid: string;
  sc_renderingId: string;
  sc_uid: string;
  sc_site: string;
  mode: 'library';
  sc_variant?: string;
  sc_version?: string;
}

/**
 * Represents the Editing Layout variant.
 * - shared - shared layout
 * - final - final layout
 */
export enum LayoutKind {
  Final = 'final',
  Shared = 'shared',
}

/**
 * Represents the kind of metadata element.
 * - open - starting chrome element
 * - close - closing chrome element
 */
export enum MetadataKind {
  Open = 'open',
  Close = 'close',
}

/**
 * Data for Preview (Editing) Mode.
 */
export type EditingPreviewData = {
  site: string;
  itemId: string;
  language: string;
  mode: Exclude<LayoutServicePageState, 'Normal'>;
  variantIds: string[];
  version?: string;
  layoutKind?: LayoutKind;
};

/**
 * Data for Design Library rendering mode
 */
export interface DesignLibraryRenderPreviewData {
  site: string;
  itemId: string;
  renderingId: string;
  componentUid: string;
  language: string;
  mode?: 'library';
  variant?: string;
  version?: string;
  dataSourceId?: string;
}
