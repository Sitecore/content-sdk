/**
 * Builds an atom registry (type name -> component) from AtomMetadata array.
 * Walks allowedChildren so nested atom-children are included.
 * @packageDocumentation
 */

import type { ComponentType } from 'react';
import type { AtomMetadata } from '../atoms';

/**
 * Returns a map of atom type name to React component for use with createView.
 *
 * @param metadata - Array of atom metadata (e.g. from createAtom)
 * @returns Record of atom name to component
 */
export function getAtomRegistry(
  metadata: AtomMetadata[]
): Record<string, ComponentType<unknown>> {
  const registry: Record<string, ComponentType<unknown>> = {};

  function addAtom(atom: AtomMetadata): void {
    if (registry[atom.name]) {
      return;
    }
    registry[atom.name] = atom.component as ComponentType<unknown>;
    for (const child of atom.allowedChildren ?? []) {
      if (child !== 'atom' && child !== 'text' && typeof child === 'object') {
        addAtom(child);
      }
    }
  }

  for (const atom of metadata) {
    addAtom(atom);
  }

  return registry;
}
