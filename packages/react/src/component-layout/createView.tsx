'use client';
/**
 * createView: renders a Component Layout document as a React tree.
 * Uses document types and resolver from @sitecore-content-sdk/content/editing.
 */

import React, { type FC, type Key, useReducer, useRef } from 'react';
import {
  type ComponentLayoutDocument as Document,
  type ComponentLayoutNode as Node,
  type ComponentLayoutElement as Element,
  type ComponentLayoutEventBinding as EventBinding,
  type ComponentLayoutResolveContext as ResolveContext,
  isComponentLayoutElement as isElement,
  hasComponentLayoutFor as hasFor,
  hasComponentLayoutShow as hasShow,
  isComponentLayoutExpressionBinding as isExpressionBinding,
  isComponentLayoutEventBinding as isEventBinding,
  isComponentLayoutSetStateAction as isSetStateAction,
  isComponentLayoutCallAction as isCallAction,
  resolveComponentLayoutTemplateString as resolveTemplateString,
  evaluateComponentLayoutShowNode as evaluateShowNode,
  isComponentLayoutPrimitive as isPrimitive,
  resolveIfTemplate,
} from '@sitecore-content-sdk/content/editing';
import { CallbackMetadata } from '../atoms';

/** Props passed to an Atom Component */
type AtomProps = React.PropsWithChildren<ResolvedProps>;

/** The Atom Component */
type AtomComponent = React.ComponentType<AtomProps>;

/** Internal state shape used by generated view components. */
type ViewState = Record<string, unknown>;

/** Patch shape for reducer updates. */
type StatePatch = Partial<ViewState>;

/** Scope values available to template resolution (e.g. for-loop alias). */
type ScopeMap = Record<string, unknown>;

/** Props passed to rendered atoms after bindings/template resolution. */
type ResolvedProps = Record<string, unknown> & {
  'data-atom-id'?: string;
  'data-atom-label'?: string;
};

/**
 * Renders nodes in a for-loop, iterating over an array with optional key resolution.
 * @param {Element} node - The element node with a `for` binding
 * @param {ResolveContext} forCtx - Resolve context for the loop
 * @param {(tmpl: Element, key: Key, item: unknown, itemScope: ScopeMap) => React.ReactNode} renderNode - Render function
 * @returns {React.ReactNode} Array of rendered nodes or null if array resolution fails
 * @internal
 */
export const renderFor = (
  node: Element,
  forCtx: ResolveContext,
  renderNode: (tmpl: Node, key: Key, item: unknown, itemScope: ScopeMap) => React.ReactNode
): React.ReactNode => {
  const forArr = resolveTemplateString(node.for?.each ?? '', forCtx);
  if (!Array.isArray(forArr)) {
    return null;
  }

  return forArr.map((item: unknown, index: number) => {
    const tmpl: Element = { ...node, for: undefined };
    const itemScope: ScopeMap = { [node.for!.as]: item };
    const itemKey = node.for?.key
      ? resolveTemplateString(node.for.key, {
          ...forCtx,
          item: item,
          scope: itemScope,
        })
      : index;

    return renderNode(tmpl, itemKey as Key, item, itemScope);
  });
};

/**
 * Renders a primitive or template-string node.
 * Returns null for unrecognised node types.
 * @param {Node} node - A non-element node (string, number, boolean, null)
 * @param {ResolveContext} ctx - Resolve context for template string resolution
 * @returns {React.ReactNode} Resolved node or null
 */
export const renderPrimitiveNode = (node: Node, ctx: ResolveContext): React.ReactNode => {
  // resolve template strings
  if (typeof node === 'string') {
    return (resolveIfTemplate(node, ctx) ?? null) as React.ReactNode;
  }

  // pass through primitives React can render natively
  if (isPrimitive(node)) {
    return node;
  }

  return null;
};

/**
 * Renders an element node (atom) with resolved props, bindings, and children.
 * @param {Element} node - The element node to render
 * @param {Key | undefined} key - React key for the element
 * @param {Record<string, React.ComponentType<unknown>>} atoms - Atom component registry
 * @param {CallbackMetadata[]} callbacks - Callback metadata array
 * @param {React.Dispatch<StatePatch>} setState - State dispatcher
 * @param {() => ViewState} getState - Function to get the current state at callback time
 * @param {ResolveContext} ctx - Resolve context
 * @param {(node: Node, key: Key | undefined, itemCtx: unknown, scope: ScopeMap | undefined) => React.ReactNode} renderNode - Recursive render function
 * @returns {React.ReactNode} Rendered atom element
 * @internal
 */
export const renderElementNode = (
  node: Element,
  key: Key | undefined,
  atoms: Record<string, React.ComponentType<unknown>>,
  callbacks: CallbackMetadata[],
  setState: React.Dispatch<StatePatch>,
  getState: () => ViewState,
  ctx: ResolveContext,
  renderNode: (
    node: Node,
    key: Key | undefined,
    itemCtx: unknown,
    scope: ScopeMap | undefined
  ) => React.ReactNode
): React.ReactNode => {
  const { id, type, staticProps = {}, bindings = {}, children = [] } = node;

  const Atom = atoms[type] as AtomComponent | undefined;
  if (!Atom) {
    throw new Error(`Component Layout: unknown atom "${type}" with id "${id}".`);
  }

  const resolvedProps: ResolvedProps = { ...staticProps };

  for (const [propName, binding] of Object.entries(bindings)) {
    if (isExpressionBinding(binding)) {
      resolvedProps[propName] = resolveTemplateString(binding.value, ctx);
    } else if (isEventBinding(binding)) {
      resolvedProps[propName] = buildEventCallback(binding, callbacks, getState, setState, ctx);
    }
  }

  resolvedProps['data-atom-id'] = id;
  resolvedProps['data-atom-label'] = type;

  const childNodes: React.ReactNode[] = children.map((c, i) => {
    if (typeof c === 'string') {
      return (resolveIfTemplate(c, ctx) ?? null) as React.ReactNode;
    }
    return renderNode(c, i, ctx.item, ctx.scope);
  });

  return childNodes.length > 0 ? (
    <Atom key={key} {...resolvedProps}>
      {childNodes}
    </Atom>
  ) : (
    <Atom key={key} {...resolvedProps} />
  );
};

/**
 * Builds a callable function from an event binding.
 * Resolves setState values and call args with template strings; invokes callbacks.
 * @param {EventBinding} binding the event binding to build the callback from
 * @param {CallbackMetadata[]} callbacks the array of callback metadata to use for call actions
 * @param {() => ViewState} getState function to get the latest state at the time of event handling
 * @param {React.Dispatch<StatePatch>} setState the React state dispatcher to apply setState actions
 * @param {ResolveContext} resolveContext - Resolve context
 * @returns {(...args: unknown[]) => void} a function that can be used as an event handler
 * @internal
 */
export const buildEventCallback = (
  binding: EventBinding,
  callbacks: CallbackMetadata[],
  getState: () => ViewState,
  setState: React.Dispatch<StatePatch>,
  resolveContext: ResolveContext
): ((...args: unknown[]) => void) => {
  return (...args: unknown[]) => {
    let eventValue: unknown;
    if (binding.arguments.length <= 1) {
      eventValue = args[0];
    } else {
      const obj: Record<string, unknown> = {};
      binding.arguments.forEach((name, i) => {
        obj[name] = args[i];
      });
      eventValue = obj;
    }

    const patch: StatePatch = {};
    const { props, item, scope } = resolveContext;
    const ctx: ResolveContext = {
      props,
      item,
      scope,
      state: getState(),
      event: eventValue,
    };

    for (const action of binding.actions) {
      if (isSetStateAction(action)) {
        for (const [key, value] of Object.entries(action.setState)) {
          patch[key] = resolveIfTemplate(value, ctx);
        }
        continue;
      }

      if (isCallAction(action)) {
        const resolvedArgs = (action.args ?? []).map((a) => resolveIfTemplate(a, ctx));
        const callable = callbacks.find((c) => c.name === action.call)?.callbackFn;
        if (typeof callable === 'function') {
          callable(...resolvedArgs);
        }
        continue;
      }
    }

    if (Object.keys(patch).length > 0) {
      setState(patch);
    }
  };
};

/**
 * Creates a React functional component that renders the given Component Layout document.
 * @param {Document} doc - Component Layout document
 * @param {Record<string, React.ComponentType<unknown>>} atoms - Map of atom type name to its React implementation
 * @param {CallbackMetadata[]} [callbacks] - Optional array of callback metadata for event actions
 * @returns {FC<RuntimeProps>} FC that accepts runtime props (spread as props in expressions)
 * @internal
 */
export function createView<RuntimeProps extends Record<string, unknown> = Record<string, unknown>>(
  doc: Document,
  atoms: Record<string, React.ComponentType<unknown>>,
  callbacks: CallbackMetadata[] = []
): FC<RuntimeProps> {
  const { root, state: initialState = {} } = doc;

  const Generated: FC<RuntimeProps> = (runtimeProps) => {
    const [state, setState] = useReducer(
      (state: ViewState, patch: StatePatch) => ({
        ...state,
        ...patch,
      }),
      initialState as ViewState
    );

    const stateRef = useRef(state);
    stateRef.current = state;

    const getState = () => stateRef.current;

    const renderNode = (
      node: Node,
      key: Key | undefined,
      itemCtx: unknown,
      scope: ScopeMap | undefined
    ): React.ReactNode => {
      const ctx: ResolveContext = {
        props: runtimeProps as Record<string, unknown>,
        state: stateRef.current,
        item: itemCtx,
        scope,
      };

      if (isElement(node)) {
        if (hasFor(node)) {
          return renderFor(node, ctx, renderNode);
        }

        if (hasShow(node)) {
          if (!evaluateShowNode(node.show, ctx)) {
            return null;
          }
        }

        return renderElementNode(node, key, atoms, callbacks, setState, getState, ctx, renderNode);
      }

      return renderPrimitiveNode(node, ctx);
    };

    const rootNode = renderNode(root, 0, undefined, undefined);

    return <>{rootNode}</>;
  };

  Generated.displayName = doc.name;
  return Generated;
}
