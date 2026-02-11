'use client';
import React, { useContext, JSX } from 'react';
import { ImportMapReactContext } from '../components/SitecoreProvider';
import { ImportMapImport } from '../components/DesignLibrary/models';

/**
 * Props that include the loadImportMap function from context.
 */
export interface WithLoadImportMapProps {
  /**
   * The dynamic import for import map to be used in variant generation mode.
   */
  loadImportMap?: () => Promise<ImportMapImport>;
}

/**
 * Hook that retrieves the loadImportMap function from context.
 * @returns {() => Promise<ImportMapImport> | undefined} The loadImportMap function from context, or undefined if not available.
 * @public
 */
export function useLoadImportMap(): (() => Promise<ImportMapImport>) | undefined {
  return useContext(ImportMapReactContext);
}

/**
 * Higher-order component that injects the loadImportMap function from context into component props.
 * If the component already receives loadImportMap via props, the prop value takes precedence.
 * @param {React.ComponentClass<T> | React.FC<T>} Component - The component to enhance.
 * @returns {React.ComponentClass<T> | React.FC<T>} The enhanced component with loadImportMap injected.
 */
export function withLoadImportMap<T extends WithLoadImportMapProps>(
  Component: React.ComponentClass<T> | React.FC<T>
) {
  const WithLoadImportMap = (props: T): JSX.Element => {
    const loadImportMapContext = useLoadImportMap();
    const loadClientImportMap = props.loadImportMap || loadImportMapContext;
    return <Component {...props} loadImportMap={loadClientImportMap} />;
  };

  WithLoadImportMap.displayName = `withLoadImportMap(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WithLoadImportMap;
}
