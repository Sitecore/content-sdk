'use client';
import React, { type FC, useMemo, useState } from 'react';
import {
  Renderer,
  StateProvider,
  ActionProvider,
  VisibilityProvider,
  ValidationProvider,
} from '@json-render/react';
import type { DefineRegistryResult } from '@json-render/react';
import { createStateStore } from '@json-render/react';
import { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomsCatalog } from './types';
import { useSitecore } from '../components/SitecoreProvider';
import { withElementChromeKeys, withEditingChromeRegistry } from './with-editing-chrome';

/**
 * Creates a React functional component that renders the given Component Layout document
 * using json-render's Renderer. The document's flat element map is passed as a spec.
 * @param {Document} doc - Component Layout document (flat spec format)
 * @param {DefineRegistryResult} registryResult - The registry from defineAtomsRegistry
 * @param {AtomsCatalog} catalog - The catalog containing component definitions
 * @returns {FC} A react functional component that renders the given Component Layout document
 * @internal
 */
export function createNCC(
  doc: Document,
  registryResult: DefineRegistryResult,
  catalog: AtomsCatalog
): FC {
  const { registry, handlers } = registryResult;

  const Generated = () => {
    const { atomsConfig, page } = useSitecore();
    // Chrome (`<code type="text/sitecore">`) is only meaningful to Design Studio/Pages, so it
    // must not leak into normal (non-editing) rendered output.
    const isEditing = page?.mode?.isEditing ?? false;
    const spec = useMemo(() => (isEditing ? withElementChromeKeys(doc) : doc), [isEditing]);
    const renderRegistry = useMemo(
      () => (isEditing ? withEditingChromeRegistry(registry, catalog) : registry),
      [isEditing]
    );
    const [store] = useState(() => createStateStore(doc.state));

    const [resolvedHandlers] = useState(() =>
      handlers(
        () => (updater) => store.update(updater(store.getSnapshot())),
        () => store.getSnapshot()
      )
    );

    return (
      <div
        className={`component${doc.state?.params?.styles ? ` ${doc.state?.params.styles}` : ''}`}
        id={(doc.state?.params?.RenderingIdentifier as string) || ''}
      >
        <StateProvider store={store}>
          <VisibilityProvider>
            <ActionProvider handlers={resolvedHandlers} navigate={atomsConfig?.navigate}>
              <ValidationProvider>
                <Renderer spec={spec} registry={renderRegistry} />
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
