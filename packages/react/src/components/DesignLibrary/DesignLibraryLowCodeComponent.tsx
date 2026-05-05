'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms, getAtomMap } from '../../atoms/atom-registry-utils';
import { serializeCallbacks } from '../../atoms/callback-registry-utils';
import { createView } from '../../atoms/component-layout';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import * as editing from '@sitecore-content-sdk/content/editing';
import { DesignLibraryErrorBoundary } from '../..';

let {
  postToDesignLibrary,
  getDesignLibraryAtomsRegistryEvent,
  getDesignLibraryStatusEvent,
  DesignLibraryStatus,
  sendAtomsErrorEvent,
  addDocumentUpdateHandler,
} = editing;

export const __mockDependencies = (mocks: any) => {
  if (mocks.postToDesignLibrary) {
    postToDesignLibrary = mocks.postToDesignLibrary;
  }
  if (mocks.sendAtomsErrorEvent) {
    sendAtomsErrorEvent = mocks.sendAtomsErrorEvent;
  }
  if (mocks.addDocumentUpdateHandler) {
    addDocumentUpdateHandler = mocks.addDocumentUpdateHandler;
  }
};

/**
 * Design Library Low Code component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
 * - On mount, it unfolds and serializes the atoms registry and callback registry and sends it to the Design Studio via the `getDesignLibraryAtomsRegistryEvent`.
 * - Receives Component model data updates via document update handler and renders the low code component
 * based on component model data and the available atoms using createView.
 * @internal
 */
export const DesignLibraryLowCodeComponent = () => {
  const { atomRegistry } = useSitecore();
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [renderKey, setRenderKey] = useState(0);

  const atomMap = useMemo(() => getAtomMap(atomRegistry?.atoms || []), [atomRegistry?.atoms]);

  const ViewComponent = useMemo(() => {
    if (!currentDocument) return null;
    return createView(currentDocument, atomMap, atomRegistry?.callbacks);
  }, [currentDocument, atomMap, atomRegistry?.callbacks]);

  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );
  }, []);

  useEffect(() => {
    const serializedAtoms = serializeAtoms(atomRegistry?.atoms ?? []);
    if (serializedAtoms.length === 0) {
      sendAtomsErrorEvent('No atoms provided', 'atoms-missing');
      return;
    }

    const serializedCallbacks = serializeCallbacks(atomRegistry?.callbacks ?? []);

    postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms, serializedCallbacks));

    const unsubDocumentUpdate = addDocumentUpdateHandler((updatedDocument) => {
      setCurrentDocument(updatedDocument);
      setRenderKey((k) => k + 1);
    });

    return () => unsubDocumentUpdate();
  }, [atomRegistry]);

  useEffect(() => {
    if (renderKey === 0) return;

    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
    );
  }, [renderKey]);

  return (
    <DesignLibraryErrorBoundary
      uid={currentDocument?.name ?? 'design-library-low-code-component'}
      renderKey={renderKey}
    >
      {ViewComponent ? <ViewComponent {...(currentDocument?.props ?? {})} /> : null}
    </DesignLibraryErrorBoundary>
  );
};
