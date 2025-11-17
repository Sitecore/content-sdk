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
import { DesignLibraryStatus, DesignLibraryMode } from '@sitecore-content-sdk/core/editing';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import { DesignLibraryServer, __mockDependencies } from './DesignLibraryServer';
import * as DesignLibraryClient from './DesignLibraryClientEvents';

use(sinonChai);

describe('<DesignLibraryServer />', () => {
  let DesignLibraryClientEventsStub: sinon.SinonStub;
  let hasCacheStub: sinon.SinonStub;
  let getCacheAndCleanStub: sinon.SinonStub;
  let createComponentInstanceStub: sinon.SinonStub;

  beforeEach(() => {
    hasCacheStub = sandbox.stub();
    getCacheAndCleanStub = sandbox.stub();
    createComponentInstanceStub = sandbox.stub();
    DesignLibraryClientEventsStub = sandbox
      .stub(DesignLibraryClient, 'DesignLibraryClientEvents')
      .callsFake(DlClientEventsMock);

    __mockDependencies({
      hasCache: hasCacheStub,
      getCacheAndClean: getCacheAndCleanStub,
      createComponentInstance: createComponentInstanceStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const sandbox = sinon.createSandbox();

  const modeNormal: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: false,
    designLibrary: { isVariantGeneration: false },
    isNormal: true,
    isPreview: false,
    isEditing: false,
  };

  const modeLibrary: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: false },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const modeLibraryMetadata_Gen: PageMode = {
    name: DesignLibraryMode.Metadata,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: true },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const components = new Map<string, React.FC>();

  const DlClientEventsMock = (props) => (
    <div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>
  );

  const ContentBlock: React.FC<{
    [prop: string]: unknown;
    fields?: { content: { value: string }; heading: { value: string } };
  }> = (props) => (
    <div className="test">
      <h2>Content Block Component</h2>
      <p className={props.params?.theme}>{props.fields?.heading?.value}</p>
    </div>
  );

  components.set('ContentBlock', ContentBlock);

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = modeLibrary): Page => ({
    locale: 'en',
    layout: layout || { sitecore: { context: {}, route: null } },
    mode: pageMode,
  });

  it('should return null when not in design library mode', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeNormal);

    const awaitedDesignLibraryServer = await DesignLibraryServer({
      page,
      rendering: layoutData.sitecore.route as any,
    });
    const rendered = render(awaitedDesignLibraryServer);

    expect(rendered?.container.innerHTML).to.equal('');
  });

  it('should initial render the component', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const awaitedDesignLibraryServer = await DesignLibraryServer({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap: components,
    });

    const rendered = render(awaitedDesignLibraryServer);

    expect(rendered?.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
        '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
        '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
        '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
        '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
      ].join('')
    );
    expect(DesignLibraryClientEventsStub).to.have.been.calledOnce;
  });

  it('should pass READY status to DesignLibraryClientEvents', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const awaitedDesignLibraryServer = await DesignLibraryServer({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap: components,
    });
    render(awaitedDesignLibraryServer);

    const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
    expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.READY);
  });

  it('should not load import map when isVariantGeneration is false', async () => {
    const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
    const page = getPage(layoutData, modeLibrary);
    const importMapLoaderSpy = sandbox.stub();

    const awaitedDesignLibraryServer = await DesignLibraryServer({
      page,
      rendering: layoutData.sitecore.route as any,
      componentMap: components,
      loadImportMap: importMapLoaderSpy,
    });

    render(awaitedDesignLibraryServer);

    expect(importMapLoaderSpy).to.not.have.been.called;
  });

  describe('variant generation mode - no cache', () => {
    beforeEach(() => {
      hasCacheStub.returns(false);
    });

    it('should load import map when isVariantGeneration is true', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub();

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      render(awaitedDesignLibraryServer);

      expect(importMapLoaderSpy).to.have.been.called;
    });

    it('should set importMapError when loadImportMap is not provided', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });
      render(awaitedDesignLibraryServer);

      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.importMapError).to.equal('No loadImportMap provided');
    });

    it('should set importMapError when loadImportMap throws', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub().throws(new Error('Import map load failed'));

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      render(awaitedDesignLibraryServer);

      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.importMapError).to.equal(
        'Error loading import map: Error: Import map load failed'
      );
    });

    it('should render AppPlaceholder when no cache update exists', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub();
      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
          '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
        ].join('')
      );

      expect(DesignLibraryClientEventsStub).to.have.been.calledOnce;
      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.READY);
    });
  });

  describe('variant generation mode - with cache update', () => {
    beforeEach(() => {
      hasCacheStub.returns(true);
    });

    it('should apply field and param updates updates from cache', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub();
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        updatedComponent: {
          fields: {
            content: {
              value: 'This is the updated value',
            },
            heading: {
              value: 'This is the updated heading value',
            },
          },
          params: { theme: 'dark' },
        },
        previewComponent: {},
      } as any);

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      const rendered = render(awaitedDesignLibraryServer);

      const expectedParam = 'dark';
      const expectedHeadingField = 'This is the updated heading value';

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
          `<div class="test"><h2>Content Block Component</h2><p class="${expectedParam}">${expectedHeadingField}</p></div>`,
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
        ].join('')
      );

      expect(DesignLibraryClientEventsStub).to.have.been.calledOnce;
      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.RENDERED);
    });

    it('should render generated component when preview component exists', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        updatedComponent: {
          fields: {
            heading: {
              value: 'This is the updated heading value',
            },
          },
          params: { theme: 'dark' },
        },
        previewComponent: { core: 'preview component code' },
      } as any);
      createComponentInstanceStub.returns((props) => (
        <div>
          <h1>Generated Component</h1>
          <h2>{props?.fields?.heading?.value}</h2>
        </div>
      ));

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
          '<div><h1>Generated Component</h1>',
          '<h2>This is the updated heading value</h2></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
        ].join('')
      );
    });

    it('should pass preview component styles to DesignLibraryClientEvents', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        updatedComponent: {
          fields: {
            heading: {
              value: 'This is the updated heading value',
            },
          },
          params: { theme: 'dark' },
        },
        previewComponent: { message: { styles: { content: 'background: green' } } },
      } as any);
      createComponentInstanceStub.returns((props) => (
        <div>
          <h1>Generated Component</h1>
          <h2>{props?.fields?.heading?.value}</h2>
        </div>
      ));

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      render(awaitedDesignLibraryServer);

      expect(DesignLibraryClientEventsStub).to.have.been.calledOnce;
      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.previewComponentStyle).to.equal('background: green');
    });

    it('should call createComponentInstance with import map and preview data', async () => {});

    it('should set importMapError when createComponentInstance throws', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        previewComponent: { core: 'preview component code' },
      } as any);
      createComponentInstanceStub.throws(new Error('create component failed'));

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      const rendered = render(awaitedDesignLibraryServer);

      const propsPassed = DesignLibraryClientEventsStub.getCall(0).args[0];
      expect(propsPassed.importMapError).to.equal('Error: create component failed');

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
          '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
        ].join('')
      );
    });

    it('should wrap generated component when error boundary and catch error', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibraryMetadata_Gen);
      const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        updatedComponent: {
          fields: {
            heading: {
              value: 'This is the updated heading value',
            },
          },
          params: { theme: 'dark' },
        },
        previewComponent: { core: 'preview component code' },
      } as any);
      createComponentInstanceStub.returns((props) => {
        throw new Error('render component failed');
        return (
          <div>
            <h1>Generated Component</h1>
            <h2>{props?.fields?.heading?.value}</h2>
          </div>
        );
      });

      const awaitedDesignLibraryServer = await DesignLibraryServer({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadImportMap: importMapLoaderSpy,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<div>Error during component rendering</div>',
          '<div data-testid="mock-dl-client-events">Mocked DL CLient Events</div>',
        ].join('')
      );
    });
  });
});
