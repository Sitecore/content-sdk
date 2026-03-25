import { z } from 'zod';
import { AtomMetadata } from './types';
import { AtomInfo } from '@sitecore-content-sdk/content/editing';

const isAtomMetadata = (value: unknown): value is AtomMetadata => {
  return typeof value !== 'string';
};

/**
 * Unfolds the atoms registry by recursively including all child atoms.
 * @param {AtomMetadata[]} atoms - the atoms array to unfold; should contain only top-level atoms (i.e., those with type 'atom')
 * @returns {AtomMetadata[]} the unfolded atoms registry that includes all allowed child atoms
 * @internal
 */
export const unfoldAtomsRegistry = (atoms: AtomMetadata[]): AtomMetadata[] => {
  const unfoldedRegistry: AtomMetadata[] = [];
  const visited = new Set<string>();

  const visit = (atom: AtomMetadata): void => {
    if (visited.has(atom.name)) {
      return;
    }

    visited.add(atom.name);
    unfoldedRegistry.push(atom);

    (atom.allowedChildren ?? []).filter(isAtomMetadata).forEach(visit);
  };

  atoms.forEach(visit);

  return unfoldedRegistry;
};

/**
 * Serializes the provided atoms metadata array into a format suitable for broadcasting via postMessage to the host application
 * @param {AtomMetadata[]} atoms - the atoms to be serialized
 * @returns {AtomInfo[]} the serialized atoms
 * @internal
 */
export const serializeAtoms = (atoms: AtomMetadata[]): AtomInfo[] => {
  const atomInfos: AtomInfo[] = [];
  const visited = new Set<string>();

  const visit = (atom: AtomMetadata): void => {
    if (visited.has(atom.name)) return;

    visited.add(atom.name);

    // process allowed children
    const allowedChildren: string[] = [];
    for (const child of atom.allowedChildren ?? []) {
      if (isAtomMetadata(child)) {
        allowedChildren.push(child.name);
      } else {
        allowedChildren.push(child);
      }
    }

    // process default children
    const defaultChildren = atom.defaultChildren?.map((child) =>
      'name' in child ? child.name : { atom: child.atom.name, props: child.props }
    );

    // process custom events
    let customEvents: Record<string, unknown> | undefined = undefined;
    if (atom.customEvents && Object.keys(atom.customEvents).length > 0) {
      const eventsShape: Record<string, z.ZodTuple> = {};
      for (const [name, args] of Object.entries(atom.customEvents)) {
        eventsShape[name] = z.tuple(args as [z.ZodType, ...z.ZodType[]]);
      }
      customEvents = z.toJSONSchema(z.object(eventsShape), { target: 'draft-7' });
    }

    atomInfos.push({
      name: atom.name,
      version: atom.version,
      type: atom.type,
      description: atom.description,
      props: z.toJSONSchema(atom.props, { target: 'draft-7' }),
      allowedChildren,
      defaultChildren,
      htmlEvents: atom.htmlEvents,
      customEvents,
    });

    for (const ch of atom.allowedChildren ?? []) {
      if (typeof ch === 'object') visit(ch);
    }
  };

  atoms.forEach(visit);

  return atomInfos;
};
