import React, { ComponentType } from 'react';
import { resetEditorChromes } from '..';

/**
 * HOC to inject editor chromes reset on component update.
 * @param {React.ComponentClass<unknown> | React.FC<unknown>} WrappedComponent - The component to wrap.
 * @public
 */
export const withEditorChromes = (
  WrappedComponent: React.ComponentClass<unknown> | React.FC<unknown>
) => {
  class Enhancer extends React.Component<unknown> {
    displayName: string =
      (WrappedComponent as ComponentType).displayName || WrappedComponent.name || 'Component';

    componentDidUpdate() {
      resetEditorChromes();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Enhancer as React.ComponentClass;
};
