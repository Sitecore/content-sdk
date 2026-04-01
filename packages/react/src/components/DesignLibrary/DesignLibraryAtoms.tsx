'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms, getAtomRegistry } from '../../atoms/atom-registry-utils';
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
  const didReceiveDocumentUpdate = useRef(false);

  const serializedAtoms = useMemo(() => serializeAtoms(atoms ?? []), [atoms]);
  const atomMap = useMemo(() => getAtomRegistry(atoms || []), [atoms]);

  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );
  }, []);

  useEffect(() => {
    if (!serializedAtoms) {
      sendAtomsErrorEvent('No atoms provided', 'atoms-missing');
      return;
    }

    postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms));

    const unsubDocumentUpdate = addDocumentUpdateHandler((updatedDocument) => {
      didReceiveDocumentUpdate.current = true;
      setCurrentDocument(updatedDocument);
    });

    return () => unsubDocumentUpdate();
  }, [serializedAtoms]);

  useEffect(() => {
    if (!didReceiveDocumentUpdate.current) return;

    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
    );
  }, [currentDocument]);

  return (
    <AtomRenderer atomMap={atomMap} callbackMap={callbackRegistry} document={currentDocument} />
  );
};
