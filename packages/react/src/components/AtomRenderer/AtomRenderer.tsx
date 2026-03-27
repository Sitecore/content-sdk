'use client';
import React, { useEffect, useMemo } from 'react';
import { AtomMetadata } from '../../atoms';
import { Document } from '@sitecore-content-sdk/content/component-layout';
import { createView } from '../..';
import { getAtomRegistry } from '../../atoms/atom-registry-utils';

export type AtomRendererProps = {
  atoms?: AtomMetadata[];
  document?: Document;
  callbackRegistry?: Record<string, (...args: unknown[]) => void>;
};

export const AtomRenderer = ({ atoms, document }: AtomRendererProps) => {
  console.log('AtomRenderer, document:', document?.name);

  const View = useMemo(() => {
    if (!document) return null;

    const atomRegistry = getAtomRegistry(atoms || []);

    return createView(document, atomRegistry, {
      alert: (...args: unknown[]) => {
        const [message] = args;
        alert(message);
      },
    });
  }, [document, atoms]);

  useEffect(() => {
    console.log('AtomRenderer, available atoms:', atoms);
    console.log('AtomRenderer, document:', document);
  }, [atoms, document]);

  return <>{View ? <View {...(document?.data ?? {})} /> : 'No document provided'}</>;
};
