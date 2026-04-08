/**
 * Component Layout document types — contract between Design Studio / XM and the rendering host.
 * Aligned with the Component Layout technical specification (Document, Node, Element, bindings, for, show).
 */

/* Primitive values */

/**
 * Primitive value in the layout tree.
 * @internal
 */
export type Primitive = string | number | boolean | null;

/* Bindings */

/**
 * Expression binding: {{ }} template string resolved at runtime.
 * @internal
 */
export interface ExpressionBinding {
  bindType: 'expression';
  value: string;
}

/**
 * Action executed when an event fires (setState or call callback).
 * @internal
 */
export interface SetStateAction {
  setState: Record<string, Primitive>;
}

/**
 * Action to call a named callback with arguments.
 * @internal
 */
export interface CallAction {
  /** Registered callback name (must match an entry in the callback registry). */
  call: string;
  /** Arguments passed to the callback; each value may be a literal or resolved from templates. */
  args?: Primitive[];
}

/**
 * Action inside an event binding.
 * @internal
 */
export type Action = SetStateAction | CallAction;

/**
 * Event binding: handler that runs a list of actions (setState / call).
 * @internal
 */
export interface EventBinding {
  bindType: 'event';
  arguments: string[];
  actions: Action[];
}

/**
 * Property binding: either an expression or an event handler.
 * @internal
 */
export type Binding = ExpressionBinding | EventBinding;

/* For loop */

/**
 * For-loop: iterate over an array; `as` is the loop variable name in expressions.
 * @internal
 */
export interface ForLoop {
  each: string;
  as: string;
  key?: string;
}

/* Conditional visibility (show) — tree-based */

/**
 * Show condition: comparison (left op right).
 * @internal
 */
export interface ShowComparison {
  left: string;
  op: 'eq' | 'ne';
  right: string;
}

/**
 * Show condition: logical and.
 * @internal
 */
export interface ShowAnd {
  and: ShowNode[];
}

/**
 * Show condition: logical or.
 * @internal
 */
export interface ShowOr {
  or: ShowNode[];
}

/**
 * Show condition node (comparison or and/or tree).
 * @internal
 */
export type ShowNode = ShowComparison | ShowAnd | ShowOr;

/* Nodes */

/**
 * Element node: atom type, optional id, props, bindings, children, for, show, layout.
 * @internal
 */
export interface Element {
  /** Atom name matching a key in the Atom Registry */
  type: string;
  /** Unique identifier. Hydrated by the editor on load. Used for design-time selection and highlight metadata */
  id?: string;
  /** Version number of the element. */
  version?: number;
  /** Map of prop name to static Primitive value. Passed directly to the component unchanged. */
  staticProps?: Record<string, Primitive>;
  /** Map of prop name to {@link Binding}. */
  bindings?: Record<string, Binding>;
  /** Child nodes of the element. */
  children?: Node[];
  /** For-loop configuration for the element. */
  for?: ForLoop;
  /** Show condition for the element. */
  show?: ShowNode;
}

/**
 * Node in the layout tree: either an Element or a primitive.
 * @internal
 */
export type Node = Element | Primitive;

/* Document root */

/**
 * Component Layout document: name, optional initial state, root node, optional runtime props.
 * @internal
 */
export interface Document {
  /** Human-readable identifier of the document */
  name: string;
  /** Initial state for the document. Keys become targets for state.* bindings and setState actions. */
  state?: Record<string, unknown>;
  /** Root node of the component tree. */
  root: Node;
  /** Static props payload spread into the runtime props object passed to the generated component. Fields are accessible via props.* bindings. */
  props?: unknown;
}

/* Type guards */

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

const has = <T extends object>(o: T, k: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(o, k);

/**
 * Type guard: node is an Element.
 * @param {Node} node - The node to check
 * @returns {boolean} True if the node is an Element, false otherwise
 * @internal
 */
export function isElement(node: Node): node is Element {
  return isObj(node) && has(node, 'type');
}

/**
 * Type guard: element has a for-loop.
 * @param {Element} node - The element to check
 * @returns {boolean} True if the element has a for-loop, false otherwise
 * @internal
 */
export function hasFor(node: Element): node is Element & { for: ForLoop } {
  return node.for !== null && node.for !== undefined && typeof node.for.each === 'string';
}

/**
 * Type guard: element has a show condition.
 * @param {Element} node - The element to check
 * @returns {boolean} True if the element has a show condition, false otherwise
 * @internal
 */
export function hasShow(node: Element): node is Element & { show: ShowNode } {
  return node.show !== null && node.show !== undefined;
}

/**
 * Type guard: binding is an expression binding.
 * @param {Binding} binding - The binding to check
 * @returns {boolean} True if the binding is an expression binding, false otherwise
 * @internal
 */
export function isExpressionBinding(binding: Binding): binding is ExpressionBinding {
  return isObj(binding) && (binding as ExpressionBinding).bindType === 'expression';
}

/**
 * Type guard: binding is an event binding.
 * @param {Binding} binding - The binding to check
 * @returns {boolean} True if the binding is an event binding, false otherwise
 * @internal
 */
export function isEventBinding(binding: Binding): binding is EventBinding {
  return isObj(binding) && (binding as EventBinding).bindType === 'event';
}

/**
 * Type guard: action is setState.
 * @param {Action} action - The action to check
 * @returns {boolean} True if the action is setState, false otherwise
 * @internal
 */
export function isSetStateAction(action: Action): action is SetStateAction {
  return isObj(action) && has(action, 'setState');
}

/**
 * Type guard: action is call.
 * @param {Action} action - The action to check
 * @returns {boolean} True if the action is call, false otherwise
 * @internal
 */
export function isCallAction(action: Action): action is CallAction {
  return isObj(action) && has(action, 'call');
}

/**
 * Type guard: value is a primitive.
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is a primitive, false otherwise
 * @internal
 */
export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/**
 * Type guard: show node is a comparison.
 * @param {ShowNode} node - The node to check
 * @returns {boolean} True if the node is a comparison, false otherwise
 * @internal
 */
export function isShowComparison(node: ShowNode): node is ShowComparison {
  return isObj(node) && has(node, 'left') && has(node, 'op') && has(node, 'right');
}

/**
 * Type guard: show node is and.
 * @param {ShowNode} node - The node to check
 * @returns {boolean} True if the node is an and, false otherwise
 * @internal
 */
export function isShowAnd(node: ShowNode): node is ShowAnd {
  return isObj(node) && has(node, 'and') && Array.isArray((node as ShowAnd).and);
}

/**
 * Type guard: show node is or.
 * @param {ShowNode} node - The node to check
 * @returns {boolean} True if the node is an or, false otherwise
 * @internal
 */
export function isShowOr(node: ShowNode): node is ShowOr {
  return isObj(node) && has(node, 'or') && Array.isArray((node as ShowOr).or);
}
