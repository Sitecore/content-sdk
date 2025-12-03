/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { Page, PageMode } from '@sitecore-content-sdk/core/client';
import {
  LayoutServiceData,
  EDITING_COMPONENT_PLACEHOLDER,
} from '@sitecore-content-sdk/core/layout';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { DesignLibrary } from './DesignLibrary';
import { getTestLayoutData } from '../../test-data/component-editing-data';
import { SitecoreProvider } from '../SitecoreProvider';
import { RichText } from '../RichText';
import { Text } from '../Text';
import { Placeholder } from '../Placeholder';

import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  DesignLibraryMode,
} from '@sitecore-content-sdk/core/editing';
import { __mockDependencies } from './DesignLibrary';
import {
  DesignLibraryPreviewError,
  getDesignLibraryComponentPreviewErrorEvent,
} from '@sitecore-content-sdk/core/codegen';
import { after } from 'node:test';

before(() => {
  if (typeof window !== 'undefined' && !window.requestAnimationFrame) {
    (window as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
  }
});

describe('<DesignLibrary />', () => {
  after(() => {
    sandbox.restore();
  });
  const sandbox = sinon.createSandbox();
  const postMessageSpy = sandbox.spy(window, 'postMessage');
  const components = new Map<string, React.FC>();

  const api = {
    edge: {
      contextId: 'test-context-id',
      clientContextId: 'test-client-context-id',
      edgeUrl: 'https://test-edge-url.com',
    },
    local: { apiKey: 'test-api-key', apiHost: 'https://test-api-host.com', path: '/test-path' },
  };

  // Modes
  const modeLibraryMetadata: PageMode = {
    name: DesignLibraryMode.Metadata,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: false },
    isNormal: false,
    isPreview: false,
    isEditing: true,
  };

  const modeLibrary_Gen: PageMode = {
    name: DesignLibraryMode.Normal,
    isDesignLibrary: true,
    designLibrary: { isVariantGeneration: true },
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

  const getPage = (layout?: LayoutServiceData, pageMode: PageMode = modeLibrary): Page => ({
    locale: 'en',
    layout: layout || { sitecore: { context: {}, route: null } },
    mode: pageMode,
  });

  const ContentBlock: React.FC<{
    [prop: string]: unknown;
    fields?: { content: { value: string }; heading: { value: string } };
  }> = (props) => (
    <div className="test">
      <RichText field={props.fields?.content} />
      <Placeholder name="inner" rendering={props.rendering} />
    </div>
  );

  const InnerBlock: React.FC<{ [prop: string]: unknown; fields?: { text: { value: string } } }> = (
    props
  ) => (
    <div className="inner">
      <Text field={props.fields?.text} />
    </div>
  );

  components.set('ContentBlock', ContentBlock);
  components.set('InnerBlock', InnerBlock);

  async function sendUpdate(details: { uid: string; fields?: any; params?: any }) {
    const ev = document.createEvent('Event');
    ev.initEvent('message', false, true);
    (ev as any).origin = window.location.origin;
    (ev as any).data = { name: 'component:update', details };
    await fireEvent(window, ev);
  }

  const defaultImportMap = () =>
    Promise.resolve({
      default: [{ module: 'react', exports: [{ name: 'default', value: React }] }],
    });

  const unsubscribeSpy = sandbox.spy();
  let addComponentPreviewHandlerSpy: sinon.SinonStub;
  let postToDesignLibrarySpy: sinon.SinonStub;
  let sendErrorEventSpy: sinon.SinonStub;
  let callbackEvent: any = null;

  const RENDER_ID = 'test-content';
  const PLACEHOLDER_GUID = '00000000-0000-0000-0000-000000000000';

  const joinHtml = (parts: string[]) => parts.join('');
  const expectContains = (html: string, parts: string[]) =>
    expect(html).to.contain(joinHtml(parts));

  const expectedInitialMarkup = (guid = PLACEHOLDER_GUID, id = RENDER_ID) =>
    joinHtml([
      '<main><div id="editing-component">',
      `<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="editing-componentmode-placeholder_${guid}"></code>`,
      `<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="${id}"></code>`,
      '<div class="test"><div>',
      '<p>This is a live set of examples of how to use Content SDK</p>\n',
      '</div><div class="sc-jss-empty-placeholder">',
      '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id=""></code>',
      '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      '</div></div>',
      '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
      '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      '</div></main>',
    ]);

  const postedEventsJson = (spy: sinon.SinonSpy) =>
    spy.getCalls().map((c) => JSON.stringify(c.args[0]));

  const expectStatus = (
    spy: sinon.SinonSpy,
    status: DesignLibraryStatus,
    id: string,
    opts: { strict?: boolean } = {}
  ) => {
    const target = JSON.stringify(getDesignLibraryStatusEvent(status, id));
    const events = postedEventsJson(spy);
    if (opts.strict) {
      expect(events).to.include(target);
    } else {
      expect(events.some((e) => e.includes(target))).to.be.true;
    }
  };

  beforeEach(() => {
    postMessageSpy.resetHistory();
    unsubscribeSpy.resetHistory();
    postToDesignLibrarySpy = sandbox.stub().callsFake((evt) => {
      // postToDesignLibrary calls window.postMessage internally
      window.postMessage(evt, '*');
    });
    sendErrorEventSpy = sandbox.stub().callsFake((uid, error, type) => {
      // sendErrorEvent calls window.postMessage internally
      const errorEvent = getDesignLibraryComponentPreviewErrorEvent(uid, error, type);
      window.postMessage(errorEvent, '*');
    });
    __mockDependencies({
      postToDesignLibrary: postToDesignLibrarySpy,
      sendErrorEvent: sendErrorEventSpy,
    });

    if (typeof (globalThis as any).requestAnimationFrame === 'undefined') {
      (globalThis as any).requestAnimationFrame = (cb: Function) => setTimeout(cb, 0);
      (globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
    }
    if (typeof window !== 'undefined') {
      (window as any).requestAnimationFrame = (globalThis as any).requestAnimationFrame;
      (window as any).cancelAnimationFrame = (globalThis as any).cancelAnimationFrame;
    }
  });

  it('should render null if not in design library mode', () => {
    const page = getPage(getTestLayoutData().layoutData, {
      name: DesignLibraryMode.Normal,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
      isNormal: false,
      isPreview: false,
      isEditing: false,
    });

    const rendered = render(
      <SitecoreProvider componentMap={components} api={api} page={page}>
        <DesignLibrary />
      </SitecoreProvider>,
      { container: document.body }
    );
    expect(rendered.baseElement.innerHTML).to.equal('');
  });

  describe('mode=library and isVariantGeneration=false', () => {
    let page: Page;

    const modeLibrary: PageMode = {
      name: DesignLibraryMode.Normal,
      isDesignLibrary: true,
      designLibrary: { isVariantGeneration: false },
      isNormal: false,
      isPreview: false,
      isEditing: false,
    };

    async function sendUpdateEvent(details: { uid: string; fields?: any; params?: any }) {
      const ev = document.createEvent('Event');
      ev.initEvent('message', false, true);
      (ev as any).origin = window.location.origin;
      (ev as any).data = { name: 'component:update', details };
      await fireEvent(window, ev);
    }

    beforeEach(() => {
      const basic = getTestLayoutData();
      page = {
        locale: 'en',
        layout: basic.layoutData,
        mode: modeLibrary,
      };
      postMessageSpy.resetHistory();
    });

    it('renders real component and sends READY + initial RENDERED', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary);

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>
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
          .some(
            (c) =>
              JSON.stringify(c.args[0]) ===
              JSON.stringify(getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'test-content'))
          )
      ).to.be.true;

      await waitFor(() => {
        expect(
          postMessageSpy
            .getCalls()
            .some((c) =>
              JSON.stringify(c.args[0]).includes(
                JSON.stringify(
                  getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'test-content')
                )
              )
            )
        ).to.be.true;
      });
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
      const withPlaceholder = getTestLayoutData(true);
      page.layout = withPlaceholder.layoutData;

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
  });

  describe('mode=library-metadata and isVariantGeneration=false', () => {
    it('renders real component and sends READY + initial RENDERED', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibraryMetadata);

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain(expectedInitialMarkup());

      expectStatus(postMessageSpy, DesignLibraryStatus.READY, RENDER_ID, { strict: true });

      await waitFor(() => expectStatus(postMessageSpy, DesignLibraryStatus.RENDERED, RENDER_ID));
    });
  });

  describe('mode=library&generation=variant and isVariantGeneration=true', () => {
    beforeEach(() => {
      addComponentPreviewHandlerSpy = sandbox.stub().callsFake((_importMap, cb) => {
        callbackEvent = cb;
        return unsubscribeSpy;
      });
      __mockDependencies({
        addComponentPreviewHandler: addComponentPreviewHandlerSpy,
        postToDesignLibrary: postToDesignLibrarySpy,
        sendErrorEvent: sendErrorEventSpy,
      });

      postMessageSpy.resetHistory();
    });

    it('fires component:ready on mount', () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>
      );

      const expectedReady = getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'test-content');
      expect(
        postMessageSpy
          .getCalls()
          .some((c) => JSON.stringify(c.args[0]) === JSON.stringify(expectedReady))
      ).to.be.true;

      const readyCount = postMessageSpy
        .getCalls()
        .filter(
          (c) =>
            c.args[0]?.name === expectedReady.name &&
            c.args[0]?.message?.uid === expectedReady.message.uid
        ).length;
      expect(readyCount).to.equal(1);
    });

    it('fires component:rendered only after generated component is received', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>
      );

      const expectedRendered = getDesignLibraryStatusEvent(
        DesignLibraryStatus.RENDERED,
        'test-content'
      );
      expect(
        postMessageSpy
          .getCalls()
          .some((c) => JSON.stringify(c.args[0]) === JSON.stringify(expectedRendered))
      ).to.be.false;

      await waitFor(() => {
        expect(addComponentPreviewHandlerSpy).to.have.been.called;
      });

      const TestComponent = () => <div>Generated!</div>;
      callbackEvent(null, TestComponent);

      await waitFor(() => {
        expect(
          postMessageSpy
            .getCalls()
            .some((c) => JSON.stringify(c.args[0]) === JSON.stringify(expectedRendered))
        ).to.be.true;
      });
    });

    it('renders real component first, wires generation, then switches to generated component', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div></div></div></main>',
        ].join('')
      );

      await waitFor(() => {
        expect(addComponentPreviewHandlerSpy).to.have.been.called;
      });

      const TestComponent = () => <div>Generated!</div>;
      callbackEvent(null, TestComponent);

      await waitFor(() => {
        expect(rendered.baseElement.innerHTML).to.contain('<div>Generated!</div>');
      });
    });

    it('renders real component first, wires generation, then switches to generated component when loadImportMap provided via SitecoreProvider', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      const rendered = render(
        <SitecoreProvider
          componentMap={components}
          api={api}
          page={page}
          loadImportMap={defaultImportMap}
        >
          <DesignLibrary />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        [
          '<main><div id="editing-component">',
          '<div class="test"><div>',
          '<p>This is a live set of examples of how to use Content SDK</p>\n',
          '</div></div></div></main>',
        ].join('')
      );

      await waitFor(() => {
        expect(addComponentPreviewHandlerSpy).to.have.been.called;
      });

      const TestComponent = () => <div>Generated!</div>;
      callbackEvent(null, TestComponent);

      await waitFor(() => {
        expect(rendered.baseElement.innerHTML).to.contain('<div>Generated!</div>');
      });
    });

    it('updates via component:update after switch', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      const Gen = (props: any) => <div className="gen">{props.fields?.content?.value}</div>;

      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>
      );

      await waitFor(() => {
        expect(addComponentPreviewHandlerSpy).to.have.been.called;
        callbackEvent(null, Gen);
      });

      await sendUpdate({
        uid: 'test-content',
        fields: { content: { value: 'updated!' } },
      });

      await waitFor(() => {
        expect(
          postMessageSpy
            .getCalls()
            .some((c) =>
              JSON.stringify(c.args[0]).includes(
                JSON.stringify(
                  getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'test-content')
                )
              )
            )
        ).to.be.true;
      });
    });

    it('sends error event when no import map is provided', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibrary_Gen);

      render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>
      );

      await waitFor(() => {
        expect(
          postMessageSpy
            .getCalls()
            .some((c) =>
              JSON.stringify(c.args[0]).includes(
                JSON.stringify(
                  getDesignLibraryComponentPreviewErrorEvent(
                    'test-content',
                    'No loadImportMap provided',
                    DesignLibraryPreviewError.RenderInit
                  )
                )
              )
            )
        ).to.be.true;
      });
    });
  });

  describe('?mode=library-metadata&generation=variant and isVariantGeneration=true', () => {
    beforeEach(() => {
      addComponentPreviewHandlerSpy = sandbox.stub().callsFake((_importMap, cb) => {
        callbackEvent = cb;
        return unsubscribeSpy;
      });
      __mockDependencies({
        addComponentPreviewHandler: addComponentPreviewHandlerSpy,
        postToDesignLibrary: postToDesignLibrarySpy,
        sendErrorEvent: sendErrorEventSpy,
      });
    });

    const expectedGeneratedParts = [
      '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close">',
      '<div>Gen-Metadata</div>',
      '</code>',
    ];

    const triggerGeneration = async () => {
      await act(async () => {
        callbackEvent(null, () => (
          <code type="text/sitecore" chrometype="rendering" class="scpm" kind="close">
            <div>Gen-Metadata</div>
          </code>
        ));
      });
    };

    it('renders real component first, wires generation, then switches to generated component', async () => {
      const page = getPage(getTestLayoutData().layoutData, modeLibraryMetadata_Gen);

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary loadImportMap={defaultImportMap} />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain(expectedInitialMarkup());

      await waitFor(() => expect(addComponentPreviewHandlerSpy).to.have.been.called);

      expectStatus(postMessageSpy, DesignLibraryStatus.READY, RENDER_ID, { strict: true });

      await triggerGeneration();

      await waitFor(() => expectContains(rendered.baseElement.innerHTML, expectedGeneratedParts));

      await waitFor(() => expectStatus(postMessageSpy, DesignLibraryStatus.RENDERED, RENDER_ID));
    });
  });

  describe('error handling', () => {
    it('should render ErrorComponent when rendering UID is missing', () => {
      const layoutData = getTestLayoutData().layoutData;

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

      const page = {
        locale: 'en',
        layout: { ...layoutData, sitecore: { ...layoutData.sitecore, route: renderingWithoutUid } },
        mode: modeLibraryMetadata,
      };

      const rendered = render(
        <SitecoreProvider componentMap={components} api={api} page={page}>
          <DesignLibrary />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.contain(
        'Rendering UID is missing in the rendering data'
      );
    });
  });
  after(() => {
    sandbox.restore();
  });
});
