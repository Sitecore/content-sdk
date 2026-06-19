import { LayoutServicePageState } from '../layout';

/**
 * Query parameters appended to the page route URL
 * Appended when XMCloud Pages preview (editing) mode is used
 * `mode` is a special case as it serves editing and component library both
 * @internal
 */
export interface EditingRenderQueryParams {
  [key: string]: unknown;
  secret: string;
  sc_lang: string;
  sc_itemid: string;
  sc_site: string;
  route: string;
  mode: Exclude<LayoutServicePageState, 'normal'> | DesignLibraryMode;
  sc_layoutKind?: LayoutKind;
  sc_variant?: string;
  sc_version?: string;
  sc_previewTime?: string;
}

/**
 * Query parameters appended for Component Library functionaity.
 * Used when a single component is rendered in Pages.
 * @internal
 */
export interface RenderComponentQueryParams {
  [key: string]: unknown;
  secret: string;
  sc_lang: string;
  sc_itemid: string;
  sc_uid: string;
  sc_site: string;
  mode: DesignLibraryMode;
  sc_renderingId?: string;
  sc_variant?: string;
  sc_version?: string;
}

/**
 * Represents the Editing Layout variant.
 * - shared - shared layout
 * - final - final layout
 * @public
 */
export enum LayoutKind {
  Final = 'final',
  Shared = 'shared',
}

/**
 * Represents the kind of metadata element.
 * - open - starting chrome element
 * - close - closing chrome element
 * @internal
 */
export enum MetadataKind {
  Open = 'open',
  Close = 'close',
}

/**
 * Data for Preview (Editing) Mode.
 * @public
 */
export type EditingPreviewData = {
  site: string;
  itemId: string;
  language: string;
  mode: Exclude<LayoutServicePageState, 'Normal'>;
  variantId: string;
  version?: string;
  layoutKind?: LayoutKind;
  previewTime?: string;
};

/**
 * Represents the mode of the Design Library
 * @public
 */
export enum DesignLibraryMode {
  /** Normal mode */
  Normal = 'library',
  /** Metadata mode */
  Metadata = 'library-metadata',
}

/**
 * Variant generation mode for Design Library
 * @public
 */
export enum DesignLibraryVariantGeneration {
  Variant = 'variant',
}

/**
 * Data for Design Library rendering mode
 * @public
 */
export interface DesignLibraryRenderPreviewData {
  site: string;
  itemId: string;
  componentUid: string;
  language: string;
  mode: DesignLibraryMode;
  renderingId?: string;
  variant?: string;
  version?: string;
  dataSourceId?: string;
  generation?: DesignLibraryVariantGeneration;
}
