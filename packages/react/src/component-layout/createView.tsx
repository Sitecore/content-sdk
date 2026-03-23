/**
 * createView: renders a Component Layout document as a React tree.
 * Uses document types and resolver from @sitecore-content-sdk/content/editing.
 * @packageDocumentation
 */

import React, {
  type FC,
  type Key,
  createElement,
  Fragment,
  useReducer,
  useMemo,
} from 'react';
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

/** Map of atom type name to callback name to ordered argument names (for Design Studio). Optional. */
export type CallbackArgNamesMap = Record<string, Record<string, string[]>>;

/**
 * Builds a callable function from an event binding.
 * Resolves setState values and call args with template strings; invokes callbacks.
 */
function buildEventCallback(
  binding: EventBinding,
  callbacks: CallbackRegistry,
  _runtime: Record<string, unknown>,
  _getState: () => Record<string, unknown>,
  setState: React.Dispatch<Partial<Record<string, unknown>>>,
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

    const patch: Record<string, unknown> = {};
    for (const action of binding.actions) {
      if (isSetStateAction(action)) {
        for (const [key, value] of Object.entries(action.setState)) {
          if (typeof value === 'string' && isTemplateString(value)) {
            patch[key] = resolveTemplateString(value, ctx);
          } else {
            patch[key] = value;
          }
        }
        continue;
      }

      if (isCallAction(action)) {
        const resolvedArgs = (action.args ?? []).map((a) => {
          if (typeof a === 'string' && isTemplateString(a)) {
            return resolveTemplateString(a, ctx);
          }
          return a;
        });
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

/** Options for createView. */
export interface CreateViewOptions {
  /** Display name for the generated component. */
  displayName?: string;
  /** Optional callback arg names per atom (for Design Studio). */
  callbackArgNames?: CallbackArgNamesMap;
}

/**
 * Creates a React functional component that renders the given Component Layout document.
 *
 * @param doc - Component Layout document (root node, optional state, name)
 * @param atoms - Map of atom type name to React component
 * @param callbacks - Optional registry of named callbacks for event actions
 * @param options - Optional displayName and callbackArgNames
 * @returns FC that accepts runtime props (spread as props in expressions)
 */
export function createView<RuntimeProps extends Record<string, unknown> = Record<string, unknown>>(
  doc: Document,
  atoms: Record<string, React.ComponentType<unknown>>,
  callbacks: CallbackRegistry = {},
  options: CreateViewOptions = {}
): FC<RuntimeProps> {
  const { root, state: initialState = {} } = doc;
  const displayName = options.displayName ?? doc.name ?? 'ComponentLayoutView';

  const Generated: FC<RuntimeProps> = (runtimeProps) => {
    const [state, setState] = useReducer(
      (s: Record<string, unknown>, patch: Partial<Record<string, unknown>>) => ({
        ...s,
        ...patch,
      }),
      initialState as Record<string, unknown>
    );

    const getState = useMemo(() => () => state, [state]);

    const renderNode = (
      node: Node,
      key: Key | undefined,
      itemCtx: unknown,
      scope: Record<string, unknown> | undefined
    ): React.ReactNode => {
      if (isElement(node)) {
        if (hasFor(node)) {
          const forCtx: ResolveContext = {
            props: runtimeProps as Record<string, unknown>,
            state,
            item: itemCtx,
            scope,
          };
          const arr = resolveTemplateString(node.for.each, forCtx);
          if (!Array.isArray(arr)) {
            return null;
          }

          return arr.map((itm: unknown, idx: number) => {
            const tmpl: Element = { ...node, for: undefined };
            const itemScope = { [node.for!.as]: itm } as Record<string, unknown>;
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
          const showCtx: ResolveContext = {
            props: runtimeProps as Record<string, unknown>,
            state,
            item: itemCtx,
            scope,
          };
          if (!evaluateShowNode(node.show, showCtx)) {
            return null;
          }
        }

        const { id, type, staticProps = {}, bindings = {}, children = [] } = node;
        const Atom = atoms[type];
        if (!Atom) {
          throw new Error(`Component Layout: unknown atom "${type}".`);
        }

        const ctx: ResolveContext = {
          props: runtimeProps as Record<string, unknown>,
          state,
          item: itemCtx,
          scope,
        };

        const resolvedProps: Record<string, unknown> = { ...staticProps };

        for (const [propName, binding] of Object.entries(bindings)) {
          if (isExpressionBinding(binding)) {
            resolvedProps[propName] = resolveTemplateString(binding.value, ctx);
          } else if (isEventBinding(binding)) {
            resolvedProps[propName] = buildEventCallback(
              binding,
              callbacks,
              runtimeProps as Record<string, unknown>,
              getState,
              setState,
              ctx
            );
          }
        }

        (resolvedProps as Record<string, unknown>)['data-designlib-id'] = id;
        (resolvedProps as Record<string, unknown>)['data-designlib-label'] = type;

        const childNodes: React.ReactNode[] = (children ?? []).map((c, i) => {
          if (typeof c === 'string' && isTemplateString(c)) {
            const resolved = resolveTemplateString(c, ctx);
            return (resolved ?? null) as React.ReactNode;
          }
          return renderNode(c, i, itemCtx, scope);
        });

        return createElement(Atom, { key, ...resolvedProps }, ...childNodes);
      }

      if (typeof node === 'string' && isTemplateString(node)) {
        const ctx: ResolveContext = {
          props: runtimeProps as Record<string, unknown>,
          state,
          item: itemCtx,
          scope,
        };
        const resolved = resolveTemplateString(node, ctx);
        return (resolved ?? null) as React.ReactNode;
      }

      if (node === null || typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') {
        return node;
      }
      return null;
    };

    const rootNode = renderNode(root, 0, undefined, undefined);
    return createElement(Fragment, null, rootNode);
  };

  Generated.displayName = displayName;
  return Generated;
}
