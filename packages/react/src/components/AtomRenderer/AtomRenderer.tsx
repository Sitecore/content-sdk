'use client';
import React, { useEffect, useMemo } from 'react';
import { AtomMetadata } from '../../atoms';
import { Document } from '@sitecore-content-sdk/content/types/editing/component-layout';
import { createView } from '../..';
import { getAtomRegistry } from '../../component-layout/getAtomRegistry';

export type AtomRendererProps = {
  atoms?: AtomMetadata[];
  document?: Document;
};

export const AtomRenderer = ({ atoms, document }: AtomRendererProps) => {
  console.log('AtomRenderer, document:', document?.name);

  const View = useMemo(() => {
    if (!document) return null;

    const atomsRegistry = getAtomRegistry(atoms ?? []);

    return createView(document, atomsRegistry, {
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

  return <>{View ? <View {...(document ?? {})} /> : 'No document provided'}</>;
};
