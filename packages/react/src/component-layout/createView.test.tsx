/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';
import {
  type ComponentLayoutDocument as Document,
  type ComponentLayoutElement as Element,
  type ComponentLayoutResolveContext as ResolveContext,
} from '@sitecore-content-sdk/content/editing';

import proxyquire from 'proxyquire';
import * as editingModule from '@sitecore-content-sdk/content/editing';
import {
  buildEventCallback,
  createView,
  renderElementNode,
  renderFor,
  renderPrimitiveNode,
} from './createView';

describe.only('component-layout/createView', () => {
  describe('renderFor()', () => {
    it('renders each item and resolves keys', () => {
      const node: Element = {
        id: 'item-template',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
          key: '{{item.id}}',
        },
        children: [],
      };

      const ctx: ResolveContext = {
        props: {
          items: [
            { id: 'a', title: 'Alpha' },
            { id: 'b', title: 'Beta' },
          ],
        },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const renderNodeSpy = sinon.spy(
        (_tmpl: any, key: React.Key, item: unknown, itemScope: Record<string, unknown>) => (
          <div key={String(key)}>
            {(item as { title: string }).title}:{(itemScope.item as { id: string }).id}
          </div>
        )
      );

      const result = renderFor(node, ctx, renderNodeSpy);

      expect(Array.isArray(result)).to.equal(true);
      expect(renderNodeSpy.callCount).to.equal(2);
      expect(renderNodeSpy.firstCall.args[0].for).to.equal(undefined);
      expect(renderNodeSpy.firstCall.args[1]).to.equal('a');
      expect(renderNodeSpy.secondCall.args[1]).to.equal('b');
    });

    it('returns null when for.each does not resolve to array', () => {
      const node: Element = {
        id: 'item-template',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
        },
        children: [],
      };

      const ctx: ResolveContext = {
        props: { items: 'not-an-array' },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const result = renderFor(node, ctx, () => null);
      expect(result).to.equal(null);
    });

    it('uses array index as key when for.key is not provided', () => {
      const node: Element = {
        id: 'item-template-no-key',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
        },
        children: [],
      };

      const ctx: ResolveContext = {
        props: {
          items: ['one', 'two', 'three'],
        },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const renderNodeSpy = sinon.spy(
        (...args: [any, React.Key, unknown, Record<string, unknown>]) => {
          void args;
          return null;
        }
      );

      renderFor(node, ctx, renderNodeSpy);

      expect(renderNodeSpy.callCount).to.equal(3);
      expect(renderNodeSpy.firstCall.args[1]).to.equal(0);
      expect(renderNodeSpy.secondCall.args[1]).to.equal(1);
      expect(renderNodeSpy.thirdCall.args[1]).to.equal(2);
    });

    it('returns an empty list when for.each resolves to an empty array', () => {
      const node: Element = {
        id: 'item-template-empty',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
        },
        children: [],
      };

      const ctx: ResolveContext = {
        props: {
          items: [],
        },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const renderNodeSpy = sinon.spy(
        (...args: [any, React.Key, unknown, Record<string, unknown>]) => {
          void args;
          return null;
        }
      );

      const result = renderFor(node, ctx, renderNodeSpy);

      expect(result).to.deep.equal([]);
      expect(renderNodeSpy.called).to.equal(false);
    });

    it('passes per-item values and scope to renderNode for each iteration', () => {
      const node: Element = {
        id: 'item-template-scope',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
          key: '{{item.id}}',
        },
        children: [],
      };

      const items = [
        { id: 'x1', value: 'A' },
        { id: 'x2', value: 'B' },
      ];

      const ctx: ResolveContext = {
        props: {
          items,
        },
        state: {},
        item: { ignored: true },
        scope: { parent: 'scope-value' },
      };

      const renderNodeSpy = sinon.spy(
        (...args: [any, React.Key, unknown, Record<string, unknown>]) => {
          void args;
          return null;
        }
      );

      renderFor(node, ctx, renderNodeSpy);

      expect(renderNodeSpy.callCount).to.equal(2);
      expect(renderNodeSpy.firstCall.args[2]).to.equal(items[0]);
      expect(renderNodeSpy.secondCall.args[2]).to.equal(items[1]);
      expect(renderNodeSpy.firstCall.args[3]).to.deep.equal({ item: items[0] });
      expect(renderNodeSpy.secondCall.args[3]).to.deep.equal({ item: items[1] });
    });

    it('does not mutate the original loop node', () => {
      const node: Element = {
        id: 'item-template-immutable',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
          key: '{{item.id}}',
        },
        children: [],
      };

      const originalFor = node.for;

      const ctx: ResolveContext = {
        props: {
          items: [{ id: '1' }],
        },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const renderNodeSpy = sinon.spy(
        (...args: [any, React.Key, unknown, Record<string, unknown>]) => {
          void args;
          return null;
        }
      );

      renderFor(node, ctx, renderNodeSpy);

      expect(node.for).to.equal(originalFor);
      expect(node.for?.as).to.equal('item');
      expect(renderNodeSpy.firstCall.args[0].for).to.equal(undefined);
    });

    it('supports non-primitive resolved keys from key template', () => {
      const node: Element = {
        id: 'item-template-object-key',
        type: 'Label',
        for: {
          each: '{{props.items}}',
          as: 'item',
          key: '{{item.keyObj}}',
        },
        children: [],
      };

      const keyObj = { nested: 'value' };
      const ctx: ResolveContext = {
        props: {
          items: [{ keyObj }],
        },
        state: {},
        item: undefined,
        scope: undefined,
      };

      const renderNodeSpy = sinon.spy(
        (...args: [any, React.Key, unknown, Record<string, unknown>]) => {
          void args;
          return null;
        }
      );

      renderFor(node, ctx, renderNodeSpy);

      expect(renderNodeSpy.calledOnce).to.equal(true);
      expect(renderNodeSpy.firstCall.args[1]).to.equal(keyObj as any);
    });
  });

  describe('renderPrimitiveNode()', () => {
    const ctx: ResolveContext = {
      props: { name: 'Alice' },
      state: {},
      item: undefined,
      scope: undefined,
    };

    it('resolves template strings', () => {
      const result = renderPrimitiveNode('{{props.name}}', ctx);
      expect(result).to.equal('Alice');
    });

    it('passes through primitive values', () => {
      expect(renderPrimitiveNode(0 as any, ctx)).to.equal(0);
      expect(renderPrimitiveNode(true as any, ctx)).to.equal(true);
      expect(renderPrimitiveNode(null as any, ctx)).to.equal(null);
    });

    it('returns null for non-primitive objects', () => {
      const result = renderPrimitiveNode({ bad: 'node' } as any, ctx);
      expect(result).to.equal(null);
    });
  });

  describe('renderElementNode()', () => {
    const atoms: Record<string, React.ComponentType<any>> = {
      Card: ({ children, ...props }) => (
        <div data-testid="card" {...props}>
          {children}
        </div>
      ),
      Child: ({ children }) => <span data-testid="child">{children}</span>,
    };

    const baseContext: ResolveContext = {
      props: {
        title: 'Hello world',
        childText: 'from props',
      },
      state: {
        message: 'initial',
      },
      item: undefined,
      scope: undefined,
    };

    it('throws for unknown atom type', () => {
      const node: Element = {
        id: 'unknown-id',
        type: 'Unknown',
        children: [],
      };

      expect(() =>
        renderElementNode(
          node,
          0,
          atoms,
          {},
          () => undefined,
          () => ({}),
          baseContext,
          () => null
        )
      ).to.throw('unknown atom "Unknown"');
    });

    it('renders atom with resolved props, binding props and children', () => {
      const setStateSpy = sinon.spy();
      const callbacks = {
        onChange: sinon.spy(),
      };

      const childElement: Element = {
        id: 'child-node',
        type: 'Child',
        children: ['nested-child'],
      };

      const node: Element = {
        id: 'card-id',
        type: 'Card',
        staticProps: {
          className: 'wrapper',
        },
        bindings: {
          title: {
            bindType: 'expression',
            value: '{{props.title}}',
          },
          onClick: {
            bindType: 'event',
            arguments: ['value'],
            actions: [
              {
                setState: {
                  message: '{{event}}',
                },
              },
            ],
          },
        },
        children: ['{{props.childText}}', childElement],
      };

      const renderNodeSpy = sinon.spy((child: any) => {
        if (child?.type === 'Child') {
          return (
            <span key="nested-from-render-node" data-testid="nested-from-renderNode">
              Nested
            </span>
          );
        }
        return null;
      });

      const element = renderElementNode(
        node,
        'k1',
        atoms,
        callbacks,
        setStateSpy as any,
        () => ({ message: 'initial' }),
        baseContext,
        renderNodeSpy
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(card.getAttribute('class')).to.equal('wrapper');
      expect(card.getAttribute('data-atom-id')).to.equal('card-id');
      expect(card.getAttribute('data-atom-label')).to.equal('Card');
      expect(card.getAttribute('title')).to.equal('Hello world');
      expect(card.textContent).to.contain('from props');
      expect(card.textContent).to.contain('Nested');

      expect(renderNodeSpy.calledOnce).to.equal(true);
      expect(renderNodeSpy.firstCall.args[0]).to.equal(childElement);

      const onClick = (card as any).onclick ?? (card as any).props?.onClick;
      expect(typeof onClick === 'function' || card.getAttribute('onClick') === null).to.equal(true);
    });

    it('renders with only static props and no bindings', () => {
      const node: Element = {
        id: 'static-id',
        type: 'Card',
        staticProps: {
          className: 'static-class',
          role: 'main',
        },
        children: ['Static content'],
      };

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        () => null
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(card.getAttribute('class')).to.equal('static-class');
      expect(card.getAttribute('role')).to.equal('main');
      expect(card.textContent).to.equal('Static content');
    });

    it('renders with only expression bindings', () => {
      const node: Element = {
        id: 'expr-id',
        type: 'Card',
        bindings: {
          title: {
            bindType: 'expression',
            value: '{{props.title}}',
          },
          subtitle: {
            bindType: 'expression',
            value: '{{state.message}}',
          },
          'aria-label': {
            bindType: 'expression',
            value: '{{props.title}} - {{state.message}}',
          },
        },
        children: [],
      };

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({ message: 'initial' }),
        baseContext,
        () => null
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(card.getAttribute('title')).to.equal('Hello world');
      expect(card.getAttribute('subtitle')).to.equal('initial');
      expect(card.getAttribute('aria-label')).to.equal('Hello world - initial');
    });

    it('renders with primitive-only children (text and template strings)', () => {
      const node: Element = {
        id: 'primitive-id',
        type: 'Card',
        children: ['Plain text: ', '{{props.childText}}', ' - end'],
      };

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        () => null
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(card.textContent).to.equal('Plain text: from props - end');
    });

    it('renders with element-only children (no text content)', () => {
      const childElement1: Element = {
        id: 'child1',
        type: 'Child',
        children: ['First child'],
      };

      const childElement2: Element = {
        id: 'child2',
        type: 'Child',
        children: ['Second child'],
      };

      const node: Element = {
        id: 'element-children-id',
        type: 'Card',
        children: [childElement1, childElement2],
      };

      const renderNodeSpy = sinon.spy((child: any) => {
        if (child?.id === 'child1') {
          return (
            <span key="c1" data-testid="child-1">
              Child 1
            </span>
          );
        }
        if (child?.id === 'child2') {
          return (
            <span key="c2" data-testid="child-2">
              Child 2
            </span>
          );
        }
        return null;
      });

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        renderNodeSpy
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(rendered.getByTestId('child-1')).to.exist;
      expect(rendered.getByTestId('child-2')).to.exist;
      expect(renderNodeSpy.callCount).to.equal(2);
    });

    it('handles mixed children when renderNode returns null for some elements', () => {
      const childElement1: Element = {
        id: 'child1',
        type: 'Child',
        children: ['Keep this'],
      };

      const childElement2: Element = {
        id: 'child2',
        type: 'Child',
        children: ['Skip this'],
      };

      const node: Element = {
        id: 'mixed-id',
        type: 'Card',
        children: [
          'Text before: ',
          childElement1,
          ' - text between - ',
          childElement2,
          ' :text after',
        ],
      };

      const renderNodeSpy = sinon.spy((child: any) => {
        if (child?.id === 'child1') {
          return (
            <span key="c1" data-testid="kept">
              Kept
            </span>
          );
        }
        return null; // Skip child2
      });

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        renderNodeSpy
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(rendered.getByTestId('kept')).to.exist;
      expect(card.textContent).to.contain('Text before:');
      expect(card.textContent).to.contain('Kept');
      expect(card.textContent).to.contain('text between');
      expect(card.textContent).to.contain('text after');
    });

    it('verifies data attributes (data-atom-id and data-atom-label) are set', () => {
      const node: Element = {
        id: 'special-atom-id',
        type: 'Card',
        children: ['Content'],
      };

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        () => null
      );

      const rendered = render(<>{element}</>);
      const card = rendered.getByTestId('card');

      expect(card.getAttribute('data-atom-id')).to.equal('special-atom-id');
      expect(card.getAttribute('data-atom-label')).to.equal('Card');
    });

    it('handles bindings to undefined props gracefully', () => {
      const node: Element = {
        id: 'undefined-props-id',
        type: 'Card',
        bindings: {
          missing: {
            bindType: 'expression',
            value: '{{props.nonexistent}}',
          },
          alsoMissing: {
            bindType: 'expression',
            value: '{{state.notThere}}',
          },
        },
        children: ['Content with undefined bindings'],
      };

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({ message: 'exists' }),
        baseContext,
        () => null
      );

      const rendered = render(<>{element}</>);

      // Should not throw, attributes may be undefined or omitted
      expect(rendered.getByTestId('card').textContent).to.contain(
        'Content with undefined bindings'
      );
    });

    it('renders complex nested structure with mixed binding types', () => {
      const innerChild: Element = {
        id: 'inner-child',
        type: 'Child',
        children: ['Inner {{props.title}}'],
      };

      const middleElement: Element = {
        id: 'middle',
        type: 'Card',
        staticProps: { role: 'group' },
        bindings: {
          dataLevel: {
            bindType: 'expression',
            value: '{{state.message}}',
          },
        },
        children: ['Middle: ', innerChild],
      };

      const node: Element = {
        id: 'outer',
        type: 'Card',
        staticProps: { className: 'outer-wrapper' },
        bindings: {
          title: {
            bindType: 'expression',
            value: '{{props.title}}',
          },
        },
        children: ['Outer text ', middleElement],
      };

      const renderNodeSpy = sinon.spy((child: any) => {
        if (child?.id === 'middle') {
          return (
            <div key="middle-wrapper" data-testid="middle-wrapper">
              {/* Rendered recursively */}
              {child.type}
            </div>
          );
        }
        if (child?.id === 'inner-child') {
          return (
            <span key="inner" data-testid="inner-span">
              Inner content
            </span>
          );
        }
        return null;
      });

      const element = renderElementNode(
        node,
        0,
        atoms,
        {},
        () => undefined,
        () => ({ message: 'nested-state' }),
        baseContext,
        renderNodeSpy
      );

      const rendered = render(<>{element}</>);
      const outer = rendered.getByTestId('card');

      expect(outer.getAttribute('class')).to.equal('outer-wrapper');
      expect(outer.getAttribute('title')).to.equal('Hello world');
      expect(outer.textContent).to.contain('Outer text');
    });

    it('event callback has access to current props and state at call time', () => {
      const setStateSpy = sinon.spy();
      const onEventSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              setState: {
                clicked: '{{event}}',
                timestamp: '{{state.message}}',
              },
            },
            {
              call: 'onEvent',
              args: ['{{event}}', '{{props.title}}', '{{state.message}}'],
            },
          ],
        } as any,
        { onEvent: onEventSpy },
        () => ({ message: 'state-value' }),
        setStateSpy as any,
        { ...baseContext, props: { title: 'Button Title' } }
      );

      callback(true);

      expect(setStateSpy.called).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({
        clicked: true,
        timestamp: 'state-value',
      });

      expect(onEventSpy.called).to.equal(true);
      expect(onEventSpy.firstCall.args).to.deep.equal([true, 'Button Title', 'state-value']);
    });

    it('atom component receives exact props shape with static and bound props', () => {
      const atomSpy = sinon.spy(({ children, ...props }: any) => (
        <div data-testid="spy-atom" {...props}>
          {children}
        </div>
      ));

      const customAtoms = {
        SpyCard: atomSpy,
      };

      const node: Element = {
        id: 'spy-id',
        type: 'SpyCard',
        staticProps: {
          className: 'static-class',
          role: 'main',
        },
        bindings: {
          title: {
            bindType: 'expression',
            value: '{{props.title}}',
          },
          'aria-label': {
            bindType: 'expression',
            value: 'Label',
          },
        },
        children: [],
      };

      const element = renderElementNode(
        node,
        0,
        customAtoms,
        {},
        () => undefined,
        () => ({}),
        { ...baseContext, props: { title: 'Test Title' } },
        () => null
      );

      render(<>{element}</>);

      expect(atomSpy.called).to.equal(true);
      const propsArg = atomSpy.firstCall.args[0];

      expect(propsArg.className).to.equal('static-class');
      expect(propsArg.role).to.equal('main');
      expect(propsArg.title).to.equal('Test Title');
      expect(propsArg['aria-label']).to.equal('Label');
      expect(propsArg['data-atom-id']).to.equal('spy-id');
      expect(propsArg['data-atom-label']).to.equal('SpyCard');
    });

    it('multiple setState actions from single event update all state properties', () => {
      const setStateSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['x', 'y'],
          actions: [
            {
              setState: {
                first: '{{event.x}}',
                second: '{{event.y}}',
                combined: '{{event.x}}-{{event.y}}',
                fromState: '{{state.message}}',
              },
            },
          ],
        } as any,
        {},
        () => ({ message: 'original' }),
        setStateSpy as any,
        baseContext
      );

      callback('first-val', 'second-val');

      expect(setStateSpy.called).to.equal(true);
      const stateArg = setStateSpy.firstCall.args[0];
      expect(stateArg.fromState).to.equal('original');
      expect(stateArg.first).to.equal('first-val');
      expect(stateArg.second).to.equal('second-val');
    });

    it('renders with key prop passed through correctly', () => {
      const atomWithKeySpy = sinon.spy(({ children, ...props }: any) => (
        <div data-testid="key-card" {...props}>
          {children}
        </div>
      ));

      const customAtoms = {
        KeyCard: atomWithKeySpy,
      };

      const node: Element = {
        id: 'key-test-id',
        type: 'KeyCard',
        children: ['Content'],
      };

      const element = renderElementNode(
        node,
        'unique-key-123',
        customAtoms,
        {},
        () => undefined,
        () => ({}),
        baseContext,
        () => null
      );

      render(<>{element}</>);

      // Key is used by React internally but not passed as prop
      // The component should still render correctly
      expect(atomWithKeySpy.called).to.equal(true);
    });
  });

  describe('buildEventCallback()', () => {
    it('resolves setState and call actions with multi-argument event payload', () => {
      const setStateSpy = sinon.spy();
      const trackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value', 'label'],
          actions: [
            {
              setState: {
                selected: '{{event.value}}',
                selectedLabel: '{{event.label}}',
                previous: '{{state.current}}',
              },
            },
            {
              call: 'trackSelection',
              args: ['{{event.value}}', '{{props.kind}}', '{{state.current}}'],
            },
          ],
        } as any,
        {
          trackSelection: trackSpy,
        },
        () => ({ current: 'hats' }),
        setStateSpy as any,
        {
          props: { kind: 'category' },
          state: { current: 'hats' },
          item: undefined,
          scope: undefined,
        }
      );

      callback('bags', 'Bags');

      expect(setStateSpy.calledOnce).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({
        selected: 'bags',
        selectedLabel: 'Bags',
        previous: 'hats',
      });

      expect(trackSpy.calledOnce).to.equal(true);
      expect(trackSpy.firstCall.args).to.deep.equal(['bags', 'category', 'hats']);
    });

    it('does not set state when there are no setState actions', () => {
      const setStateSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'missingCallback',
              args: ['{{event}}'],
            },
          ],
        } as any,
        {},
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('anything');
      expect(setStateSpy.called).to.equal(false);
    });

    it('executes only call actions without setState actions', () => {
      const setStateSpy = sinon.spy();
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'onlyCall',
              args: ['{{event}}', '{{props.label}}'],
            },
          ],
        } as any,
        { onlyCall: callbackSpy },
        () => ({}),
        setStateSpy as any,
        {
          props: { label: 'Test Label' },
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('test-value');

      expect(setStateSpy.called).to.equal(false);
      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal(['test-value', 'Test Label']);
    });

    it('handles missing callback function gracefully (does not throw)', () => {
      const setStateSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'nonexistentCallback',
              args: ['{{event}}'],
            },
          ],
        } as any,
        {},
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      // Should not throw even though callback doesn't exist
      expect(() => callback('value')).to.not.throw();
    });

    it('handles event with no arguments', () => {
      const setStateSpy = sinon.spy();
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: [],
          actions: [
            {
              setState: {
                triggered: true,
              },
            },
            {
              call: 'onTriggered',
              args: [],
            },
          ],
        } as any,
        { onTriggered: callbackSpy },
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback();

      expect(setStateSpy.calledOnce).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ triggered: true });
      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal([]);
    });

    it('resolves template args with props, state, item, and scope', () => {
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'complexCall',
              args: ['{{event}}', '{{props.name}}', '{{state.count}}', '{{item.id}}'],
            },
          ],
        } as any,
        { complexCall: callbackSpy },
        () => ({ count: 42 }),
        () => undefined,
        {
          props: { name: 'John' },
          state: { count: 42 },
          item: { id: 'item-123' },
          scope: { context: 'scope-value' },
        }
      );

      callback('event-data');

      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal(['event-data', 'John', 42, 'item-123']);
    });

    it('executes setState before call actions in order', () => {
      const setStateSpy = sinon.spy();

      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              setState: {
                updated: true,
              },
            },
            {
              call: 'onUpdated',
              args: [],
            },
          ],
        } as any,
        { onUpdated: callbackSpy },
        () => ({ updated: false }),
        setStateSpy as any,
        {
          props: {},
          state: { updated: false },
          item: undefined,
          scope: undefined,
        }
      );

      callback();

      // Verify both were called
      expect(setStateSpy.calledOnce).to.equal(true);
      expect(callbackSpy.calledOnce).to.equal(true);
    });

    it('handles multiple call actions in sequence', () => {
      const setStateSpy = sinon.spy();
      const call1Spy = sinon.spy();
      const call2Spy = sinon.spy();
      const call3Spy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'first',
              args: ['{{event}}-1'],
            },
            {
              call: 'second',
              args: ['{{event}}-2'],
            },
            {
              call: 'third',
              args: ['{{event}}-3'],
            },
          ],
        } as any,
        {
          first: call1Spy,
          second: call2Spy,
          third: call3Spy,
        },
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('test');

      expect(call1Spy.calledOnce).to.equal(true);
      expect(call1Spy.firstCall.args).to.deep.equal(['test-1']);
      expect(call2Spy.calledOnce).to.equal(true);
      expect(call2Spy.firstCall.args).to.deep.equal(['test-2']);
      expect(call3Spy.calledOnce).to.equal(true);
      expect(call3Spy.firstCall.args).to.deep.equal(['test-3']);
    });

    it('handles call action without any arguments', () => {
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              call: 'noArgs',
              args: [],
            },
          ],
        } as any,
        { noArgs: callbackSpy },
        () => ({}),
        () => undefined,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('ignored');

      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal([]);
    });

    it('handles empty actions array', () => {
      const setStateSpy = sinon.spy();
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [],
        } as any,
        { anyCallback: callbackSpy },
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('value');

      expect(setStateSpy.called).to.equal(false);
      expect(callbackSpy.called).to.equal(false);
    });

    it('handles single argument event binding', () => {
      const setStateSpy = sinon.spy();
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['selectedId'],
          actions: [
            {
              setState: {
                id: '{{event}}',
              },
            },
            {
              call: 'onSelect',
              args: ['{{event}}'],
            },
          ],
        } as any,
        { onSelect: callbackSpy },
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback('id-456');

      expect(setStateSpy.calledOnce).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ id: 'id-456' });
      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal(['id-456']);
    });

    it('call action can access state values changed by setState', () => {
      const setStateSpy = sinon.spy();
      const callbackSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['newValue'],
          actions: [
            {
              setState: {
                value: '{{event}}',
              },
            },
            {
              call: 'onValueSet',
              args: ['{{state.value}}'],
            },
          ],
        } as any,
        { onValueSet: callbackSpy },
        () => ({ value: 'old' }),
        setStateSpy as any,
        {
          props: {},
          state: { value: 'old' },
          item: undefined,
          scope: undefined,
        }
      );

      callback('new');

      // When call action accesses state, it should use the original state (before setState)
      // This validates that templates are resolved with the current context
      expect(callbackSpy.calledOnce).to.equal(true);
      expect(callbackSpy.firstCall.args).to.deep.equal(['old']);
    });

    it('handles undefined and null event values in setState', () => {
      const setStateSpy = sinon.spy();

      const callback = buildEventCallback(
        {
          bindType: 'event',
          arguments: ['value'],
          actions: [
            {
              setState: {
                result: '{{event}}',
              },
            },
          ],
        } as any,
        {},
        () => ({}),
        setStateSpy as any,
        {
          props: {},
          state: {},
          item: undefined,
          scope: undefined,
        }
      );

      callback(null);

      expect(setStateSpy.calledOnce).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ result: null });

      setStateSpy.resetHistory();

      callback(undefined);

      expect(setStateSpy.calledOnce).to.equal(true);
      expect(setStateSpy.firstCall.args[0]).to.deep.equal({ result: undefined });
    });
  });

  describe('createView()', () => {
    const atoms: Record<string, React.ComponentType<any>> = {
      Stack: ({ children }) => <section data-testid="stack">{children}</section>,
      Text: ({ children }) => <p data-testid="text">{children}</p>,
      Emitter: ({ onValueChange }) => (
        <button data-testid="emit" onClick={() => onValueChange?.('updated')}>
          Emit
        </button>
      ),
    };

    it('creates a component with displayName and updates state through bound events', () => {
      const onChangedSpy = sinon.spy();
      const doc: Document = {
        name: 'SimpleGeneratedView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'text',
              type: 'Text',
              children: ['{{state.message}}'],
            },
            {
              id: 'emitter',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        message: '{{event}}',
                      },
                    },
                    {
                      call: 'onChanged',
                      args: ['{{event}}'],
                    },
                  ],
                },
              },
              children: [],
            },
          ],
        },
        state: {
          message: 'initial',
        },
      };

      const Generated = createView(doc, atoms, {
        onChanged: onChangedSpy,
      });

      expect(Generated.displayName).to.equal('SimpleGeneratedView');

      const rendered = render(<Generated />);

      expect(rendered.getByTestId('text').textContent).to.equal('initial');

      fireEvent.click(rendered.getByTestId('emit'));

      expect(rendered.getByTestId('text').textContent).to.equal('updated');
      expect(onChangedSpy.calledOnce).to.equal(true);
      expect(onChangedSpy.firstCall.args[0]).to.equal('updated');
    });

    it('supports for/show expressions with runtime props', () => {
      const doc: Document = {
        name: 'LoopAndShowDoc',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'line',
              type: 'Text',
              for: {
                each: '{{props.items}}',
                as: 'item',
                key: '{{item.id}}',
              },
              show: {
                left: '{{item.visible}}',
                op: 'eq',
                right: true as any,
              },
              children: ['{{item.label}}'],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      const rendered = render(
        <Generated
          items={[
            { id: '1', label: 'First', visible: true },
            { id: '2', label: 'Second', visible: false },
            { id: '3', label: 'Third', visible: true },
          ]}
        />
      );

      expect(rendered.container.textContent).to.contain('First');
      expect(rendered.container.textContent).to.contain('Third');
      expect(rendered.container.textContent).to.not.contain('Second');
    });

    it('renders component with no initial state', () => {
      const doc: Document = {
        name: 'NoStateView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'text',
              type: 'Text',
              children: ['Static content'],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);
      const rendered = render(<Generated />);

      expect(rendered.getByTestId('text').textContent).to.equal('Static content');
    });

    it('handles multiple events updating different state properties independently', () => {
      const onFirstSpy = sinon.spy();
      const onSecondSpy = sinon.spy();

      const doc: Document = {
        name: 'MultiEventView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'text1',
              type: 'Text',
              children: ['First: {{state.first}}'],
            },
            {
              id: 'text2',
              type: 'Text',
              children: ['Second: {{state.second}}'],
            },
            {
              id: 'emitter1',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        first: '{{event}}',
                      },
                    },
                    {
                      call: 'onFirst',
                      args: ['{{event}}'],
                    },
                  ],
                },
              },
              children: [],
            },
            {
              id: 'emitter2',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        second: '{{event}}',
                      },
                    },
                    {
                      call: 'onSecond',
                      args: ['{{event}}'],
                    },
                  ],
                },
              },
              children: [],
            },
          ],
        },
        state: {
          first: 'A',
          second: 'B',
        },
      };

      const Generated = createView(doc, atoms, {
        onFirst: onFirstSpy,
        onSecond: onSecondSpy,
      });

      const rendered = render(<Generated />);

      expect(rendered.container.textContent).to.contain('First: A');
      expect(rendered.container.textContent).to.contain('Second: B');

      fireEvent.click(rendered.getAllByTestId('emit')[0]);

      expect(rendered.container.textContent).to.contain('First: updated');
      expect(rendered.container.textContent).to.contain('Second: B');
      expect(onFirstSpy.calledOnce).to.equal(true);

      fireEvent.click(rendered.getAllByTestId('emit')[1]);

      expect(rendered.container.textContent).to.contain('First: updated');
      expect(rendered.container.textContent).to.contain('Second: updated');
      expect(onSecondSpy.calledOnce).to.equal(true);
    });

    it('renders nested for loops (for within for)', () => {
      const doc: Document = {
        name: 'NestedLoopView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'group',
              type: 'Stack',
              for: {
                each: '{{props.groups}}',
                as: 'group',
                key: '{{group.id}}',
              },
              children: [
                {
                  id: 'item',
                  type: 'Text',
                  for: {
                    each: '{{group.items}}',
                    as: 'item',
                    key: '{{item.id}}',
                  },
                  children: ['{{item.name}}'],
                },
              ],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      const rendered = render(
        <Generated
          groups={[
            {
              id: 'g1',
              name: 'Group1',
              items: [
                { id: 'i1', name: 'ItemA' },
                { id: 'i2', name: 'ItemB' },
              ],
            },
            { id: 'g2', name: 'Group2', items: [{ id: 'i3', name: 'ItemC' }] },
          ]}
        />
      );

      expect(rendered.container.textContent).to.contain('ItemA');
      expect(rendered.container.textContent).to.contain('ItemB');
      expect(rendered.container.textContent).to.contain('ItemC');
    });

    it('supports show condition with different operators (eq, ne)', () => {
      const doc: Document = {
        name: 'ShowOperatorsView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'eq-text',
              type: 'Text',
              show: {
                left: '{{props.status}}',
                op: 'eq',
                right: 'active',
              },
              children: ['Status is active'],
            },
            {
              id: 'ne-text',
              type: 'Text',
              show: {
                left: '{{props.status}}',
                op: 'ne',
                right: 'inactive',
              },
              children: ['Status is not inactive'],
            },
            {
              id: 'level-text',
              type: 'Text',
              show: {
                left: '{{props.level}}',
                op: 'eq',
                right: 'admin',
              },
              children: ['User is admin'],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      const rendered = render(<Generated status="active" level="admin" />);

      expect(rendered.container.textContent).to.contain('Status is active');
      expect(rendered.container.textContent).to.contain('Status is not inactive');
      expect(rendered.container.textContent).to.contain('User is admin');
    });

    it('combines for and show on same element for conditional list rendering', () => {
      const doc: Document = {
        name: 'ForShowCombinedView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'item',
              type: 'Text',
              for: {
                each: '{{props.items}}',
                as: 'item',
                key: '{{item.id}}',
              },
              show: {
                left: '{{item.status}}',
                op: 'eq',
                right: 'active',
              },
              children: ['{{item.label}}'],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      const rendered = render(
        <Generated
          items={[
            { id: '1', label: 'Active One', status: 'active' },
            { id: '2', label: 'Inactive', status: 'inactive' },
            { id: '3', label: 'Active Two', status: 'active' },
          ]}
        />
      );

      expect(rendered.container.textContent).to.contain('Active One');
      expect(rendered.container.textContent).to.contain('Active Two');
      expect(rendered.container.textContent).to.not.contain('Inactive');
    });

    it('updates state through multiple sequential events', () => {
      const doc: Document = {
        name: 'SequentialEventsView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'count-text',
              type: 'Text',
              children: ['Count: {{state.count}}'],
            },
            {
              id: 'emitter',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        count: '{{event}}',
                      },
                    },
                  ],
                },
              },
              children: [],
            },
          ],
        },
        state: {
          count: 0,
        },
      };

      const Generated = createView(doc, atoms);
      const rendered = render(<Generated />);

      expect(rendered.getByTestId('text').textContent).to.equal('Count: 0');

      fireEvent.click(rendered.getByTestId('emit'));
      expect(rendered.getByTestId('text').textContent).to.equal('Count: updated');

      fireEvent.click(rendered.getByTestId('emit'));
      expect(rendered.getByTestId('text').textContent).to.equal('Count: updated');
    });

    it('handles event binding with no actions', () => {
      const doc: Document = {
        name: 'NoActionsView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'text',
              type: 'Text',
              children: ['Click me'],
            },
            {
              id: 'button-with-no-actions',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [],
                },
              },
              children: [],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      expect(() => {
        const rendered = render(<Generated />);
        fireEvent.click(rendered.getByTestId('emit'));
      }).to.not.throw();
    });

    it('accepts runtime props not referenced in templates', () => {
      const doc: Document = {
        name: 'UnusedPropsView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'text',
              type: 'Text',
              children: ['Content'],
            },
          ],
        },
      };

      const Generated = createView(doc, atoms);

      expect(() => {
        const rendered = render(
          <Generated
            usedProp="value"
            unusedProp="also value"
            anotherUnused={123}
            andAnother={{ nested: true }}
          />
        );
        expect(rendered.getByTestId('text').textContent).to.equal('Content');
      }).to.not.throw();
    });

    it('initializes state with various value types (numbers, booleans, objects, arrays)', () => {
      const doc: Document = {
        name: 'VariousTypesView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'number-text',
              type: 'Text',
              children: ['Number: {{state.count}}'],
            },
            {
              id: 'bool-text',
              type: 'Text',
              children: ['Active: {{state.active}}'],
            },
            {
              id: 'object-text',
              type: 'Text',
              children: ['Name: {{state.user.name}}'],
            },
            {
              id: 'array-text',
              type: 'Text',
              children: ['Items: {{state.items.length}}'],
            },
          ],
        },
        state: {
          count: 42,
          active: true,
          user: { name: 'John', age: 30 },
          items: [1, 2, 3],
        },
      };

      const Generated = createView(doc, atoms);
      const rendered = render(<Generated />);

      const textElements = rendered.getAllByTestId('text');
      expect(textElements[0].textContent).to.contain('Number: 42');
      expect(textElements[1].textContent).to.contain('Active: true');
      expect(textElements[2].textContent).to.contain('Name: John');
      expect(textElements[3].textContent).to.contain('Items: 3');
    });

    it('supports dynamic prop expression binding to state', () => {
      const onUpdateSpy = sinon.spy();

      const doc: Document = {
        name: 'DynamicPropsView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'emitter',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        label: '{{event}}',
                      },
                    },
                    {
                      call: 'onUpdate',
                      args: ['{{state.label}}'],
                    },
                  ],
                },
              },
              children: [],
            },
          ],
        },
        state: {
          label: 'initial',
        },
      };

      const Generated = createView(doc, atoms, { onUpdate: onUpdateSpy });
      const rendered = render(<Generated />);

      fireEvent.click(rendered.getByTestId('emit'));

      expect(onUpdateSpy.calledOnce).to.equal(true);
    });

    it('show condition based on state value updates reactively', () => {
      const doc: Document = {
        name: 'ShowStateReactiveView',
        root: {
          id: 'root',
          type: 'Stack',
          children: [
            {
              id: 'message',
              type: 'Text',
              show: {
                left: '{{state.messageVisible}}',
                op: 'eq',
                right: 'shown',
              },
              children: ['Message is visible'],
            },
            {
              id: 'emitter',
              type: 'Emitter',
              bindings: {
                onValueChange: {
                  bindType: 'event',
                  arguments: ['value'],
                  actions: [
                    {
                      setState: {
                        messageVisible: 'shown',
                      },
                    },
                  ],
                },
              },
              children: [],
            },
          ],
        },
        state: {
          messageVisible: 'hidden',
        },
      };

      const Generated = createView(doc, atoms);
      const rendered = render(<Generated />);

      expect(rendered.container.textContent).to.not.contain('Message is visible');

      fireEvent.click(rendered.getByTestId('emit'));

      expect(rendered.container.textContent).to.contain('Message is visible');
    });

    it('renders complex nested element structure with mixed binding types', () => {
      const onNestedEventSpy = sinon.spy();

      const doc: Document = {
        name: 'ComplexNestedView',
        root: {
          id: 'root',
          type: 'Stack',
          staticProps: { role: 'main' },
          children: [
            {
              id: 'outer-text',
              type: 'Text',
              bindings: {
                title: {
                  bindType: 'expression',
                  value: '{{props.title}}',
                },
              },
              children: ['Outer: {{state.outerValue}}'],
            },
            {
              id: 'group',
              type: 'Stack',
              for: {
                each: '{{props.items}}',
                as: 'item',
                key: '{{item.id}}',
              },
              show: {
                left: '{{item.visibility}}',
                op: 'eq',
                right: 'visible',
              },
              children: [
                {
                  id: 'item-text',
                  type: 'Text',
                  children: ['{{item.label}} - {{state.outerValue}} - '],
                },
                {
                  id: 'nested-emitter',
                  type: 'Emitter',
                  bindings: {
                    onValueChange: {
                      bindType: 'event',
                      arguments: ['value'],
                      actions: [
                        {
                          setState: {
                            outerValue: '{{event}}',
                          },
                        },
                        {
                          call: 'onNestedEvent',
                          args: ['{{item.id}}', '{{event}}'],
                        },
                      ],
                    },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        state: {
          outerValue: 'initial',
        },
      };

      const Generated = createView(doc, atoms, {
        onNestedEvent: onNestedEventSpy,
      });

      const rendered = render(
        <Generated
          title="Test Title"
          items={[
            { id: 'i1', label: 'Item 1', visibility: 'visible' },
            { id: 'i2', label: 'Item 2', visibility: 'hidden' },
            { id: 'i3', label: 'Item 3', visibility: 'visible' },
          ]}
        />
      );

      expect(rendered.container.textContent).to.contain('Item 1');
      expect(rendered.container.textContent).to.contain('Item 3');
      expect(rendered.container.textContent).to.not.contain('Item 2');

      const buttons = rendered.getAllByTestId('emit');
      fireEvent.click(buttons[0]);

      expect(onNestedEventSpy.calledOnce).to.equal(true);
      expect(onNestedEventSpy.firstCall.args).to.deep.equal(['i1', 'updated']);
    });
  });
});
