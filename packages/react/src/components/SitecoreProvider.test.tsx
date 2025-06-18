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

  const NestedComponent: FC<NestedComponentProps> = (props: NestedComponentProps) => {
    const { pageContext } = useSitecore();

    nestedContext = pageContext;

    <div>{props.pageContext && 'test'}</div>;
  };

  const NestedComponentWithContext = withSitecore()(NestedComponent);

  const components = new Map();

  const mockLayoutData: LayoutServiceData = {
    sitecore: {
      context: {
        pageEditing: false,
        site: {
          name: 'JssTestWeb',
        },
        language: 'en',
      },
      route: {
        name: 'styleguide',
        placeholders: {
          'ContentSdkTestWeb-main': [],
        },
        itemId: 'testitemid',
      },
    },
  };

  it('should set default context', () => {
    render(
      <SitecoreProvider componentMap={components}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).deep.equal({
      pageEditing: false,
    });
  });

  it('should update state when new context as prop received', () => {
    const component = render(
      <SitecoreProvider componentMap={components}>
        <NestedComponentWithContext />
      </SitecoreProvider>
    );

    expect(nestedContext).deep.equal({
      pageEditing: false,
    });

    component.rerender(
      <SitecoreProvider componentMap={components} layoutData={mockLayoutData}>
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
        placeholders: {
          'ContentSdkTestWeb-main': [],
        },
      },
      site: {
        name: 'JssTestWeb',
      },
    });
  });
});
