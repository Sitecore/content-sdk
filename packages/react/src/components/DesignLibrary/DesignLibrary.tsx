'use client';
/* eslint-disable jsdoc/require-param */
/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import {
  EDITING_COMPONENT_ID,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/core/layout';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/core/editing';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { useSitecore } from '../../enhancers/withSitecore';
import { Placeholder, PlaceholderMetadata } from '../Placeholder';
import { postToDL, sendErrorEvent } from './design-library-utils';
import { ErrorBoundary } from './ErrorBoundary';
import { DesignLibraryProps, DynamicComponent } from './models';

let {
  getDesignLibraryImportMapEvent,
  getDesignLibraryComponentPropsEvent,
  addComponentPreviewHandler,
} = codegen;

export const __mockDependencies = (mocks: any) => {
  addComponentPreviewHandler = mocks.addComponentPreviewHandler;
};

/**
 * Design Library component.
 *
 * Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
 * when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
 * wires the **variant generation** handshake so the parent (DL Studio) can send
 * generated code to preview and iterate on.
 * @param {DesignLibraryProps} props
 * @param {() => Promise<{ default: import('../codegen').ImportEntry[] }>} [props.loadImportMap] Optional async loader that resolves to the import-map used to resolve the generated component’s imports. Required when `isVariantGeneration` is true.
 * @returns {JSX.Element} The preview surface, or `null` when not in Design Library mode.
 */
export const DesignLibrary = ({ loadImportMap }: DesignLibraryProps) => {
  const { page } = useSitecore();
  const route = page.layout.sitecore.route;
  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    postToDL(getDesignLibraryStatusEvent(DesignLibraryStatus.READY, rendering.uid));

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
  }, [isVariantGeneration, rendering]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Send a rendered event only as effect of a component update command
    if (renderKey === 0) return;

    postToDL(getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, rendering.uid));
  }, [renderKey, rendering]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!isDesignLibrary || !isVariantGeneration) return undefined;

    let cancelled = false;
    // since import map is loaded lazily, we only need to add preview event handler once the import map is loaded
    // unsubscribe function for useEffect cleanup will also be returned once importMap promise has been resolved or rejected
    let unsubscribe: (() => void) | undefined;

    (async () => {
      if (!loadImportMap) {
        sendErrorEvent(
          rendering.uid,
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
          rendering.uid,
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

      const importMapEvent = getDesignLibraryImportMapEvent(rendering.uid, importMap);
      postToDL(importMapEvent);

      const propsEvent = getDesignLibraryComponentPropsEvent(
        rendering.uid,
        propsState.fields,
        propsState.params
      );
      postToDL(propsEvent);
    })();

    // return function that calls unsubscribe - if the component was mounted correctly
    return () => {
      cancelled = true;
      unsubscribe && unsubscribe();
    };
  }, [isVariantGeneration, rendering]);

  return (
    <main>
      {isGeneratedComponentActive ? (
        <ErrorBoundary uid={rendering.uid} renderKey={renderKey}>
          <PlaceholderMetadata rendering={rendering}>
            <Component fields={propsState.fields} params={propsState.params} key={renderKey} />
          </PlaceholderMetadata>
        </ErrorBoundary>
      ) : (
        <div id={EDITING_COMPONENT_ID}>
          {route && (
            <Placeholder name={EDITING_COMPONENT_PLACEHOLDER} rendering={route} key={renderKey} />
          )}
        </div>
      )}
    </main>
  );
};
