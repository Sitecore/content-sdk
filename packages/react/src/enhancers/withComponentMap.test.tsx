/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect, use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { render } from '@testing-library/react';
import { withComponentMap } from './withComponentMap';
import { ComponentMapReactContext } from '../components/SitecoreContext';

use(sinonChai);

describe('withComponentMap', () => {
  it('should render component and pass componentMap from HOC props', () => {
    const TestComponent = spy(({ componentMap }: { componentMap: any }) => (
      <div>{JSON.stringify(componentMap)}</div>
    ));
    const WrappedComponent = withComponentMap(TestComponent);

    const componentMapProp = { key: 'value' };
    const { getByText } = render(<WrappedComponent componentMap={componentMapProp} />);

    expect(TestComponent).to.have.been.calledWithMatch({ componentMap: componentMapProp });
    expect(getByText(JSON.stringify(componentMapProp))).to.exist;
  });

  it('should render component and use componentMap from context as fallback', () => {
    const TestComponent = spy(({ componentMap }: { componentMap: any }) => (
      <div>{JSON.stringify(componentMap)}</div>
    ));
    const WrappedComponent = withComponentMap(TestComponent);

    const contextValue = { fallbackKey: 'fallbackValue' };
    const { getByText } = render(
      <ComponentMapReactContext.Provider value={contextValue}>
        <WrappedComponent />
      </ComponentMapReactContext.Provider>
    );

    expect(TestComponent).to.have.been.calledWithMatch({ componentMap: contextValue });
    expect(getByText(JSON.stringify(contextValue))).to.exist;
  });
});
