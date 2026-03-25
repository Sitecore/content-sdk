'use client';
import React, { useEffect } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms } from '../../atoms/atom-registry-utils';
import {
  postToDesignLibrary,
  getDesignLibraryAtomsRegistryEvent,
} from '@sitecore-content-sdk/content/editing';
import { AtomRenderer } from '../AtomRenderer/AtomRenderer';

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
  const { atoms } = useSitecore();

  useEffect(() => {
    if (atoms) {
      const serializedAtoms = serializeAtoms(atoms);
      console.log('Serialized Atoms:', serializedAtoms);

      postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms));
    }

    console.log('Design Library Atoms mounted');
  }, [atoms]);

  return <AtomRenderer atoms={atoms} />;
};
