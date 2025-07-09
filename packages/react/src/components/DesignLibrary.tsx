/* eslint-disable prefer-const */

import React, { useEffect, useMemo, useState, JSX } from 'react';
import { Placeholder } from './Placeholder';
import {
  ComponentFields,
  ComponentParams,
  EDITING_COMPONENT_ID,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/core/layout';
import * as editing from '@sitecore-content-sdk/core/editing';
import { useSitecore } from '../enhancers/withSitecore';

let {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
  getDesignLibraryImportMapEvent,
  getDesignLibraryComponentPropsEvent,
  addComponentPreviewHandler,
} = editing;

export const __mockDependencies = (mocks: any) => {
  addComponentPreviewHandler = mocks.addComponentPreviewHandler;
};

/**
 * This component is used to render the component in preview mode.
 * It is used to send the rendered event to the parent window and render the component.
 * Reacts on the update event from the parent window and re-renders the component.
 */
const Preview = (): JSX.Element => {
  const { pageContext } = useSitecore();
  const { route } = pageContext;
  const [renderKey, setRenderKey] = useState(0);
  const [rootUpdate, setRootUpdate] = useState(null);
  const rootComponent = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER][0];
  // useEffect may execute multiple times on single render (i.e. in dev) - but we only want to fire ready event once
  let componentReady = false;

  // have an up-to-date layout state between re-renders (SSR re-render excluded)
  const persistedRoot = useMemo(() => ({ ...(rootComponent || {}), ...rootUpdate }), [
    rootComponent,
    rootUpdate,
  ]);
  route.placeholders[EDITING_COMPONENT_PLACEHOLDER][0] = persistedRoot;

  useEffect(() => {
    // useEffect will fire when components are ready - and we inform the whole wide world of it too
    if (!componentReady) {
      componentReady = true;
      window.top.postMessage(
        getDesignLibraryStatusEvent(DesignLibraryStatus.READY, rootComponent.uid),
        '*'
      );
    }
    const unsubscribe = addComponentUpdateHandler(persistedRoot, (updatedRoot) => {
      setRootUpdate({ ...updatedRoot });
      setRenderKey((key) => key + 1);
    });
    // useEffect will cleanup event handler on re-render
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Send a rendered event only as effect of a component update command
    if (renderKey === 0) {
      return;
    }

    window.top.postMessage(
      getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, rootComponent.uid),
      '*'
    );
  }, [renderKey, rootComponent.uid]);

  return (
    <>
      <main>
        <div id={EDITING_COMPONENT_ID}>
          {route && (
            <Placeholder name={EDITING_COMPONENT_PLACEHOLDER} rendering={route} key={renderKey} />
          )}
        </div>
      </main>
    </>
  );
};

type DynamicComponent = React.ComponentType<{
  [key: string]: unknown;
  fields: ComponentFields;
  params: ComponentParams;
}>;

/**
 * This component is used to render the component in variant generation mode.
 * It is used to send the import-map and component-props events to the parent window and render the dynamic component.
 */
export const VariantGeneration = () => {
  const { pageContext } = useSitecore();
  const rendering = pageContext.route?.placeholders[EDITING_COMPONENT_PLACEHOLDER][0];
  const [Component, setComponent] = React.useState<DynamicComponent>(null);

  useEffect(() => {
    if (!rendering) {
      return () => {};
    }

    const unsubscribe = addComponentPreviewHandler((Component) => {
      setComponent(() => Component as DynamicComponent);
    });

    const importMap: editing.ImportEntry[] = [];

    const importMapEvent = getDesignLibraryImportMapEvent(rendering.uid, importMap);

    console.debug('Component Library: sending import-map event', importMapEvent);

    window.top.postMessage(importMapEvent, '*');

    const componentPropsEvent = getDesignLibraryComponentPropsEvent(
      rendering.uid,
      rendering.fields,
      rendering.params
    );

    console.debug('Component Library: sending component-props event', componentPropsEvent);

    window.top.postMessage(componentPropsEvent, '*');

    return unsubscribe;
  }, []);

  if (!rendering) {
    return <div>No component found in layout data. Please check your layout data.</div>;
  }

  return Component ? (
    <div>
      <Component fields={rendering.fields} params={rendering.params} />
    </div>
  ) : (
    <div>Loading preview...</div>
  );
};

export const DesignLibrary = (): JSX.Element => {
  const { pageContext } = useSitecore();
  const { isDesignLibrary } = pageContext.mode;
  const isVariantGeneration = pageContext.mode.designLibrary?.isVariantGeneration;

  if (!isDesignLibrary) {
    return null;
  }

  if (isVariantGeneration) {
    return <VariantGeneration />;
  }

  return <Preview />;
};
