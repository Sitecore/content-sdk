/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { z } from 'zod';
import { render } from '@testing-library/react';
import { RepeatScopeProvider } from '@json-render/react';
import type { ComponentRenderProps } from '@json-render/react';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import { defineAtomsCatalog } from './define-atoms-catalog';
import { ATOM_TYPE } from './constants';
import {
  CHROME_ELEMENT_KEY_PROP,
  withElementChromeKeys,
  withEditingChrome,
  withEditingChromeRegistry,
} from './with-editing-chrome';

const noop = () => undefined;
const baseRenderProps = (
  overrides: Partial<ComponentRenderProps> = {}
): ComponentRenderProps => ({
  element: { type: 'Stub', props: {} },
  emit: noop,
  on: () => ({ emit: noop, shouldPreventDefault: false, bound: false }),
  ...overrides,
});

describe('withElementChromeKeys', () => {
  it('injects each element key into its own props', () => {
    const doc: Document = {
      name: 'doc',
      root: 'root-el',
      elements: {
        'root-el': { type: 'Box', props: { title: 'Hi' }, children: ['child-el'] },
        'child-el': { type: 'Text', props: {} },
      },
    };

    const result = withElementChromeKeys(doc);

    expect(result.elements['root-el'].props).to.deep.equal({
      title: 'Hi',
      [CHROME_ELEMENT_KEY_PROP]: 'root-el',
    });
    expect(result.elements['child-el'].props).to.deep.equal({
      [CHROME_ELEMENT_KEY_PROP]: 'child-el',
    });
  });

  it('does not mutate the original document', () => {
    const doc: Document = {
      name: 'doc',
      root: 'root-el',
      elements: { 'root-el': { type: 'Box', props: {} } },
    };

    withElementChromeKeys(doc);

    expect(doc.elements['root-el'].props).to.deep.equal({});
  });
});

describe('withEditingChrome', () => {
  const Stub = ({ element }: ComponentRenderProps) => (
    <span data-testid="stub">{JSON.stringify(element.props)}</span>
  );

  it('renders open/close atom chrome around the wrapped component using the injected element key', () => {
    const Wrapped = withEditingChrome(Stub);
    const { container } = render(
      <Wrapped
        {...baseRenderProps({
          element: { type: 'Stub', props: { [CHROME_ELEMENT_KEY_PROP]: 'card-1' } },
        })}
      />
    );

    const open = container.querySelector(`code[chrometype="${ATOM_TYPE}"][kind="open"]`);
    const close = container.querySelector(`code[chrometype="${ATOM_TYPE}"][kind="close"]`);

    expect(open?.getAttribute('element-name')).to.equal('card-1');
    expect(open?.getAttribute('type')).to.equal('text/sitecore');
    expect(open?.getAttribute('atom-type')).to.equal('Stub');
    expect(open?.className).to.equal('scpm');
    expect(close).to.not.be.null;
  });

  it('includes the atom slot mapping in the opening chrome block', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Stub: { props: z.object({}), description: 'Stub', slots: ['header', 'body'] },
      },
      actions: {},
    });
    const Wrapped = withEditingChrome(Stub, catalog.data.components.Stub);
    const { container } = render(
      <Wrapped
        {...baseRenderProps({
          element: {
            type: 'Stub',
            props: { [CHROME_ELEMENT_KEY_PROP]: 'card-1' },
          },
        })}
      />
    );

    const open = container.querySelector(`code[chrometype="${ATOM_TYPE}"][kind="open"]`);
    expect(open?.getAttribute('atom-slots')).to.equal(JSON.stringify(['header', 'body']));
  });

  it('strips the internal chrome-key prop before it reaches the wrapped component', () => {
    const Wrapped = withEditingChrome(Stub);
    const { getByTestId } = render(
      <Wrapped
        {...baseRenderProps({
          element: {
            type: 'Stub',
            props: { title: 'Hi', [CHROME_ELEMENT_KEY_PROP]: 'card-1' },
          },
        })}
      />
    );

    expect(getByTestId('stub').textContent).to.equal(JSON.stringify({ title: 'Hi' }));
  });

  it('renders the wrapped component with no chrome when the element key is missing', () => {
    const Wrapped = withEditingChrome(Stub);
    const { container } = render(<Wrapped {...baseRenderProps({ element: { type: 'Stub', props: {} } })} />);

    expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"]`)).to.be.null;
  });

  it('suffixes the chrome id with the repeat index inside a repeat scope', () => {
    const Wrapped = withEditingChrome(Stub);
    const { container } = render(
      <RepeatScopeProvider item={{}} index={2} basePath="/items/2">
        <Wrapped
          {...baseRenderProps({
            element: { type: 'Stub', props: { [CHROME_ELEMENT_KEY_PROP]: 'item' } },
          })}
        />
      </RepeatScopeProvider>
    );

    const open = container.querySelector(`code[chrometype="${ATOM_TYPE}"][kind="open"]`);
    expect(open?.getAttribute('element-name')).to.equal('item_2');
  });

  it('keeps the plain unsuffixed id for the container owning the repeat itself', () => {
    const Wrapped = withEditingChrome(Stub);
    const { container } = render(
      <Wrapped
        {...baseRenderProps({
          element: { type: 'Stub', props: { [CHROME_ELEMENT_KEY_PROP]: 'list' } },
        })}
      />
    );

    const open = container.querySelector(`code[chrometype="${ATOM_TYPE}"][kind="open"]`);
    expect(open?.getAttribute('element-name')).to.equal('list');
  });
});

describe('withEditingChromeRegistry', () => {
  it('wraps every component in the registry', () => {
    const Text = ({ element }: ComponentRenderProps) => <span>{JSON.stringify(element.props)}</span>;
    const Box = ({ children }: ComponentRenderProps) => <div>{children}</div>;

    const registry = withEditingChromeRegistry({ Text, Box });

    const { container } = render(
      <>
        {React.createElement(
          registry.Text,
          baseRenderProps({
            element: { type: 'Text', props: { [CHROME_ELEMENT_KEY_PROP]: 'text-1' } },
          })
        )}
        {React.createElement(
          registry.Box,
          baseRenderProps({
            element: { type: 'Box', props: { [CHROME_ELEMENT_KEY_PROP]: 'box-1' } },
          })
        )}
      </>
    );

    expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="text-1"]`)).to.not.be.null;
    expect(container.querySelector(`code[chrometype="${ATOM_TYPE}"][element-name="box-1"]`)).to.not.be.null;
  });
});
