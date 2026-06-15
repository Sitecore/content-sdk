/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, act } from '@testing-library/react';
import sinon from 'sinon';
import { z } from 'zod';
import { defineAtomsCatalog } from '../../atoms/define-atoms-catalog';
import { defineAtomsRegistry } from '../../atoms/define-atoms-registry';
import { useBoundProp } from '../../atoms';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import { SitecoreProvider } from '../SitecoreProvider';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import type { AtomsConfig } from '../../atoms/types';
import type { ImportMapImport } from './models';

// =============================================================================
// Shared provider helpers
// =============================================================================

const apiStub = {} as any;
const emptyComponentMap = new Map();
const loadImportMapStub = async (): Promise<ImportMapImport> => ({} as ImportMapImport);

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

function wrapInProvider(ui: React.ReactNode, atoms?: AtomsConfig) {
  return (
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
}

// =============================================================================
// Shared component stubs
// =============================================================================

const TextStub = ({ props }: any) => <span data-testid="text-el">{(props as any)?.content}</span>;
const BoxStub = ({ children }: any) => <div data-testid="box-el">{children}</div>;
const ButtonStub = ({ props, emit }: any) => (
  <button data-testid="btn" onClick={() => emit('press')}>
    {(props as any)?.label}
  </button>
);
const CheckboxStub = ({ props, bindings }: any) => {
  const [checked, setChecked] = useBoundProp<boolean>((props as any)?.checked, bindings?.checked);
  return (
    <input
      type="checkbox"
      data-testid="checkbox-el"
      checked={Boolean(checked)}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
};

// =============================================================================
// Shared catalogs + registries
// =============================================================================

/** Minimal catalog for prop-resolution tests (no Button, no actions). */
const textBoxCatalog = defineAtomsCatalog({
  components: {
    Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
    Box: { props: z.object({}), description: 'Box', slots: ['default'] },
  },
  actions: {},
});

const textBoxRegistry = defineAtomsRegistry(textBoxCatalog, {
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

const textBoxConfig: AtomsConfig = { catalog: textBoxCatalog, registry: textBoxRegistry };

/** Catalog with Text + Box + Button for interactive action tests. */
const interactiveCatalog = defineAtomsCatalog({
  components: {
    Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
    Box: { props: z.object({}), description: 'Box', slots: ['default'] },
    Button: { props: z.object({ label: z.string().optional() }), description: 'Button' },
  },
  actions: {},
});

const interactiveRegistry = defineAtomsRegistry(interactiveCatalog, {
  components: { Text: TextStub, Box: BoxStub, Button: ButtonStub },
});

const interactiveConfig: AtomsConfig = {
  catalog: interactiveCatalog,
  registry: interactiveRegistry,
};

/** Catalog with Box + Text + Checkbox for two-way binding tests. */
const bindCatalog = defineAtomsCatalog({
  components: {
    Box: { props: z.object({}), description: 'Box', slots: ['default'] },
    Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
    Checkbox: { props: z.object({ checked: z.boolean().optional() }), description: 'Checkbox' },
  },
  actions: {},
});

const bindRegistry = defineAtomsRegistry(bindCatalog, {
  components: { Box: BoxStub, Text: TextStub, Checkbox: CheckboxStub },
});

const bindConfig: AtomsConfig = { catalog: bindCatalog, registry: bindRegistry };

/** Catalog that adds Button to the bind set (for the external-setState test). */
const bindWithButtonCatalog = defineAtomsCatalog({
  components: {
    Box: { props: z.object({}), description: 'Box', slots: ['default'] },
    Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
    Checkbox: { props: z.object({ checked: z.boolean().optional() }), description: 'Checkbox' },
    Button: { props: z.object({ label: z.string().optional() }), description: 'Button' },
  },
  actions: {},
});

const bindWithButtonRegistry = defineAtomsRegistry(bindWithButtonCatalog, {
  components: { Box: BoxStub, Text: TextStub, Checkbox: CheckboxStub, Button: ButtonStub },
});

const bindWithButtonConfig: AtomsConfig = {
  catalog: bindWithButtonCatalog,
  registry: bindWithButtonRegistry,
};

// =============================================================================
// Sample documents
// =============================================================================

const sampleDoc: Document = {
  name: 'hero',
  root: 'root-el',
  elements: { 'root-el': { type: 'Box', props: {}, children: [] } },
};

// =============================================================================
// Tests
// =============================================================================

describe('<StudioComponentWrapper />', () => {
  const renderInProvider = (ui: React.ReactNode, atoms = textBoxConfig) =>
    render(wrapInProvider(ui, atoms));

  // ---------------------------------------------------------------------------
  // Guard conditions
  // ---------------------------------------------------------------------------

  describe('guard conditions', () => {
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

    it('renders a view when document and atomsConfig are both provided', () => {
      const { container } = renderInProvider(<StudioComponentWrapper document={sampleDoc} />);
      expect(container.innerHTML).to.not.equal('');
    });
  });

  // ---------------------------------------------------------------------------
  // Prop resolution
  // ---------------------------------------------------------------------------

  describe('prop resolution', () => {
    describe('$state', () => {
      it('resolves a top-level path from doc.state', () => {
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

      it('resolves a nested JSON Pointer path', () => {
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
    });

    describe('$template', () => {
      it('interpolates state values into the template string', () => {
        const doc: Document = {
          name: 'template-test',
          root: 'r',
          elements: {
            r: {
              type: 'Text',
              // Single-quoted — ${/name} is a literal template token, not a JS template literal
              props: { content: { $template: 'Hello, ${/name}!' } },
              children: [],
            },
          },
          state: { name: 'Alice' },
        };
        const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
        expect(getByTestId('text-el').textContent).to.equal('Hello, Alice!');
      });
    });

    describe('$cond / $then / $else', () => {
      it('renders the $then branch when the condition is truthy', () => {
        const doc: Document = {
          name: 'cond-truthy',
          root: 'r',
          elements: {
            r: {
              type: 'Text',
              props: {
                content: { $cond: { $state: '/isAdmin' }, $then: 'Admin', $else: 'Member' },
              },
              children: [],
            },
          },
          state: { isAdmin: true },
        };
        const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
        expect(getByTestId('text-el').textContent).to.equal('Admin');
      });

      it('renders the $else branch when the condition is falsy', () => {
        const doc: Document = {
          name: 'cond-falsy',
          root: 'r',
          elements: {
            r: {
              type: 'Text',
              props: {
                content: { $cond: { $state: '/isAdmin' }, $then: 'Admin', $else: 'Member' },
              },
              children: [],
            },
          },
          state: { isAdmin: false },
        };
        const { getByTestId } = renderInProvider(<StudioComponentWrapper document={doc} />);
        expect(getByTestId('text-el').textContent).to.equal('Member');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  describe('actions', () => {
    const renderInteractive = (ui: React.ReactNode) => renderInProvider(ui, interactiveConfig);

    describe('built-in setState', () => {
      it('updates a $state-bound prop and re-renders', async () => {
        const doc: Document = {
          name: 'setstate-test',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'display'] },
            btn: {
              type: 'Button',
              props: { label: 'Update' },
              on: {
                press: { action: 'setState', params: { statePath: '/message', value: 'updated' } },
              },
              children: [],
            },
            display: { type: 'Text', props: { content: { $state: '/message' } }, children: [] },
          },
          state: { message: 'initial' },
        };

        const { getByTestId } = renderInteractive(<StudioComponentWrapper document={doc} />);
        expect(getByTestId('text-el').textContent).to.equal('initial');

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(getByTestId('text-el').textContent).to.equal('updated');
      });

      it('updates a nested JSON Pointer path', async () => {
        const doc: Document = {
          name: 'nested-setstate',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'display'] },
            btn: {
              type: 'Button',
              props: { label: 'Go' },
              on: {
                press: { action: 'setState', params: { statePath: '/user/name', value: 'Bob' } },
              },
              children: [],
            },
            display: { type: 'Text', props: { content: { $state: '/user/name' } }, children: [] },
          },
          state: { user: { name: 'Alice' } },
        };

        const { getByTestId } = renderInteractive(<StudioComponentWrapper document={doc} />);
        expect(getByTestId('text-el').textContent).to.equal('Alice');

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(getByTestId('text-el').textContent).to.equal('Bob');
      });

      it('a chained setState reads the value mutated by the preceding action', async () => {
        const doc: Document = {
          name: 'chained-setstate',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'display'] },
            btn: {
              type: 'Button',
              props: { label: 'Go' },
              on: {
                press: [
                  { action: 'setState', params: { statePath: '/counter', value: 42 } },
                  {
                    action: 'setState',
                    params: { statePath: '/copy', value: { $state: '/counter' } },
                  },
                ],
              },
              children: [],
            },
            display: { type: 'Text', props: { content: { $state: '/copy' } }, children: [] },
          },
          state: { counter: 0, copy: 0 },
        };

        const { getByTestId } = renderInteractive(<StudioComponentWrapper document={doc} />);

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(getByTestId('text-el').textContent).to.equal('42');
      });
    });

    describe('built-in pushState', () => {
      it('appends an item to a state array and re-renders the list', async () => {
        const doc: Document = {
          name: 'pushstate-test',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'list'] },
            btn: {
              type: 'Button',
              props: { label: 'Add' },
              on: {
                press: {
                  action: 'pushState',
                  params: { statePath: '/items', value: { id: '3', name: 'Charlie' } },
                },
              },
              children: [],
            },
            list: {
              type: 'Box',
              props: {},
              repeat: { statePath: '/items', key: 'id' },
              children: ['item'],
            },
            item: { type: 'Text', props: { content: { $item: 'name' } }, children: [] },
          },
          state: {
            items: [
              { id: '1', name: 'Alice' },
              { id: '2', name: 'Bob' },
            ],
          },
        };

        const { getAllByTestId, getByTestId } = renderInteractive(
          <StudioComponentWrapper document={doc} />
        );
        expect(getAllByTestId('text-el')).to.have.length(2);

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(getAllByTestId('text-el')).to.have.length(3);
        expect(getAllByTestId('text-el')[2].textContent).to.equal('Charlie');
      });
    });

    describe('built-in removeState', () => {
      it('removes the item at the given index from a state array', async () => {
        const doc: Document = {
          name: 'removestate-test',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'list'] },
            btn: {
              type: 'Button',
              props: { label: 'Remove Middle' },
              on: {
                press: { action: 'removeState', params: { statePath: '/items', index: 1 } },
              },
              children: [],
            },
            list: {
              type: 'Box',
              props: {},
              repeat: { statePath: '/items', key: 'id' },
              children: ['item'],
            },
            item: { type: 'Text', props: { content: { $item: 'name' } }, children: [] },
          },
          state: {
            items: [
              { id: '1', name: 'Alice' },
              { id: '2', name: 'Bob' },
              { id: '3', name: 'Charlie' },
            ],
          },
        };

        const { getAllByTestId, getByTestId } = renderInteractive(
          <StudioComponentWrapper document={doc} />
        );
        expect(getAllByTestId('text-el')).to.have.length(3);

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        const remaining = getAllByTestId('text-el').map((n) => n.textContent);
        expect(remaining).to.deep.equal(['Alice', 'Charlie']);
      });

      it('removes the first item when index is 0', async () => {
        const doc: Document = {
          name: 'removestate-first',
          root: 'root',
          elements: {
            root: { type: 'Box', props: {}, children: ['btn', 'list'] },
            btn: {
              type: 'Button',
              props: { label: 'Remove First' },
              on: {
                press: { action: 'removeState', params: { statePath: '/items', index: 0 } },
              },
              children: [],
            },
            list: {
              type: 'Box',
              props: {},
              repeat: { statePath: '/items', key: 'id' },
              children: ['item'],
            },
            item: { type: 'Text', props: { content: { $item: 'name' } }, children: [] },
          },
          state: {
            items: [
              { id: '1', name: 'Alice' },
              { id: '2', name: 'Bob' },
            ],
          },
        };

        const { getAllByTestId, getByTestId } = renderInteractive(
          <StudioComponentWrapper document={doc} />
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        const remaining = getAllByTestId('text-el').map((n) => n.textContent);
        expect(remaining).to.deep.equal(['Bob']);
      });
    });

    describe('built-in navigate', () => {
      const navigateSpy = sinon.stub();

      const navigateCatalog = defineAtomsCatalog({
        components: {
          Button: { props: z.object({ label: z.string().optional() }), description: 'Button' },
        },
        actions: {
          save: { params: z.object({}), description: 'Save and navigate' },
        },
      });

      const navigateRegistry = defineAtomsRegistry(navigateCatalog, {
        components: { Button: ButtonStub },
        actions: { save: async () => {} },
      });

      const navigateConfig: AtomsConfig = {
        catalog: navigateCatalog,
        registry: navigateRegistry,
        navigate: navigateSpy,
      };

      beforeEach(() => navigateSpy.resetHistory());

      it('calls the navigate callback with the path from onSuccess after the action succeeds', async () => {
        const doc: Document = {
          name: 'navigate-test',
          root: 'r',
          elements: {
            r: {
              type: 'Button',
              props: { label: 'Save' },
              on: { press: { action: 'save', onSuccess: { navigate: '/dashboard' } } },
              children: [],
            },
          },
        };

        const { getByTestId } = renderInProvider(
          <StudioComponentWrapper document={doc} />,
          navigateConfig
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(navigateSpy.calledOnce).to.be.true;
        expect(navigateSpy.firstCall.args[0]).to.equal('/dashboard');
      });

      it('does not call navigate when onSuccess is not set', async () => {
        const doc: Document = {
          name: 'navigate-no-success',
          root: 'r',
          elements: {
            r: {
              type: 'Button',
              props: { label: 'Save' },
              on: { press: { action: 'save' } },
              children: [],
            },
          },
        };

        const { getByTestId } = renderInProvider(
          <StudioComponentWrapper document={doc} />,
          navigateConfig
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(navigateSpy.called).to.be.false;
      });
    });

    describe('custom action handlers', () => {
      const greetSpy = sinon.stub();

      const greetCatalog = defineAtomsCatalog({
        components: {
          Text: { props: z.object({ content: z.string().optional() }), description: 'Text' },
          Box: { props: z.object({}), description: 'Box', slots: ['default'] },
          Button: { props: z.object({ label: z.string().optional() }), description: 'Button' },
        },
        actions: {
          greet: { params: z.object({ name: z.string() }), description: 'Greet someone' },
        },
      });

      const greetRegistry = defineAtomsRegistry(greetCatalog, {
        components: { Text: TextStub, Box: BoxStub, Button: ButtonStub },
        actions: { greet: async (params) => greetSpy(params) },
      });

      const greetConfig: AtomsConfig = { catalog: greetCatalog, registry: greetRegistry };

      beforeEach(() => greetSpy.resetHistory());

      it('calls the registered handler with the correct params', async () => {
        const doc: Document = {
          name: 'custom-action',
          root: 'r',
          elements: {
            r: {
              type: 'Button',
              props: { label: 'Say Hello' },
              on: { press: { action: 'greet', params: { name: 'World' } } },
              children: [],
            },
          },
        };

        const { getByTestId } = renderInProvider(
          <StudioComponentWrapper document={doc} />,
          greetConfig
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(greetSpy.calledOnce).to.be.true;
        expect(greetSpy.firstCall.args[0]).to.deep.equal({ name: 'World' });
      });

      it('resolves $state references in params before invoking the handler', async () => {
        const doc: Document = {
          name: 'action-state-params',
          root: 'r',
          elements: {
            r: {
              type: 'Button',
              props: { label: 'Greet' },
              on: { press: { action: 'greet', params: { name: { $state: '/userName' } } } },
              children: [],
            },
          },
          state: { userName: 'Alice' },
        };

        const { getByTestId } = renderInProvider(
          <StudioComponentWrapper document={doc} />,
          greetConfig
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(greetSpy.calledOnce).to.be.true;
        expect(greetSpy.firstCall.args[0]).to.deep.equal({ name: 'Alice' });
      });

      it('does not call the handler when no binding is set for the event', async () => {
        const doc: Document = {
          name: 'no-binding',
          root: 'r',
          elements: {
            r: { type: 'Button', props: { label: 'Inert' }, children: [] },
          },
        };

        const { getByTestId } = renderInProvider(
          <StudioComponentWrapper document={doc} />,
          greetConfig
        );

        await act(async () => {
          fireEvent.click(getByTestId('btn'));
        });

        expect(greetSpy.called).to.be.false;
      });
    });
  });

  // ---------------------------------------------------------------------------
  // List rendering with repeat
  // ---------------------------------------------------------------------------

  describe('list rendering with repeat', () => {
    const renderList = (doc: Document) =>
      renderInProvider(<StudioComponentWrapper document={doc} />, interactiveConfig);

    it('renders one child per item in the state array', () => {
      const doc: Document = {
        name: 'list-test',
        root: 'list',
        elements: {
          list: {
            type: 'Box',
            props: {},
            repeat: { statePath: '/items', key: 'id' },
            children: ['item'],
          },
          item: { type: 'Text', props: { content: { $item: 'name' } }, children: [] },
        },
        state: {
          items: [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
            { id: '3', name: 'Charlie' },
          ],
        },
      };

      const texts = renderList(doc)
        .getAllByTestId('text-el')
        .map((n) => n.textContent);
      expect(texts).to.deep.equal(['Alice', 'Bob', 'Charlie']);
    });

    it('renders nothing when the state array is empty', () => {
      const doc: Document = {
        name: 'empty-list',
        root: 'list',
        elements: {
          list: {
            type: 'Box',
            props: {},
            repeat: { statePath: '/items', key: 'id' },
            children: ['item'],
          },
          item: { type: 'Text', props: { content: { $item: 'name' } }, children: [] },
        },
        state: { items: [] },
      };

      const { container } = renderList(doc);
      expect(container.querySelectorAll('[data-testid="text-el"]').length).to.equal(0);
    });

    it('filters items via a $item visibility condition on the child element', () => {
      // Visibility on the CHILD (inside the repeat scope) filters individual items.
      const doc: Document = {
        name: 'filtered-list',
        root: 'list',
        elements: {
          list: {
            type: 'Box',
            props: {},
            repeat: { statePath: '/tasks', key: 'id' },
            children: ['item'],
          },
          item: {
            type: 'Text',
            props: { content: { $item: 'title' } },
            visible: { $item: 'active', eq: true },
            children: [],
          },
        },
        state: {
          tasks: [
            { id: '1', title: 'Buy groceries', active: true },
            { id: '2', title: 'Read book', active: false },
            { id: '3', title: 'Go running', active: true },
          ],
        },
      };

      const texts = renderList(doc)
        .getAllByTestId('text-el')
        .map((n) => n.textContent);
      expect(texts).to.deep.equal(['Buy groceries', 'Go running']);
    });
  });

  // ---------------------------------------------------------------------------
  // $bindState — two-way binding
  // ---------------------------------------------------------------------------

  describe('$bindState — two-way binding', () => {
    it('reflects the initial state value in the bound prop', () => {
      const doc: Document = {
        name: 'bindstate-initial',
        root: 'r',
        elements: {
          r: { type: 'Checkbox', props: { checked: { $bindState: '/isChecked' } }, children: [] },
        },
        state: { isChecked: true },
      };

      const { getByTestId } = renderInProvider(
        <StudioComponentWrapper document={doc} />,
        bindConfig
      );
      expect((getByTestId('checkbox-el') as HTMLInputElement).checked).to.be.true;
    });

    it('writes back to state when the component changes the bound value', async () => {
      const doc: Document = {
        name: 'bindstate-writeback',
        root: 'root',
        elements: {
          root: { type: 'Box', props: {}, children: ['checkbox', 'display'] },
          checkbox: {
            type: 'Checkbox',
            props: { checked: { $bindState: '/isChecked' } },
            children: [],
          },
          display: {
            type: 'Text',
            props: {
              content: { $cond: { $state: '/isChecked' }, $then: 'checked', $else: 'unchecked' },
            },
            children: [],
          },
        },
        state: { isChecked: false },
      };

      const { getByTestId } = renderInProvider(
        <StudioComponentWrapper document={doc} />,
        bindConfig
      );
      expect(getByTestId('text-el').textContent).to.equal('unchecked');
      expect((getByTestId('checkbox-el') as HTMLInputElement).checked).to.be.false;

      await act(async () => {
        fireEvent.click(getByTestId('checkbox-el'));
      });

      expect(getByTestId('text-el').textContent).to.equal('checked');
      expect((getByTestId('checkbox-el') as HTMLInputElement).checked).to.be.true;
    });

    it('reflects an external setState into the bound prop (read direction)', async () => {
      const doc: Document = {
        name: 'bindstate-external',
        root: 'root',
        elements: {
          root: { type: 'Box', props: {}, children: ['btn', 'checkbox'] },
          btn: {
            type: 'Button',
            props: { label: 'Check' },
            on: { press: { action: 'setState', params: { statePath: '/isChecked', value: true } } },
            children: [],
          },
          checkbox: {
            type: 'Checkbox',
            props: { checked: { $bindState: '/isChecked' } },
            children: [],
          },
        },
        state: { isChecked: false },
      };

      const { getByTestId } = renderInProvider(
        <StudioComponentWrapper document={doc} />,
        bindWithButtonConfig
      );
      expect((getByTestId('checkbox-el') as HTMLInputElement).checked).to.be.false;

      await act(async () => {
        fireEvent.click(getByTestId('btn'));
      });

      expect((getByTestId('checkbox-el') as HTMLInputElement).checked).to.be.true;
    });
  });
});

