/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreProviderOptimized } from './SitecoreProviderOptimized';
import { useSitecore } from '../enhancers/withSitecore';
import { LayoutServiceData, LayoutServicePageState } from '../index';
import { render } from '@testing-library/react';

describe('SitecoreProviderOptimized', () => {
  let nestedContext = {};

  const NestedComponent = () => {
    const { page } = useSitecore();
    nestedContext = page;
    return <span>Page mode is {page.mode.name}</span>;
  };

  const components = new Map();

  // minimal API stub – details don't matter for these tests
  const apiStub = {} as any;

  const mockLayoutData: LayoutServiceData = {
    sitecore: {
      context: {
        pageEditing: false,
        site: { name: 'ContentSdkTestWeb' },
        language: 'en',
      },
      route: {
        name: 'styleguide',
        placeholders: { 'ContentSdkTestWeb-main': [] },
        itemId: 'testitemid',
      },
    },
  };

  const mockPage: Page = {
    layout: mockLayoutData,
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

  it('renders the component with the context', () => {
    const rendered = render(
      <SitecoreProviderOptimized api={apiStub} componentMap={components} page={mockPage}>
        <NestedComponent />
      </SitecoreProviderOptimized>
    );

    expect(nestedContext).to.deep.equal(mockPage);
    expect(rendered.getByText('Page mode is normal')).to.exist;
  });

  it('updates state when new page is received via props', () => {
    const rendered = render(
      <SitecoreProviderOptimized api={apiStub} componentMap={components} page={mockPage}>
        <NestedComponent />
      </SitecoreProviderOptimized>
    );

    expect(nestedContext).to.deep.equal(mockPage);

    const newMockPage: Page = {
      ...mockPage,
      locale: 'gr',
    };

    rendered.rerender(
      <SitecoreProviderOptimized api={apiStub} componentMap={components} page={newMockPage}>
        <NestedComponent />
      </SitecoreProviderOptimized>
    );

    expect(nestedContext).to.deep.equal({
      ...mockPage,
      locale: 'gr',
    });
  });

  it('applies default edgeUrl when Edge IDs are present', () => {
    let capturedApi: any;

    const ApiConsumer: FC = () => {
      const { api } = useSitecore();
      capturedApi = api;
      return <div>API Consumer</div>;
    };

    const apiWithEdgeId = {
      edge: {
        contextId: 'test-context-id',
        clientContextId: 'test-client-id',
        // no edgeUrl provided
      },
    };

    render(
      <SitecoreProviderOptimized api={apiWithEdgeId} componentMap={components} page={mockPage}>
        <ApiConsumer />
      </SitecoreProviderOptimized>
    );

    expect(capturedApi.edge.edgeUrl).to.exist;
    expect(capturedApi.edge.edgeUrl).to.be.a('string');
  });
});
