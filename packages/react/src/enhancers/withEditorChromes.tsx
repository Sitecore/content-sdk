import React, { ComponentType, useEffect, useRef } from 'react';
import { resetEditorChromes } from '..';

/**
 * HOC to inject editor chromes reset on component update.
 * @param {React.ComponentClass<unknown> | React.FC<unknown>} WrappedComponent - The component to wrap.
 * @public
 */
export const withEditorChromes = (
  WrappedComponent: React.ComponentClass<unknown> | React.FC<unknown>
) => {
  const Enhancer = (props: Record<string, unknown>) => {
    const isFirstRender = useRef(true);
    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      // only reset chromes on subsequent re-renders
      resetEditorChromes();
    });

    return <WrappedComponent {...props} />;
  };

  Enhancer.displayName =
    (WrappedComponent as ComponentType).displayName ||
    (WrappedComponent as ComponentType).name ||
    'Component';

  return Enhancer;
};
