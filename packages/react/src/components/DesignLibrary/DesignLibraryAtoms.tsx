'use client';
import React, { useEffect, useState } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms } from '../../atoms/atom-registry-utils';
import {
  postToDesignLibrary,
  getDesignLibraryAtomsRegistryEvent,
  getDesignLibraryStatusEvent,
  DesignLibraryStatus,
  sendAtomsErrorEvent,
  addDocumentUpdateHandler,
} from '@sitecore-content-sdk/content/editing';
import { AtomRenderer } from '../AtomRenderer/AtomRenderer';
import { cardsWithDataBinding } from '../AtomRenderer/test-data/component-layouts';

/**
 * Design Library Atoms component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when in atom rendering mode.
 * - On mount, it unfolds and serializes the atoms registry and sends it to the Design Studio via the `getDesignLibraryAtomsRegistryEvent`.
 * - Fetches Component model data, and passes it to the `AtomRenderer` which is responsible for rendering the low code component
 * based on component model data and the available atoms.
 * @internal
 */
export const DesignLibraryAtoms = () => {
  const { atoms, callbackRegistry } = useSitecore();
  const [currentDocument, setCurrentDocument] = useState(cardsWithDataBinding);
  const [renderKey, setRenderKey] = useState(0);

  const serializedAtoms = serializeAtoms(atoms ?? []);

  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );

    if (!serializedAtoms) {
      sendAtomsErrorEvent('No atoms provided', 'atoms-missing');
      return;
    } else {
      postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms));

      const unsubDocumentUpdate = addDocumentUpdateHandler((updatedDocument) => {
        setCurrentDocument(updatedDocument);
        setRenderKey((k) => k + 1);
      });

      return () => unsubDocumentUpdate();
    }
  }, [serializedAtoms]);

  useEffect(() => {
    // Send a rendered event only as effect of a document update
    if (renderKey === 0) return;

    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
    );
  }, [renderKey]);

  return (
    <AtomRenderer
      atoms={atoms}
      callbackRegistry={callbackRegistry ?? {}}
      document={currentDocument}
    />
  );
};
