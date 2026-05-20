'use client';
import React, { JSX, useMemo } from 'react';
import { createView } from '../component-layout';
import { getAtomMap } from '../atom-registry-utils';
import { useSitecore } from '../../components/SitecoreProvider';
import { StudioComponentWrapperProps } from './models';

/**
 * Runtime props spread onto the root view from `document.props` when it is a plain object.
 * @param {unknown} propsValue - `document.props` from a component layout document
 * @returns props object safe to spread onto the generated view component
 * @internal
 */
function getRootRuntimePropsFromDocument(propsValue: unknown): Record<string, unknown> {
  if (propsValue == null) {
    return {};
  }
  if (typeof propsValue !== 'object' || Array.isArray(propsValue)) {
    return {};
  }
  return propsValue as Record<string, unknown>;
}

/**
 * Client component that renders a pre-fetched Studio (NCC) component layout.
 *
 * Expects `document` to be provided (fetched server-side by
 * `StudioComponentServerWrapper`, from Design Library document updates, or any other
 * preview path that supplies a layout `Document`). Spreads plain-object `document.props`
 * onto the root view so bindings resolve against the same runtime props as Design Library
 * low-code preview. Renders `null` when no layout is available.
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

  if (!ViewComponent || !props.document) return null;

  const rootRuntimeProps = getRootRuntimePropsFromDocument(props.document.props);

  return <ViewComponent {...rootRuntimeProps} />;
};

