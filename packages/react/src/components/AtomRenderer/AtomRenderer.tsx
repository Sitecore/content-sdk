'use client';
import React, { ComponentType, useEffect, useMemo } from 'react';
import { Document } from '@sitecore-content-sdk/content/component-layout';
import { createView } from '../..';

export type AtomRendererProps = {
  atomMap?: Record<string, ComponentType<unknown>>;
  document?: Document;
  callbackMap?: Record<string, (...args: unknown[]) => void>;
};

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
