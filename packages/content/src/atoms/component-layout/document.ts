/**
 * Component Layout document types — aligned with json-render flat spec format.
 * Contract between Design Studio / MMS and the rendering host.
 */

/* ── Actions ── */

/**
 * Action that patches local document state.
 */
interface SetStateAction {
  setState: Record<string, unknown>;
}

/**
 * Action that dispatches a named action from the catalog.
 */
interface CallAction {
  action: string;
  params?: Record<string, unknown>;
}

/**
 * Union of actions triggered by element events.
 */
type Action = SetStateAction | CallAction;

/* ── Element event ── */

/**
 * Event binding on an element: maps an event name to a list of actions.
 */
interface ElementEvent {
  actions: Action[];
}

/* ── Repeat (for-loop) ── */

/**
 * Repeat configuration: iterate over a state/prop array.
 */
interface RepeatConfig {
  /** Expression resolving to an array (e.g. "$state.items" or "$props.rows"). */
  each: string;
  /** Variable name for the current item inside the loop scope. */
  as: string;
  /** Optional expression for a stable React key per iteration. */
  key?: string;
}

/* ── Element ── */

/**
 * A single element in the flat element map. References child elements by key.
 * Props may contain json-render binding expressions ($state, $bindState, $item, $bindItem, templates).
 */
interface Element {
  /** Component type name (must match a key in the catalog/registry). */
  type: string;
  /** Props passed to the component. May contain binding expressions resolved by the renderer. */
  props?: Record<string, unknown>;
  /** Ordered list of child element keys. */
  children?: string[];
  /** Event handlers keyed by event name. */
  events?: Record<string, ElementEvent>;
  /** Visibility condition evaluated by the renderer. When falsy the element is not rendered. */
  show?: unknown;
  /** Repeat/loop configuration. */
  repeat?: RepeatConfig;
}

/* ── Document (json-render spec) ── */

/**
 * Component Layout document aligned with json-render spec format.
 * Uses a flat element map addressed by string keys.
 * @internal
 */
export interface Document {
  /** Human-readable identifier of the document. */
  name: string;
  /** Key of the root element in the elements map. */
  root: string;
  /** Flat map of element keys to element definitions. */
  elements: Record<string, Element>;
  /** Initial state for the document. Targeted by $state bindings and setState actions. */
  state?: Record<string, unknown>;
  /** Static props payload accessible via $props bindings. */
  props?: Record<string, unknown>;
}
