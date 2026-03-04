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
  COMPONENT_PREVIEW_CACHE_KEY_PREFIX,
  updateComponent as updateComponentOriginal,
} from '@sitecore-content-sdk/core/editing';
import {
  ComponentUpdateModel,
  ComponentPreviewModel,
} from '../../server-actions/update-server-component-action';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { AppPlaceholder, PlaceholderMetadata } from '../Placeholder';
import { DesignLibraryErrorBoundary } from './DesignLibraryErrorBoundary';
import {
  DynamicComponent,
  DesignLibraryServerProps,
  DesignLibraryServerPreviewProps,
  DesignLibraryServerVariantGenerationProps,
  ServerComponentInitError,
} from './models';
import { ErrorComponent } from '../ErrorBoundary';

let { getCacheAndClean, hasCache } = globalCache;
let { createComponentInstance, getImportMapInfo } = codegen;
let updateComponent = updateComponentOriginal;

export const __mockDependencies = async (mocks: any) => {
  getCacheAndClean = mocks.getCacheAndClean;
  hasCache = mocks.hasCache;
  createComponentInstance = mocks.createComponentInstance;
  if (mocks.updateComponent) {
    updateComponent = mocks.updateComponent;
  }
  if (mocks.getImportMapInfo) {
    getImportMapInfo = mocks.getImportMapInfo;
  }
};

/**
 * Design Library component for rendering server components in app router application.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
 * wires the **variant generation** handshake so the parent (Design Library) can send
 * generated code to preview and iterate on.
 * Also renders the DesignLibraryClientEvents component which serves as a communication bridge between DesignLibraryServer and the Design Studio on the client side.
 * @param {DesignLibraryServerProps} props The props. {@link DesignLibraryServerProps}
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServer = async ({
  page,
  componentMap,
  rendering,
  loadServerImportMap,
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
        loadServerImportMap={loadServerImportMap}
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
 * @param {DesignLibraryServerVariantGenerationProps} props The props. {@link DesignLibraryServerVariantGenerationProps}
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServerVariantGeneration = async ({
  page,
  rendering,
  loadServerImportMap,
  componentMap,
}: DesignLibraryServerVariantGenerationProps) => {
  let designLibraryStatus = DesignLibraryStatus.READY;
  let importMap: codegen.ImportEntry[] | undefined;
  let importMapInfo: codegen.ImportEntryInfo[] | undefined;
  let Component: DynamicComponent | undefined;
  let componentInitError: ServerComponentInitError | undefined;
  let generatedComponentData: codegen.GeneratedComponentData | undefined;

  const getComponentInitError = (
    type: codegen.DesignLibraryPreviewError,
    error: unknown
  ): ServerComponentInitError => ({
    type,
    message: error instanceof Error ? error.message : String(error),
  });

  // load importmap and importmap payload to pass to FE
  // if not provided, or errors during load set error to pass to FE
  if (!loadServerImportMap) {
    componentInitError = getComponentInitError(
      codegen.DesignLibraryPreviewError.ImportMapMissing,
      'No loadImportMap provided'
    );
  } else {
    try {
      const mod = await loadServerImportMap();
      importMap = mod.default;
      importMapInfo = getImportMapInfo(importMap);
    } catch (e) {
      componentInitError = getComponentInitError(
        codegen.DesignLibraryPreviewError.ImportMapLoad,
        `Error loading import map: ${e}`
      );
    }
  }

  let componentToUpdate = rendering?.placeholders?.[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  if (!componentToUpdate) return <ErrorComponent message="Rendering data is missing" />;

  if (!componentToUpdate.uid)
    return <ErrorComponent message="Rendering UID is missing in the rendering data" />;

  const uid = componentToUpdate.uid;
  const componentUpdateKey = `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${uid}`;
  const componentPreviewKey = `${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}${uid}`;

  // check if we have an update for this component in the global cache
  if (hasCache(componentUpdateKey)) {
    // we have fields/params update, get it and clean the cache
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const updateData = getCacheAndClean<ComponentUpdateModel>(componentUpdateKey);

    // apply the updates to the component rendering
    if (updateData?.rendering) {
      updateComponent(componentToUpdate, updateData.rendering.fields, updateData.rendering.params);
    }

    // generate the component instance if we are dealing with an AI-generated component
    if (updateData?.generatedComponentData && !componentInitError && importMap) {
      generatedComponentData = updateData.generatedComponentData;
      try {
        // use provided code and import map to create the component instance
        Component = createComponentInstance(
          importMap,
          updateData.generatedComponentData
        ) as DynamicComponent;
      } catch (error) {
        // error during component initialization - send error to client
        componentInitError = getComponentInitError(
          codegen.DesignLibraryPreviewError.RenderInit,
          error
        );
      }
    }
  } else if (hasCache(componentPreviewKey) && !componentInitError && importMap) {
    // we have a preview update, get it and clean the cache
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const previewData = getCacheAndClean<ComponentPreviewModel>(componentPreviewKey);
    if (previewData?.error) {
      componentInitError = getComponentInitError(
        codegen.DesignLibraryPreviewError.GeneratedComponentFetch,
        previewData.error
      );
    }

    if (previewData?.generatedComponentData) {
      generatedComponentData = previewData.generatedComponentData;
      try {
        // use provided code and import map to create the component instance
        Component = createComponentInstance(
          importMap,
          previewData.generatedComponentData
        ) as DynamicComponent;
      } catch (error) {
        // error during component initialization - send error to client
        componentInitError = getComponentInitError(
          codegen.DesignLibraryPreviewError.RenderInit,
          error
        );
      }
    }
  }

  return (
    <>
      {Component ? (
        <DesignLibraryErrorBoundary uid={componentToUpdate.uid}>
          <PlaceholderMetadata rendering={componentToUpdate}>
            <Component
              fields={componentToUpdate.fields}
              params={componentToUpdate.params}
              key={Date.now()}
            />
          </PlaceholderMetadata>
        </DesignLibraryErrorBoundary>
      ) : (
        <AppPlaceholder
          name={EDITING_COMPONENT_PLACEHOLDER}
          page={page}
          rendering={rendering}
          componentMap={componentMap}
          key={Date.now()}
        />
      )}
      <DesignLibraryVariantGenerationEvents
        designLibraryStatus={designLibraryStatus}
        importMap={importMapInfo}
        // pass a new object since we have mutated the original which leads to old reference passed to the client
        component={{ ...componentToUpdate }}
        componentInitError={componentInitError}
        generatedComponentData={generatedComponentData}
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
 * @param {DesignLibraryServerPreviewProps} props The props. {@link DesignLibraryServerPreviewProps}
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibraryServerPreview = async ({
  page,
  rendering,
  componentMap,
}: DesignLibraryServerPreviewProps) => {
  let designLibraryStatus = DesignLibraryStatus.READY;

  let componentToUpdate = rendering?.placeholders?.[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  if (!componentToUpdate) return <ErrorComponent message="Rendering data is missing" />;
  if (!componentToUpdate.uid)
    return <ErrorComponent message="Rendering UID is missing in the rendering data" />;

  const componentUpdateKey = `${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentToUpdate.uid}`;

  // check if we have an update for this component in the global cache
  if (hasCache(componentUpdateKey)) {
    // we have an update, get it and clean the cache
    designLibraryStatus = DesignLibraryStatus.RENDERED;
    const updateData = getCacheAndClean<ComponentUpdateModel>(componentUpdateKey);

    // apply the updates to the component rendering
    if (updateData?.rendering) {
      updateComponent(componentToUpdate, updateData.rendering.fields, updateData.rendering.params);
    }
  }

  return (
    <>
      <AppPlaceholder
        name={EDITING_COMPONENT_PLACEHOLDER}
        page={page}
        rendering={rendering}
        componentMap={componentMap}
        key={Date.now()}
      />
      <DesignLibraryPreviewEvents
        designLibraryStatus={designLibraryStatus}
        // pass a new object since we have mutated the original which leads to old reference passed to the client
        component={{ ...componentToUpdate }}
      />
    </>
  );
};
