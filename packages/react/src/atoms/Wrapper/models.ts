import type { Document } from '@sitecore-content-sdk/content/atoms';

/**
 * Rendering parameters injected by the layout service for Studio components.
 * The `ComponentRef$` field on the rendering is copied into params with the `$` stripped.
 * @internal
 */
export type StudioComponentParams = {
  /**
   * Identifier or relative/absolute path to the Studio component layout JSON in MMS.
   */
  componentRef?: string;
};

/**
 * Props accepted by the RSC `StudioComponentServerWrapper`.
 * @internal
 */
export type StudioComponentServerWrapperProps = {
  /**
   * Pipe separated relative paths to the Studio component layout JSON in MMS with the last segment as the variant name. The path matching `FieldNames` will be used, or `default` if no match.
   */
  componentRef: string;
  fieldNames?: string;
};

/**
 * Props accepted by the `StudioComponentWrapper` used to render a Studio component layout on the client. Expects a pre-fetched `document` containing the component layout data.
 * @internal
 */
export type StudioComponentWrapperProps = {
  document?: Document | null;
};

