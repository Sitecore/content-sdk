'use client';
import { useContext } from 'react';
import { ComponentMapReactContext } from '../components/SitecoreProvider';
import { ComponentMap } from '../components/sharedTypes';

/**
 * Hook to access the component map from the SitecoreProvider context.
 * This is a modern alternative to the withComponentMap HOC.
 *
 * @returns {ComponentMap} The component map from the nearest SitecoreProvider
 * @public
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const componentMap = useComponentMap();
 *   const Component = componentMap.get('MyComponentName');
 *   return Component ? <Component /> : null;
 * }
 * ```
 */
export function useComponentMap(): ComponentMap {
  const componentMap = useContext(ComponentMapReactContext);
  return componentMap;
}
