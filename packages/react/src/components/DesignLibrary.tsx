'use client';
/* eslint-disable jsdoc/require-param */
/* eslint-disable prefer-const */
import React, { useEffect, useMemo, useState, JSX } from 'react';
import { Placeholder } from './Placeholder';
import {
  ComponentFields,
  ComponentParams,
  EDITING_COMPONENT_ID,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/core/layout';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  addComponentUpdateHandler,
} from '@sitecore-content-sdk/core/editing';
import * as codegen from '@sitecore-content-sdk/core/codegen';
import { useSitecore } from '../enhancers/withSitecore';

let {
  getDesignLibraryImportMapEvent,
  getDesignLibraryComponentPropsEvent,
  addComponentPreviewHandler,
} = codegen;

export const __mockDependencies = (mocks: any) => {
  addComponentPreviewHandler = mocks.addComponentPreviewHandler;
};

export type ImportMapImport = {
  default: codegen.ImportEntry[];
};

/**
 * This component is used to render the component in preview mode.
 * It is used to send the rendered event to the parent window and render the component.
 * Reacts on the update event from the parent window and re-renders the component.
 */
const Preview = (): JSX.Element => {
  const { page } = useSitecore();
  const {
    layout: {
      sitecore: { route },
    },
  } = page;
  const [renderKey, setRenderKey] = useState(0);
  const [rootUpdate, setRootUpdate] = useState(null);
  const rootComponent = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER][0];
  // useEffect may execute multiple times on single render (i.e. in dev) - but we only want to fire ready event once
  let componentReady = false;

  // have an up-to-date layout state between re-renders (SSR re-render excluded)
  const persistedRoot = useMemo(
    () => ({ ...(rootComponent || {}), ...rootUpdate }),
    [rootComponent, rootUpdate]
  );
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

type ErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey: number;
};

const sendErrorEvent = (uid: string, error: unknown, type: codegen.DesignLibraryPreviewError) => {
  const errorEvent = codegen.getDesignLibraryComponentPreviewErrorEvent(uid, error, type);

  console.error('Component Library: sending error event', errorEvent);

  window.top.postMessage(errorEvent, '*');
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.renderKey !== this.props.renderKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    sendErrorEvent(this.props.uid, error, codegen.DesignLibraryPreviewError.Render);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error during component rendering</div>;
    }

    return this.props.children;
  }
}

type VariantGenerationProps = {
  /**
   * The import map to be used in variant generation mode.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
};

/**
 * This component is used to render the component in variant generation mode.
 * It is used to send the import-map and component-props events to the parent window and render the dynamic component.
 */
export const VariantGeneration = (props: VariantGenerationProps) => {
  const { page } = useSitecore();
  const {
    layout: {
      sitecore: { route },
    },
  } = page;
  const rendering = route?.placeholders[EDITING_COMPONENT_PLACEHOLDER][0];
  const [renderKey, setRenderKey] = useState(0);
  const [Component, setComponent] = useState<DynamicComponent | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    let cancelled = false;
    // since import map is loaded lazily, we only need to add preview event handler once the import map is loaded
    // unsubscribe function for useEffect cleanup will also be returned once importMap promise has been resolved or rejected
    let unsubscribe: (() => void) | undefined = undefined;

    const init = async () => {
      let importMap: codegen.ImportEntry[] = undefined;
      if (!props.loadImportMap) {
        const errorMessage =
          'No loadImportMap prop provided. Please provide a dynamic import map function for DesignLibrary.';
        sendErrorEvent(rendering.uid, errorMessage, codegen.DesignLibraryPreviewError.RenderInit);
        return;
      }
      try {
        const importMapImport = await props.loadImportMap();
        importMap = importMapImport.default;
      } catch (error) {
        const errorMessage = `Error loading import map: ${error}`;
        sendErrorEvent(rendering.uid, errorMessage, codegen.DesignLibraryPreviewError.RenderInit);
        return;
      }
      // account for component being unmounted while resolving async import map
      if (cancelled) return;

      unsubscribe = addComponentPreviewHandler(importMap, (error, Component) => {
        // Error event is already sent in the addComponentPreviewHandler
        if (error) {
          return;
        }

        setRenderKey((key) => key + 1);
        setComponent(() => Component as DynamicComponent);
      });

      const importMapEvent = getDesignLibraryImportMapEvent(rendering.uid, importMap);

      console.debug('Component Library: sending event', importMapEvent);

      window.parent.postMessage(importMapEvent, '*');

      const componentPropsEvent = getDesignLibraryComponentPropsEvent(
        rendering.uid,
        rendering.fields,
        rendering.params
      );

      console.debug('Component Library: sending event', componentPropsEvent);

      window.top.postMessage(componentPropsEvent, '*');

      const readyEvent = getDesignLibraryStatusEvent(DesignLibraryStatus.READY, rendering.uid);

      console.debug('Component Library: sending event', readyEvent);

      window.top?.postMessage(readyEvent, '*');
    };

    init();
    // return function that calls unsubsubribe - if the component was mounted correctly
    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // Send a rendered event only as effect of a component update command
    if (renderKey === 0) return undefined;

    const renderedEvent = getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, rendering.uid);

    console.debug('Component Library: sending event', renderedEvent);

    window.top?.postMessage(renderedEvent, '*');
  }, [renderKey, rendering?.uid]);

  return (
    <main>
      {Component ? (
        <ErrorBoundary uid={rendering.uid} renderKey={renderKey}>
          <Component fields={rendering.fields} params={rendering.params} key={renderKey} />
        </ErrorBoundary>
      ) : (
        <div>Loading preview...</div>
      )}
    </main>
  );
};

// @MAJOR-RELEASE-TODO - Make importMap required in next major version
type DesignLibraryProps = {
  /**
   * The dynamic import for import map to be used in variant generation mode.
   * Currently it's optional but it will be required in the next major version.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
};

export const DesignLibrary = ({ loadImportMap }: DesignLibraryProps): JSX.Element => {
  const { page } = useSitecore();
  const { isDesignLibrary } = page.mode;
  const isVariantGeneration = page.mode.designLibrary?.isVariantGeneration;

  if (!isDesignLibrary) {
    return null;
  }

  if (isVariantGeneration) {
    return <VariantGeneration loadImportMap={loadImportMap} />;
  }

  return <Preview />;
};
