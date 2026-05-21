import {
  StudioComponentServerWrapper,
  type StudioComponentParams,
} from '@sitecore-content-sdk/react';
import type { ComponentRendering } from '@sitecore-content-sdk/content/layout';

type StudioNccWrapperParams = StudioComponentParams & {
  FieldNames?: string;
};

type StudioNccWrapperProps = {
  params?: StudioNccWrapperParams;
  rendering?: ComponentRendering;
};

/**
 * Internal template component: maps Sitecore rendering params to {@link StudioComponentServerWrapper}.
 * Register as `StudioNccWrapper` in `.sitecore/component-map.ts` (not part of the public SDK API).
 * @internal
 */
export default async function StudioNccWrapper(props: StudioNccWrapperProps) {
  return (
    <StudioComponentServerWrapper
      componentRef={props.params?.componentRef ?? ''}
      fieldNames={props.params?.FieldNames}
    />
  );
}
