import { constants } from '@sitecore-content-sdk/core';
import { validateEvent } from '../../editing/design-library';
import { Document, SerializedCatalog } from '../types';
import {
  DESIGN_LIBRARY_ATOMS_CATALOG_EVENT_NAME,
  DESIGN_LIBRARY_ATOMS_ERROR_EVENT_NAME,
  DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME,
} from './constants';
import {
  DesignLibraryAtomsCatalogEvent,
  DesignLibraryAtomsError,
  DesignLibraryAtomsErrorEvent,
} from './types';

const { ERROR_MESSAGES } = constants;

/**
 * Creates a DesignLibraryAtomsCatalogEvent with the given catalog payload.
 * @param {AtomsCatalogPayload} payload - serialized catalog data
 * @returns {DesignLibraryAtomsCatalogEvent} the event ready to be posted to Design Studio
 * @internal
 */
export function getDesignLibraryAtomsCatalogEvent(
  payload: SerializedCatalog
): DesignLibraryAtomsCatalogEvent {
  return {
    name: DESIGN_LIBRARY_ATOMS_CATALOG_EVENT_NAME,
    message: payload as unknown as Record<string, unknown>,
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

