import React from 'react';
import { ComponentMapReactContext } from '../components/SitecoreContext';
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
    const context = useContext(ComponentMapReactContext);

    return <Component {...props} componentMap={props.componentMap || context} />;
  }

  WithComponentMap.displayName = `withComponentMap(${Component.displayName ||
    Component.name ||
    'Anonymous'})`;

  return WithComponentMap;
}
