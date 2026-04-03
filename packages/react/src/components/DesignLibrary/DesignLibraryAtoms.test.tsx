/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DesignLibraryAtoms, __mockDependencies } from './DesignLibraryAtoms';
import { SitecoreProvider } from '../SitecoreProvider';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
  getDesignLibraryAtomsRegistryEvent,
  AtomInfo,
} from '@sitecore-content-sdk/content/editing';
import * as atomRegistryUtils from '../../atoms/atom-registry-utils';
import { Document } from '@sitecore-content-sdk/content/types/component-layout';
import { AtomMetadata } from '../../atoms/types';
import { z } from 'zod';

describe('<DesignLibraryAtoms />', () => {
  const sandbox = sinon.createSandbox();

  let postToDesignLibrarySpy: sinon.SinonStub;
  let sendAtomsErrorEventSpy: sinon.SinonStub;
  let addDocumentUpdateHandlerSpy: sinon.SinonStub;
  let serializeAtomsStub: sinon.SinonStub;
  let getAtomMapStub: sinon.SinonStub;

  const mockAtoms: AtomMetadata[] = [
    {
      name: 'Button',
      type: 'atom',
      description: 'A button component',
      component: () => React.createElement('button', null, 'Button'),
      props: z.object({
        label: z.string(),
      }),
    },
    {
      name: 'Text',
      type: 'atom',
      description: 'A text component',
      component: () => React.createElement('div', null, 'Text'),
      props: z.object({
        content: z.string(),
      }),
    },
  ];

  const mockAtomMap: Record<string, React.ComponentType<unknown>> = {
    Stack: () => React.createElement('div', { 'data-test': 'stack' }),
    Card: () => React.createElement('div', { 'data-test': 'card' }),
    CardHeader: () => React.createElement('div', { 'data-test': 'card-header' }),
    CardTitle: () => React.createElement('div', { 'data-test': 'card-title' }),
    CardDescription: () => React.createElement('div', { 'data-test': 'card-description' }),
    CardContent: () => React.createElement('div', { 'data-test': 'card-content' }),
    Image: () => React.createElement('img', { 'data-test': 'image' }),
    Button: () => React.createElement('button', { 'data-test': 'button' }),
    Text: () => React.createElement('div', { 'data-test': 'text' }),
  };

  const mockSerializedAtoms: AtomInfo[] = [
    {
      name: 'Button',
      type: 'atom',
      description: 'A button component',
      props: { label: { type: 'string' } },
      allowedChildren: [],
    },
    {
      name: 'Text',
      type: 'atom',
      description: 'A text component',
      props: { content: { type: 'string' } },
      allowedChildren: [],
    },
  ];

  const mockCallbacks = [
    {
      name: 'trackSelection',
      description: 'Track selection callback',
      callbackFn: () => {},
    },
  ];

  const getPage = () => ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: 'normal',
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
      isNormal: true,
      isPreview: false,
      isEditing: false,
    },
  });

  beforeEach(() => {
    postToDesignLibrarySpy = sandbox.stub();
    sendAtomsErrorEventSpy = sandbox.stub();
    addDocumentUpdateHandlerSpy = sandbox.stub().returns(() => {});
    serializeAtomsStub = sandbox.stub(atomRegistryUtils, 'serializeAtoms');
    getAtomMapStub = sandbox.stub(atomRegistryUtils, 'getAtomMap');

    __mockDependencies({
      postToDesignLibrary: postToDesignLibrarySpy,
      sendAtomsErrorEvent: sendAtomsErrorEventSpy,
      addDocumentUpdateHandler: addDocumentUpdateHandlerSpy,
    });

    serializeAtomsStub.returns(mockSerializedAtoms);
    getAtomMapStub.returns(mockAtomMap);

    // Stub console methods to suppress AtomRenderer console output during tests
    sandbox.stub(console, 'log');
    sandbox.stub(console, 'warn');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should send READY status event on mount', () => {
    const page = getPage();

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(postToDesignLibrarySpy).to.have.been.calledWith(
      getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
    );
  });

  it('should wrap AtomRenderer in DesignLibraryErrorBoundary', () => {
    const page = getPage();

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(container).to.exist;
    expect(getAtomMapStub).to.have.been.calledWith(mockAtoms);
  });

  it('should serialize atoms and send atoms registry event', () => {
    const page = getPage();

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(serializeAtomsStub).to.have.been.calledWith(mockAtoms);
    expect(postToDesignLibrarySpy).to.have.been.calledWith(
      getDesignLibraryAtomsRegistryEvent(mockSerializedAtoms, {})
    );
  });

  it('should handle empty atoms array', () => {
    const page = getPage();
    serializeAtomsStub.returns(mockSerializedAtoms);

    render(
      <SitecoreProvider atoms={[]} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(serializeAtomsStub).to.have.been.calledWith([]);
    expect(postToDesignLibrarySpy).to.have.been.calledWith(
      getDesignLibraryAtomsRegistryEvent(mockSerializedAtoms, {})
    );
  });

  it('should send error event when atoms serialization returns null', () => {
    const page = getPage();
    serializeAtomsStub.returns(null);

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(sendAtomsErrorEventSpy).to.have.been.calledWith('No atoms provided', 'atoms-missing');
    expect(postToDesignLibrarySpy).not.to.have.been.calledWith(
      sinon.match((arg) => arg.name === 'atom:registry')
    );
  });

  it('should send error event when atoms serialization returns undefined', () => {
    const page = getPage();
    serializeAtomsStub.returns(undefined);

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(sendAtomsErrorEventSpy).to.have.been.calledWith('No atoms provided', 'atoms-missing');
  });

  it('should subscribe to document updates on mount', () => {
    const page = getPage();

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(addDocumentUpdateHandlerSpy).to.have.been.called;
  });

  it('should update document state when document update is received', async () => {
    const page = getPage();
    let capturedHandler: ((doc: Document) => void) | null = null;

    addDocumentUpdateHandlerSpy.callsFake((handler) => {
      capturedHandler = handler;
      return () => {};
    });

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(capturedHandler).to.not.be.null;

    const updatedDocument: Document = {
      name: 'UpdatedDocument',
      root: {
        id: 'updated-root',
        type: 'Stack',
        children: [],
      },
      props: {},
      state: {},
    };

    capturedHandler!(updatedDocument);

    await waitFor(() => {
      expect(container).to.exist;
    });
  });

  it('should increment renderKey when document update is received', async () => {
    const page = getPage();
    let capturedHandler: ((doc: Document) => void) | null = null;

    addDocumentUpdateHandlerSpy.callsFake((handler) => {
      capturedHandler = handler;
      return () => {};
    });

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    const initialCallCount = postToDesignLibrarySpy.callCount;

    const updatedDocument: Document = {
      name: 'UpdatedDocument',
      root: {
        id: 'updated-root',
        type: 'Stack',
        children: [],
      },
      props: {},
      state: {},
    };

    capturedHandler!(updatedDocument);

    // renderKey increment should trigger RENDERED event
    await waitFor(() => {
      expect(postToDesignLibrarySpy.callCount).to.be.greaterThan(initialCallCount);
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
      );
    });
  });

  it('should send RENDERED status event after document update', async () => {
    const page = getPage();
    let capturedHandler: ((doc: Document) => void) | null = null;

    addDocumentUpdateHandlerSpy.callsFake((handler) => {
      capturedHandler = handler;
      return () => {};
    });

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    const initialCallCount = postToDesignLibrarySpy.callCount;

    const updatedDocument: Document = {
      name: 'UpdatedDocument',
      root: {
        id: 'updated-root',
        type: 'Stack',
        children: [],
      },
      props: {},
      state: {},
    };

    capturedHandler!(updatedDocument);

    await waitFor(() => {
      expect(postToDesignLibrarySpy.callCount).to.be.greaterThan(initialCallCount);
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
      );
    });
  });

  it('should not send RENDERED status before document update', () => {
    const page = getPage();

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    const renderedCalls = postToDesignLibrarySpy
      .getCalls()
      .filter((call) => call.args[0]?.message?.status === DesignLibraryStatus.RENDERED);

    expect(renderedCalls).to.have.length(0);
  });

  it('should unsubscribe from document updates on unmount', () => {
    const page = getPage();
    const unsubscribeSpy = sandbox.spy();

    addDocumentUpdateHandlerSpy.returns(unsubscribeSpy);

    const { unmount } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(unsubscribeSpy).not.to.have.been.called;

    unmount();

    expect(unsubscribeSpy).to.have.been.called;
  });

  it('should render AtomRenderer with correct props', () => {
    const page = getPage();

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(container).to.exist;
    expect(getAtomMapStub).to.have.been.calledWith(mockAtoms);
  });

  it('should handle undefined atoms', () => {
    const page = getPage();
    serializeAtomsStub.returns(null);

    render(
      <SitecoreProvider callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(serializeAtomsStub).to.have.been.calledWith([]);
    expect(sendAtomsErrorEventSpy).to.have.been.calledWith('No atoms provided', 'atoms-missing');
  });

  it('should initialize with cardsWithDataBinding document', () => {
    const page = getPage();

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(container).to.exist;
  });

  it('should update atomMap when atoms change', () => {
    const page = getPage();

    const updatedAtoms = [
      {
        name: 'Card',
        component: () => <div>Card</div>,
        props: {
          title: { type: 'string' },
        },
      },
    ];

    const { rerender } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(getAtomMapStub).to.have.been.calledWith(mockAtoms);

    rerender(
      <SitecoreProvider atoms={updatedAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(getAtomMapStub).to.have.been.calledWith(updatedAtoms);
  });

  it('should resubscribe to document updates when atoms change', () => {
    const page = getPage();
    const unsubscribeSpy1 = sandbox.spy();
    const unsubscribeSpy2 = sandbox.spy();

    addDocumentUpdateHandlerSpy.onFirstCall().returns(unsubscribeSpy1);
    addDocumentUpdateHandlerSpy.onSecondCall().returns(unsubscribeSpy2);

    const updatedAtoms = [
      {
        name: 'Card',
        component: () => <div>Card</div>,
        props: {
          title: { type: 'string' },
        },
      },
    ];

    const { rerender } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(addDocumentUpdateHandlerSpy).to.have.been.calledOnce;

    rerender(
      <SitecoreProvider atoms={updatedAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(unsubscribeSpy1).to.have.been.called;
    expect(addDocumentUpdateHandlerSpy).to.have.been.calledTwice;
  });

  it('should handle multiple document updates', async () => {
    const page = getPage();
    let capturedHandler: ((doc: Document) => void) | null = null;

    addDocumentUpdateHandlerSpy.callsFake((handler) => {
      capturedHandler = handler;
      return () => {};
    });

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    const doc1: Document = {
      name: 'Doc1',
      root: { id: '1', type: 'Stack', children: [] },
      props: {},
      state: {},
    };

    const doc2: Document = {
      name: 'Doc2',
      root: { id: '2', type: 'Stack', children: [] },
      props: {},
      state: {},
    };

    capturedHandler!(doc1);

    await waitFor(() => {
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'low-code-component')
      );
    });

    const callCountAfterFirst = postToDesignLibrarySpy.callCount;

    capturedHandler!(doc2);

    await waitFor(() => {
      expect(postToDesignLibrarySpy.callCount).to.be.greaterThan(callCountAfterFirst);
    });
  });

  it('should pass callbackRegistry to AtomRenderer', () => {
    const page = getPage();
    const customCallbacks = [
      { name: 'onButtonClick', description: 'Button click callback', callbackFn: () => {} },
      { name: 'onSelectChange', description: 'Select change callback', callbackFn: () => {} },
    ];

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={customCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(container).to.exist;
  });

  it('should handle empty callback registry', () => {
    const page = getPage();

    const { container } = render(
      <SitecoreProvider atoms={mockAtoms} callbacks={[]} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    expect(container).to.exist;
  });

  it('should send events in correct order', async () => {
    const page = getPage();
    let capturedHandler: ((doc: Document) => void) | null = null;

    addDocumentUpdateHandlerSpy.callsFake((handler) => {
      capturedHandler = handler;
      return () => {};
    });

    render(
      <SitecoreProvider atoms={mockAtoms} callbacks={mockCallbacks} page={page}>
        <DesignLibraryAtoms />
      </SitecoreProvider>
    );

    const calls = postToDesignLibrarySpy.getCalls();
    const readyCall = calls.find(
      (call) => call.args[0]?.message?.status === DesignLibraryStatus.READY
    );
    const registryCall = calls.find((call) => call.args[0]?.name === 'atom:registry');

    expect(readyCall).to.exist;
    expect(registryCall).to.exist;

    const updatedDocument: Document = {
      name: 'Updated',
      root: { id: 'root', type: 'Stack', children: [] },
      props: {},
      state: {},
    };

    capturedHandler!(updatedDocument);

    await waitFor(() => {
      const renderedCall = postToDesignLibrarySpy
        .getCalls()
        .find((call) => call.args[0]?.message?.status === DesignLibraryStatus.RENDERED);
      expect(renderedCall).to.exist;
    });
  });
});
