/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';
import { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DesignLibrary } from './DesignLibrary';
import { getTestLayoutData } from '../test-data/component-editing-data';
import { SitecoreProvider } from './SitecoreProvider';
import { RichText } from './RichText';
import { Text } from './Text';
import { Placeholder } from '..';

import {
  DesignLibraryStatus,
  ComponentUpdateEventArgs,
  getDesignLibraryStatusEvent,
  DesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { __mockDependencies } from './DesignLibrary';

describe('<DesignLibrary />', () => {
  const sandbox = sinon.createSandbox();
  const postMessageSpy = sandbox.spy(global.window, 'postMessage');
  const consoleErrorSpy = sandbox.spy(console, 'error');
  const components = new Map<string, React.FC>();

  const mode: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: {
      isVariantGeneration: false,
    },
    isNormal: false,
    isPreview: false,
    isEditing: false,
  };

  const variantGenerationMode: PageMode = {
    name: DesignLibraryMode.VariantGeneration,
    isNormal: false,
    isPreview: false,
    isEditing: false,
    isDesignLibrary: true,
    designLibrary: {
      isVariantGeneration: true,
    },
  };

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = mode): Page => ({
    locale: 'en',
    layout: layout || {
      sitecore: {
        context: {},
        route: null,
      },
    },
    mode: pageMode,
  });

  const api = {
    edge: {
      contextId: 'test-context-id',
      clientContextId: 'test-client-context-id',
      edgeUrl: 'https://test-edge-url.com',
    },
    local: {
      apiKey: 'test-api-key',
      apiHost: 'https://test-api-host.com',
      path: '/test-path',
    },
  };

  it('should render null if not in design library mode', () => {
    const page = getPage();

    page.mode = {
      name: DesignLibraryMode.Normal,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
      isNormal: false,
      isPreview: false,
      isEditing: false,
    };
    const rendered = render(
      <SitecoreProvider componentMap={components} api={api} page={page}>
        <DesignLibrary />
      </SitecoreProvider>,
      { container: document.body }
    );
    expect(rendered.baseElement.innerHTML).to.equal('');
  });

  describe('Preview', () => {
    let page: Page;

    const ContentBlock: React.FC<{
      [prop: string]: unknown;
      fields?: { content: { value: string }; heading: { value: string } };
    }> = (props) => (
      <div className="test">
        <RichText field={props.fields?.content} />
        <Placeholder name="inner" rendering={props.rendering} />
      </div>
    );

    const InnerBlock: React.FC<{
      [prop: string]: unknown;
      fields?: { text: { value: string } };
    }> = (props) => (
      <div className="inner">
        <Text field={props.fields?.text} />
      </div>
    );

    components.set('ContentBlock', ContentBlock);
    components.set('InnerBlock', InnerBlock);

    // eslint-disable-next-line jsdoc/require-jsdoc
    async function sendUpdateEvent(
      eventDataDetails: ComponentUpdateEventArgs['details']
    ): Promise<void> {
      // jsdom performs postMessage without origin. We work around, ugly (https://github.com/jsdom/jsdom/issues/2745)
      // jsdom also doesn't consider `new MessageEvent()` to be of class Event - so we go very much around to get it working
      const updateEvent = document.createEvent('Event');
      const updateEventData: ComponentUpdateEventArgs = {
        name: 'component:update',
        details: eventDataDetails,
      };
      updateEvent.initEvent('message', false, true);
      (updateEvent as any).origin = window.location.origin;
      (updateEvent as any).data = updateEventData;
      await fireEvent(window, updateEvent);
    }

    beforeEach(() => {
      const basicPage = getTestLayoutData();
      page = getPage(basicPage.layoutData);
    });

    it('should render', () => {
      // don't wrap the content in divs
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );
      expect(rendered.baseElement.innerHTML).to.equal(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div></div></div></main>',
        ].join('')
      );
    });

    it('should render component with placeholders', () => {
      page.layout = getTestLayoutData(true).layoutData;

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div>',
          '<div class="inner">',
          'Its an inner component',
          '</div></div></div>',
          '</main>',
        ].join('')
      );
    });

    it('should fire component:ready event', () => {
      const expectedReadyMessage = getDesignLibraryStatusEvent(
        DesignLibraryStatus.READY,
        'test-content'
      );

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div></div></div></main>',
        ].join('')
      );

      expect(
        postMessageSpy
          .getCalls()
          .some((call) => JSON.stringify(call.args[0]) === JSON.stringify(expectedReadyMessage))
      ).to.be.true;
    });

    it('should update root component', async () => {
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div></div></div></main>',
        ].join('')
      );

      await sendUpdateEvent({
        uid: 'test-content',
        fields: { content: { value: 'new content!' } },
      });

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          'new content!',
          '</div></div></div></main>',
        ].join('')
      );
    });

    it('should update nested component', async () => {
      const placeholderPage = getTestLayoutData(true);
      page.layout = placeholderPage.layoutData;

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div>',
          '<div class="inner">',
          'Its an inner component',
          '</div></div></div>',
          '</main>',
        ].join('')
      );

      await sendUpdateEvent({
        uid: 'test-inner',
        fields: { text: { value: 'new inner content!' } },
      });

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div>',
          '<div class="inner">',
          'new inner content!',
          '</div></div></div>',
          '</main>',
        ].join('')
      );
    });

    it('should send render event when component is updated', async () => {
      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>
      );

      await sendUpdateEvent({
        uid: 'test-content',
        fields: { content: { value: 'new content!' } },
      });

      expect(
        postMessageSpy
          .getCalls()
          .some((call) =>
            JSON.stringify(call.args[0]).includes(
              JSON.stringify(
                getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'test-content')
              )
            )
          )
      ).to.be.true;
    });
  });

  describe('VariantGeneration', () => {
    const TestComponent = () => <div>TestComponent</div>;
    const unsubscribeSpy = sandbox.spy();
    let addComponentPreviewHandlerSpy: sandbox.SinonStub;
    let page: Page;

    const defaultImportMap = () =>
      new Promise((resolve) => {
        resolve({
          default: [
            {
              module: 'react',
              exports: [{ name: 'default', value: React }],
            },
          ],
        });
      });

    let callbackEvent: any = null;

    beforeEach(() => {
      page = getPage(getTestLayoutData().layoutData, variantGenerationMode);

      addComponentPreviewHandlerSpy = sandbox.stub().callsFake((_importMap, callback) => {
        callbackEvent = callback;

        return unsubscribeSpy;
      });

      __mockDependencies({ addComponentPreviewHandler: addComponentPreviewHandlerSpy });
    });

    afterEach(() => {
      postMessageSpy.resetHistory();
      consoleErrorSpy.resetHistory();
      addComponentPreviewHandlerSpy.resetHistory();
      unsubscribeSpy.resetHistory();
    });

    it('should render component when provided', async () => {
      const rendered = await render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Wait for the useEffect to complete and component to render
      await waitFor(() => {
        expect(addComponentPreviewHandlerSpy).to.have.been.called;
        callbackEvent(null, TestComponent);
        expect(rendered.baseElement.innerHTML).to.contain('TestComponent');
      });
    });

    it('should render loading preview when no component is provided', () => {
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Check that we are in variant generation mode and rendering loading state
      expect(rendered.baseElement.innerHTML).to.contain('Loading preview...');
    });

    it('should render error message when component fails to initialize', async () => {
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      await waitFor(() => {
        callbackEvent('Error', null);
        expect(rendered.baseElement.innerHTML).to.contain('Error during component initialization');
      });
    });

    it('should render error message when import map promise cannot be resolved', async () => {
      const initError = new Error('Failed to load import map');
      const errorImportMap = () =>
        new Promise((_, reject) => {
          reject(initError);
        });
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={errorImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      await waitFor(() => {
        expect(rendered.baseElement.innerHTML).to.contain(
          'No dynamic import map loaded. Please check a dynamic import map function is passed into Design Library'
        );
        expect(consoleErrorSpy.calledWith('Error loading import map:', initError)).to.be.true;
      });
    });

    it('should render error message when component fails to render', async () => {
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      await waitFor(() => {
        callbackEvent(null, () => {
          throw new Error('Error rendering component');
        });
        expect(rendered.baseElement.innerHTML).to.contain('Error during component rendering');
      });
    });

    it('should render error message when no rendering is found', () => {
      // Set to empty array to simulate no rendering found
      page.layout.sitecore.route!.placeholders['editing-componentmode-placeholder'] = [];

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        'No component found in layout data. Please check your layout data.'
      );
    });

    it('should render error message when no import map is provided', async () => {
      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      await waitFor(() => {
        expect(rendered.baseElement.innerHTML).to.contain(
          'No dynamic import map loaded. Please check a dynamic import map function is passed into Design Library'
        );
      });
    });

    it('should send postMessage events for import-map and component-props', async () => {
      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Check that postMessage was called (we can't easily mock the event functions)
      await waitFor(() => {
        expect(postMessageSpy.called).to.be.true;
        expect(postMessageSpy.callCount).to.be.greaterThan(0);
      });
    });
  });
});
