'use client';
import React, { useEffect, useState } from 'react';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { useSitecore } from '../SitecoreProvider';
import { serializeCatalog } from '../../atoms';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import * as editing from '@sitecore-content-sdk/content/editing';
import * as atoms from '@sitecore-content-sdk/content/atoms';
import { DesignLibraryErrorBoundary, PlaceholderMetadata } from '../..';
import type { ChildComponentProps } from '../Placeholder/models';

let { postToDesignLibrary, getDesignLibraryStatusEvent, DesignLibraryStatus } = editing;
let {
  addDocumentUpdateHandler,
  getDesignLibraryAtomsCatalogEvent,
  sendAtomsErrorEvent,
  addComponentPropsUpdateHandler,
} = atoms;

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
  if (mocks.addComponentPropsUpdateHandler) {
    addComponentPropsUpdateHandler = mocks.addComponentPropsUpdateHandler;
  }
};

/**
 * Props for {@link DesignLibraryLowCodeComponent}.
 * @internal
 */
export type DesignLibraryLowCodeComponentProps = {
  /**
   * Sitecore rendering from the Design Library editing placeholder.
   * UID must match READY/RENDERED status events and chrome metadata (same contract as DesignLibrary).
   */
  rendering?: ComponentRendering;
};

/**
 * Design Library Low Code component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
 * - On mount, it serializes the atoms catalog and sends it to the Design Studio via the `atoms:catalog` event.
 * - Receives Component model data updates via document update handler and renders the low code component
 * via `StudioComponentWrapper` (same client path as Studio / NCC preview elsewhere).
 * - Wraps preview output with `PlaceholderMetadata` using the layout rendering UID so Design Studio
 * receives the same chrome handshake as normal Design Library components.
 * @param {DesignLibraryLowCodeComponentProps} props - Component props.
 * @returns {JSX.Element} The low-code preview surface.
 * @internal
 */
export const DesignLibraryLowCodeComponent = ({ rendering }: DesignLibraryLowCodeComponentProps) => {
  const { atomsConfig } = useSitecore();
  const uid = rendering?.uid;
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const uid = currentDocument?.name || 'design-library-low-code-component'
  const [renderKey, setRenderKey] = useState(0);
  const [fields, setFields] = useState<ChildComponentProps['fields'] | undefined>();
  const [params, setParams] = useState<ChildComponentProps['params'] | undefined>();

  if (!uid) {
    return <ErrorComponent message="Rendering UID is missing in the rendering data" />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, uid)
    );
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const unsubscribe = addComponentPropsUpdateHandler((updatedFields, updatedParams) => {
      setFields(updatedFields as ChildComponentProps['fields']);
      setParams(updatedParams);
    });
    return () => unsubscribe();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!atomsConfig?.catalog) {
      sendAtomsErrorEvent('No atoms catalog provided', 'atoms-missing');
      return;
    }

    const payload = serializeCatalog(atomsConfig.catalog);
    postToDesignLibrary(getDesignLibraryAtomsCatalogEvent(payload));

    const unsubDocumentUpdate = addDocumentUpdateHandler((updatedDocument) => {
      setCurrentDocument(updatedDocument);
      setRenderKey((k) => k + 1);
    });

    return () => unsubDocumentUpdate();
  }, [atomsConfig]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (renderKey === 0) return;

    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, uid)
    );
  }, [renderKey]);

  return (
    <DesignLibraryErrorBoundary
      uid={uid}
      renderKey={renderKey}
    >
        <PlaceholderMetadata rendering={
      {
        uid: uid,
        componentName: uid,
      }} componentRuntime="client">
        <StudioComponentWrapper document={currentDocument} fields={fields} params={params} />
      </PlaceholderMetadata>
    </DesignLibraryErrorBoundary>
  );
};
