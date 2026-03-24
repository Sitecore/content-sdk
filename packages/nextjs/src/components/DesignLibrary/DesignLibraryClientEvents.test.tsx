/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { render, waitFor } from '@testing-library/react';
import { Page, PageMode } from '@sitecore-content-sdk/content/client';
import {
  LayoutServiceData,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/content/layout';
import { DesignLibraryStatus, DesignLibraryMode } from '@sitecore-content-sdk/content/editing';
import { DesignLibraryPreviewError } from '@sitecore-content-sdk/content/codegen';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import proxyquire from 'proxyquire';

use(sinonChai);

describe('<DesignLibraryClientEvents />', () => {
  let postToDesignLibrarySpy: sinon.SinonStub;
  let addComponentUpdateHandlerSpy: sinon.SinonStub;
  let updateComponentActionSpy: sinon.SinonStub;
  let previewComponentActionSpy: sinon.SinonStub;
  let addServerComponentPreviewHandlerSpy: sinon.SinonStub;
  let getDesignLibraryImportMapEventSpy: sinon.SinonStub;
  let getDesignLibraryComponentPropsEventSpy: sinon.SinonStub;
  let addStyleElementSpy: sinon.SinonStub;
  let sendErrorEventSpy: sinon.SinonStub;
  let useSitecoreStub: sinon.SinonStub;
  let DesignLibraryVariantGenerationEvents: any;
  let DesignLibraryPreviewEvents: any;
  let __mockDependencies: any;

  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    postToDesignLibrarySpy = sandbox.stub();
    addComponentUpdateHandlerSpy = sandbox.stub();
    updateComponentActionSpy = sandbox.stub();
    previewComponentActionSpy = sandbox.stub();
    addServerComponentPreviewHandlerSpy = sandbox.stub();
    getDesignLibraryImportMapEventSpy = sandbox.stub();
    getDesignLibraryComponentPropsEventSpy = sandbox.stub();
    addStyleElementSpy = sandbox.stub();
    sendErrorEventSpy = sandbox.stub();

    // Mock useSitecore hook
    useSitecoreStub = sandbox.stub().returns({
      page: {
        locale: 'en',
        layout: { sitecore: { context: {}, route: null } },
        mode: { name: DesignLibraryMode.Normal, isDesignLibrary: true },
      },
      componentMap: new Map(),
      api: {
        edge: {
          contextId: 'test-context-id',
          clientContextId: 'test-client-context-id',
          edgeUrl: 'https://test-edge-url.com',
        },
        local: { apiKey: 'test-api-key', apiHost: 'https://test-api-host.com', path: '/test-path' },
      },
    });

    // Use proxyquire to load module with mocked dependencies
    const module = proxyquire('./DesignLibraryClientEvents', {
      '@sitecore-content-sdk/react': {
        useSitecore: useSitecoreStub,
      },
    });

    DesignLibraryVariantGenerationEvents = module.DesignLibraryVariantGenerationEvents;
    DesignLibraryPreviewEvents = module.DesignLibraryPreviewEvents;
    __mockDependencies = module.__mockDependencies;

    __mockDependencies({
      postToDesignLibrary: postToDesignLibrarySpy,
      addComponentUpdateHandler: addComponentUpdateHandlerSpy,
      updateComponentAction: updateComponentActionSpy,
      previewComponentAction: previewComponentActionSpy,
      addServerComponentPreviewHandler: addServerComponentPreviewHandlerSpy,
      getDesignLibraryImportMapEvent: getDesignLibraryImportMapEventSpy,
      getDesignLibraryComponentPropsEvent: getDesignLibraryComponentPropsEventSpy,
      addStyleElement: addStyleElementSpy,
      sendErrorEvent: sendErrorEventSpy,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const components = new Map<string, React.FC>();
  const api = {
    edge: {
      contextId: 'test-context-id',
      clientContextId: 'test-client-context-id',
      edgeUrl: 'https://test-edge-url.com',
    },
    local: { apiKey: 'test-api-key', apiHost: 'https://test-api-host.com', path: '/test-path' },
  };

  const importMap = [
    { module: 'react', exports: ['default', 'useState'] },
    { module: 'next/image', exports: ['default'] },
  ];

  const testEditedComponent =
    getTestLayoutData().layoutData.sitecore.route?.placeholders[EDITING_COMPONENT_PLACEHOLDER]?.[0];

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = modeLibrary): Page => ({
    locale: 'en',
    layout: layout || { sitecore: { context: {}, route: null } },
    mode: pageMode,
  });

  const modeLibrary: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: false },
    isNormal: false,
    isPreview: false,
    isEditing: false,
  };

  const modeLibraryMetadata_Gen: PageMode = {
    name: DesignLibraryMode.Metadata,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: true },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const renderWithSitecore = (
    props: any,
    pageMode: PageMode = modeLibrary,
    isVariantGeneration: boolean = false
  ) => {
    const layoutData: LayoutServiceData = getTestLayoutData();
    const page = getPage(layoutData, pageMode);

    // Update the useSitecore mock to return the correct page/api context
    useSitecoreStub.returns({
      page,
      componentMap: components,
      api,
    });

    return render(
      <>
        {isVariantGeneration ? (
          <DesignLibraryVariantGenerationEvents {...props} />
        ) : (
          <DesignLibraryPreviewEvents {...props} />
        )}
      </>
    );
  };

  describe('DesignLibraryPreviewEvents', () => {
    it('should post status event on mount', async () => {
      renderWithSitecore({
        designLibraryStatus: DesignLibraryStatus.READY,
        component: testEditedComponent,
      });

      await waitFor(() => {
        expect(postToDesignLibrarySpy).to.have.been.calledWith(
          sinon.match({
            name: 'component:status',
            message: {
              status: DesignLibraryStatus.READY,
              uid: testEditedComponent.uid,
              isRenderingServerComponent: true,
            },
          })
        );
      });
    });

    it('should add component update handler on mount', async () => {
      renderWithSitecore({
        designLibraryStatus: DesignLibraryStatus.READY,
        component: testEditedComponent,
      });

      expect(addComponentUpdateHandlerSpy).to.have.been.calledOnce;
      expect(addComponentUpdateHandlerSpy).to.have.been.calledWith(
        testEditedComponent,
        sinon.match.func
      );
    });

    it('should call updateComponentAction when component is updated', () => {
      renderWithSitecore({
        designLibraryStatus: DesignLibraryStatus.READY,
        component: testEditedComponent,
      });

      const updateCallback = addComponentUpdateHandlerSpy.getCall(0).args[1];
      const rendering = {
        ...testEditedComponent,
        fields: { title: { value: 'Updated Title' } },
      };

      updateCallback(rendering);

      expect(updateComponentActionSpy).to.have.been.calledWith({
        uid: rendering.uid,
        rendering,
      });
    });

    it('should clean up event handlers on unmount', async () => {
      const unsubUpdate = sinon.stub();
      addComponentUpdateHandlerSpy.returns(unsubUpdate);

      const { unmount } = renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
        },
        modeLibraryMetadata_Gen
      );

      unmount();

      expect(unsubUpdate).to.have.been.calledOnce;
    });

    describe('error handling', () => {
      it('should not post status event when component UID is missing', async () => {
        renderWithSitecore({
          designLibraryStatus: DesignLibraryStatus.READY,
          component: { ...testEditedComponent, uid: undefined },
        });

        await waitFor(() => {
          expect(postToDesignLibrarySpy).to.not.have.been.called;
        });
      });

      it('should not add component update handler when component UID is missing', () => {
        renderWithSitecore({
          designLibraryStatus: DesignLibraryStatus.READY,
          component: { ...testEditedComponent, uid: undefined },
        });

        expect(addComponentUpdateHandlerSpy).to.not.have.been.called;
      });

      it('should not add component update handler when component is null', () => {
        renderWithSitecore({
          designLibraryStatus: DesignLibraryStatus.READY,
          component: null,
        });

        expect(addComponentUpdateHandlerSpy).to.not.have.been.called;
      });
    });
  });

  describe('DesignLibraryVariantGenerationEvents', () => {
    const testPropsEvent = {
      uid: '82696f4f-15d5-4bca-895f-d4b66327807d',
      fields: {
        PromoText: {
          metadata: {
            datasource: {
              id: '{6E076E6D-5729-4079-84C6-6C0C79C70BDF}',
              language: 'en',
              revision: '17bf47cc-7034-46a7-ade5-56ebf87052b0',
              version: 1,
            },
            title: 'Text',
            fieldId: '{28079F3A-896B-4273-BE5F-59D0EBB7CD7D}',
            fieldType: 'Rich Text',
            rawValue:
              '<h3>Latest Streetwear</h3>\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.</p>',
          },
          value:
            '<h3>Latest Streetwear</h3>\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus.</p>',
        },
      },
      parameters: {
        GridParameters: 'col-12',
        FieldNames: 'Default',
        Styles: '',
        RenderingIdentifier: '',
        DynamicPlaceholderId: '3',
      },
    };

    const testImportEvent = {
      name: 'component:generation:import-map',
      message: {
        uid: '82696f4f-15d5-4bca-895f-d4b66327807d',
        importMap: [
          {
            module: '@sitecore-content-sdk/nextjs',
            exports: ['Link', 'Text'],
          },
          {
            module: 'react',
            exports: ['Suspense', 'default', 'Children'],
          },
        ],
      },
    };

    it('should post status event on mount', async () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
        },
        modeLibraryMetadata_Gen,
        true
      );

      await waitFor(() => {
        expect(postToDesignLibrarySpy).to.have.been.calledWith(
          sinon.match({
            name: 'component:status',
            message: {
              status: DesignLibraryStatus.READY,
              uid: testEditedComponent.uid,
              isRenderingServerComponent: true,
            },
          })
        );
      });
    });

    it('should add component update handler on mount', async () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
        },
        modeLibraryMetadata_Gen,
        true
      );

      expect(addComponentUpdateHandlerSpy).to.have.been.calledOnce;
      expect(addComponentUpdateHandlerSpy).to.have.been.calledWith(
        testEditedComponent,
        sinon.match.func
      );
    });

    it('should call updateComponentAction when component is updated', () => {
      const previewComponentData = {
        message: { styles: { content: 'some style' }, code: { content: 'some code' } },
      };
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          previewComponentData: previewComponentData,
        },
        modeLibraryMetadata_Gen,
        true
      );

      const updateCallback = addComponentUpdateHandlerSpy.getCall(0).args[1];
      const rendering = {
        ...testEditedComponent,
        fields: { title: { value: 'Updated Title' } },
      };

      updateCallback(rendering);

      expect(updateComponentActionSpy).to.have.been.calledWith({
        uid: rendering.uid,
        rendering,
        generatedComponentData: undefined,
      });
    });

    it('should clean up event handlers on unmount', async () => {
      const unsubUpdate = sinon.stub();
      const unsubPreview = sinon.stub();
      addComponentUpdateHandlerSpy.returns(unsubUpdate);
      addServerComponentPreviewHandlerSpy.returns(unsubPreview);

      const { unmount } = renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen,
        true
      );

      unmount();

      expect(unsubUpdate).to.have.been.calledOnce;
      expect(unsubPreview).to.have.been.calledOnce;
    });

    it('should add server component preview handler in variant generation mode', () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen,
        true
      );

      expect(addServerComponentPreviewHandlerSpy).to.have.been.calledOnce;
      expect(addServerComponentPreviewHandlerSpy).to.have.been.calledWith(
        testEditedComponent,
        sinon.match.func
      );
    });

    it('should post import map event and component props event in variant generation mode', async () => {
      getDesignLibraryComponentPropsEventSpy.returns(testImportEvent);
      getDesignLibraryImportMapEventSpy.returns(testPropsEvent);

      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen,
        true
      );
      expect(getDesignLibraryImportMapEventSpy).to.have.been.calledOnce;
      expect(getDesignLibraryComponentPropsEventSpy).to.have.been.calledOnce;
      expect(postToDesignLibrarySpy).to.have.been.calledWith(testImportEvent);
      expect(postToDesignLibrarySpy).to.have.been.calledWith(testPropsEvent);
    });

    it('should call previewComponentAction when preview component event is received', async () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen,
        true
      );

      const updateCallback = addServerComponentPreviewHandlerSpy.getCall(0).args[1];
      const mockRendering = { componentName: 'Test', uid: testEditedComponent.uid };
      const componentPreviewServerEvent = {
        name: 'component:generation:component-preview',
        message: {
          cache: {
            id: 'test-cache-id',
            token: 'test-cache-token',
          },
        },
      };

      updateCallback(mockRendering, componentPreviewServerEvent);

      expect(previewComponentActionSpy).to.have.been.calledWith(
        {
          uid: testEditedComponent.uid,
          args: componentPreviewServerEvent,
        },
        mockRendering,
        'https://test-edge-url.com'
      );
    });

    it('should add style element when previewComponentData style is provided', async () => {
      const testStyle = '.test-class { color: red; }';
      const previewComponentData = { styles: { content: testStyle } };
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
          generatedComponentData: previewComponentData,
        },
        modeLibraryMetadata_Gen,
        true
      );

      expect(addStyleElementSpy).to.have.been.calledWith(testStyle);
    });

    it('should not add style element when previewComponentData style is not provided', async () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen
      );

      expect(addStyleElementSpy).to.not.have.been.called;
    });

    it('should send error event when importMapError is present', async () => {
      const testError = 'something wrong happened';

      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
          componentInitError: {
            message: testError,
            type: DesignLibraryPreviewError.ImportMapLoad,
          },
        },
        modeLibraryMetadata_Gen,
        true
      );

      expect(sendErrorEventSpy).to.have.been.called;
      expect(sendErrorEventSpy).to.have.been.calledWith(
        testEditedComponent.uid,
        testError,
        DesignLibraryPreviewError.ImportMapLoad
      );
    });

    it('should not set up preview handler when importMapError exists', async () => {
      renderWithSitecore(
        {
          designLibraryStatus: DesignLibraryStatus.READY,
          component: testEditedComponent,
          importMap: importMap,
        },
        modeLibraryMetadata_Gen,
        true
      );

      expect(sendErrorEventSpy).to.not.have.been.called;
    });

    describe('error handling', () => {
      it('should not post status event when component UID is missing', async () => {
        renderWithSitecore(
          {
            designLibraryStatus: DesignLibraryStatus.READY,
            component: { ...testEditedComponent, uid: undefined },
            importMap: importMap,
          },
          modeLibraryMetadata_Gen,
          true
        );

        await waitFor(() => {
          expect(postToDesignLibrarySpy).to.not.have.been.called;
        });
      });

      it('should not add component update handler when component UID is missing', () => {
        renderWithSitecore(
          {
            designLibraryStatus: DesignLibraryStatus.READY,
            component: { ...testEditedComponent, uid: undefined },
            importMap: importMap,
          },
          modeLibraryMetadata_Gen,
          true
        );

        expect(addComponentUpdateHandlerSpy).to.not.have.been.called;
      });

      it('should not add server component preview handler when component UID is missing', () => {
        renderWithSitecore(
          {
            designLibraryStatus: DesignLibraryStatus.READY,
            component: { ...testEditedComponent, uid: undefined },
            importMap: importMap,
          },
          modeLibraryMetadata_Gen,
          true
        );

        expect(addServerComponentPreviewHandlerSpy).to.not.have.been.called;
      });

      it('should not add component update handler when component is null', () => {
        renderWithSitecore(
          {
            designLibraryStatus: DesignLibraryStatus.READY,
            component: null,
            importMap: importMap,
          },
          modeLibraryMetadata_Gen,
          true
        );

        expect(addComponentUpdateHandlerSpy).to.not.have.been.called;
      });
    });
  });
});
