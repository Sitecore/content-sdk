import React from 'react';
import {
  StudioComponentServerWrapper,
  type StudioComponentParams,
} from '@sitecore-content-sdk/react';
import type { ComponentRendering } from '@sitecore-content-sdk/content/layout';

/**
 * Rendering parameters for {@link StudioNccWrapper} from Sitecore layout service.
 * `ComponentRef$` is exposed as `componentRef`; optional `FieldNames` selects a variant path.
 * @public
 */
export type StudioNccWrapperParams = StudioComponentParams & {
  FieldNames?: string;
};

/**
 * Props for {@link StudioNccWrapper} when rendered from a Sitecore layout placeholder.
 * @public
 */
export type StudioNccWrapperProps = {
  params?: StudioNccWrapperParams;
  rendering?: ComponentRendering;
};

/**
 * Fetches an NCC / Studio component layout from MMS and renders it with atoms.
 * Register in `.sitecore/component-map.ts` using the same key as the Sitecore rendering name.
 * @param {StudioNccWrapperProps} props layout props (`params.componentRef`, optional `params.FieldNames`)
 * @public
 */
const StudioNccWrapper = async (props: StudioNccWrapperProps) => {
  const componentRef = props.params?.componentRef ?? '';
  const fieldNames = props.params?.FieldNames;

  return <StudioComponentServerWrapper componentRef={componentRef} fieldNames={fieldNames} />;
};

export default StudioNccWrapper;
