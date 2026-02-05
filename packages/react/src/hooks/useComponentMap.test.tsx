/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React, { FC } from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { useComponentMap } from './useComponentMap';
import { SitecoreProvider } from '../components/SitecoreProvider';
import { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';

describe('useComponentMap', () => {
  const TestComponent: FC = () => <div>Test Component</div>;
  const AnotherComponent: FC = () => <div>Another Component</div>;

  const componentMap = new Map();
  componentMap.set('TestComponent', TestComponent);
  componentMap.set('AnotherComponent', AnotherComponent);

  const mockPage: Page = {
    layout: {
      sitecore: {
        context: {
          pageEditing: false,
          site: { name: 'TestSite' },
          language: 'en',
        },
        route: {
          name: 'test',
          placeholders: {},
          itemId: 'testid',
        },
      },
    },
    locale: 'en',
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    },
  };

  const apiStub = {} as any;

  it('should return the component map from context', () => {
    let capturedComponentMap: any;

    const Consumer: FC = () => {
      capturedComponentMap = useComponentMap();
      return <div>Consumer</div>;
    };

    render(
      <SitecoreProvider api={apiStub} componentMap={componentMap} page={mockPage}>
        <Consumer />
      </SitecoreProvider>
    );

    expect(capturedComponentMap).to.equal(componentMap);
  });

  it('should allow retrieving components from the map', () => {
    let retrievedComponent: any;

    const Consumer: FC = () => {
      const map = useComponentMap();
      retrievedComponent = map.get('TestComponent');
      return <div>Consumer</div>;
    };

    render(
      <SitecoreProvider api={apiStub} componentMap={componentMap} page={mockPage}>
        <Consumer />
      </SitecoreProvider>
    );

    expect(retrievedComponent).to.equal(TestComponent);
  });

  it('should return undefined for non-existent components', () => {
    let retrievedComponent: any;

    const Consumer: FC = () => {
      const map = useComponentMap();
      retrievedComponent = map.get('NonExistentComponent');
      return <div>Consumer</div>;
    };

    render(
      <SitecoreProvider api={apiStub} componentMap={componentMap} page={mockPage}>
        <Consumer />
      </SitecoreProvider>
    );

    expect(retrievedComponent).to.be.undefined;
  });

  it('should work with multiple components in the map', () => {
    let testComp: any;
    let anotherComp: any;

    const Consumer: FC = () => {
      const map = useComponentMap();
      testComp = map.get('TestComponent');
      anotherComp = map.get('AnotherComponent');
      return <div>Consumer</div>;
    };

    render(
      <SitecoreProvider api={apiStub} componentMap={componentMap} page={mockPage}>
        <Consumer />
      </SitecoreProvider>
    );

    expect(testComp).to.equal(TestComponent);
    expect(anotherComp).to.equal(AnotherComponent);
  });
});
