/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

chaiUse(sinonChai);
import { render, waitFor } from '@testing-library/react';
import { DesignLibraryLowCodeComponent, __mockDependencies } from './DesignLibraryLowCodeComponent';
import { SitecoreProvider } from '../SitecoreProvider';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
} from '@sitecore-content-sdk/content/editing';
import type { AtomsConfig } from '../../atoms/types';
import type { ImportMapImport } from './models';
import type { DefineRegistryResult } from '@json-render/react';

describe('<DesignLibraryLowCodeComponent />', () => {
  const sandbox = sinon.createSandbox();

  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

  let postToDesignLibrarySpy: sinon.SinonStub;
  let sendAtomsErrorEventSpy: sinon.SinonStub;
  let addDocumentUpdateHandlerStub: sinon.SinonStub;

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

  const getPage = () => ({
    locale: 'en',
    layout: { sitecore: { context: {}, route: null } },
    mode: {
      name: 'normal',
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
      isNormal: true,
      isPreview: false,
      isEditing: false,
    },
  });

  beforeEach(() => {
    postToDesignLibrarySpy = sandbox.stub();
    sendAtomsErrorEventSpy = sandbox.stub();
    addDocumentUpdateHandlerStub = sandbox.stub().returns(() => {});
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
        atoms={runtime}
      >
        <DesignLibraryLowCodeComponent />
      </SitecoreProvider>
    );

  it('posts READY status on mount', async () => {
    renderComponent(atomsConfig);
    await waitFor(() => {
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'low-code-component')
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
});
