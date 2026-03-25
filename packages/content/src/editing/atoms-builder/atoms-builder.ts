import { DesignLibraryEvent } from '../design-library';

/**
 * Event to send import map to design library
 */
const DESIGN_LIBRARY_ATOM_REGISTRY_EVENT_NAME = 'atom:registry';

/**
 * Represents the type of atom, which can be either a top-level atom or an atom child
 * @internal
 */
export const AtomType = { ATOM: 'atom', ATOM_CHILD: 'atom-child' } as const;

export type SerializedDefaultChild = string | { atom: string; props?: Record<string, unknown> };

/**
 * Represents the serialized atom metadata information to be sent to design library
 * @internal
 */
export type AtomInfo = {
  /**
   * The name of the atom, which should be unique across the registry and is used to identify the atom in the atom registry.
   */
  name: string;
  /**
   * The optional version of the atom.
   */
  version?: number;
  /**
   * The type of the atom, which can be either a top-level 'atom' or an 'atom-child'.
   */
  type: (typeof AtomType)[keyof typeof AtomType];
  /**
   * A description of the atom.
   */
  description: string;
  /**
   * The properties of the atom.
   */
  props: Record<string, unknown>;
  /**
   * The children of the atom, which define the nested structure of the atom.
   */
  children: string[];
  /**
   * The default children of the atom.
   */
  defaultChildren?: SerializedDefaultChild[];
  /**
   * The HTML events of the atom, which define the standard DOM events the atom can handle.
   */
  htmlEvents?: string[];
  /**
   * The custom events of the atom, which define the non-standard events the atom can handle.
   */
  customEvents?: Record<string, unknown>;
};

/**
 * Represents an event indicating the atom registry to be sent to design library
 * @internal
 */
export interface DesignLibraryAtomsRegistryEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_ATOM_REGISTRY_EVENT_NAME;
  message: {
    atomsRegistry: AtomInfo[];
  };
}

/**
 * Creates a DesignLibraryAtomsRegistryEvent with the given atoms registry.
 * @param {AtomInfo[]} atomsRegistry - the atoms registry to be sent in the event
 * @returns {DesignLibraryAtomsRegistryEvent} the created event with the atoms registry
 * @internal
 */
export function getDesignLibraryAtomsRegistryEvent(
  atomsRegistry: AtomInfo[]
): DesignLibraryAtomsRegistryEvent {
  return {
    name: DESIGN_LIBRARY_ATOM_REGISTRY_EVENT_NAME,
    message: {
      atomsRegistry,
    },
  };
}
