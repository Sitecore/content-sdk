'use server';
import { debug } from '@sitecore-content-sdk/content';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import {
  ServerComponentPreviewEventArgs,
  GeneratedComponentData,
  fetchGeneratedComponentFromCache,
} from '@sitecore-content-sdk/content/codegen';
import { setCache } from '@sitecore-content-sdk/core/tools';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/content/editing';

export type ComponentUpdateModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The updated component rendering data.
   */
  updatedComponent?: ComponentRendering;
  /**
   * The data needed for generated component to be rendered on the server
   */
  generatedComponentData?: GeneratedComponentData;
  /**
   * The preview component event arguments in variant generation mode.
   */
  serverComponentPreviewEventArgs?: ServerComponentPreviewEventArgs;
};

/**
 * Server action to update global cache with the provided component updates received from Design Library.
 * Stores the given {@link ComponentUpdateModel} in the global cache using a key based on the component UID.
 * This enables dynamic rendering of server components inside Design Library
 * @param {ComponentUpdateModel} componentUpdate - The component update model containing the UID and optional updated or preview component data.
 * @returns A Promise that resolves when the cache has been updated.
 */
export async function updateServerComponentAction(
  componentUpdate: ComponentUpdateModel
): Promise<void> {
  debug.editing(`Updating server component cache for Component: ${componentUpdate.uid}`);

  let componentUpdateCache: ComponentUpdateModel = componentUpdate;

  if (componentUpdate.serverComponentPreviewEventArgs) {
    // we've received a component preview event from the Design Library, so we need to fetch the generated component data from secured endpoint
    const generatedComponentData = await fetchGeneratedComponentFromCache(
      componentUpdate.serverComponentPreviewEventArgs.message.cache.id,
      componentUpdate.serverComponentPreviewEventArgs.message.cache.token,
      process.env.SITECORE_EDGE_URL
    );

    componentUpdateCache = {
      ...componentUpdate,
      generatedComponentData,
    };
  }

  setCache(`${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentUpdate.uid}`, componentUpdateCache);
}
