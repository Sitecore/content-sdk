/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { z } from 'zod';
import { defineAtomsCatalog } from '../../atoms/define-atoms-catalog';
import { defineAtomsRegistry } from '../../atoms/define-atoms-registry';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import { SitecoreProvider } from '../SitecoreProvider';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomsConfig } from '../../atoms/types';
import type { ImportMapImport } from './models';

describe('<StudioComponentWrapper />', () => {
  const apiStub = {} as any;
  const emptyComponentMap = new Map();
  const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

  // Minimal catalog + registry with two echoing test components
  const testCatalog = defineAtomsCatalog({
    components: {
      Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
      Box: { props: z.object({}), description: 'Box', slots: ['default'] },
    },
    actions: {},
  });

  const testRegistry = defineAtomsRegistry(testCatalog, {
    components: {
      Text: ({ props, children }) => (
        <span {...props} data-testid="text-el">
          {props?.content ?? children}
        </span>
      ),
      Box: ({ children }) => <div data-testid="box-el">{children}</div>,
    },
    actions: {},
  });

  const atomsConfig: AtomsConfig = {
    catalog: testCatalog,
    registry: testRegistry,
  };

  const sampleDoc: Document = {
    name: 'hero',
    root: 'root-el',
    elements: {
      'root-el': { type: 'Box', props: {}, children: [] },
    },
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

  const wrapInProvider = (ui: React.ReactNode, atoms?: AtomsConfig) => (
    <SitecoreProvider
      api={apiStub}
      componentMap={emptyComponentMap}
      page={getPage() as any}
      loadImportMap={loadImportMapStub}
      atomsConfig={atoms}
    >
      {ui}
    </SitecoreProvider>
  );

  const renderInProvider = (ui: React.ReactNode, atoms = atomsConfig) =>
    render(wrapInProvider(ui, atoms));

  // ── Guard conditions ──────────────────────────────────────────────────────

  it('renders null when document is null', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={null} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders null when document is undefined', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={undefined} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders null when atomsConfig is not provided', () => {
    const { container } = render(
      wrapInProvider(<StudioComponentWrapper document={sampleDoc} />, undefined)
    );
    expect(container.innerHTML).to.equal('');
  });

  // ── Basic rendering ───────────────────────────────────────────────────────

  it('renders a view when document and atomsConfig are both provided', () => {
    const { container } = renderInProvider(<StudioComponentWrapper document={sampleDoc} />);
    expect(container.innerHTML).to.not.equal('');
  });

  // ── $state — read from state model (RFC 6901 JSON Pointer paths) ──────────

  it('resolves a $state binding from doc.state', () => {
    const doc: Document = {
      name: 'state-test',
      root: 'r',
      elements: {
        r: { type: 'Text', props: { content: { $state: '/message' } }, children: [] },
      },
      state: { message: 'Hello from state' },
    };
    const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
    expect(getByTestId('text-el').textContent).to.equal('Hello from state');
  });

  it('resolves a nested JSON Pointer path in a $state binding', () => {
    const doc: Document = {
      name: 'nested-state',
      root: 'r',
      elements: {
        r: { type: 'Text', props: { content: { $state: '/user/name' } }, children: [] },
      },
      state: { user: { name: 'Alice' } },
    };
    const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
    expect(getByTestId('text-el').textContent).to.equal('Alice');
  });

  // ── $template — string interpolation ─────────────────────────────────────

  it('resolves a $template expression using state values', () => {
    const doc: Document = {
      name: 'template-test',
      root: 'r',
      elements: {
        r: {
          type: 'Text',
          // Single-quoted string — ${/name} is a literal template token, not a JS template literal
          props: { content: { $template: 'Hello, ${/name}!' } },
          children: [],
        },
      },
      state: { name: 'Alice' },
    };
    const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
    expect(getByTestId('text-el').textContent).to.equal('Hello, Alice!');
  });

  // ── $cond / $then / $else — conditional props ─────────────────────────────

  it('resolves $cond conditional prop — truthy branch', () => {
    const doc: Document = {
      name: 'cond-truthy',
      root: 'r',
      elements: {
        r: {
          type: 'Text',
          props: { content: { $cond: { $state: '/isAdmin' }, $then: 'Admin', $else: 'Member' } },
          children: [],
        },
      },
      state: { isAdmin: true },
    };
    const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
    expect(getByTestId('text-el').textContent).to.equal('Admin');
  });

  it('resolves $cond conditional prop — falsy branch', () => {
    const doc: Document = {
      name: 'cond-falsy',
      root: 'r',
      elements: {
        r: {
          type: 'Text',
          props: { content: { $cond: { $state: '/isAdmin' }, $then: 'Admin', $else: 'Member' } },
          children: [],
        },
      },
      state: { isAdmin: false },
    };
    const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
    expect(getByTestId('text-el').textContent).to.equal('Member');
  });

  // ── useMemo reactivity ────────────────────────────────────────────────────

  it('re-renders as empty when document changes to null', () => {
    const { container, rerender } = renderInProvider(
      <StudioComponentWrapper document={sampleDoc} />
    );
    expect(container.innerHTML).to.not.equal('');

    rerender(wrapInProvider(<StudioComponentWrapper document={null} />));

    expect(container.innerHTML).to.equal('');
  });

  it('renders the updated document when the document prop changes', () => {
    const firstDoc: Document = {
      name: 'first',
      root: 'r',
      elements: { r: { type: 'Text', props: { content: 'First' }, children: [] } },
    };
    const secondDoc: Document = {
      name: 'second',
      root: 'r',
      elements: { r: { type: 'Text', props: { content: 'Second' }, children: [] } },
    };

    const { getByTestId, rerender } = renderInProvider(
      <StudioComponentWrapper document={firstDoc} />
    );
    expect(getByTestId('text-el').textContent).to.equal('First');

    rerender(wrapInProvider(<StudioComponentWrapper document={secondDoc} />, atomsConfig));

    expect(getByTestId('text-el').textContent).to.equal('Second');
  });
});
