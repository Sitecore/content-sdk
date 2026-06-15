/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

chaiUse(sinonChai);
import { render, waitFor } from '@testing-library/react';
import { DesignLibrary, __mockDependencies } from './DesignLibrary';
import { SitecoreProvider } from '../SitecoreProvider';
import {
  DesignLibraryStatus,
  getDesignLibraryStatusEvent,
} from '@sitecore-content-sdk/content/editing';
import type { AtomsConfig } from '../../atoms/types';
import type { ImportMapImport } from './models';
import type { DefineRegistryResult } from '@json-render/react';

describe('<DesignLibrary />', () => {
  const sandbox = sinon.createSandbox();

  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> =>
    ({
      default: [],
    } as unknown as ImportMapImport);

  let postToDesignLibrarySpy: sinon.SinonStub;

  const mockRegistry: DefineRegistryResult = {
    registry: {} as any,
    handlers: () => ({}),
    executeAction: async () => {},
  };

  const mockCatalog = {
    componentNames: ['Button'],
    actionNames: [],
    data: { components: { Button: { description: 'A button', slots: ['default'] } } },
    jsonSchema: () => ({}),
  } as any;

  const atomsConfig: AtomsConfig = {
    catalog: mockCatalog,
    registry: mockRegistry,
  };

  const getPage = (overrides: Record<string, unknown> = {}) => ({
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: {
          uid: 'test-uid',
          placeholders: {
            'editing-componentmode-placeholder': [
              {
                uid: 'component-1',
                componentName: 'TestComponent',
                fields: {},
                params: {},
              },
            ],
          },
        },
      },
    },
    mode: {
      name: 'normal',
      isDesignLibrary: true,
      designLibrary: { isVariantGeneration: false },
      isNormal: false,
      isPreview: false,
      isEditing: false,
      ...overrides,
    },
  });

  beforeEach(() => {
    postToDesignLibrarySpy = sandbox.stub();
    __mockDependencies({
      postToDesignLibrary: postToDesignLibrarySpy,
      addComponentPreviewHandler: sandbox.stub(),
      sendErrorEvent: sandbox.stub(),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders null when not in design library mode', () => {
    const page = getPage({ isDesignLibrary: false });
    const { container } = render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        page={page as any}
        loadImportMap={loadImportMapStub}
        atoms={atomsConfig}
      >
        <DesignLibrary />
      </SitecoreProvider>
    );
    expect(container.innerHTML).to.equal('');
  });

  it('posts READY status on mount when in design library mode', async () => {
    const page = getPage();
    render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        page={page as any}
        loadImportMap={loadImportMapStub}
        atoms={atomsConfig}
      >
        <DesignLibrary />
      </SitecoreProvider>
    );
    await waitFor(() => {
      expect(postToDesignLibrarySpy).to.have.been.calledWith(
        getDesignLibraryStatusEvent(DesignLibraryStatus.READY, 'component-1')
      );
    });
  });
});
