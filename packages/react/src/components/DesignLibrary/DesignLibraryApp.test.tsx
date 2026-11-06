/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { render } from '@testing-library/react';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { DesignLibraryMode } from '@sitecore-content-sdk/core/editing';
import { ComponentMapEntry } from '../models';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('<DesignLibraryApp />', () => {
  let DesignLibraryRuntimeStub: sinon.SinonStub;
  let DesignLibraryApp: any;
  const sandbox = sinon.createSandbox();

  const modeLibrary: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: false },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const ClientComponent: React.FC<{ [prop: string]: unknown }> = () => <div>Client Component</div>;

  const createComponentMap = (
    componentName: string,
    componentType: 'client' | 'server'
  ): Map<string, ComponentMapEntry> => {
    const map = new Map<string, ComponentMapEntry>();
    map.set(componentName, {
      component: ClientComponent,
      componentType,
    });
    return map;
  };

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = modeLibrary): Page => ({
    locale: 'en',
    layout: layout || { sitecore: { context: {}, route: null } },
    mode: pageMode,
  });

  beforeEach(() => {
    DesignLibraryRuntimeStub = sandbox
      .stub()
      .returns(<div data-testid="design-library-runtime">Runtime Rendered</div>);

    const module = proxyquire('./DesignLibraryApp', {
      '#rsc-env': {
        '@noCallThru': true,
        rsc: true,
        loadDesignLibraryRuntime: () =>
          Promise.resolve({
            DesignLibraryRuntime: DesignLibraryRuntimeStub,
          }),
      },
    });

    DesignLibraryApp = module.DesignLibraryApp;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return null and not import runtime when route is null', async () => {
    const page: Page = {
      locale: 'en',
      layout: { sitecore: { context: {}, route: null } },
      mode: modeLibrary,
    };

    const result = await DesignLibraryApp({
      page,
      rendering: page.layout.sitecore.route as any,
      componentMap: createComponentMap('ContentBlock', 'client'),
      loadServerImportMap: sinon.stub(),
    });

    expect(result).to.equal(null);
    expect(DesignLibraryRuntimeStub).to.not.have.been.called;
  });

  it('should render DesignLibraryRuntime when route is present', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const componentMap = createComponentMap('ContentBlock', 'client');

    const result = await DesignLibraryApp({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap,
      loadServerImportMap: sinon.stub(),
    });

    render(result);

    expect(DesignLibraryRuntimeStub).to.have.been.calledOnce;
  });
});
