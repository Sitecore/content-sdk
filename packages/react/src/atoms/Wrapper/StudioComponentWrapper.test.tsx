/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import { SitecoreProvider } from '../../components/SitecoreProvider';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomsConfig } from '../types';
import type { ImportMapImport } from '../../components/DesignLibrary/models';
import type { DefineRegistryResult } from '@json-render/react';

describe('<StudioComponentWrapper />', () => {
  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

  const sampleDoc: Document = {
    name: 'hero',
    root: 'root-el',
    elements: {
      'root-el': { type: 'Box', props: {}, children: [] },
    },
  };

  const mockRegistry: DefineRegistryResult = {
    registry: {} as any,
    handlers: () => ({}),
    executeAction: async () => {},
  };

  const atomsConfig: AtomsConfig = {
    catalog: {} as any,
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

  const renderInProvider = (ui: React.ReactNode) =>
    render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        page={getPage() as any}
        loadImportMap={loadImportMapStub}
        atoms={atomsConfig}
      >
        {ui}
      </SitecoreProvider>
    );

  it('renders null when document is null', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={null} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders null when atomsConfig is not provided', () => {
    const { container } = render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        page={getPage() as any}
        loadImportMap={loadImportMapStub}
      >
        <StudioComponentWrapper document={sampleDoc} />
      </SitecoreProvider>
    );
    expect(container.innerHTML).to.equal('');
  });
});

