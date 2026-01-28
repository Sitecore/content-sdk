/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React, { FC } from 'react';
import { expect } from 'chai';
import { Page } from '@sitecore-content-sdk/content/client';
import { SitecoreProvider } from './SitecoreProvider';
import { WithSitecoreProps, withSitecore, useSitecore } from '../enhancers/withSitecore';
import { LayoutServiceData, LayoutServicePageState } from '../index';
import { render } from '@testing-library/react';

describe('SitecoreProvider', () => {
  let nestedContext = {};

  interface NestedComponentProps extends WithSitecoreProps {
    anotherProperty?: string;
  }

  const NestedComponent: FC<NestedComponentProps> = () => {
    const { page } = useSitecore();
    nestedContext = page;
    return <span>Page mode is {page.mode.name}</span>;
  };

  const NestedComponentWithContext = withSitecore()(NestedComponent);
  const components = new Map();

  // minimal API stub – details don’t matter for these tests
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
      <SitecoreProvider api={apiStub} componentMap={components} page={mockPage}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal(mockPage);
    expect(rendered.getByText('Page mode is normal')).to.exist;
  });

  it('updates state when new page is received via props', () => {
    const rendered = render(
      <SitecoreProvider api={apiStub} componentMap={components} page={mockPage}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal(mockPage);

    const newMockPage: Page = {
      ...mockPage,
      locale: 'gr',
    };

    rendered.rerender(
      <SitecoreProvider api={apiStub} componentMap={components} page={newMockPage}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal({
      ...mockPage,
      locale: 'gr',
    });
  });
});
