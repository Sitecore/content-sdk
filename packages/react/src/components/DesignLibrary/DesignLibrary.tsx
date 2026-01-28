'use client';
/* eslint-disable jsdoc/require-param */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import {
  EDITING_COMPONENT_ID,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/content/layout';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/content/editing';
import * as codegen from '@sitecore-content-sdk/content/codegen';
import * as editing from '@sitecore-content-sdk/content/editing';
import { useSitecore } from '../../enhancers/withSitecore';
import { Placeholder, PlaceholderMetadata } from '../Placeholder';
import { DesignLibraryErrorBoundary } from './DesignLibraryErrorBoundary';
import { DesignLibraryProps, DynamicComponent } from './models';
import { withLoadImportMap } from '../../enhancers/withLoadImportMap';
import { ErrorComponent } from '../ErrorBoundary';

let {
  getDesignLibraryImportMapEvent,
  getDesignLibraryComponentPropsEvent,
  addComponentPreviewHandler,
  sendErrorEvent,
} = codegen;
let { postToDesignLibrary } = editing;

export const __mockDependencies = (mocks: any) => {
  addComponentPreviewHandler = mocks.addComponentPreviewHandler;
  if (mocks.postToDesignLibrary) {
    postToDesignLibrary = mocks.postToDesignLibrary;
  }
  if (mocks.sendErrorEvent) {
    sendErrorEvent = mocks.sendErrorEvent;
  }
};

/**
 * Design Library component.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
 * wires the **variant generation** handshake so the parent (DL Studio) can send
 * generated code to preview and iterate on.
 * @param {DesignLibraryProps} props
 * @param {() => Promise} [props.loadImportMap] Optional async loader that resolves to the import-map used to resolve the generated component’s imports. Required when `isVariantGeneration` is true.
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 * @public
 */
export const DesignLibrary = withLoadImportMap(({ loadImportMap }: DesignLibraryProps) => {
  const { page } = useSitecore();
  const route = page.layout.sitecore.route;
  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];
  const uid = rendering?.uid;

  const { isDesignLibrary } = page.mode;
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;

  const [propsState, setPropsState] = useState({
    fields: rendering?.fields,
    params: rendering?.params,
  });
  const [renderKey, setRenderKey] = useState(0);
  const [Component, setComponent] = useState<DynamicComponent | null>(null);
  const isGeneratedComponentActive = !!Component;

  if (!isDesignLibrary) return null;

  if (!uid) return <ErrorComponent message="Rendering UID is missing in the rendering data" />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    postToDesignLibrary(getDesignLibraryStatusEvent(DesignLibraryStatus.READY, uid));

    if (!isVariantGeneration) {
      requestAnimationFrame(() => {
        setRenderKey((k) => (k === 0 ? k + 1 : k));
      });
    }

    const unsubUpdate = addComponentUpdateHandler(rendering, (updated) => {
      setPropsState({ fields: updated.fields, params: updated.params });
      setRenderKey((k) => k + 1);
    });

    // useEffect will cleanup event handler on re-render
    return () => unsubUpdate && unsubUpdate();
  }, [isVariantGeneration, rendering, uid]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Send a rendered event only as effect of a component update command
    if (renderKey === 0) return;

    postToDesignLibrary(getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, uid));
  }, [renderKey, uid]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isDesignLibrary || !isVariantGeneration) return;

    let cancelled = false;
    // since import map is loaded lazily, we only need to add preview event handler once the import map is loaded
    // unsubscribe function for useEffect cleanup will also be returned once importMap promise has been resolved or rejected
    let unsubscribe: (() => void) | undefined;

    (async () => {
      if (!loadImportMap) {
        sendErrorEvent(
          uid,
          'No loadImportMap provided',
          codegen.DesignLibraryPreviewError.RenderInit
        );
        return;
      }

      let importMap: codegen.ImportEntry[];
      try {
        const mod = await loadImportMap();
        importMap = mod.default;
      } catch (e) {
        sendErrorEvent(
          uid,
          `Error loading import map: ${e}`,
          codegen.DesignLibraryPreviewError.RenderInit
        );
        return;
      }
      // account for component being unmounted while resolving async import map
      if (cancelled) return;

      unsubscribe = addComponentPreviewHandler(importMap, (error, Component) => {
        // Error event is already sent in the addComponentPreviewHandler
        if (error) return;
        setComponent(() => Component as DynamicComponent);
        setRenderKey((k) => k + 1);
      });

      const importMapEvent = getDesignLibraryImportMapEvent(uid, importMap);
      postToDesignLibrary(importMapEvent);

      const propsEvent = getDesignLibraryComponentPropsEvent(
        uid,
        propsState.fields,
        propsState.params
      );
      postToDesignLibrary(propsEvent);
    })();

    // return function that calls unsubscribe - if the component was mounted correctly
    return () => {
      cancelled = true;
      unsubscribe && unsubscribe();
    };
  }, [isVariantGeneration, uid]);

  return (
    <main>
      {isGeneratedComponentActive ? (
        <DesignLibraryErrorBoundary uid={uid} renderKey={renderKey}>
          <PlaceholderMetadata rendering={rendering}>
            <Component fields={propsState.fields} params={propsState.params} key={renderKey} />
          </PlaceholderMetadata>
        </DesignLibraryErrorBoundary>
      ) : (
        <div id={EDITING_COMPONENT_ID}>
          {route && (
            <Placeholder name={EDITING_COMPONENT_PLACEHOLDER} rendering={route} key={renderKey} />
          )}
        </div>
      )}
    </main>
  );
});
