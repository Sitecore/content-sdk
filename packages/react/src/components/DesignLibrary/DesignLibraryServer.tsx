'use server';
import React from 'react';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/core/layout';
import { DesignLibraryClientEvents } from './DesignLibraryClientEvents';
import { getCacheAndClean, hasCache } from '@sitecore-content-sdk/core/utils';
import {
  DesignLibraryStatus,
  COMPONENT_UPDATE_CACHE_KEY_PREFIX,
} from '@sitecore-content-sdk/core/editing';
import { ComponentUpdateModel } from '../../server-actions/update-server-component-action';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { AppPlaceholder, PlaceholderMetadata } from '../Placeholder';
import ErrorBoundary from '../ErrorBoundary';
import { DynamicComponent, DesignLibraryServerProps } from './models';

/**
 * Design Library component for rendering server components in app router application.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
 * wires the **variant generation** handshake so the parent (DL Studio) can send
 * generated code to preview and iterate on.
 * Also Renders the DesignLibraryClientEvents component which serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * @param {DesignLibraryServerProps} [props]
 * @param {Page} [props.page] the page data.
 * @param {Record<string, DynamicComponent>} [props.componentMap] Component Map will be used by the placeholder to map Sitecore component names to app implementation
 * @param {ComponentRendering} [props.rendering] Rendering data to be used when rendering the placeholder.
 * @param {() => Promise<{ default: import('../codegen').ImportEntry[] }>} [props.loadImportMap] Optional async loader that resolves to the import-map used to resolve the generated component’s imports. Required when `isVariantGeneration` is true.
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServer = async ({
  page,
  componentMap,
  rendering,
  loadImportMap,
}: DesignLibraryServerProps) => {
  if (!page.mode.isDesignLibrary) {
    return null;
  }
  let designLibraryStatus = DesignLibraryStatus.READY;
  let importMap: codegen.ImportEntry[];
  let importMapPayload: codegen.ImportEntryPayload[];
  let Component: DynamicComponent;
  let importMapError: string;
  let previewComponentStyle: string;
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;

  // load importmap and importmap payload to pass to FE
  // if not provided, or errors during load set error to pass to FE
  if (isVariantGeneration) {
    if (!loadImportMap) {
      importMapError = 'No loadImportMap provided';
    } else {
      try {
        const mod = await loadImportMap();
        importMap = mod.default;
        importMapPayload = codegen.getImportMapPayload(importMap);
      } catch (e) {
        importMapError = `Error loading import map: ${e}`;
      }
    }
  }

  let componentToUpdate = rendering?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const componentUpdateKey = `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentToUpdate.uid}`;
  if (hasCache(componentUpdateKey)) {
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const updateData = getCacheAndClean<ComponentUpdateModel>(componentUpdateKey);

    if (updateData.updatedComponent) {
      componentToUpdate.fields = {
        ...componentToUpdate.fields,
        ...updateData.updatedComponent.fields,
      };
      componentToUpdate.params = {
        ...componentToUpdate.params,
        ...updateData.updatedComponent.params,
      };
    }

    if (isVariantGeneration && updateData.previewComponent && !importMapError) {
      // use provided code and import map to create the component
      Component = codegen.createComponent(
        importMap,
        updateData.previewComponent
      ) as DynamicComponent;

      // pass any raw styles to the client
      previewComponentStyle = updateData.previewComponent.message.styles.content;
    }
  }

  return (
    <>
      {isVariantGeneration && Component ? (
        <ErrorBoundary rendering={componentToUpdate}>
          <PlaceholderMetadata rendering={componentToUpdate}>
            <Component fields={componentToUpdate.fields} params={componentToUpdate.params} />
          </PlaceholderMetadata>
        </ErrorBoundary>
      ) : (
        <AppPlaceholder
          name={EDITING_COMPONENT_PLACEHOLDER}
          page={page}
          rendering={rendering}
          componentMap={componentMap}
        />
      )}
      <DesignLibraryClientEvents
        designLibraryStatus={designLibraryStatus}
        importMap={importMapPayload}
        // pass a new object since we have mutated the original which leads to old reference passed to the client
        component={{ ...componentToUpdate }}
        importMapError={importMapError}
        previewComponentStyle={previewComponentStyle}
      />
    </>
  );
};
