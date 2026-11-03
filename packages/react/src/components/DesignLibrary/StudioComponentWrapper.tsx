'use client';
import React, { JSX, useMemo, useRef } from 'react';
import fastDeepEqual from 'fast-deep-equal/es6/react';
import { createNCC } from '../../atoms';
import { useSitecore } from '../SitecoreProvider';
import { Document } from '@sitecore-content-sdk/content/atoms';

/**
 * Props accepted by the `StudioComponentWrapper` used to render a Studio component layout on the client. Expects a pre-fetched `document` containing the component layout data.
 * @internal
 */
type StudioComponentWrapperProps = {
  document: Document | null;
};

/**
 * Returns the previously seen document while the incoming one is deeply equal to it.
 * The document is rebuilt on every server render, so its identity changes even when its content does not.
 * @param {Document | null | undefined} document the incoming document
 * @returns {Document | null | undefined} a referentially stable document for as long as its content is unchanged
 */
const useStableDocument = (document: Document | null | undefined) => {
  const ref = useRef(document);

  if (ref.current !== document && !fastDeepEqual(ref.current, document)) {
    ref.current = document;
  }

  return ref.current;
};

/**
 * Client component that renders a pre-fetched Studio (NCC) component layout.
 *
 * Expects `document` to be provided (fetched server-side by
 * `StudioComponentServerWrapper`, from Design Library document updates, or any other
 * preview path that supplies a layout `Document`). Renders `null` when no layout
 * is available.
 *
 * The rendered component is only re-created when the document content, atoms catalog or atoms registry
 * change. Re-creating it remounts the whole subtree, which replaces its DOM and detaches the Pages editor
 * canvas from it, so identity-only changes (e.g. an inline `atomsConfig` object or a re-fetched but
 * identical document) must not trigger it.
 * @param {StudioComponentWrapperProps} props component props
 * @internal
 */
export const StudioComponentWrapper = ({
  document: incomingDocument,
}: StudioComponentWrapperProps): JSX.Element | null => {
  const { atomsConfig } = useSitecore();
  const document = useStableDocument(incomingDocument);
  const registry = atomsConfig?.registry;
  const catalog = atomsConfig?.catalog;

  const NCComponent = useMemo(() => {
    if (!document || !registry || !catalog) return null;

    return createNCC(document, registry, catalog);
  }, [document, registry, catalog]);

  if (!NCComponent) return null;

  return <NCComponent />;
};
