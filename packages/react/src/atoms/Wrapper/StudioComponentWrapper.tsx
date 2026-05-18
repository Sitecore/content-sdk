'use client';
import React, { JSX, useMemo } from 'react';
import { createView } from '../component-layout';
import { getAtomMap } from '../atom-registry-utils';
import { useSitecore } from '../../components/SitecoreProvider';
import { StudioComponentWrapperProps } from './models';

/**
 * Client component that renders a pre-fetched Studio (NCC) component layout.
 *
 * Expects `document` to be provided (fetched server-side by
 * `StudioComponentServerWrapper` or from DesignLibraryLowCodeComponent). Renders `null` when no layout is available.
 * @param {StudioComponentWrapperProps} props component props
 * @internal
 */
export const StudioComponentWrapper = (props: StudioComponentWrapperProps): JSX.Element | null => {
  const { atomRegistry } = useSitecore();
  const atomMap = useMemo(() => getAtomMap(atomRegistry?.atoms ?? []), [atomRegistry?.atoms]);

  const ViewComponent = useMemo(() => {
    if (!props.document) return null;

    return createView(props.document, atomMap, atomRegistry?.callbacks);
  }, [props.document, atomMap, atomRegistry?.callbacks]);

  if (!ViewComponent) return null;

  return <ViewComponent />;
};

