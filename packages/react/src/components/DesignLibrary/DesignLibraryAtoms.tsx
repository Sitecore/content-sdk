'use client';
import React, { useEffect } from 'react';
import { useSitecore } from '../SitecoreProvider';
import { serializeAtoms } from '../../atoms/atom-registry-utils';
import { serializeCallbacks } from '../../atoms/callback-registry-utils';
import {
  postToDesignLibrary,
  getDesignLibraryAtomsRegistryEvent,
  AtomInfo,
  CallbackInfo,
} from '@sitecore-content-sdk/content/editing';
import { AtomRenderer } from '../AtomRenderer/AtomRenderer';

/**
 * Design Library Atoms component.
 *
 * Facilitates the communication between the Design Studio and the Rendering Host when in atom rendering mode.
 * - On mount, it unfolds and serializes the atoms registry and callback registry and sends it to the Design Studio via the `getDesignLibraryAtomsRegistryEvent`.
 * - Fetches Component model data, and passes it to the `AtomRenderer` which is responsible for rendering the low code component
 * based on component model data and the available atoms.
 * @internal
 */
export const DesignLibraryAtoms = () => {
  const { atoms, callbacks } = useSitecore();

  useEffect(() => {
    let serializedAtoms: AtomInfo[] = [];
    let serializedCallbacks: Record<string, CallbackInfo> = {};

    if (atoms) {
      serializedAtoms = serializeAtoms(atoms);
      console.log('Serialized Atoms:', serializedAtoms);
    }

    if (callbacks) {
      serializedCallbacks = serializeCallbacks(callbacks);
      console.log('Serialized Callbacks:', serializedCallbacks);
    }

    postToDesignLibrary(getDesignLibraryAtomsRegistryEvent(serializedAtoms, serializedCallbacks));

    console.log('Design Library Atoms mounted');
    console.log('Design Library Callbacks mounted');
  }, [atoms, callbacks]);

  return <AtomRenderer atoms={atoms} callbacks={callbacks} />;
};
