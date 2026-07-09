/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { render } from '@testing-library/react';
import { Page, PageMode } from '@sitecore-content-sdk/content/client';
import { LayoutServiceData } from '@sitecore-content-sdk/content/layout';
import { DesignLibraryMode } from '@sitecore-content-sdk/content/editing';
import { ComponentMapEntry } from '../models';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('<DesignLibraryApp />', () => {
  let DesignLibraryStub: sinon.SinonStub;
  let DesignLibraryLowCodeComponentStub: sinon.SinonStub;
  let DesignLibraryServerStub: sinon.SinonStub;
  let DesignLibraryApp: any;
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    DesignLibraryStub = sandbox
      .stub()
      .returns(<div data-testid="design-library-client">Client Component Rendered</div>);

    DesignLibraryLowCodeComponentStub = sandbox
      .stub()
      .returns(<div data-testid="design-library-low-code">Low Code Component Rendered</div>);

    DesignLibraryServerStub = sandbox
      .stub()
      .resolves(<div data-testid="design-library-server">Server Component Rendered</div>);

    // Use proxyquire to mock dependencies before DesignLibraryApp imports them
    const module = proxyquire('./DesignLibraryApp', {
      '@sitecore-content-sdk/react': {
        DesignLibrary: DesignLibraryStub,
        DesignLibraryLowCodeComponent: DesignLibraryLowCodeComponentStub,
      },
      './DesignLibraryServer': {
        DesignLibraryServer: DesignLibraryServerStub,
      },
    });

    DesignLibraryApp = module.DesignLibraryApp;
  });

  afterEach(() => {
    sandbox.restore();
  });

  const modeLibrary: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: false, isLowCode: false },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const modeLibraryLowCode: PageMode = {
    ...modeLibrary,
    designLibrary: { ...modeLibrary.designLibrary, isLowCode: true },
  };

  const ClientComponent: React.FC<{ [prop: string]: unknown }> = () => <div>Client Component</div>;

  const ServerComponent: React.FC<{ [prop: string]: unknown }> = () => <div>Server Component</div>;

  const createComponentMap = (
    componentName: string,
    componentType: 'client' | 'server'
  ): Map<string, ComponentMapEntry> => {
    const map = new Map<string, ComponentMapEntry>();
    map.set(componentName, {
      component: componentType === 'client' ? ClientComponent : ServerComponent,
      componentType,
    });
    return map;
  };

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = modeLibrary): Page => ({
    locale: 'en',
    layout: layout || { sitecore: { context: {}, route: null } },
    mode: pageMode,
  });

  it('should return null when route is null', () => {
    const page: Page = {
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: modeLibrary,
    };

    const componentMap = createComponentMap('ContentBlock', 'client');

    const awaitedDesignLibraryServer = DesignLibraryApp({
      page,
      rendering: page.layout.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(awaitedDesignLibraryServer);

    expect(DesignLibraryStub).to.not.have.been.called;
    expect(DesignLibraryServerStub).to.not.have.been.called;
  });

  it('should render DesignLibrary when component is client type', () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const componentMap = createComponentMap('ContentBlock', 'client');
    const awaitedDesignLibraryServer = DesignLibraryApp({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(awaitedDesignLibraryServer);

    expect(DesignLibraryStub).to.have.been.calledOnce;
    expect(DesignLibraryLowCodeComponentStub).to.not.have.been.called;
    expect(DesignLibraryServerStub).to.not.have.been.called;
  });

  it('should render DesignLibraryLowCodeComponent when isLowCode is true', () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibraryLowCode);
    const componentMap = createComponentMap('ContentBlock', 'client');

    const awaitedDesignLibraryServer = DesignLibraryApp({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(awaitedDesignLibraryServer);

    expect(DesignLibraryLowCodeComponentStub).to.have.been.calledOnce;
    expect(DesignLibraryStub).to.not.have.been.called;
    expect(DesignLibraryServerStub).to.not.have.been.called;
  });

  it('should render DesignLibraryServer when component is server type', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const componentMap = createComponentMap('ContentBlock', 'server');
    const awaitedDesignLibraryServer = await DesignLibraryApp({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(awaitedDesignLibraryServer);

    expect(DesignLibraryServerStub).to.have.been.calledOnce;
    expect(DesignLibraryStub).to.not.have.been.called;

    expect(DesignLibraryServerStub).to.have.been.calledWith({
      page,
      componentMap,
      loadServerImportMap: sinon.match.func,
      rendering: layoutData.sitecore.route,
    });
  });

  it('should render DesignLibraryServer when component is not in map (treated as server)', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const componentMap = new Map<string, ComponentMapEntry>();

    const awaitedDesignLibraryServer = await DesignLibraryApp({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(awaitedDesignLibraryServer);

    expect(DesignLibraryServerStub).to.have.been.calledOnce;
    expect(DesignLibraryStub).to.not.have.been.called;
  });
});
