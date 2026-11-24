'use server';
import { refresh } from 'next/cache';
import { debug } from '@sitecore-content-sdk/content';
import {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
} from '@sitecore-content-sdk/content/layout';
import {
  ServerComponentPreviewEventArgs,
  GeneratedComponentData,
  fetchGeneratedComponentFromCache,
} from '@sitecore-content-sdk/content/codegen';
import { resolveEdgeUrl, setCache } from '@sitecore-content-sdk/core/tools';
import { COMPONENT_UPDATE_CACHE_KEY_PREFIX } from '@sitecore-content-sdk/content/editing';
import { isDesignLibraryAuthorizedFromHeaders } from '../utils/utils';
import { NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME_ENV } from '../config/define-config';

/**
 * Fail-closed secret check for Design Library server actions.
 * Does not log the token.
 */
const assertEditingSecretAuthorized = async (): Promise<void> => {
  if (await isDesignLibraryAuthorizedFromHeaders()) {
    return;
  }
  debug.editing('empty / invalid editing secret');
  throw new Error('Unauthorized');
};

/**
 * Reference to a generated component stored in the Sitecore Edge authoring cache.
 * Only a reference is accepted from the client - the component code itself is always fetched on the server.
 */
export type GeneratedComponentCacheReference = {
  /** The unique identifier for the cache entry. */
  id: string;
  /** The jwt token for authentication when fetching the generated component from the cache. */
  token: string;
};

export type ComponentUpdateModel = {
  /**
   * Unique identifier of the component being updated.
   */
  uid: string;
  /**
   * The updated component rendering data. Only `fields` and `params` are applied.
   */
  rendering?: ComponentRendering;
  /**
   * Reference to the generated component in the Sitecore Edge authoring cache (taken from the last preview event).
   * Required if update event is coming for a generated component in variant generation mode.
   */
  cache?: GeneratedComponentCacheReference;
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
 * The component state stored in the global cache by the Design Library server actions
 * and consumed by the Design Library server component on the following render.
 * Built on the server only - never accepted from the client as is.
 */
export type ComponentRenderState = {
  /**
   * Unique identifier of the component.
   */
  uid: string;
  /**
   * The updated fields and params of the component.
   */
  rendering?: {
    fields?: ComponentFields;
    params?: ComponentParams;
  };
  /**
   * The generated component data fetched from the Sitecore Edge authoring cache (variant generation mode).
   */
  generatedComponentData?: GeneratedComponentData;
  /**
   * Error message in case fetching generated component data from secured cache endpoint fails.
   */
  error?: string;
};

/**
 * Resolves the Sitecore Edge URL on the server (env variables, falling back to the production Edge URL).
 * It's never accepted from the client: the generated component code fetched from this URL is executed on the server,
 * so a client-provided URL would allow fetching (and executing) code from an arbitrary host.
 * Mirrors the env resolution of the Next.js `defineConfig`.
 * @returns {string} The Sitecore Edge URL.
 */
const getServerEdgeUrl = (): string =>
  resolveEdgeUrl(process.env[NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME_ENV]);

/**
 * Builds the {@link ComponentRenderState} from an allow-list of the provided data, stores it in the global cache
 * and triggers a re-render. The re-render happens within the same request, so it works on serverless environments too.
 * The generated component data is fetched from Sitecore Edge on every call (no cross-request caching), so the behavior
 * is the same on every instance and Sitecore Edge validates the cache token on every update.
 * @param {string} uid - Unique identifier of the component.
 * @param {ComponentRendering | null} [rendering] - The component rendering, only `fields` and `params` are taken.
 * @param {GeneratedComponentCacheReference} [cache] - Reference to the generated component in the Edge authoring cache.
 */
const storeRenderState = async (
  uid: string,
  rendering: ComponentRendering | null | undefined,
  cache: GeneratedComponentCacheReference | undefined
): Promise<void> => {
  const state: ComponentRenderState = {
    uid,
    rendering: rendering ? { fields: rendering.fields, params: rendering.params } : undefined,
  };

  if (cache?.id && cache?.token) {
    try {
      state.generatedComponentData = await fetchGeneratedComponentFromCache(
        cache.id,
        cache.token,
        getServerEdgeUrl()
      );
    } catch (error) {
      debug.editing(
        `Error fetching generated component data from cache for Component: ${uid}`,
        error
      );
      state.error = error instanceof Error ? error.message : String(error);
    }
  }

  setCache(`${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${uid}`, state);
  refresh();
};

/**
 * Server action to apply component updates (fields, params) received from Design Library.
 * In variant generation mode the generated component is resolved on the server from the Sitecore Edge authoring cache
 * using the provided cache reference - generated code is never accepted from the client.
 * @param {ComponentUpdateModel} updatedComponent - The component update model containing the UID, updated rendering and optional generated component cache reference.
 * @returns A Promise that resolves when the cache has been updated.
 */
export async function updateComponentAction(updatedComponent: ComponentUpdateModel): Promise<void> {
  await assertEditingSecretAuthorized();
  const { uid, rendering, cache } = updatedComponent;
  debug.editing(`Updating server component cache for Update Component: ${uid}`);
  await storeRenderState(uid, rendering, cache);
}

/**
 * Server action to preview a generated component in variant generation mode.
 * The generated component data is always fetched from the secured Sitecore Edge cache endpoint via the provided event arguments.
 * @param {PreviewEventModel} previewEvent - The preview event model containing the UID and the preview event arguments with cache information to fetch the generated component data.
 * @param {ComponentRendering} rendering - The component rendering data to use when rendering server side.
 * @returns A Promise that resolves when the cache has been updated.
 */
export async function previewComponentAction(
  previewEvent: PreviewEventModel,
  rendering: ComponentRendering | null
): Promise<void> {
  await assertEditingSecretAuthorized();
  const { uid, args } = previewEvent;
  debug.editing(`Updating server component cache for Preview Component: ${uid}`);

  const cache = args?.message?.cache;
  if (!cache) {
    debug.editing(`No preview event arguments provided for Component: ${uid}`);
    setCache(`${COMPONENT_UPDATE_CACHE_KEY_PREFIX}${uid}`, {
      uid,
      error: 'No preview event arguments provided',
    } as ComponentRenderState);
    refresh();
    return;
  }

  await storeRenderState(uid, rendering, cache);
}
