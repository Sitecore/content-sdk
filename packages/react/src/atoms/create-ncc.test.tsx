/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { PagesEditor } from '@sitecore-content-sdk/content/editing';
import { EDITOR_CHROMES_RESET_DEBOUNCE_MS } from './reset-editor-chromes';
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

  const mockCatalog = defineAtomsCatalog({
    components: {
      Card: { props: z.object({ title: z.string().optional() }), description: 'Card' },
    },
    actions: {},
  });

  it('returns an FC with the document name as displayName', () => {
    const View = createNCC(mockDoc, mockRegistry, mockCatalog);
    expect(View.displayName).to.equal('TestComponent');
  });

  it('returns a functional component', () => {
    const View = createNCC(mockDoc, mockRegistry, mockCatalog);
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
      const View = createNCCWithMocks(
        { ...mockDoc, state: { ...mockDoc.state, params: { styles: 'my-style' } } },
        mockRegistry,
        mockCatalog
      );
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).to.equal('component my-style');
    });

    it('uses empty string for className when params.styles is not provided', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry, mockCatalog);
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).to.equal('component');
    });

    it('applies params.RenderingIdentifier to the wrapper div id', () => {
      const View = createNCCWithMocks(
        { ...mockDoc, state: { params: { RenderingIdentifier: 'my-rendering-id' } } },
        mockRegistry,
        mockCatalog
      );
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.id).to.equal('my-rendering-id');
    });

    it('uses empty string for id when params.RenderingIdentifier is not provided', () => {
      const View = createNCCWithMocks(mockDoc, mockRegistry, mockCatalog);
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.id).to.equal('');
    });

    it('renders a document without initial state', () => {
      const statelessDocument: Document = {
        name: mockDoc.name,
        root: mockDoc.root,
        elements: mockDoc.elements,
      };
      const View = createNCCWithMocks(statelessDocument, mockRegistry, mockCatalog);
      const { container } = render(<View />);
      const div = container.firstChild as HTMLElement;
      expect(div.className).to.equal('component');
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
          page={
            {
              locale: 'en',
              mode: { isEditing: true },
              layout: { sitecore: { context: {}, route: null } },
            } as any
          }
          loadImportMap={async () => ({} as any)}
          atomsConfig={{ catalog, registry }}
        >
          {ui}
        </SitecoreProvider>
      );

    it('does not render chrome when the page is not in editing mode', () => {
      const doc: Document = {
        name: 'chrome-doc',
        root: 'card-el',
        elements: {
          'card-el': { type: 'Card', props: { title: 'Hello' } },
        },
      };
      const View = createNCC(doc, registry, catalog);
      const { container } = render(
        <SitecoreProvider
          api={{} as any}
          componentMap={new Map()}
          page={
            {
              locale: 'en',
              mode: { isEditing: false },
              layout: { sitecore: { context: {}, route: null } },
            } as any
          }
          loadImportMap={async () => ({} as any)}
          atomsConfig={{ catalog, registry }}
        >
          <View />
        </SitecoreProvider>
      );

      expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"]`)).to.be.null;
    });

    it('wraps every rendered atom with chrometype="atom" chrome using the element key', () => {
      const doc: Document = {
        name: 'chrome-doc',
        root: 'list-el',
        elements: {
          'list-el': { type: 'List', props: {}, children: ['card-el'] },
          'card-el': { type: 'Card', props: { title: 'Hello' } },
        },
      };
      const View = createNCC(doc, registry, catalog);
      const { container } = renderInProvider(<View />);

      expect(
        container.querySelector(`code[chrometype="${ATOM_TYPE}"][data-element-name="list-el"]`)
      ).to.not.be.null;
      expect(
        container.querySelector(`code[chrometype="${ATOM_TYPE}"][data-element-name="card-el"]`)
      ).to.not.be.null;
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
      const View = createNCC(doc, registry, catalog);
      const { container } = renderInProvider(<View />);

      expect(
        container.querySelector(`code[chrometype="${ATOM_TYPE}"][data-element-name="list-el"]`)
      ).to.not.be.null;
      expect(
        container.querySelector(`code[chrometype="${ATOM_TYPE}"][data-element-name="card-el_0"]`)
      ).to.not.be.null;
      expect(
        container.querySelector(`code[chrometype="${ATOM_TYPE}"][data-element-name="card-el_1"]`)
      ).to.not.be.null;
    });
  });

  describe('Pages chrome reset', () => {
    // Chrome rediscovery contract with Pages (Horizon)
    const resetChromesKey = 'Sitecore.Horizon.ResetChromes';
    const catalog = defineAtomsCatalog({
      components: {
        Card: { props: z.object({ title: z.string().optional() }), description: 'Card' },
      },
      actions: {},
    });
    const registry = defineAtomsRegistry(catalog, {
      components: { Card: ({ props }) => <span>{props?.title}</span> },
      actions: {},
    });
    const doc: Document = {
      name: 'reset-doc',
      root: 'card-el',
      elements: { 'card-el': { type: 'Card', props: { title: 'Hello' } } },
    };

    let resetChromes: sinon.SinonStub;
    let clock: sinon.SinonFakeTimers;

    const withPage = (isEditing: boolean, ui: React.ReactNode) => (
      <SitecoreProvider
        api={{} as any}
        componentMap={new Map()}
        page={
          {
            locale: 'en',
            mode: { isEditing },
            layout: { sitecore: { context: {}, route: null } },
          } as any
        }
        loadImportMap={async () => ({} as any)}
        atomsConfig={{ catalog, registry }}
      >
        {ui}
      </SitecoreProvider>
    );

    beforeEach(() => {
      clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
      sinon.stub(PagesEditor, 'isActive').returns(true);
      resetChromes = sinon.stub();
      (window as any)[resetChromesKey] = resetChromes;
    });

    afterEach(() => {
      // Flush any pending debounced reset so it can't leak into the next test
      clock.runAll();
      clock.restore();
      sinon.restore();
      delete (window as any)[resetChromesKey];
    });

    it('asks Pages to re-discover chromes once, after the debounce window, when mounting in editing mode', () => {
      const View = createNCC(doc, registry, catalog);
      render(withPage(true, <View />));

      expect(resetChromes.called).to.be.false;
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS - 1);
      expect(resetChromes.called).to.be.false;

      clock.tick(1);
      expect(resetChromes.calledOnce).to.be.true;
    });

    it('coalesces the reset when several atom components mount together', () => {
      const First = createNCC(doc, registry, catalog);
      const Second = createNCC({ ...doc, name: 'reset-doc-2' }, registry, catalog);
      render(
        withPage(
          true,
          <>
            <First />
            <Second />
          </>
        )
      );
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS);

      expect(resetChromes.calledOnce).to.be.true;
    });

    it('coalesces mounts that happen in different commits into a single reset after the last one', () => {
      const First = createNCC(doc, registry, catalog);
      const { rerender } = render(withPage(true, <First />));
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS - 20);
      expect(resetChromes.called).to.be.false;

      // A new component type (e.g. createNCC re-run) remounts the subtree in a later commit
      const Second = createNCC(doc, registry, catalog);
      rerender(withPage(true, <Second />));

      // The first request's window has elapsed, but the second one restarted the timer
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS - 1);
      expect(resetChromes.called).to.be.false;

      clock.tick(1);
      expect(resetChromes.calledOnce).to.be.true;
    });

    it('asks Pages to re-discover chromes again when the component is remounted after things settled', () => {
      const First = createNCC(doc, registry, catalog);
      const { rerender } = render(withPage(true, <First />));
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS);
      expect(resetChromes.calledOnce).to.be.true;

      const Second = createNCC(doc, registry, catalog);
      rerender(withPage(true, <Second />));
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS);

      expect(resetChromes.calledTwice).to.be.true;
    });

    it('does not reset chromes when not in editing mode', () => {
      const View = createNCC(doc, registry, catalog);
      render(withPage(false, <View />));
      clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS);

      expect(resetChromes.called).to.be.false;
    });

    it('does not throw when the Pages reset function fails', () => {
      resetChromes.throws(new Error('boom'));
      const View = createNCC(doc, registry, catalog);
      render(withPage(true, <View />));

      expect(() => clock.tick(EDITOR_CHROMES_RESET_DEBOUNCE_MS)).to.not.throw();
      expect(resetChromes.calledOnce).to.be.true;
    });
  });
});
