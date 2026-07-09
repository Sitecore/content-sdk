'use client';
import React, { JSX, useMemo } from 'react';
import { createNCC } from '../../atoms';
import { useSitecore } from '../SitecoreProvider';
import { Document } from '@sitecore-content-sdk/content/atoms';
import type { ChildComponentProps } from '../Placeholder/models';

/**
 * Props accepted by the `StudioComponentWrapper` used to render a Studio component layout on the client. Expects a pre-fetched `document` containing the component layout data.
 * @internal
 */
type StudioComponentWrapperProps = {
  document: Document | null;
  fields?: ChildComponentProps['fields'];
  params?: ChildComponentProps['params'];
};

/**
 * Client component that renders a pre-fetched Studio (NCC) component layout.
 *
 * Expects `document` to be provided (fetched server-side by
 * `StudioComponentServerWrapper`, from Design Library document updates, or any other
 * preview path that supplies a layout `Document`). Renders `null` when no layout
 * is available.
 * @param {StudioComponentWrapperProps} props component props
 * @internal
 */
export const StudioComponentWrapper = ({
  document,
  fields,
  params,
}: StudioComponentWrapperProps): JSX.Element | null => {
  const { atomsConfig } = useSitecore();

  const NCComponent = useMemo(() => {
    if (!document || !atomsConfig) return null;

    return createNCC(document, atomsConfig.registry);
  }, [document, atomsConfig]);

  if (!NCComponent) return null;

  return <NCComponent fields={fields} params={params} />;
};
