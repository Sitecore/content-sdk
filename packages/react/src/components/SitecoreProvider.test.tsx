import React, { FC } from 'react';
import { expect } from 'chai';
import { SitecoreProvider } from './SitecoreProvider';
import { WithSitecoreProps, withSitecore, useSitecore } from '../enhancers/withSitecore';
import { LayoutServiceData } from '../index';
import { render } from '@testing-library/react';

describe('SitecoreProvider', () => {
  let nestedContext = {};

  interface NestedComponentProps extends WithSitecoreProps {
    anotherProperty?: string;
  }

  const NestedComponent: FC<NestedComponentProps> = () => {
    const { pageContext } = useSitecore();
    nestedContext = pageContext;
    return null;
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

  it('sets default context when no layoutData is supplied', () => {
    render(
      <SitecoreProvider api={apiStub} componentMap={components}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal({ pageEditing: false });
  });

  it('updates state when new layoutData is received via props', () => {
    const rendered = render(
      <SitecoreProvider api={apiStub} componentMap={components}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal({ pageEditing: false });

    rendered.rerender(
      <SitecoreProvider api={apiStub} componentMap={components} layoutData={mockLayoutData}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).to.deep.equal({
      pageEditing: false,
      itemId: 'testitemid',
      language: 'en',
      route: {
        itemId: 'testitemid',
        name: 'styleguide',
        placeholders: { 'ContentSdkTestWeb-main': [] },
      },
      site: { name: 'ContentSdkTestWeb' },
    });
  });
});
