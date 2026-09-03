'use client';
import React, { type FC, useEffect, useState } from 'react';
import {
  Renderer,
  StateProvider,
  ActionProvider,
  VisibilityProvider,
  ValidationProvider,
} from '@json-render/react';
import type { DefineRegistryResult } from '@json-render/react';
import { createStateStore } from '@json-render/react';
import type { StateModel } from '@json-render/core';
import { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomsCatalog } from './types';
import { useSitecore } from '../components/SitecoreProvider';
import type { ChildComponentProps } from '../components/Placeholder/models';
import { withElementChromeKeys, withEditingChromeRegistry } from './with-editing-chrome';

/**
 * Props accepted by the NCC component created by `createNCC`.
 * @internal
 */
type NCCProps = {
  [key: string]: unknown;
  fields?: ChildComponentProps['fields'];
  params?: ChildComponentProps['params'];
};

/**
 * Creates a React functional component that renders the given Component Layout document
 * using json-render's Renderer. The document's flat element map is passed as a spec.
 * @param {Document} doc - Component Layout document (flat spec format)
 * @param {DefineRegistryResult} registryResult - The registry from defineAtomsRegistry
 * @param {AtomsCatalog} catalog - The catalog containing component definitions
 * @returns {FC<NCCProps>} FC that accepts runtime props merged into spec state
 * @internal
 */
export function createNCC(
  doc: Document,
  registryResult: DefineRegistryResult,
  catalog: AtomsCatalog
): FC<NCCProps> {
  const { registry, handlers } = registryResult;
  const chromeDoc = withElementChromeKeys(doc);
  const chromeRegistry = withEditingChromeRegistry(registry, catalog);

  const initialState: StateModel = {
    ...(doc.state ?? {}),
  };

  const Generated: FC<NCCProps> = ({ fields, params }) => {
    const { atomsConfig } = useSitecore();
    const [store] = useState(() =>
      createStateStore({
        ...initialState,
        fields,
        params,
      })
    );

    useEffect(() => {
      const snapshot = store.getSnapshot();

      store.update({
        fields: { ...(snapshot.fields as object), ...fields },
        params: { ...(snapshot.params as object), ...params },
      });
    }, [fields, params, store]);

    const [resolvedHandlers] = useState(() =>
      handlers(
        () => (updater) => store.update(updater(store.getSnapshot())),
        () => store.getSnapshot()
      )
    );

    return (
      <div className={`component${params?.styles ? ` ${params.styles}` : ''}`} id={params?.RenderingIdentifier || ''}>
        <StateProvider store={store}>
          <VisibilityProvider>
            <ActionProvider handlers={resolvedHandlers} navigate={atomsConfig?.navigate}>
              <ValidationProvider>
                <Renderer spec={chromeDoc} registry={chromeRegistry} />
              </ValidationProvider>
            </ActionProvider>
          </VisibilityProvider>
        </StateProvider>
      </div>
    );
  };

  Generated.displayName = doc.name;

  return Generated;
}
