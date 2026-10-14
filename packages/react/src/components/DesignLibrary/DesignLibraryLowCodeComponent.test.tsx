/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

chaiUse(sinonChai);
import { act, render, waitFor } from '@testing-library/react';
import { DesignLibraryLowCodeComponent, __mockDependencies } from './DesignLibraryLowCodeComponent';
import { SitecoreProvider } from '../SitecoreProvider';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
} from '@sitecore-content-sdk/content/editing';
import type { AtomsConfig } from '../../atoms/types';
import { ATOM_TYPE } from '../../atoms/constants';
import type { ImportMapImport } from './models';
import type { DefineRegistryResult } from '@json-render/react';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import { z } from 'zod';
import { defineAtomsCatalog } from '../../atoms/define-atoms-catalog';
import { defineAtomsRegistry } from '../../atoms/define-atoms-registry';

describe('<DesignLibraryLowCodeComponent />', () => {
  const sandbox = sinon.createSandbox();

  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

  let postToDesignLibrarySpy: sinon.SinonStub;
  let sendAtomsErrorEventSpy: sinon.SinonStub;
  let addDocumentUpdateHandlerStub: sinon.SinonStub;
  let unsubscribeDocumentUpdateStub: sinon.SinonStub;

  const mockRegistry: DefineRegistryResult = {
    registry: {} as any,
    handlers: () => ({}),
    executeAction: async () => {},
  };

  const mockCatalog = {
    componentNames: ['Button'],
    actionNames: [],
    data: {
      components: {
        Button: {
          props: { toJSONSchema: () => ({}) },
          description: 'A button',
          slots: ['default'],
        },
      },
      actions: {},
    },
    jsonSchema: () => ({}),
  } as any;

  const atomsConfig: AtomsConfig = {
    catalog: mockCatalog,
    registry: mockRegistry,
  };

  const previewCatalog = defineAtomsCatalog({
    components: {
      Button: { props: z.object({ label: z.string().optional() }), description: 'A button' },
    },
    actions: {},
  });
  const previewConfig: AtomsConfig = {
    catalog: previewCatalog,
    registry: defineAtomsRegistry(previewCatalog, {
      components: {
        Button: ({ props }) => <button data-testid="preview-button">{props.label}</button>,
      },
    }),
  };
  const getPreviewDocument = (state: Document['state']): Document => ({
    name: 'preview',
    root: 'button',
    elements: {
      button: {
        type: 'Button',
        props: { label: { $state: '/fields/heading/value' } },
        children: [],
      },
    },
    state,
  });

  const getPage = () => ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: 'normal',
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false, isLowCode: false },
      isNormal: true,
      isPreview: false,
      isEditing: false,
    },
  });

  beforeEach(() => {
    postToDesignLibrarySpy = sandbox.stub();
    sendAtomsErrorEventSpy = sandbox.stub();
    unsubscribeDocumentUpdateStub = sandbox.stub();
    addDocumentUpdateHandlerStub = sandbox.stub().returns(unsubscribeDocumentUpdateStub);
    __mockDependencies({
      postToDesignLibrary: postToDesignLibrarySpy,
      sendAtomsErrorEvent: sendAtomsErrorEventSpy,
      addDocumentUpdateHandler: addDocumentUpdateHandlerStub,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  const renderComponent = (runtime?: AtomsConfig) =>
    render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        page={getPage() as any}
        loadImportMap={loadImportMapStub}
        atomsConfig={runtime}
      >
        <DesignLibraryLowCodeComponent />
      </SitecoreProvider>
    );

  it('posts READY status on mount with rendering uid', async () => {
    renderComponent(atomsConfig);
    await waitFor(() => {
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'design-library-low-code-component')
      );
    });
  });

  it('sends error when no catalog is provided', async () => {
    renderComponent(undefined);
    await waitFor(() => {
      expect(sendAtomsErrorEventSpy).to.have.been.calledWith(
        'No atoms catalog provided',
        'atoms-missing'
      );
    });
  });

  it('posts atoms:catalog event when catalog is available', async () => {
    renderComponent(atomsConfig);
    await waitFor(() => {
      const catalogCall = postToDesignLibrarySpy
        .getCalls()
        .find((c: sinon.SinonSpyCall) => c.args[0]?.name === 'atoms:catalog');
      expect(catalogCall).to.not.be.undefined;
    });
  });

  it('subscribes to document update handler', async () => {
    renderComponent(atomsConfig);
    await waitFor(() => {
      expect(addDocumentUpdateHandlerStub).to.have.been.called;
    });
  });

  it('sets current document and increments render key when document update is received', async () => {
    renderComponent(atomsConfig);

    await waitFor(() => {
      expect(addDocumentUpdateHandlerStub).to.have.been.called;
    });

    const callback = addDocumentUpdateHandlerStub.firstCall.args[0];
    const updatedDocument = { name: 'test-doc' } as any;

    act(() => {
      callback(updatedDocument);
    });

    await waitFor(() => {
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.RENDERED, 'test-doc')
      );
    });
  });

  it('wraps preview with PlaceholderMetadata chromes using document uid', async () => {
    const { container } = renderComponent(atomsConfig);

    await waitFor(() => {
      expect(addDocumentUpdateHandlerStub).to.have.been.called;
    });

    const callback = addDocumentUpdateHandlerStub.firstCall.args[0];
    const updatedDocument = { name: 'test-content' } as any;

    act(() => {
      callback(updatedDocument);
    });

    const openChrome = container.querySelector(
      'code.scpm[chrometype="rendering"][kind="open"][id="test-content"]'
    );
    const closeChrome = container.querySelector('code.scpm[chrometype="rendering"][kind="close"]');

    expect(openChrome).to.not.be.null;
    expect(closeChrome).to.not.be.null;
    expect(openChrome?.getAttribute('data-csdk-component-runtime')).to.equal('client');
    expect(openChrome?.getAttribute('data-component-type')).to.equal(ATOM_TYPE);
  });

  it('renders fields and params from the preview document state', async () => {
    const { container, getByTestId } = renderComponent(previewConfig);
    const document = getPreviewDocument({
      fields: { heading: { value: 'New Heading' } },
      params: { styles: 'dark', RenderingIdentifier: 'preview-id' },
    });

    act(() => {
      addDocumentUpdateHandlerStub.firstCall.args[0](document);
    });

    await waitFor(() => {
      expect(getByTestId('preview-button').textContent).to.equal('New Heading');
      expect(container.querySelector('#preview-id')?.className).to.equal('component dark');
    });
  });

  it('refreshes fields and params when a same-name replacement document arrives', async () => {
    const { container, getByTestId } = renderComponent(previewConfig);
    const callback = addDocumentUpdateHandlerStub.firstCall.args[0];

    act(() => {
      callback(
        getPreviewDocument({
          fields: { heading: { value: 'Original Heading' } },
          params: { styles: 'light', RenderingIdentifier: 'original-id' },
        })
      );
    });
    await waitFor(() => {
      expect(getByTestId('preview-button').textContent).to.equal('Original Heading');
      expect(container.querySelector('#original-id')?.className).to.equal('component light');
    });

    act(() => {
      callback(
        getPreviewDocument({
          fields: { heading: { value: 'Replacement Heading' } },
          params: { styles: 'dark', RenderingIdentifier: 'replacement-id' },
        })
      );
    });

    await waitFor(() => {
      expect(getByTestId('preview-button').textContent).to.equal('Replacement Heading');
      expect(container.querySelector('#replacement-id')?.className).to.equal('component dark');
      expect(container.querySelector('#original-id')).to.be.null;
      expect(getByTestId('preview-button').closest('.component')?.textContent).to.not.contain(
        'Original Heading'
      );
    });
    const renderedCalls = postToDesignLibrarySpy
      .getCalls()
      .filter(
        (call: sinon.SinonSpyCall) => call.args[0]?.message?.status === DesignLibraryStatus.RENDERED
      );
    expect(renderedCalls).to.have.length(2);
    expect(addDocumentUpdateHandlerStub).to.have.been.calledOnce;
  });

  it('unsubscribes from document updates on unmount', () => {
    const { unmount } = renderComponent(atomsConfig);

    expect(addDocumentUpdateHandlerStub).to.have.been.calledOnce;
    expect(unsubscribeDocumentUpdateStub).to.not.have.been.called;

    unmount();

    expect(unsubscribeDocumentUpdateStub).to.have.been.calledOnce;
  });

  it('wraps the rendered component with PlaceholderMetadata using the default uid before a document is received', async () => {
    const { container } = renderComponent(atomsConfig);

    await waitFor(() => {
      const codeBlocks = container.querySelectorAll('code');
      expect(codeBlocks).to.have.length(2);
      expect(codeBlocks[0].getAttribute('chrometype')).to.equal('rendering');
      expect(codeBlocks[0].getAttribute('id')).to.equal('design-library-low-code-component');
      expect(codeBlocks[0].getAttribute('data-csdk-component-runtime')).to.equal('client');
      expect(codeBlocks[0].getAttribute('data-component-type')).to.equal(ATOM_TYPE);
    });
  });

  it('wraps the rendered component with PlaceholderMetadata using the document name once a document is received', async () => {
    const { container } = renderComponent(atomsConfig);

    await waitFor(() => {
      expect(addDocumentUpdateHandlerStub).to.have.been.called;
    });

    const callback = addDocumentUpdateHandlerStub.firstCall.args[0];
    const updatedDocument = { name: 'test-doc' } as any;

    act(() => {
      callback(updatedDocument);
    });

    await waitFor(() => {
      const codeBlocks = container.querySelectorAll('code');
      expect(codeBlocks[0].getAttribute('id')).to.equal('test-doc');
      expect(codeBlocks[0].getAttribute('data-csdk-component-runtime')).to.equal('client');
    });
  });
});
