'use server';
import React from 'react';
import { DesignLibraryProps } from './DesignLibrary';
import { Page } from '@sitecore-content-sdk/core/client';
import {
  ComponentRendering,
  RouteData,
  EDITING_COMPONENT_PLACEHOLDER,
  ComponentFields,
  ComponentParams,
} from '@sitecore-content-sdk/core/layout';
import { ComponentMap } from './sharedTypes';
import { AppPlaceholder } from './Placeholder';
import { DesignLibraryClient } from './DesignLibraryClient';
import { getCacheAndClean, hasCache } from '@sitecore-content-sdk/core/utils';
import {
  DesignLibraryStatus,
  COMPONENT_UPDATE_CACHE_KEY_PREFIX,
} from '@sitecore-content-sdk/core/editing';
import { ComponentUpdateModel } from '../server-actions/update-server-component-action';
import * as codegen from '@sitecore-content-sdk/core/codegen';

export type ImportMapImport = {
  default: codegen.ImportEntry[];
};

type DesignLibraryServerProps = DesignLibraryProps & {
  /**
   * Component Map will be used to map Sitecore component names to app implementation
   * When rendered within a <SitecoreProvider> component, defaults to the context componentMap.
   * When rendered as a server placeholder, this prop must be provided.
   */
  componentMap?: ComponentMap;
  /** Rendering data to be used when rendering the placeholder. */
  rendering: ComponentRendering | RouteData;
  /**
   * Page data.
   * This data is passed by the SitecoreProvider.
   */
  page: Page;
  /**
   * The dynamic import for import map to be used in variant generation mode.
   * Currently it's optional but it will be required in the next major version.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
};

type DynamicComponentServer = React.ComponentType<{
  [key: string]: unknown;
  fields: ComponentFields;
  params: ComponentParams;
}>;

export const DesignLibraryServer = async ({
  page,
  componentMap,
  rendering,
  loadImportMap,
}: DesignLibraryServerProps) => {
  if (!page.mode.isDesignLibrary) {
    return null;
  }
  console.log('DesignLibrarySR render');

  let designLibraryStatus = DesignLibraryStatus.READY;
  let importMap: codegen.ImportEntry[];
  let importMapPayload: codegen.ImportEntryPayload[];
  let Component: DynamicComponentServer;
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;

  // load importmap and importmap payload to pass to FE
  if (isVariantGeneration) {
    try {
      const mod = await loadImportMap();
      importMap = mod.default;
      importMapPayload = codegen.getImportMapPayload(importMap);
    } catch (e) {
      console.log('Error loading import map: ', e);
      // TODO: send error event to frontend
      // sendErrorEvent(
      //   rendering.uid,
      //   `Error loading import map: ${e}`,
      //   codegen.DesignLibraryPreviewError.RenderInit
      // );
    }
  }

  const componentToUpdate = rendering?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
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

    if (isVariantGeneration && updateData.previewComponent) {
      Component = codegen.createComponent(
        importMap,
        updateData.previewComponent
      ) as DynamicComponentServer;
    }
  }

  return (
    <>
      {isVariantGeneration && Component ? (
        <Component
          fields={rendering.fields}
          params={(rendering as ComponentRendering<ComponentFields>).params}
        />
      ) : (
        <AppPlaceholder
          name={EDITING_COMPONENT_PLACEHOLDER}
          page={page}
          rendering={rendering}
          componentMap={componentMap}
        />
      )}
      <DesignLibraryClient designLibraryStatus={designLibraryStatus} importMap={importMapPayload} />
    </>
  );
};
