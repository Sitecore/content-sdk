'use client';
import React, { ComponentType, useEffect, useMemo } from 'react';
import { Document } from '@sitecore-content-sdk/content/component-layout';
import { createView } from '../../component-layout';
import { CallbackMetadata } from '../../atoms';

export type AtomRendererProps = {
  atomMap?: Record<string, ComponentType<unknown>>;
  document?: Document;
  callbackMap?: CallbackMetadata[];
};

/**
 * AtomRenderer component responsible for rendering a given document using the provided atom implementations and callbacks.
 * It uses the createView function to generate a React component based on the document structure and atom map.
 * @param {AtomRendererProps} props - The props for the AtomRenderer, including the atom map, document to render, and callback map.
 * @param {Record<string, ComponentType<unknown>>} props.atomMap - A mapping of atom type names to their React component implementations.
 * @param {Document} props.document - The document representing the component layout to render.
 * @param {CallbackMetadata[]} [props.callbackMap] - An optional array of callback metadata for event handling.
 * @returns {JSX.Element} The rendered component based on the provided document and atom map.
 * @internal
 */
export const AtomRenderer = ({ atomMap, document, callbackMap }: AtomRendererProps) => {
  console.log('AtomRenderer, document:', document?.name);

  const View = useMemo(() => {
    if (!document) return null;

    if (!atomMap) {
      console.warn('AtomRenderer: No atom map provided');
      return null;
    }

    return createView(document, atomMap, callbackMap);
  }, [document, atomMap, callbackMap]);

  useEffect(() => {
    console.log('AtomRenderer, available atoms:', atomMap);
    console.log('AtomRenderer, document:', document);
  }, [atomMap, document]);

  return <>{View ? <View {...(document?.props ?? {})} /> : 'No document provided'}</>;
};
