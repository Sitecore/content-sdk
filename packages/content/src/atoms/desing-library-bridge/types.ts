import { DesignLibraryEvent } from '../../editing/design-library';
import {
  DESIGN_LIBRARY_ATOMS_CATALOG_EVENT_NAME,
  DESIGN_LIBRARY_ATOMS_ERROR_EVENT_NAME,
} from './constants';

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
 * Serialized component entry in the catalog payload sent to Design Studio.
 * @internal
 */
export interface AtomCatalogEntry {
  /** Component name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the component props. */
  propsSchema: object;
  /** Human-readable description. */
  description: string;
  /** Named slots (children). */
  slots: string[];
}

/**
 * Serialized action entry in the catalog payload sent to Design Studio.
 * @internal
 */
export interface ActionCatalogEntry {
  /** Action name (key in the catalog). */
  name: string;
  /** JSON Schema representation of the action params. */
  paramsSchema: object;
  /** Human-readable description. */
  description: string;
}

/**
 * Payload of the atoms:catalog event sent to Design Studio.
 * @internal
 */
export interface AtomsCatalogPayload {
  /** Serialized component entries. */
  components: AtomCatalogEntry[];
  /** Serialized action entries. */
  actions: ActionCatalogEntry[];
}

/**
 * Represents the atoms:catalog event sent to Design Studio.
 * @internal
 */
export interface DesignLibraryAtomsCatalogEvent extends DesignLibraryEvent {
  name: typeof DESIGN_LIBRARY_ATOMS_CATALOG_EVENT_NAME;
  message: Record<string, unknown>;
}

