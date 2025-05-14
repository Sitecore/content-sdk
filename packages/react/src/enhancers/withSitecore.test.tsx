/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { expect, use } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';

import { useSitecore, withSitecore } from '../enhancers/withSitecore';
import { SitecoreProviderReactContext } from '../components/SitecoreProvider';

use(sinonChai);

describe('withSitecore', () => {
  it('withSitecore()', () => {
    const setContext = spy();

    const testComponentProps = {
      pageContext: {
        text: 'value',
      },
      api: {
        edge: {
          contextId: 'id',
          edgeUrl: 'url',
        },
      },
      setContext,
    };

    const TestComponent: React.FC<any> = (props: any) => (
      <>
        <div onClick={props.updateContext}>
          {props.pageContext.text}
          {props.customProp}
        </div>
        <span>
          {props.api.edge.contextId} {props.api.edge.edgeUrl}
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
      testComponentProps.pageContext.text + 'xxx'
    );
    fireEvent.click(wrapper.container.querySelector('div') as Element);

    // eslint-disable-next-line no-unused-expressions
    expect(testComponentProps.setContext).not.to.be.called;

    TestComponentWithContext = withSitecore({ updatable: true })(TestComponent);

    wrapper = render(
      <SitecoreProviderReactContext.Provider value={testComponentProps}>
        <TestComponentWithContext customProp="xxx" />
      </SitecoreProviderReactContext.Provider>
    );

    fireEvent.click(wrapper.container.querySelector('div') as Element);

    // eslint-disable-next-line no-unused-expressions
    expect(testComponentProps.setContext).to.have.been.called;
  });

  describe('useSitecore()', () => {
    it('context access', () => {
      const setContext = spy();

      const testComponentProps = {
        pageContext: {
          text: 'value',
        },
        api: {
          edge: {
            contextId: 'id',
            edgeUrl: 'url',
          },
        },
        setContext,
      };

      const TestComponent: React.FC<any> = (props: any) => {
        const reactContext = useSitecore();
        const context = reactContext.pageContext as { text: string };

        return (
          <>
            <div onClick={reactContext.updateContext}>
              {context.text}
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
        testComponentProps.pageContext.text + 'xxx'
      );
      expect(wrapper.container.querySelector('span')?.textContent).equal('id url');
      fireEvent.click(wrapper.container.querySelector('div') as Element);

      // eslint-disable-next-line no-unused-expressions
      expect(testComponentProps.setContext).to.not.have.been.called;
    });

    it('updatable', () => {
      const setContext = spy();

      const testComponentProps = {
        pageContext: {
          text: 'value',
        },
        setContext,
      };

      const TestComponent: React.FC<any> = (props: any) => {
        const reactContext = useSitecore({ updatable: true });
        const context = reactContext.pageContext as { text: string };

        return (
          <div onClick={reactContext.updateContext}>
            {context.text}
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
        testComponentProps.pageContext.text + 'bbb'
      );
      fireEvent.click(wrapper.container.querySelector('div') as Element);

      // eslint-disable-next-line no-unused-expressions
      expect(testComponentProps.setContext).to.have.been.called;
    });
  });
});
