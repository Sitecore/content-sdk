import { constants } from '@sitecore-content-sdk/core';
import { DesignLibraryEvent, validateEvent } from '../design-library';
import type { Document } from '../../atoms/component-layout/document';

const { ERROR_MESSAGES } = constants;

/**
 * Event name for component preview updates from design library
 */
const DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME = 'component:atoms:preview';

/**
 * Event to send import map to design library
 */
const DESIGN_LIBRARY_ATOM_REGISTRY_EVENT_NAME = 'atom:registry';

/**
 * Event to send to design library when rendering atoms error occurs
 */
const DESIGN_LIBRARY_ATOMS_ERROR_EVENT_NAME = 'atoms:error';

/**
 * Enumeration of error types for the design library atoms.
 * @internal
 */
export type DesignLibraryAtomsError = 'render' | 'atoms-missing';

/**
 * Represents a atom rendering error event to be sent to design library
 * @internal
 */
export interface DesignLibraryAtomsErrorEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_ATOMS_ERROR_EVENT_NAME;
  message: {
    error: unknown;
    type: DesignLibraryAtomsError;
  };
}

/**
 * Represents the type of atom, which can be either a top-level atom or an atom child
 * @internal
 */
export type AtomType = 'atom' | 'atom-child';

export type SerializedDefaultChild = string | { atom: string; props?: Record<string, unknown> };

/**
 * Represents the serialized callback metadata information to be sent to design library
 * @internal
 */
export type CallbackInfo = {
  /**
   * A description of the callback.
   */
  description: string;
  /**
   * The parameters of the callback.
   */
  params?: Record<string, unknown>;
};

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
   * The type of the atom.
   */
  type: AtomType;
  /**
   * A description of the atom.
   */
  description: string;
  /**
   * The properties of the atom.
   */
  props: Record<string, unknown>;
  /**
   * The allowed children of the atom, which define the nested structure of the atom.
   */
  allowedChildren: string[];
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
    callbackRegistry: Record<string, CallbackInfo>;
  };
}

/**
 * Creates a DesignLibraryAtomsRegistryEvent with the given atoms registry and callback registry.
 * @param {AtomInfo[]} atomsRegistry - the atoms registry to be sent in the event
 * @param {Record<string, CallbackInfo>} callbackRegistry - the callback registry to be sent in the event
 * @returns {DesignLibraryAtomsRegistryEvent} the created event with the atoms registry and callback registry
 * @internal
 */
export function getDesignLibraryAtomsRegistryEvent(
  atomsRegistry: AtomInfo[],
  callbackRegistry: Record<string, CallbackInfo>
): DesignLibraryAtomsRegistryEvent {
  return {
    name: DESIGN_LIBRARY_ATOM_REGISTRY_EVENT_NAME,
    message: {
      atomsRegistry,
      callbackRegistry,
    },
  };
}

/**
 * Generates a DesignLibraryAtomsErrorEvent depending on the type of error with the given error.
 * @param {unknown} error - The error to be sent.
 * @param {DesignLibraryAtomsError} type - The type of error.
 * @returns An object representing the DesignLibraryAtomsErrorEvent.
 * @internal
 */
export function getDesignLibraryAtomsErrorEvent(
  error: unknown,
  type: DesignLibraryAtomsError
): DesignLibraryAtomsErrorEvent {
  return {
    name: DESIGN_LIBRARY_ATOMS_ERROR_EVENT_NAME,
    message: { error, type },
  };
}

/**
 * Sends a design library atoms error event to the design library
 * @param {unknown} error - The error object or message to be sent.
 * @param {DesignLibraryAtomsError} type - The type of error, as defined in DesignLibraryAtomsError.
 * @internal
 */
export const sendAtomsErrorEvent = (error: unknown, type: DesignLibraryAtomsError) => {
  const errorEvent = getDesignLibraryAtomsErrorEvent(error, type);
  console.error(
    `Component Library: sending error event. ${ERROR_MESSAGES.CONTACT_SUPPORT}`,
    errorEvent
  );
  if (typeof window !== 'undefined') {
    const target = window.parent && window.parent !== window ? window.parent : window;
    target.postMessage(errorEvent, '*');
  }
};

/**
 * Adds a handler for atom document update events from the design library.
 * @param {(updatedRootComponent: Document) => void} callback - The callback to be invoked when a document update event is received.
 * @returns A function to unsubscribe from the atom document update events.
 * @internal
 */
export const addDocumentUpdateHandler = (callback: (updatedRootComponent: Document) => void) => {
  const handler = (e: MessageEvent) => {
    if (!validateEvent(e, DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME)) {
      return;
    }

    console.debug('Component Library atoms: message received', e.data);

    callback(e.data.document as Document);
  };

  window.addEventListener('message', handler);

  const unsubscribe = () => {
    window.removeEventListener('message', handler);
  };

  return unsubscribe;
};
