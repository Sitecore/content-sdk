'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeCatalog } from '../../atoms';
import { extractDocumentClasses } from '../../atoms/extract-document-classes';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import * as editing from '@sitecore-content-sdk/content/editing';
import * as atoms from '@sitecore-content-sdk/content/atoms';
import { DesignLibraryErrorBoundary } from '../..';
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
 * Design Library Low Code component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when previewing a low code component built with the Atoms.
 * - On mount, it serializes the atoms catalog and sends it to the Design Studio via the `atoms:catalog` event.
 * - Receives Component model data updates via document update handler and renders the low code component
 * via `StudioComponentWrapper` (same client path as Studio / NCC preview elsewhere).
 * - When `atomsConfig.compileCssAction` is provided, compiles Document class names and injects CSS so
 * utilities that exist only in MMS Document JSON are styled during editing.
 * @internal
 */
export const DesignLibraryLowCodeComponent = () => {
  const { atomsConfig } = useSitecore();
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [renderKey, setRenderKey] = useState(0);
  const [fields, setFields] = useState<ChildComponentProps['fields'] | undefined>();
  const [params, setParams] = useState<ChildComponentProps['params'] | undefined>();
  const [documentCss, setDocumentCss] = useState('');
  const cssRequestIdRef = useRef(0);

  useEffect(() => {
    postToDesignLibrary(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );
  }, []);

  useEffect(() => {
    const unsubscribe = addComponentPropsUpdateHandler((updatedFields, updatedParams) => {
      setFields(updatedFields as ChildComponentProps['fields']);
      setParams(updatedParams);
    });
    return () => unsubscribe();
  }, []);

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

      if (!atomsConfig.compileCssAction) {
        return;
      }

      const classes = extractDocumentClasses(updatedDocument);
      if (!classes.length) {
        setDocumentCss('');
        return;
      }

      const requestId = ++cssRequestIdRef.current;
      atomsConfig
        .compileCssAction(classes)
        .then((css) => {
          // Ignore stale responses when Document updates arrive faster than compiles finish.
          if (requestId === cssRequestIdRef.current) {
            setDocumentCss(css);
          }
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[Sitecore] compileCssAction failed:', err);
          }
        });
    });

    return () => unsubDocumentUpdate();
  }, [atomsConfig]);

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
      {documentCss ? <style dangerouslySetInnerHTML={{ __html: documentCss }} /> : null}
      <StudioComponentWrapper document={currentDocument} fields={fields} params={params} />
    </DesignLibraryErrorBoundary>
  );
};
