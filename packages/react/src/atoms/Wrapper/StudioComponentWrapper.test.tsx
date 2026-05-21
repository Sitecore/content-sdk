/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import sinon from 'sinon';
import { expect, use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';

chaiUse(sinonChai);
import { render } from '@testing-library/react';
import { z } from 'zod';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import { SitecoreProvider } from '../../components/SitecoreProvider';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomMetadata } from '../types';
import type { ImportMapImport } from '../../components/DesignLibrary/models';

/**
 * Minimal error boundary to catch React render errors without crashing the test.
 */
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ onError?: (err: Error) => void }>,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err: Error) {
    this.props.onError?.(err);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

describe('<StudioComponentWrapper />', () => {
  const sandbox = sinon.createSandbox();
  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

  const Box: React.FC<React.PropsWithChildren<Record<string, unknown>>> = (props) =>
    React.createElement('div', { 'data-test': 'box', ...props }, props.children);

  const atoms: AtomMetadata[] = [
    {
      name: 'Box',
      type: 'atom',
      description: 'Container',
      component: Box as React.ComponentType<unknown>,
      props: z.object({}),
    },
  ];

  const sampleDoc: Document = {
    name: 'hero',
    root: { id: 'r', type: 'Box' },
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
        loadImportMap={loadImportMapStub}
        page={getPage() as any}
        atomRegistry={{ atoms, callbacks: [] }}
      >
        {ui}
      </SitecoreProvider>
    );

  const renderWithoutAtomRegistry = (ui: React.ReactNode) =>
    render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        loadImportMap={loadImportMapStub}
        page={getPage() as any}
      >
        {ui}
      </SitecoreProvider>
    );

  afterEach(() => {
    sandbox.restore();
  });

  it('renders nothing when document is null', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={null} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders nothing when document is undefined', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={undefined} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders the component-layout view when document is provided', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={sampleDoc} />);
    expect(container.querySelector('[data-test="box"]')).to.exist;
  });

  it('renders nothing safely when atomRegistry is absent from the provider and document is null', () => {
    const { container } = renderWithoutAtomRegistry(<StudioComponentWrapper document={null} />);
    expect(container.innerHTML).to.equal('');
  });

  it('throws when document references an atom type not present in the registry', () => {
    const docWithUnknownAtom: Document = { name: 'test', root: { id: 'x', type: 'UnknownAtom' } };
    let caughtError: Error | undefined;

    // Suppress the expected React error boundary console output
    const consoleErrorStub = sandbox.stub(console, 'error');

    render(
      <SitecoreProvider
        api={apiStub}
        componentMap={emptyComponentMap}
        loadImportMap={loadImportMapStub}
        page={getPage() as any}
        atomRegistry={{ atoms, callbacks: [] }}
      >
        <ErrorBoundary
          onError={(err) => {
            caughtError = err;
          }}
        >
          <StudioComponentWrapper document={docWithUnknownAtom} />
        </ErrorBoundary>
      </SitecoreProvider>
    );

    consoleErrorStub.restore();

    expect(caughtError).to.be.instanceOf(Error);
    expect(caughtError!.message).to.include('UnknownAtom');
  });
});

