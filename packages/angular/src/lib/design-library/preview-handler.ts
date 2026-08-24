import type { Type } from '@angular/core';
import { validateEvent } from '@sitecore-content-sdk/content/editing';
import {
  DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME,
  DesignLibraryPreviewError,
  addStyleElement,
  sendErrorEvent,
  type GeneratedComponentData,
  type ImportEntry,
} from '@sitecore-content-sdk/content/codegen';
import type { DesignLibraryComponentFactory } from './component-factory';

/**
 * Angular counterpart of Content SDK's `addComponentPreviewHandler`
 * (packages/content/src/editing/codegen/preview.ts).
 *
 * The shared handler is reused for everything framework-agnostic — the wire protocol is not
 * re-declared here: the `component:generation:component-preview` event name and origin/name
 * validation come from `@sitecore-content-sdk/content` (`DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME`,
 * `validateEvent`), style injection reuses `addStyleElement`, and preview failures are reported with
 * the shared `sendErrorEvent`. The **only** override (principle 3) is the build step: the shared
 * handler's `createComponentInstance` yields a non-Angular element, so here the generated source is
 * compiled into an Angular component class via the injected {@link DesignLibraryComponentFactory}.
 * @param {ImportEntry[]} importMap - module registry used to resolve the generated component's imports.
 * @param {DesignLibraryComponentFactory} factory - compiles the payload source into a renderable class.
 * @param {(error: unknown | null, component: Type<unknown> | null) => void} callback - invoked with the
 * compiled component on success, or the error on failure (the error event is already sent to Studio).
 * @returns {(() => void) | undefined} unsubscribe function, or `undefined` outside the browser.
 * @public
 */
export function addAngularComponentPreviewHandler(
  importMap: ImportEntry[],
  factory: DesignLibraryComponentFactory,
  callback: (error: unknown | null, component: Type<unknown> | null) => void
): (() => void) | undefined {
  if (typeof window === 'undefined') return;

  const handler = async (e: MessageEvent) => {
    if (!validateEvent(e, DESIGN_LIBRARY_COMPONENT_PREVIEW_EVENT_NAME)) {
      return;
    }

    console.debug('Component Library: message received', e.data);

    const message = (e.data as { message: GeneratedComponentData }).message;

    try {
      // Override of the shared `createComponentInstance`: compile Angular source instead.
      const component = await factory.compile(message.code.content, importMap);
      if (message.styles?.content) {
        addStyleElement(message.styles.content);
      }
      callback(null, component);
    } catch (error) {
      // Mirror the shared handler: report the failure to Studio so it can regenerate.
      sendErrorEvent(message.uid, error, DesignLibraryPreviewError.RenderInit);
      callback(error, null);
    }
  };

  window.addEventListener('message', handler);

  return () => window.removeEventListener('message', handler);
}
