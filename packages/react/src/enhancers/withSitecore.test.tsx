/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect, use } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { useSitecore, withSitecore, WithSitecoreProps } from '../enhancers/withSitecore';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';

use(sinonChai);

describe('withSitecore', () => {
  const setPage = spy();

  const testComponentProps: SitecoreProviderState = {
    page: {
      layout: {
        sitecore: {
          context: {},
          route: null,
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
    },
    api: {
      edge: {
        contextId: 'id',
        edgeUrl: 'url',
        clientContextId: 'clientId',
      },
      local: {
        apiKey: 'apiKey',
        apiHost: 'apiHost',
        path: 'path',
      },
    },
    setPage,
  };

  afterEach(() => {
    setPage.resetHistory();
  });

  it('withSitecore()', () => {
    const TestComponent: React.FC<any> = (props: WithSitecoreProps & { customProp: string }) => (
      <>
        <div onClick={props.updatePage}>
          {props.page.locale}
          {props.customProp}
        </div>
        <span>
          {props.api?.edge.contextId} {props.api?.edge.edgeUrl}
        </span>
      </>
    );

    let TestComponentWithContext: React.FC<any> = withSitecore()(TestComponent);

    let wrapper = render(
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponentWithContext customProp="xxx" />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.querySelector('span')?.textContent).equal('id url');
    expect(wrapper.container.querySelector('div')?.textContent).equal(
      testComponentProps.page.locale + 'xxx'
    );
    fireEvent.click(wrapper.container.querySelector('div') as Element);

    // eslint-disable-next-line no-unused-expressions
    expect(testComponentProps.setPage).not.to.be.called;

    TestComponentWithContext = withSitecore({ updatable: true })(TestComponent);

    wrapper = render(
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponentWithContext customProp="xxx" />
      </SitecoreProviderReactContext.Provider>
    );

    fireEvent.click(wrapper.container.querySelector('div') as Element);

    // eslint-disable-next-line no-unused-expressions
    expect(testComponentProps.setPage).to.have.been.called;
  });

  describe('useSitecore()', () => {
    it('context access', () => {
      const TestComponent: React.FC<any> = (props: any) => {
        const reactContext = useSitecore();
        const page = reactContext.page;

        return (
          <>
            <div onClick={reactContext.updatePage}>
              {page.locale}
              {props.customProp}
            </div>
            <span>
              {reactContext.api?.edge?.contextId} {reactContext.api?.edge?.edgeUrl}
            </span>
          </>
        );
      };

      const wrapper = render(
        <SitecoreProviderReactContext.Provider value={testComponentProps}>
          <TestComponent customProp="xxx" />
        </SitecoreProviderReactContext.Provider>
      );

      expect(wrapper.container.querySelector('div')?.textContent).equal(
        testComponentProps.page.locale + 'xxx'
      );
      expect(wrapper.container.querySelector('span')?.textContent).equal('id url');
      fireEvent.click(wrapper.container.querySelector('div') as Element);

      // eslint-disable-next-line no-unused-expressions
      expect(testComponentProps.setPage).to.not.have.been.called;
    });

    it('updatable', () => {
      const TestComponent: React.FC<any> = (props: any) => {
        const reactContext = useSitecore({ updatable: true });
        const context = reactContext.page;

        return (
          <div onClick={reactContext.updatePage}>
            {context.locale}
            {props.customProp}
          </div>
        );
      };

      const wrapper = render(
        <SitecoreProviderReactContext.Provider value={testComponentProps}>
          <TestComponent customProp="bbb" />
        </SitecoreProviderReactContext.Provider>
      );

      expect(wrapper.container.querySelector('div')?.textContent).equal(
        testComponentProps.page.locale + 'bbb'
      );
      fireEvent.click(wrapper.container.querySelector('div') as Element);

      // eslint-disable-next-line no-unused-expressions
      expect(testComponentProps.setPage).to.have.been.called;
    });
  });
});
