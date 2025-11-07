'use server';
import { debug } from '@sitecore-content-sdk/core';
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { ComponentPreviewEventArgs } from '@sitecore-content-sdk/core/codegen';
import { setCache } from '@sitecore-content-sdk/core/utils';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/core/editing';

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
   * The preview component event arguments when in variant generation mode.
   */
  previewComponent?: ComponentPreviewEventArgs;
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
  setCache(`${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${componentUpdate.uid}`, componentUpdate);
}
