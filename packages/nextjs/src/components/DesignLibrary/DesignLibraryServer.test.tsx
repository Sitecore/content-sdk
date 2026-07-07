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
import {
  LayoutServiceData,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/content/layout';
import { DesignLibraryPreviewError } from '@sitecore-content-sdk/content/codegen';
import { DesignLibraryStatus, DesignLibraryMode } from '@sitecore-content-sdk/content/editing';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import * as DesignLibraryClient from './DesignLibraryClientEvents';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('<DesignLibraryServer />', () => {
  let DesignLibraryPreviewEventsStub: sinon.SinonStub;
  let DesignLibraryVariantGenerationEventsStub: sinon.SinonStub;
  let hasCacheStub: sinon.SinonStub;
  let getCacheAndCleanStub: sinon.SinonStub;
  let createComponentInstanceStub: sinon.SinonStub;
  let updateComponentStub: sinon.SinonStub;
  let getImportMapInfoStub: sinon.SinonStub;
  let ErrorBoundaryStub: sinon.SinonStub;
  let AppPlaceholderStub: sinon.SinonStub;
  let DesignLibraryErrorBoundaryStub: sinon.SinonStub;
  let DesignLibraryServer: any;
  let DesignLibraryServerPreview: any;
  let DesignLibraryServerVariantGeneration: any;
  let __mockDependencies: any;

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    hasCacheStub = sandbox.stub();
    getCacheAndCleanStub = sandbox.stub();
    createComponentInstanceStub = sandbox.stub();
    // updateComponent actually mutates the component object
    updateComponentStub = sandbox.stub().callsFake((component: any, fields?: any, params?: any) => {
      if (fields) {
        component.fields = { ...component.fields, ...fields };
      }
      if (params) {
        component.params = { ...component.params, ...params };
      }
    });
    getImportMapInfoStub = sandbox.stub().returns([]);

    // Mock ErrorBoundary to be a pass-through wrapper
    ErrorBoundaryStub = sandbox
      .stub()
      .callsFake(({ children }: { children: React.ReactNode }) => <>{children}</>);

    // Mock DesignLibraryErrorBoundary to be a pass-through wrapper
    DesignLibraryErrorBoundaryStub = sandbox.stub().callsFake((props: any) => {
      const { children, onError } = props;

      // Simple error boundary that catches errors
      class TestErrorBoundary extends React.Component<
        { children: React.ReactNode; onError?: (error: Error) => void },
        { hasError: boolean }
      > {
        constructor(props: any) {
          super(props);
          this.state = { hasError: false };
        }

        static getDerivedStateFromError() {
          return { hasError: true };
        }

        componentDidCatch(error: Error) {
          if (this.props.onError) {
            this.props.onError(error);
          }
        }

        render() {
          if (this.state.hasError) {
            return <div>Error during component rendering</div>;
          }
          return this.props.children;
        }
      }

      return <TestErrorBoundary onError={onError}>{children}</TestErrorBoundary>;
    });

    // Mock AppPlaceholder to render components with chrome markers
    AppPlaceholderStub = sandbox.stub().callsFake((props: any) => {
      const { rendering, componentMap } = props;
      const placeholder = rendering?.placeholders?.[EDITING_COMPONENT_PLACEHOLDER];

      if (!placeholder || placeholder.length === 0) {
        return null;
      }

      return (
        <>
          <code
            type="text/sitecore"
            chrometype="placeholder"
            className="scpm"
            kind="open"
            id={`${EDITING_COMPONENT_PLACEHOLDER}_00000000-0000-0000-0000-000000000000`}
          />
          {placeholder.map((component: any, index: number) => {
            const Component = componentMap?.get(component.componentName);
            if (!Component) return null;

            return (
              <React.Fragment key={index}>
                <code
                  type="text/sitecore"
                  chrometype="rendering"
                  className="scpm"
                  kind="open"
                  id={component.uid}
                  data-csdk-component-runtime="server"
                />
                <Component {...component} />
                <code type="text/sitecore" chrometype="rendering" className="scpm" kind="close" />
              </React.Fragment>
            );
          })}
          <code type="text/sitecore" chrometype="placeholder" className="scpm" kind="close" />
        </>
      );
    });

    DesignLibraryPreviewEventsStub = sandbox
      .stub(DesignLibraryClient, 'DesignLibraryPreviewEvents')
      .callsFake(DlClientEventsMockPreview);
    DesignLibraryVariantGenerationEventsStub = sandbox
      .stub(DesignLibraryClient, 'DesignLibraryVariantGenerationEvents')
      .callsFake(DlClientEventsMockVariantGeneration);

    // Use proxyquire to mock React components that use hooks
    const module = proxyquire('./DesignLibraryServer', {
      '@sitecore-content-sdk/react': {
        ErrorBoundary: ErrorBoundaryStub,
        AppPlaceholder: AppPlaceholderStub,
        DesignLibraryErrorBoundary: DesignLibraryErrorBoundaryStub,
      },
    });

    DesignLibraryServer = module.DesignLibraryServer;
    DesignLibraryServerPreview = module.DesignLibraryServerPreview;
    DesignLibraryServerVariantGeneration = module.DesignLibraryServerVariantGeneration;
    __mockDependencies = module.__mockDependencies;

    __mockDependencies({
      hasCache: hasCacheStub,
      getCacheAndClean: getCacheAndCleanStub,
      createComponentInstance: createComponentInstanceStub,
      updateComponent: updateComponentStub,
      getImportMapInfo: getImportMapInfoStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

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

  const DlClientEventsMockPreview = () => (
    <div data-testid="mock-dl-client-events-preview">Mocked DL CLient Events for Preview</div>
  );

  const DlClientEventsMockVariantGeneration = () => (
    <div data-testid="mock-dl-client-events-variant-generation">
      Mocked DL CLient Events for variant generation
    </div>
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

  describe('DesignLibraryServer', () => {
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
  });

  describe('DesignLibraryServerPreview', () => {
    it('should initial render the component', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);
      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.equal(
        [
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
          '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
          '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
          '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
          '<div data-testid="mock-dl-client-events-preview">Mocked DL CLient Events for Preview</div>',
        ].join('')
      );
      expect(DesignLibraryPreviewEventsStub).to.have.been.calledOnce;
    });

    it('should pass READY status to DesignLibraryClientEvents', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);
      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });
      render(awaitedDesignLibraryServer);

      const propsPassed = DesignLibraryPreviewEventsStub.getCall(0).args[0];
      expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.READY);
    });

    it('should not load import map when isVariantGeneration is false', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);
      const importMapLoaderSpy = sandbox.stub();

      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
        loadServerImportMap: importMapLoaderSpy,
      });

      render(awaitedDesignLibraryServer);

      expect(importMapLoaderSpy).to.not.have.been.called;
    });

    it('should apply field updates from cache', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);

      hasCacheStub.returns(true);
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        rendering: {
          fields: {
            heading: {
              value: 'Updated Heading from Cache',
            },
          },
          params: {},
        },
      } as any);

      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.include('Updated Heading from Cache');
    });

    it('should apply param updates from cache', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);

      hasCacheStub.returns(true);
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        rendering: {
          fields: {},
          params: { theme: 'dark-mode' },
        },
      } as any);

      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });

      const rendered = render(awaitedDesignLibraryServer);

      expect(rendered?.container.innerHTML).to.include('class="dark-mode"');
    });

    it('should pass RENDERED status to DesignLibraryClientEvents when cache exists', async () => {
      const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
      const page = getPage(layoutData, modeLibrary);

      hasCacheStub.returns(true);
      getCacheAndCleanStub.returns({
        uid: 'test-content',
        rendering: {
          fields: {},
          params: {},
        },
      } as any);

      const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
        page,
        rendering: layoutData.sitecore.route as any,
        componentMap: components,
      });

      render(awaitedDesignLibraryServer);

      const propsPassed = DesignLibraryPreviewEventsStub.getCall(0).args[0];
      expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.RENDERED);
    });

    describe('error handling', () => {
      it('should render ErrorComponent when rendering data is missing', async () => {
        const page = getPage(undefined, modeLibrary);

        const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
          page,
          rendering: { placeholders: {} } as any,
          componentMap: components,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.include('Rendering data is missing');
      });

      it('should render ErrorComponent when component UID is missing', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibrary);

        // Remove UID from the component
        const renderingWithoutUid = {
          ...layoutData.sitecore.route,
          placeholders: {
            [EDITING_COMPONENT_PLACEHOLDER]: [
              {
                ...layoutData.sitecore.route.placeholders?.[EDITING_COMPONENT_PLACEHOLDER]?.[0],
                uid: undefined,
              },
            ],
          },
        };

        const awaitedDesignLibraryServer = await DesignLibraryServerPreview({
          page,
          rendering: renderingWithoutUid as any,
          componentMap: components,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.include(
          'Rendering UID is missing in the rendering data'
        );
      });
    });
  });

  describe('DesignLibraryServerVariantGeneration', () => {
    describe('variant generation mode - no cache', () => {
      beforeEach(() => {
        hasCacheStub.returns(false);
      });

      it('should load import map when isVariantGeneration is true', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub();

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        render(awaitedDesignLibraryServer);

        expect(importMapLoaderSpy).to.have.been.called;
      });

      it('should use noop import map when loadImportMap is not provided', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
        });
        render(awaitedDesignLibraryServer);

        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.componentInitError).to.be.undefined;
        expect(propsPassed.importMap).to.deep.equal([]);
      });

      it('should set componentInitError when loadImportMap throws', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().throws(new Error('Import map load failed'));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        render(awaitedDesignLibraryServer);

        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.componentInitError).to.deep.equal({
          message: 'Error loading import map: Error: Import map load failed',
          type: DesignLibraryPreviewError.ImportMapLoad,
        });
      });

      it('should render AppPlaceholder when no cache update exists', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub();
        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
            '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );

        expect(DesignLibraryVariantGenerationEventsStub).to.have.been.calledOnce;
        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.READY);
      });
    });

    describe('error handling', () => {
      beforeEach(() => {
        hasCacheStub.returns(false);
      });

      it('should render ErrorComponent when rendering data is missing', async () => {
        const page = getPage(undefined, modeLibraryMetadata_Gen);

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: { placeholders: {} } as any,
          componentMap: components,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.include('Rendering data is missing');
      });

      it('should render ErrorComponent when component UID is missing', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);

        // Remove UID from the component
        const renderingWithoutUid = {
          ...layoutData.sitecore.route,
          placeholders: {
            [EDITING_COMPONENT_PLACEHOLDER]: [
              {
                ...layoutData.sitecore.route.placeholders?.[EDITING_COMPONENT_PLACEHOLDER]?.[0],
                uid: undefined,
              },
            ],
          },
        };

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: renderingWithoutUid as any,
          componentMap: components,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.include(
          'Rendering UID is missing in the rendering data'
        );
      });
    });

    describe('variant generation mode - with update cache', () => {
      beforeEach(() => {
        hasCacheStub.onFirstCall().returns(true);
        hasCacheStub.onSecondCall().returns(false);
      });

      it('should apply field and param updates from cache', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub();
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
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
        } as any);

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        const expectedParam = 'dark';
        const expectedHeadingField = 'This is the updated heading value';

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
            `<div class="test"><h2>Content Block Component</h2><p class="${expectedParam}">${expectedHeadingField}</p></div>`,
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );

        expect(DesignLibraryVariantGenerationEventsStub).to.have.been.calledOnce;
        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.RENDERED);
      });

      it('should render generated component when preview component exists', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.returns((props) => (
          <div>
            <h1>Generated Component</h1>
            <h2>{props?.fields?.heading?.value}</h2>
          </div>
        ));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
            '<div><h1>Generated Component</h1>',
            '<h2>This is the updated heading value</h2></div>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });

      it('should pass component veriant data to DesignLibraryClientEvents', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        const generatedComponentData = { styles: { content: 'background: green' } };
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData,
        } as any);
        createComponentInstanceStub.returns((props) => (
          <div>
            <h1>Generated Component</h1>
            <h2>{props?.fields?.heading?.value}</h2>
          </div>
        ));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        render(awaitedDesignLibraryServer);

        expect(DesignLibraryVariantGenerationEventsStub).to.have.been.calledOnce;
        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.generatedComponentData).to.deep.equal(generatedComponentData);
      });

      it('should call createComponentInstance with import map and preview data', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMap = [{ someEntry: 'someUrl' }];
        const importMapLoaderSpy = sandbox.stub().returns({ default: importMap });
        const generatedComponentData = { core: 'preview component code' };
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          generatedComponentData,
        } as any);
        createComponentInstanceStub.returns(() => <div>Generated</div>);

        await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        expect(createComponentInstanceStub).to.have.been.calledOnceWith(
          importMap,
          generatedComponentData
        );
      });

      it('should set componentInitError when createComponentInstance throws', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.throws(new Error('create component failed'));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.componentInitError).to.deep.equal({
          message: 'create component failed',
          type: DesignLibraryPreviewError.RenderInit,
        });

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
            '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });

      it('should wrap generated component when error boundary and catch error', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.returns((props) => {
          throw new Error('render component failed');
          // eslint-disable-next-line no-unreachable
          return (
            <div>
              <h1>Generated Component</h1>
              <h2>{props?.fields?.heading?.value}</h2>
            </div>
          );
        });

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<div>Error during component rendering</div>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });
    });

    describe('variant generation mode - with preview cache', () => {
      beforeEach(() => {
        hasCacheStub.onFirstCall().returns(false);
        hasCacheStub.onSecondCall().returns(true);
      });

      it('should apply field and param updates from cache', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            uid: 'test-content',
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
        } as any);

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        const expectedParam = 'dark';
        const expectedHeadingField = 'This is the updated heading value';

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
            `<div class="test"><h2>Content Block Component</h2><p class="${expectedParam}">${expectedHeadingField}</p></div>`,
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );

        expect(DesignLibraryVariantGenerationEventsStub).to.have.been.calledOnce;
        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.designLibraryStatus).to.equal(DesignLibraryStatus.RENDERED);
      });

      it('should render generated component when preview component exists', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.returns((props) => (
          <div>
            <h1>Generated Component</h1>
            <h2>{props?.fields?.heading?.value}</h2>
          </div>
        ));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content"></code>',
            '<div><h1>Generated Component</h1>',
            '<h2>This is the updated heading value</h2></div>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });

      it('should pass component veriant data to DesignLibraryClientEvents', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        const generatedComponentData = { styles: { content: 'background: green' } };
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData,
        } as any);
        createComponentInstanceStub.returns((props) => (
          <div>
            <h1>Generated Component</h1>
            <h2>{props?.fields?.heading?.value}</h2>
          </div>
        ));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        render(awaitedDesignLibraryServer);

        expect(DesignLibraryVariantGenerationEventsStub).to.have.been.calledOnce;
        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.generatedComponentData).to.deep.equal(generatedComponentData);
      });

      it('should call createComponentInstance with import map and preview data', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMap = [{ someEntry: 'someUrl' }];
        const importMapLoaderSpy = sandbox.stub().returns({ default: importMap });
        const generatedComponentData = { core: 'preview component code' };
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          generatedComponentData,
        } as any);
        createComponentInstanceStub.returns(() => <div>Generated</div>);

        await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        expect(createComponentInstanceStub).to.have.been.calledOnceWith(
          importMap,
          generatedComponentData
        );
      });

      it('should set componentInitError when createComponentInstance throws', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.throws(new Error('create component failed'));

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        const propsPassed = DesignLibraryVariantGenerationEventsStub.getCall(0).args[0];
        expect(propsPassed.componentInitError).to.deep.equal({
          message: 'create component failed',
          type: DesignLibraryPreviewError.RenderInit,
        });

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_00000000-0000-0000-0000-000000000000"></code>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="test-content" data-csdk-component-runtime="server"></code>',
            '<div class="test"><h2>Content Block Component</h2><p>Content SDK Styleguide</p></div>',
            '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
            '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });

      it('should wrap generated component when error boundary and catch error', async () => {
        const layoutData: LayoutServiceData = getTestLayoutData().layoutData;
        const page = getPage(layoutData, modeLibraryMetadata_Gen);
        const importMapLoaderSpy = sandbox.stub().returns({ default: [] });
        getCacheAndCleanStub.returns({
          uid: 'test-content',
          rendering: {
            fields: {
              heading: {
                value: 'This is the updated heading value',
              },
            },
            params: { theme: 'dark' },
          },
          generatedComponentData: { core: 'preview component code' },
        } as any);
        createComponentInstanceStub.returns((props) => {
          throw new Error('render component failed');
          // eslint-disable-next-line no-unreachable
          return (
            <div>
              <h1>Generated Component</h1>
              <h2>{props?.fields?.heading?.value}</h2>
            </div>
          );
        });

        const awaitedDesignLibraryServer = await DesignLibraryServerVariantGeneration({
          page,
          rendering: layoutData.sitecore.route as any,
          componentMap: components,
          loadServerImportMap: importMapLoaderSpy,
        });

        const rendered = render(awaitedDesignLibraryServer);

        expect(rendered?.container.innerHTML).to.equal(
          [
            '<div>Error during component rendering</div>',
            '<div data-testid="mock-dl-client-events-variant-generation">Mocked DL CLient Events for variant generation</div>',
          ].join('')
        );
      });
    });
  });
});
