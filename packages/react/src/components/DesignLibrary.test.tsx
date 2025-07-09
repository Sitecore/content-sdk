/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { PageMode } from '@sitecore-content-sdk/core/client';
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
  const postMessageSpy = sinon.spy(global.window, 'postMessage');
  const components = new Map<string, React.FC>();

  const mode: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: {
      isVariantGeneration: false,
    },
  };

  const variantGenerationMode: PageMode = {
    name: DesignLibraryMode.VariantGeneration,
    isDesignLibrary: true,
    designLibrary: {
      isVariantGeneration: true,
    },
  };

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
    const mode = {
      name: DesignLibraryMode.Normal,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    };
    const rendered = render(
      <SitecoreProvider
        componentMap={components}
        layoutData={getTestLayoutData().layoutData}
        api={api}
        mode={mode}
      >
        <DesignLibrary />
      </SitecoreProvider>,
      { container: document.body }
    );
    expect(rendered.baseElement.innerHTML).to.equal('');
  });

  describe('Preview', () => {
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

    it('should render', () => {
      const basicPage = getTestLayoutData();
      // don't wrap the content in divs
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={mode}
        >
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
      const placeholderPage = getTestLayoutData(true);
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={placeholderPage.layoutData}
          api={api}
          mode={mode}
        >
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
      const basicPage = getTestLayoutData();
      const expectedReadyMessage = getDesignLibraryStatusEvent(
        DesignLibraryStatus.READY,
        'test-content'
      );
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={mode}
        >
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
      const basicPage = getTestLayoutData();
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={mode}
        >
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
      // const basicPage = getTestLayoutData();
      const placeholderPage = getTestLayoutData(true);
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={placeholderPage.layoutData}
          api={api}
          mode={mode}
        >
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
      const basicPage = getTestLayoutData();
      render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={mode}
        >
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
    const unsubscribeSpy = sinon.spy();
    let addComponentPreviewHandlerSpy: sinon.SinonStub;

    beforeEach(() => {
      addComponentPreviewHandlerSpy = sinon.stub().callsFake((callback) => {
        callback(TestComponent);

        return unsubscribeSpy;
      });

      __mockDependencies({ addComponentPreviewHandler: addComponentPreviewHandlerSpy });
    });

    afterEach(() => {
      postMessageSpy.resetHistory();
      addComponentPreviewHandlerSpy.resetHistory();
      unsubscribeSpy.resetHistory();
    });

    it('should render component when provided', async () => {
      const basicPage = getTestLayoutData();
      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={variantGenerationMode}
        >
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Wait for the useEffect to complete and component to render
      await waitFor(() => {
        expect(rendered.baseElement.innerHTML).to.contain('TestComponent');
      });
    });

    it('should render loading preview when no component is provided', () => {
      const basicPage = getTestLayoutData();

      addComponentPreviewHandlerSpy.callsFake((callback) => {
        callback(null);

        return unsubscribeSpy;
      });

      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={variantGenerationMode}
        >
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Check that we are in variant generation mode and rendering loading state
      expect(rendered.baseElement.innerHTML).to.contain('Loading preview...');
    });

    it('should render error message when no rendering is found', () => {
      const emptyPage = getTestLayoutData();
      // Set to empty array to simulate no rendering found
      emptyPage.layoutData.sitecore.route.placeholders['editing-componentmode-placeholder'] = [];

      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          layoutData={emptyPage.layoutData}
          api={api}
          mode={variantGenerationMode}
        >
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        'No component found in layout data. Please check your layout data.'
      );
    });

    it('should send postMessage events for import-map and component-props', () => {
      const basicPage = getTestLayoutData();
      render(
        <SitecoreProvider
          componentMap={components}
          layoutData={basicPage.layoutData}
          api={api}
          mode={variantGenerationMode}
        >
          <DesignLibrary />
        </SitecoreProvider>,
        { container: document.body }
      );

      // Check that postMessage was called (we can't easily mock the event functions)
      expect(postMessageSpy.called).to.be.true;
      expect(postMessageSpy.callCount).to.be.greaterThan(0);
    });
  });
});
