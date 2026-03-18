'use client';
import React, { useEffect } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { unfoldAtomsRegistry, serializeAtoms } from '../../atoms/atom-registry-utils';
import {
  postToDesignLibrary,
  getDesignLibraryAtomsRegistryEvent,
} from '@sitecore-content-sdk/content/editing';

export const AtomRenderer = () => {
  const { atoms } = useSitecore();

  useEffect(() => {
    if (atoms) {
      const flattenedAtoms = unfoldAtomsRegistry(atoms);
      console.log('Flattened Atoms:', flattenedAtoms);
      const serializedAtoms = serializeAtoms(flattenedAtoms);
      console.log('Serialized Atoms:', serializedAtoms);

      postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms));
    }

    console.log('Low Code Renderer mounted');
  }, [atoms]);

  return <div>Low Code Renderer</div>;
};
