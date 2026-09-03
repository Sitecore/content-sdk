/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import proxyquire from 'proxyquire';
import { z } from 'zod';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { DefineRegistryResult } from '@json-render/react';
import { createNCC } from '.';
import { defineAtomsCatalog } from './define-atoms-catalog';
import { defineAtomsRegistry } from './define-atoms-registry';
import { ATOM_TYPE } from './constants';
import { SitecoreProvider } from '../components/SitecoreProvider';

describe('create-ncc', () => {
  const mockDoc: Document = {
    name: 'TestComponent',
    root: 'root-el',
    elements: {
      'root-el': {
        type: 'Card',
        props: { title: 'Hello' },
        children: [],
      },
    },
    state: { count: 0 },
  };

  const mockRegistry: DefineRegistryResult = {
    registry: {} as any,
    handlers: () => ({}),
    executeAction: async () => {},
  };

  it('returns an FC with the document name as displayName', () => {
    const View = createNCC(mockDoc, mockRegistry);
    expect(View.displayName).to.equal('TestComponent');
  });

  it('returns a functional component', () => {
    const View = createNCC(mockDoc, mockRegistry);
    expect(typeof View).to.equal('function');
  });

  describe('rendered wrapper div', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createNCCWithMocks: typeof createNCC;

    const mockSnapshot: Record<string, unknown> = {};
    const mockStore = {
      getSnapshot: () => mockSnapshot,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: () => {},
    };

    before(() => {
      const module = proxyquire('./create-ncc', {
        '@json-render/react': {
          Renderer: () => null,
          StateProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
          ActionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
          VisibilityProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
          ValidationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
          createStateStore: () => mockStore,
        },
        '../components/SitecoreProvider': {
          useSitecore: () => ({ atomsConfig: null }),
        },
      });
      createNCCWithMocks = module.createNCC;
    });

    it('applies params.styles to the wrapper div className', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry);
      const { container } = render(<View params={{ styles: 'my-style' }} />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).to.equal('component my-style');
    });

    it('uses empty string for className when params.styles is not provided', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry);
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).to.equal('component');
    });

    it('applies params.RenderingIdentifier to the wrapper div id', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry);
      const { container } = render(<View params={{ RenderingIdentifier: 'my-rendering-id' }} />);
      const div = container.firstChild as HTMLElement;
      expect(div.id).to.equal('my-rendering-id');
    });

    it('uses empty string for id when params.RenderingIdentifier is not provided', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry);
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.id).to.equal('');
    });
  });

  describe('editing chrome', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Card: { props: z.object({ title: z.string().optional() }), description: 'Card' },
        List: { props: z.object({}), description: 'List' },
      },
      actions: {},
    });

    const registry = defineAtomsRegistry(catalog, {
      components: {
        Card: ({ props }) => <span data-testid="card">{props?.title}</span>,
        List: ({ children }) => <div data-testid="list">{children}</div>,
      },
      actions: {},
    });

    const renderInProvider = (ui: React.ReactNode) =>
      render(
        <SitecoreProvider
          api={{} as any}
          componentMap={new Map()}
          page={{ locale: 'en', layout: { sitecore: { context: {}, route: null } } } as any}
          loadImportMap={async () => ({} as any)}
          atomsConfig={{ catalog, registry }}
        >
          {ui}
        </SitecoreProvider>
      );

    it('wraps every rendered atom with chrometype="atom" chrome using the element key', () => {
      const doc: Document = {
        name: 'chrome-doc',
        root: 'list-el',
        elements: {
          'list-el': { type: 'List', props: {}, children: ['card-el'] },
          'card-el': { type: 'Card', props: { title: 'Hello' } },
        },
      };
      const View = createNCC(doc, registry);
      const { container } = renderInProvider(<View />);

      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="list-el"]`)).to.not.be.null;
      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="card-el"]`)).to.not.be.null;
    });

    it('suffixes repeated atoms with the repeat index and keeps the repeat owner unsuffixed', () => {
      const doc: Document = {
        name: 'repeat-doc',
        root: 'list-el',
        elements: {
          'list-el': {
            type: 'List',
            props: {},
            children: ['card-el'],
            repeat: { statePath: '/cards' },
          },
          'card-el': { type: 'Card', props: { title: { $item: 'title' } } },
        },
        state: { cards: [{ title: 'One' }, { title: 'Two' }] },
      };
      const View = createNCC(doc, registry);
      const { container } = renderInProvider(<View />);

      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="list-el"]`)).to.not.be.null;
      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="card-el_0"]`)).to.not.be.null;
      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="card-el_1"]`)).to.not.be.null;
    });
  });
});
