'use client';
/**
 * createView: renders a Component Layout document as a React tree using json-render.
 * The Document is aligned with json-render's flat spec format and is passed directly
 * to the Renderer component with the provided registry.
 */

import React, { type FC } from 'react';
import { Renderer, StateProvider, ActionProvider, VisibilityProvider } from '@json-render/react';
import type { ComponentRegistry, DefineRegistryResult } from '@json-render/react';
import type { Spec, StateModel } from '@json-render/core';
import type { Document } from '@sitecore-content-sdk/content/atoms';

/**
 * Creates a React functional component that renders the given Component Layout document
 * using json-render's Renderer. The document's flat element map is passed as a spec.
 *
 * @param {Document} doc - Component Layout document (flat spec format)
 * @param {DefineRegistryResult} registryResult - The registry from defineAtomsRegistry
 * @returns {FC<RuntimeProps>} FC that accepts runtime props merged into spec state
 * @internal
 */
export function createView<RuntimeProps extends Record<string, unknown> = Record<string, unknown>>(
  doc: Document,
  registryResult: DefineRegistryResult
): FC<RuntimeProps> {
  const { registry, handlers } = registryResult;

  const spec: Spec = {
    root: doc.root,
    elements: doc.elements as Spec['elements'],
  };

  const initialState: StateModel = {
    ...(doc.state ?? {}),
    ...(doc.props ?? {}),
  };

  const Generated: FC<RuntimeProps> = (runtimeProps) => {
    const mergedState: StateModel = {
      ...initialState,
      ...(runtimeProps as Record<string, unknown>),
    };

    return (
      <StateProvider initialState={mergedState}>
        <ActionProvider
          handlers={handlers(
            () => undefined,
            () => mergedState
          )}
        >
          <VisibilityProvider>
            <Renderer spec={spec} registry={registry as ComponentRegistry} />
          </VisibilityProvider>
        </ActionProvider>
      </StateProvider>
    );
  };

  Generated.displayName = doc.name;
  return Generated;
}
