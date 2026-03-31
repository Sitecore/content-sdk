/* eslint-disable eqeqeq, jsdoc/check-tag-names, jsdoc/require-param -- != null guards; TypeDoc @packageDocumentation; one-line type-guard JSDoc */

/**
 * Component Layout document types — contract between Design Studio / XM and the rendering host.
 * Aligned with the Component Layout technical specification (Document, Node, Element, bindings, for, show).
 * @packageDocumentation
 */

/* Primitive values */

/** Primitive value in the layout tree. */
export type Primitive = string | number | boolean | null;

/* Bindings */

/** Expression binding: {{ }} template string resolved at runtime. */
export interface ExpressionBinding {
  bindType: 'expression';
  value: string;
}

/** Action executed when an event fires (setState or call callback). */
export interface SetStateAction {
  setState: Record<string, Primitive>;
}

/** Action that invokes a named callback. */
export interface CallAction {
  call: string;
  args?: Primitive[];
}

/** Action inside an event binding. */
export type Action = SetStateAction | CallAction;

/** Event binding: handler that runs a list of actions (setState / call). */
export interface EventBinding {
  bindType: 'event';
  arguments: string[];
  actions: Action[];
}

/** Property binding: either an expression or an event handler. */
export type Binding = ExpressionBinding | EventBinding;

/* For loop */

/** For-loop: iterate over an array; `as` is the loop variable name in expressions. */
export interface ForLoop {
  each: string;
  as: string;
  key?: string;
}

/* Conditional visibility (show) — tree-based */

/** Show condition: comparison (left op right). */
export interface ShowComparison {
  left: string;
  op: 'eq' | 'ne';
  right: string;
}

/** Show condition: logical and. */
export interface ShowAnd {
  and: ShowNode[];
}

/** Show condition: logical or. */
export interface ShowOr {
  or: ShowNode[];
}

/** Show condition node (comparison or and/or tree). */
export type ShowNode = ShowComparison | ShowAnd | ShowOr;

/* Nodes */

/** Element node: atom type, optional id, props, bindings, children, for, show, layout. */
export interface Element {
  type: string;
  id?: string;
  version?: number;
  staticProps?: Record<string, Primitive>;
  bindings?: Record<string, Binding>;
  children?: Node[];
  for?: ForLoop;
  show?: ShowNode;
}

/** Node in the layout tree: either an Element or a primitive. */
export type Node = Element | Primitive;

/* Document root */

/** Component Layout document: name, optional initial state, root node, optional runtime props. */
export interface Document {
  name: string;
  state?: Record<string, unknown>;
  root: Node;
  /** Optional runtime props passed to the view (e.g. from layout service). */
  data?: unknown;
}

/* Type guards */

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null;

const has = <T extends object>(o: T, k: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(o, k);

/** Type guard: node is an Element. */
export function isElement(node: Node): node is Element {
  return isObj(node) && has(node, 'type');
}

/** Type guard: element has a for-loop. */
export function hasFor(node: Element): node is Element & { for: ForLoop } {
  return node.for != null && typeof node.for.each === 'string';
}

/** Type guard: element has a show condition. */
export function hasShow(node: Element): node is Element & { show: ShowNode } {
  return node.show != null;
}

/** Type guard: binding is an expression binding. */
export function isExpressionBinding(binding: Binding): binding is ExpressionBinding {
  return isObj(binding) && (binding as ExpressionBinding).bindType === 'expression';
}

/** Type guard: binding is an event binding. */
export function isEventBinding(binding: Binding): binding is EventBinding {
  return isObj(binding) && (binding as EventBinding).bindType === 'event';
}

/** Type guard: action is setState. */
export function isSetStateAction(action: Action): action is SetStateAction {
  return isObj(action) && has(action, 'setState');
}

/** Type guard: action is call. */
export function isCallAction(action: Action): action is CallAction {
  return isObj(action) && has(action, 'call');
}

/** Type guard: value is a primitive. */
export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/** Type guard: show node is a comparison. */
export function isShowComparison(node: ShowNode): node is ShowComparison {
  return isObj(node) && has(node, 'left') && has(node, 'op') && has(node, 'right');
}

/** Type guard: show node is and. */
export function isShowAnd(node: ShowNode): node is ShowAnd {
  return isObj(node) && has(node, 'and') && Array.isArray((node as ShowAnd).and);
}

/** Type guard: show node is or. */
export function isShowOr(node: ShowNode): node is ShowOr {
  return isObj(node) && has(node, 'or') && Array.isArray((node as ShowOr).or);
}
