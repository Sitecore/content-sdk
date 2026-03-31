'use client';
/**
 * createView: renders a Component Layout document as a React tree.
 * Uses document types and resolver from @sitecore-content-sdk/content/editing.
 * @packageDocumentation
 */

import React, { type FC, type Key, createElement, Fragment, useReducer } from 'react';
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
  isComponentLayoutTemplateString as isTemplateString,
  resolveComponentLayoutTemplateString as resolveTemplateString,
  evaluateComponentLayoutShowNode as evaluateShowNode,
} from '@sitecore-content-sdk/content/editing';

/** Registry of named callbacks (e.g. alert, navigate). */
export type CallbackRegistry = Record<string, (...args: unknown[]) => void>;

/** Internal state shape used by generated view components. */
type ViewState = Record<string, unknown>;
/** Patch shape for reducer updates. */
type StatePatch = Partial<ViewState>;
/** Scope values available to template resolution (e.g. for-loop alias). */
type ScopeMap = Record<string, unknown>;
/** Props passed to rendered atoms after bindings/template resolution. */
type ResolvedProps = Record<string, unknown> & {
  'data-designlib-id'?: string;
  'data-designlib-label'?: string;
};

/**
 * Resolves a template string value against the provided context.
 * Returns the original value when it is not a template string.
 * @param {unknown} value - Value that may be a template string
 * @param {ResolveContext} ctx - Resolve context
 * @returns {unknown} Resolved value or original value
 * @internal
 */
export const resolveIfTemplate = (value: unknown, ctx: ResolveContext): unknown => {
  if (typeof value === 'string' && isTemplateString(value)) {
    return resolveTemplateString(value, ctx);
  }

  return value;
};

/**
 * Builds a callable function from an event binding.
 * Resolves setState values and call args with template strings; invokes callbacks.
 * @param {EventBinding} binding the event binding to build the callback from
 * @param {CallbackRegistry} callbacks the registry of callback implementations to use for call actions
 * @param {React.Dispatch<StatePatch>} setState the React state dispatcher to apply setState actions
 * @param {ResolveContext} resolveContext the context to use for resolving template strings
 * @returns {(...args: unknown[]) => void} a function that can be used as an event handler
 */
function buildEventCallback(
  binding: EventBinding,
  callbacks: CallbackRegistry,
  setState: React.Dispatch<StatePatch>,
  resolveContext: ResolveContext
): (...args: unknown[]) => void {
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

    const ctx: ResolveContext = {
      ...resolveContext,
      event: eventValue,
    };

    const patch: StatePatch = {};
    for (const action of binding.actions) {
      if (isSetStateAction(action)) {
        for (const [key, value] of Object.entries(action.setState)) {
          patch[key] = resolveIfTemplate(value, ctx);
        }
        continue;
      }

      if (isCallAction(action)) {
        const resolvedArgs = (action.args ?? []).map((a) => resolveIfTemplate(a, ctx));
        const callable = callbacks[action.call];
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
}

/**
 * Creates a React functional component that renders the given Component Layout document.
 * @param {Document} doc - Component Layout document
 * @param {Record<string, React.ComponentType<unknown>>} atoms - Map of atom type name to its React implementation
 * @param {CallbackRegistry} [callbacks] - Optional registry map of callback names to their implementations for event actions
 * @returns {FC<RuntimeProps>} FC that accepts runtime props (spread as props in expressions)
 */
export function createView<RuntimeProps extends Record<string, unknown> = Record<string, unknown>>(
  doc: Document,
  atoms: Record<string, React.ComponentType<unknown>>,
  callbacks: CallbackRegistry = {}
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

    const makeCtx = (itemCtx?: unknown, scope?: ScopeMap): ResolveContext => ({
      props: runtimeProps as Record<string, unknown>,
      state,
      item: itemCtx,
      scope,
    });

    const renderNode = (
      node: Node,
      key: Key | undefined,
      itemCtx: unknown,
      scope: ScopeMap | undefined
    ): React.ReactNode => {
      if (isElement(node)) {
        if (hasFor(node)) {
          const forCtx: ResolveContext = makeCtx(itemCtx, scope);
          const arr = resolveTemplateString(node.for.each, forCtx);
          if (!Array.isArray(arr)) {
            return null;
          }

          return arr.map((itm: unknown, idx: number) => {
            const tmpl: Element = { ...node, for: undefined };
            const itemScope = { [node.for!.as]: itm } as ScopeMap;
            const itemKey = node.for!.key
              ? resolveTemplateString(node.for!.key, {
                  ...forCtx,
                  item: itm,
                  scope: itemScope,
                })
              : idx;
            return renderNode(tmpl, itemKey as Key, itm, itemScope);
          });
        }

        if (hasShow(node)) {
          const showCtx: ResolveContext = makeCtx(itemCtx, scope);
          if (!evaluateShowNode(node.show, showCtx)) {
            return null;
          }
        }

        const { id, type, staticProps = {}, bindings = {}, children = [] } = node;
        const Atom = atoms[type];
        if (!Atom) {
          throw new Error(`Component Layout: unknown atom "${type}" with id "${id}".`);
        }

        const ctx: ResolveContext = makeCtx(itemCtx, scope);

        const resolvedProps: ResolvedProps = { ...staticProps };

        for (const [propName, binding] of Object.entries(bindings)) {
          if (isExpressionBinding(binding)) {
            resolvedProps[propName] = resolveTemplateString(binding.value, ctx);
          } else if (isEventBinding(binding)) {
            resolvedProps[propName] = buildEventCallback(binding, callbacks, setState, ctx);
          }
        }

        resolvedProps['data-designlib-id'] = id;
        resolvedProps['data-designlib-label'] = type;

        const childNodes: React.ReactNode[] = (children ?? []).map((c, i) => {
          if (typeof c === 'string') {
            return (resolveIfTemplate(c, ctx) ?? null) as React.ReactNode;
          }
          return renderNode(c, i, itemCtx, scope);
        });

        return createElement(Atom, { key, ...resolvedProps }, ...childNodes);
      }

      if (typeof node === 'string' && isTemplateString(node)) {
        return (resolveIfTemplate(node, makeCtx(itemCtx, scope)) ?? null) as React.ReactNode;
      }

      if (
        node === null ||
        typeof node === 'string' ||
        typeof node === 'number' ||
        typeof node === 'boolean'
      ) {
        return node;
      }
      return null;
    };

    const rootNode = renderNode(root, 0, undefined, undefined);

    return createElement(Fragment, null, rootNode);
  };

  Generated.displayName = doc.name;
  return Generated;
}
