'use server';
import React from 'react';
import { EDITING_COMPONENT_PLACEHOLDER } from '@sitecore-content-sdk/core/layout';
import {
  DesignLibraryPreviewEvents,
  DesignLibraryVariantGenerationEvents,
} from './DesignLibraryClientEvents';
import * as globalCache from '@sitecore-content-sdk/core/utils';
import {
  DesignLibraryStatus,
  COMPONENT_UPDATE_CACHE_KEY_PREFIX,
  updateComponent,
} from '@sitecore-content-sdk/core/editing';
import { ComponentUpdateModel } from '../../server-actions/update-server-component-action';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { AppPlaceholder, PlaceholderMetadata } from '../Placeholder';
import { DesignLibraryErrorBoundary } from './DesignLibraryErrorBoundary';
import {
  DynamicComponent,
  DesignLibraryServerProps,
  DesignLibraryServerPreviewProps,
  DesignLibraryServerVariantGenerationProps,
} from './models';

let { getCacheAndClean, hasCache } = globalCache;
let { createComponentInstance } = codegen;

export const __mockDependencies = async (mocks: any) => {
  getCacheAndClean = mocks.getCacheAndClean;
  hasCache = mocks.hasCache;
  createComponentInstance = mocks.createComponentInstance;
};

/**
 * Design Library component for rendering server components in app router application.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
 * wires the **variant generation** handshake so the parent (Design Library) can send
 * generated code to preview and iterate on.
 * Also renders the DesignLibraryClientEvents component which serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * @param {DesignLibraryServerProps} [props] The props. {@link DesignLibraryServerProps}
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

  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;

  if (isVariantGeneration) {
    return (
      <DesignLibraryServerVariantGeneration
        page={page}
        rendering={rendering}
        loadImportMap={loadImportMap}
        componentMap={componentMap}
      />
    );
  }

  return (
    <DesignLibraryServerPreview page={page} rendering={rendering} componentMap={componentMap} />
  );
};

/**
 * Design Library component for rendering server components in app router application in variant generation mode.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes on first render and,
 * wires the **variant generation** handshake so the parent (Design Library) can send
 * generated code to preview and iterate on.
 * Also renders the DesignLibraryVariantGenerationEvents component which serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * @param {DesignLibraryServerVariantGenerationProps} [props] The props. {@link DesignLibraryServerVariantGenerationProps}
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServerVariantGeneration = async ({
  page,
  rendering,
  loadImportMap,
  componentMap,
}: DesignLibraryServerVariantGenerationProps) => {
  if (!page.mode.isDesignLibrary) {
    return null;
  }
  let designLibraryStatus = DesignLibraryStatus.READY;
  let importMap: codegen.ImportEntry[];
  let importMapInfo: codegen.ImportEntryInfo[];
  let Component: DynamicComponent;
  let importMapError: string;
  let previewComponentStyle: string;

  // load importmap and importmap payload to pass to FE
  // if not provided, or errors during load set error to pass to FE
  if (!loadImportMap) {
    importMapError = 'No loadImportMap provided';
  } else {
    try {
      const mod = await loadImportMap();
      importMap = mod.default;
      importMapInfo = codegen.getImportMapInfo(importMap);
    } catch (e) {
      importMapError = `Error loading import map: ${e}`;
    }
  }

  let componentToUpdate = rendering?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const componentUpdateKey = `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentToUpdate.uid}`;

  // check if we have an update for this component in the global cache
  if (hasCache(componentUpdateKey)) {
    // we have an update, get it and clean the cache
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const updateData = getCacheAndClean<ComponentUpdateModel>(componentUpdateKey);

    // apply the updates to the component rendering
    if (updateData.updatedComponent) {
      updateComponent(
        componentToUpdate,
        updateData.updatedComponent.fields,
        updateData.updatedComponent.params
      );
    }

    if (updateData.previewComponent && !importMapError) {
      try {
        // use provided code and import map to create the component instance
        Component = createComponentInstance(
          importMap,
          updateData.previewComponent
        ) as DynamicComponent;

        // pass any raw styles to the client to be added to document head
        previewComponentStyle = updateData.previewComponent.message?.styles?.content;
      } catch (error) {
        // error during component initialization - send error to client
        importMapError = error.toString();
      }
    }
  }

  return (
    <>
      {Component ? (
        <DesignLibraryErrorBoundary uid={componentToUpdate.uid}>
          <PlaceholderMetadata rendering={componentToUpdate}>
            <Component fields={componentToUpdate.fields} params={componentToUpdate.params} />
          </PlaceholderMetadata>
        </DesignLibraryErrorBoundary>
      ) : (
        <AppPlaceholder
          name={EDITING_COMPONENT_PLACEHOLDER}
          page={page}
          rendering={rendering}
          componentMap={componentMap}
        />
      )}
      <DesignLibraryVariantGenerationEvents
        designLibraryStatus={designLibraryStatus}
        importMap={importMapInfo}
        // pass a new object since we have mutated the original which leads to old reference passed to the client
        component={{ ...componentToUpdate }}
        importMapError={importMapError}
        previewComponentStyle={previewComponentStyle}
      />
    </>
  );
};

/**
 * Design Library component for rendering server components in app router application when variant generation is not enabled.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * wires the **component update** handshake so the parent (Design Library) can send
 * updated component props.
 * Also renders the DesignLibraryPreviewEvents component which serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * @param {DesignLibraryServerPreviewProps} [props] The props. {@link DesignLibraryServerPreviewProps}
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServerPreview = async ({
  page,
  rendering,
  componentMap,
}: DesignLibraryServerPreviewProps) => {
  if (!page.mode.isDesignLibrary) {
    return null;
  }
  let designLibraryStatus = DesignLibraryStatus.READY;

  let componentToUpdate = rendering?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const componentUpdateKey = `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentToUpdate.uid}`;

  // check if we have an update for this component in the global cache
  if (hasCache(componentUpdateKey)) {
    // we have an update, get it and clean the cache
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const updateData = getCacheAndClean<ComponentUpdateModel>(componentUpdateKey);

    // apply the updates to the component rendering
    if (updateData.updatedComponent) {
      updateComponent(
        componentToUpdate,
        updateData.updatedComponent.fields,
        updateData.updatedComponent.params
      );
    }
  }

  return (
    <>
      <AppPlaceholder
        name={EDITING_COMPONENT_PLACEHOLDER}
        page={page}
        rendering={rendering}
        componentMap={componentMap}
      />
      <DesignLibraryPreviewEvents
        designLibraryStatus={designLibraryStatus}
        // pass a new object since we have mutated the original which leads to old reference passed to the client
        component={{ ...componentToUpdate }}
      />
    </>
  );
};
