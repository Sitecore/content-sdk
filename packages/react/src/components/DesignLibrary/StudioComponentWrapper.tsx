'use client';
import React, { JSX, useMemo, useState } from 'react';
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
  // State (not a ref) keeps render pure: React discards state set during a render it throws away.
  // The last seen input is stored too, so the deep comparison runs once per new reference
  // rather than on every render.
  const [seen, setSeen] = useState({ input: document, stable: document });

  if (seen.input === document) {
    return seen.stable;
  }

  const stable = fastDeepEqual(seen.stable, document) ? seen.stable : document;
  setSeen({ input: document, stable });

  return stable;
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
