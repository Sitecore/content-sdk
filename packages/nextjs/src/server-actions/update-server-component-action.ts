'use server';
import { refresh } from 'next/cache';
import { debug } from '@sitecore-content-sdk/content';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import {
  ServerComponentPreviewEventArgs,
  GeneratedComponentData,
  fetchGeneratedComponentFromCache,
} from '@sitecore-content-sdk/content/codegen';
import { setCache } from '@sitecore-content-sdk/core/tools';
import {
  COMPONENT_UPDATE_CACHE_KEY_PREFIX,
  COMPONENT_PREVIEW_CACHE_KEY_PREFIX,
} from '@sitecore-content-sdk/content/editing';

export type ComponentUpdateModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The updated component rendering data.
   */
  rendering?: ComponentRendering;
  /**
   * The data needed for generated component to be rendered on the server. Required if update event is coming for a generated component in variant generation mode.
   */
  generatedComponentData?: GeneratedComponentData;
};

export type ComponentPreviewModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The data needed for generated component to be rendered on the server
   */
  generatedComponentData?: GeneratedComponentData;
  /**
   * Error message in case fetching generated component data from secured cache endpoint fails.
   */
  error?: string;
};

export type PreviewEventModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The preview component event arguments in variant generation mode.
   */
  args: ServerComponentPreviewEventArgs;
};

/**
 * Server action to update global cache with the provided component updates received from Design Library.
 * Stores the given {@link ComponentUpdateModel} in the global cache using a key based on the component UID.
 * This enables rendering dynamic updates of server components inside Design Library
 * @param {ComponentUpdateModel} updatedComponent - The component update model containing the UID and optional updated or preview component data.
 * @returns A Promise that resolves when the cache has been updated.
 */
export async function updateComponentAction(updatedComponent: ComponentUpdateModel): Promise<void> {
  debug.editing(`Updating server component cache for Update Component: ${updatedComponent.uid}`);
  setCache(`${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${updatedComponent.uid}`, updatedComponent);
  refresh();
}

/**
 * Server action to update global cache with the generated component data in variant generation mode
 * The generated component data is retrieved from a secured cache endpoint via the provided event arguments.
 * This enables rendering dynamic updates of server components inside Design Library
 * @param {PreviewEventModel} previewEvent - The preview event model containing the UID and the preview event arguments with cache information to fetch the generated component data.
 * @param {string} [edgeUrl] - Optional Edge URL to fetch the generated component data.
 * @returns A Promise that resolves when the cache has been updated.
 */
export async function previewComponentAction(
  previewEvent: PreviewEventModel,
  edgeUrl?: string
): Promise<void> {
  debug.editing(`Updating server component cache for Preview Component: ${previewEvent.uid}`);

  const updatedComponent: ComponentPreviewModel = {
    uid: previewEvent.uid,
    generatedComponentData: undefined,
    error: undefined,
  };

  if (previewEvent.args) {
    // we've received a component preview event from the Design Library, so we need to fetch the generated component data from secured endpoint
    try {
      updatedComponent.generatedComponentData = await fetchGeneratedComponentFromCache(
        previewEvent.args.message.cache.id,
        previewEvent.args.message.cache.token,
        edgeUrl
      );
    } catch (error) {
      debug.editing(
        `Error fetching generated component data from cache for Component: ${previewEvent.uid}`,
        error
      );
      updatedComponent.error = error instanceof Error ? error.message : String(error);
    }
  } else {
    debug.editing(`No preview event arguments provided for Component: ${previewEvent.uid}`);
    updatedComponent.error = 'No preview event arguments provided';
  }

  setCache(`${COMPONENT_PREVIEW_CACHE_KEY_PREFIX}${updatedComponent.uid}`, updatedComponent);
  refresh();
}
