import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { ClientComponentWrapper } from './ClientComponentWrapper';
import { SitecoreProvider } from '../SitecoreProvider';
import { ComponentRendering, LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { Page } from '@sitecore-content-sdk/content/client';
import { convertedDevData as normalModeDevData } from '../../test-data/normal-mode-data';

describe('ClientComponentWrapper', () => {
  const api = {
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
  };

  const getPage = (): Page => ({
    layout: normalModeDevData,
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
  });

  const createRendering = (overrides?: Partial<ComponentRendering>): ComponentRendering => ({
    componentName: 'TestComponent',
    uid: 'uid-1',
    ...overrides,
  });

  it('renders the resolved component from the component map', () => {
    const Received: any[] = [];
    const TestComponent: React.FC<any> = (props) => {
      Received.push(props);
      return <div className="test-component-marker">ok</div>;
    };

    const componentMap = new Map<string, React.FC<any>>();
    componentMap.set('TestComponent', TestComponent);

    const rendering: ComponentRendering = createRendering();

    const { container } = render(
      <SitecoreProvider api={api} componentMap={componentMap} page={getPage()}>
        <ClientComponentWrapper
          rendering={rendering}
          componentProps={{ fields: {}, params: {}, rendering } as any}
          placeholderName="main"
        />
      </SitecoreProvider>
    );

    expect(container.querySelectorAll('.test-component-marker').length).to.equal(1);
    // Ensure our component received some props
    expect(Received.length).to.equal(1);
  });

  it('merges componentProps with context-provided rendering, componentMap and page', () => {
    let captured: any = null;
    const TestComponent: React.FC<any> = (props) => {
      captured = props;
      return <div className="merge-marker" />;
    };

    const componentMap = new Map<string, React.FC<any>>();
    componentMap.set('TestComponent', TestComponent);

    const rendering: ComponentRendering = createRendering();
    const page = getPage();

    const customProps = { fields: { a: 1 }, params: { b: 'x' } } as any;

    render(
      <SitecoreProvider api={api} componentMap={componentMap} page={page}>
        <ClientComponentWrapper
          rendering={rendering}
          componentProps={customProps}
          placeholderName="main"
        />
      </SitecoreProvider>
    );

    // eslint-disable-next-line no-unused-expressions
    expect(captured).to.not.be.null;
    expect(captured.fields).to.deep.equal({ a: 1 });
    expect(captured.params).to.deep.equal({ b: 'x' });
    expect(captured.rendering).to.equal(rendering);
    expect(captured.componentMap).to.equal(componentMap);
    expect(captured.page).to.equal(page);
  });

  it('context values override conflicting keys from componentProps', () => {
    let captured: any = null;
    const TestComponent: React.FC<any> = (props) => {
      captured = props;
      return <div className="override-marker" />;
    };

    const componentMap = new Map<string, React.FC<any>>();
    componentMap.set('TestComponent', TestComponent);

    const realRendering: ComponentRendering = createRendering();
    const realPage = getPage();

    const fakePage = { fake: true } as any;
    const fakeRendering = { componentName: 'Wrong', uid: 'wrong' } as any;
    const fakeComponentMap = new Map();

    const componentProps = {
      fields: {},
      params: {},
      // Intentionally conflicting keys (not in AppComponentProps) — will be overridden
      page: fakePage,
      rendering: fakeRendering,
      componentMap: fakeComponentMap,
    } as any;

    render(
      <SitecoreProvider api={api} componentMap={componentMap} page={realPage}>
        <ClientComponentWrapper
          rendering={realRendering}
          componentProps={componentProps}
          placeholderName="main"
        />
      </SitecoreProvider>
    );

    // eslint-disable-next-line no-unused-expressions
    expect(captured).to.not.be.null;
    expect(captured.page).to.equal(realPage);
    expect(captured.rendering).to.equal(realRendering);
    expect(captured.componentMap).to.equal(componentMap);
  });
});
