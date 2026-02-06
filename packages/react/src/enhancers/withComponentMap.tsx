'use client';
import React, { JSX } from 'react';
import { ComponentMapReactContext } from '../components/SitecoreProvider';
import { useContext } from 'react';
import { ComponentMap } from '../components/sharedTypes';

export interface WithComponentMapProps {
  componentMap?: ComponentMap;
}

/**
 * @param {React.ComponentClass<T> | React.FC<T>} Component
 */
export function withComponentMap<T extends WithComponentMapProps>(
  Component: React.ComponentClass<T> | React.FC<T>
) {
  /**
   * @param {T} props - props to pass to the wrapped component
   * @returns {JSX.Element} - the rendered component
   */
  function WithComponentMap(props: T): JSX.Element {
    const contextComponentMap = useComponentMap();

    return <Component {...props} componentMap={props.componentMap || contextComponentMap} />;
  }

  WithComponentMap.displayName = `withComponentMap(${
    Component.displayName || Component.name || 'Anonymous'
  })`;

  return WithComponentMap;
}

/**
 * Hook to access the component map in client context.
 * @returns {ComponentMap} The component map from the SitecoreProvider
 * @public
 */
export function useComponentMap(): ComponentMap {
  const componentMap = useContext(ComponentMapReactContext);
  return componentMap;
}
