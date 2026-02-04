/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import { expect, use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import { render } from '@testing-library/react';
import { withLoadImportMap, WithLoadImportMapProps, useLoadImportMap } from './withLoadImportMap';
import { ImportMapReactContext } from '../components/SitecoreProvider';
import { ImportMapImport } from '../components/DesignLibrary/models';

use(sinonChai);

describe('withLoadImportMap', () => {
  const mockImportMapData: ImportMapImport = {
    default: [
      {
        module: 'react',
        exports: [
          { name: 'default', value: {} },
          { name: 'useState', value: {} },
        ],
      },
    ],
  };

  const TestComponent = spy(({ loadImportMap }: WithLoadImportMapProps) => (
    <div data-testid="test-component">
      {loadImportMap ? 'loadImportMap provided' : 'no loadImportMap'}
    </div>
  ));

  it('should render component and pass loadImportMap from HOC props', async () => {
    const loadImportMapProp = spy(() => Promise.resolve(mockImportMapData));

    const WrappedComponent = withLoadImportMap(TestComponent);

    const { getByTestId } = render(<WrappedComponent loadImportMap={loadImportMapProp} />);

    expect(TestComponent).to.have.been.calledWithMatch({ loadImportMap: loadImportMapProp });
    expect(getByTestId('test-component')).to.exist;
    expect(getByTestId('test-component').textContent).to.equal('loadImportMap provided');
  });

  it('should render component and use loadImportMap from context as fallback', async () => {
    const contextLoadImportMap = spy(() => Promise.resolve(mockImportMapData));

    const WrappedComponent = withLoadImportMap(TestComponent);

    const { getByTestId } = render(
      <ImportMapReactContext.Provider value={contextLoadImportMap}>
        <WrappedComponent />
      </ImportMapReactContext.Provider>
    );

    expect(TestComponent).to.have.been.calledWithMatch({ loadImportMap: contextLoadImportMap });
    expect(getByTestId('test-component')).to.exist;
    expect(getByTestId('test-component').textContent).to.equal('loadImportMap provided');
  });

  it('should prioritize prop loadImportMap over context loadImportMap', async () => {
    const propLoadImportMap = spy(() => Promise.resolve(mockImportMapData));
    const contextLoadImportMap = spy(() =>
      Promise.resolve({ default: [{ module: 'context-module', exports: [] }] })
    );

    const WrappedComponent = withLoadImportMap(TestComponent);

    render(
      <ImportMapReactContext.Provider value={contextLoadImportMap}>
        <WrappedComponent loadImportMap={propLoadImportMap} />
      </ImportMapReactContext.Provider>
    );

    expect(TestComponent).to.have.been.calledWithMatch({ loadImportMap: propLoadImportMap });
    expect(TestComponent).to.not.have.been.calledWithMatch({
      loadImportMap: contextLoadImportMap,
    });
  });

  it('should render without loadImportMap when neither prop nor context provides it', () => {
    const WrappedComponent = withLoadImportMap(TestComponent);

    const { getByTestId } = render(<WrappedComponent />);

    expect(TestComponent).to.have.been.calledWithMatch({ loadImportMap: undefined });
    expect(getByTestId('test-component').textContent).to.equal('no loadImportMap');
  });

  it('should handle loadImportMap function being called', async () => {
    const loadImportMapProp = spy(() => Promise.resolve(mockImportMapData));

    const TestComponent = ({ loadImportMap }: WithLoadImportMapProps) => {
      const [data, setData] = React.useState<string>('loading');

      React.useEffect(() => {
        if (loadImportMap) {
          loadImportMap().then(() => setData('loaded'));
        }
      }, [loadImportMap]);

      return <div data-testid="test-component">{data}</div>;
    };

    const WrappedComponent = withLoadImportMap(TestComponent);

    const { getByTestId, findByText } = render(
      <WrappedComponent loadImportMap={loadImportMapProp} />
    );

    expect(getByTestId('test-component').textContent).to.equal('loading');

    await findByText('loaded');

    expect(loadImportMapProp).to.have.been.calledOnce;
    expect(getByTestId('test-component').textContent).to.equal('loaded');
  });
});

describe('useLoadImportMap', () => {
  const mockImportMapData: ImportMapImport = {
    default: [
      {
        module: 'react',
        exports: [
          { name: 'default', value: {} },
          { name: 'useState', value: {} },
        ],
      },
    ],
  };

  const TestComponent = () => {
    const loadImportMap = useLoadImportMap();
    return (
      <div data-testid="test-hook">
        {loadImportMap ? 'loadImportMap available' : 'no loadImportMap'}
      </div>
    );
  };

  it('should return loadImportMap function from context', () => {
    const contextLoadImportMap = spy(() => Promise.resolve(mockImportMapData));

    const { getByTestId } = render(
      <ImportMapReactContext.Provider value={contextLoadImportMap}>
        <TestComponent />
      </ImportMapReactContext.Provider>
    );

    expect(getByTestId('test-hook').textContent).to.equal('loadImportMap available');
  });

  it('should return undefined when context is not provided', () => {
    const { getByTestId } = render(<TestComponent />);

    expect(getByTestId('test-hook').textContent).to.equal('no loadImportMap');
  });
});
