import { expect } from 'chai';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { createView } from './createView';
import { getAtomRegistry } from './getAtomRegistry';
import type { ComponentLayoutDocument as Document } from '@sitecore-content-sdk/content/editing';
import type { AtomMetadata } from '../atoms';

describe('createView', () => {
  const Box = (props: { children?: React.ReactNode; title?: string }) => (
    <div data-testid="box" data-title={props.title}>
      {props.children}
    </div>
  );

  const Text = (props: { value?: string }) => <span data-testid="text">{props.value}</span>;

  const atoms = {
    Box: Box as React.ComponentType<unknown>,
    Text: Text as React.ComponentType<unknown>,
  };

  it('should render a simple document with one element', () => {
    const BoxWithAttrs = (props: { children?: React.ReactNode; title?: string; 'data-designlib-id'?: string; 'data-designlib-label'?: string }) => (
      <div data-testid="box" data-title={props.title} data-designlib-id={props['data-designlib-id']} data-designlib-label={props['data-designlib-label']}>
        {props.children}
      </div>
    );
    const doc: Document = {
      name: 'Test',
      root: {
        type: 'Box',
        id: 'box-1',
        staticProps: { title: 'Hello' },
        children: [],
      },
    };
    const View = createView(doc, { ...atoms, Box: BoxWithAttrs as React.ComponentType<unknown> });
    render(<View />);
    const box = screen.getByTestId('box');
    expect(box).to.exist;
    expect(box.getAttribute('data-title')).to.equal('Hello');
    expect(box.getAttribute('data-designlib-id')).to.equal('box-1');
    expect(box.getAttribute('data-designlib-label')).to.equal('Box');
  });

  it('should resolve expression bindings with props', () => {
    const doc: Document = {
      name: 'Test',
      root: {
        type: 'Text',
        id: 't1',
        bindings: { value: { bindType: 'expression', value: '{{props.label}}' } },
        children: [],
      },
    };
    const View = createView(doc, atoms);
    render(<View label="Resolved" />);
    const text = screen.getByTestId('text');
    expect(text.textContent).to.equal('Resolved');
  });

  it('should use initial state from document', () => {
    const doc: Document = {
      name: 'Test',
      state: { count: 42 },
      root: {
        type: 'Text',
        id: 't1',
        bindings: { value: { bindType: 'expression', value: '{{state.count}}' } },
        children: [],
      },
    };
    const View = createView(doc, atoms);
    render(<View />);
    const text = screen.getByTestId('text');
    expect(text.textContent).to.equal('42');
  });

  it('should throw on unknown atom type', () => {
    const doc: Document = {
      name: 'Test',
      root: { type: 'UnknownAtom', id: 'u1', children: [] },
    };
    const View = createView(doc, atoms);
    expect(() => render(<View />)).to.throw(/unknown atom "UnknownAtom"/);
  });
});

describe('getAtomRegistry', () => {
  it('should return a map of name to component from metadata', () => {
    const Button = () => null;
    const meta: AtomMetadata = {
      name: 'Button',
      type: 'atom',
      description: 'Button',
      props: {} as AtomMetadata['props'],
      component: Button,
    };
    const registry = getAtomRegistry([meta]);
    expect(registry.Button).to.equal(Button);
    expect(Object.keys(registry)).to.deep.equal(['Button']);
  });

  it('should include allowedChildren in registry', () => {
    const Card = () => null;
    const CardBody = () => null;
    const cardMeta: AtomMetadata = {
      name: 'Card',
      type: 'atom',
      description: 'Card',
      props: {} as AtomMetadata['props'],
      component: Card,
      allowedChildren: [
        {
          name: 'CardBody',
          type: 'atom-child',
          description: 'Body',
          props: {} as AtomMetadata['props'],
          component: CardBody,
        },
      ],
    };
    const registry = getAtomRegistry([cardMeta]);
    expect(registry.Card).to.equal(Card);
    expect(registry.CardBody).to.equal(CardBody);
  });
});
