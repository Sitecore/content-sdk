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

type ErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey: number;
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
    const errorEvent = codegen.getDesignLibraryComponentPreviewErrorEvent(
      this.props.uid,
      error,
      codegen.DesignLibraryPreviewError.Render
    );

    console.debug('Component Library: sending error event', errorEvent);

    window.top.postMessage(errorEvent, '*');
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
  const [initError, setInitError] = useState<boolean>(false);
  const [importMapError, setImportMapError] = useState<boolean>(false);
  const [Component, setComponent] = useState<DynamicComponent>(null);

  if (!rendering) {
    return <div>No component found in layout data. Please check your layout data.</div>;
  }

  useEffect(() => {
    let cancelled = false;
    // since import map is loaded lazily, we only need to add preview event handler once the import map is loaded
    // unsubscribe function for useEffect cleanup will also be returned once importMap promise has been resolved or rejected
    let unsubscribe: (() => void) | undefined = undefined;

    const init = async () => {
      let importMap: codegen.ImportEntry[] = undefined;
      if (!props.loadImportMap) {
        console.error(
          'No loadImportMap prop provided. Please provide a dynamic import map function for DesignLibrary.'
        );
        setImportMapError(true);
        return;
      }
      try {
        const importMapImport = await props.loadImportMap();
        importMap = importMapImport.default;
      } catch (error) {
        console.error('Error loading import map:', error);
        setImportMapError(true);
        return;
      }
      // account for component being unmounted while resolving async import map
      if (cancelled) return;

      unsubscribe = addComponentPreviewHandler(importMap, (error, Component) => {
        setRenderKey((key) => key + 1);
        if (error) {
          setInitError(true);

          return;
        }
        setInitError(false);
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

  if (importMapError) {
    return (
      <div>
        No dynamic import map loaded. Please check a dynamic import map function is passed into
        Design Library
      </div>
    );
  }

  if (initError) {
    return <div key={renderKey}>Error during component initialization</div>;
  }

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
