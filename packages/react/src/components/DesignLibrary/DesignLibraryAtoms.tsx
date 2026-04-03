'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms, getAtomMap } from '../../atoms/atom-registry-utils';
import { serializeCallbacks } from '../../atoms/callback-registry-utils';
import * as editing from '@sitecore-content-sdk/content/editing';
import { AtomRenderer } from '../AtomRenderer/AtomRenderer';
import {
  cardsWithDataBinding,
  // accordionWithCards,
} from '../AtomRenderer/test-data/component-layouts';
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
 * Design Library Atoms component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when in atom rendering mode.
 * - On mount, it unfolds and serializes the atoms registry and callback registry and sends it to the Design Studio via the `getDesignLibraryAtomsRegistryEvent`.
 * - Fetches Component model data, and passes it to the `AtomRenderer` which is responsible for rendering the low code component
 * based on component model data and the available atoms.
 * @internal
 */
export const DesignLibraryAtoms = () => {
  const { atomsRegistry } = useSitecore();
  const [currentDocument, setCurrentDocument] = useState(cardsWithDataBinding);
  const [renderKey, setRenderKey] = useState(0);

  const atomMap = useMemo(() => getAtomMap(atomsRegistry?.atoms || []), [atomsRegistry?.atoms]);

  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );
  }, []);

  useEffect(() => {
    const serializedAtoms = serializeAtoms(atomsRegistry?.atoms ?? []);
    if (!serializedAtoms) {
      sendAtomsErrorEvent('No atoms provided', 'atoms-missing');
      return;
    }

    const serializedCallbacks = serializeCallbacks(atomsRegistry?.callbacks ?? []);

    postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms, serializedCallbacks));

    const unsubDocumentUpdate = addDocumentUpdateHandler((updatedDocument) => {
      setCurrentDocument(updatedDocument);
      setRenderKey((k) => k + 1);
    });

    return () => unsubDocumentUpdate();
  }, [atomsRegistry]);

  useEffect(() => {
    if (renderKey === 0) return;

    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
    );
  }, [renderKey]);

  return (
    <DesignLibraryErrorBoundary uid={currentDocument.name} renderKey={renderKey}>
      <AtomRenderer
        atomMap={atomMap}
        callbackMap={atomsRegistry?.callbacks || []}
        document={currentDocument}
      />
    </DesignLibraryErrorBoundary>
  );
};
