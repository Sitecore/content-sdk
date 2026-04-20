/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  parseBindExpression,
  resolveBindExpression,
  isTemplateString,
  resolveTemplateString,
  evaluateShowNode,
  resolveIfTemplate,
  type ResolveContext,
} from './resolver';

const ctx: ResolveContext = {
  props: { user: { name: 'Alice' }, count: 0 },
  item: { id: 'item-1', label: 'First' },
  state: { visible: true, category: 'cat' },
  event: { value: 'clicked' },
};

describe('component-layout resolver', () => {
  describe('parseBindExpression', () => {
    it('should parse simple source-only expressions', () => {
      expect(parseBindExpression('props')).to.deep.equal({ source: 'props', segments: [] });
      expect(parseBindExpression('item')).to.deep.equal({ source: 'item', segments: [] });
      expect(parseBindExpression('state')).to.deep.equal({ source: 'state', segments: [] });
      expect(parseBindExpression('event')).to.deep.equal({ source: 'event', segments: [] });
    });

    it('should accept optional leading $', () => {
      expect(parseBindExpression('$props')).to.deep.equal({ source: 'props', segments: [] });
      expect(parseBindExpression('$state.count')).to.deep.equal({
        source: 'state',
        segments: [{ type: 'dot', key: 'count' }],
      });
    });

    it('should parse dot path segments', () => {
      expect(parseBindExpression('props.user')).to.deep.equal({
        source: 'props',
        segments: [{ type: 'dot', key: 'user' }],
      });
      expect(parseBindExpression('props.user.name')).to.deep.equal({
        source: 'props',
        segments: [
          { type: 'dot', key: 'user' },
          { type: 'dot', key: 'name' },
        ],
      });
      expect(parseBindExpression('item.id')).to.deep.equal({
        source: 'item',
        segments: [{ type: 'dot', key: 'id' }],
      });
    });

    it('should parse bracket segment with nested expression', () => {
      const parsed = parseBindExpression('props.user[state.category]');
      expect(parsed.source).to.equal('props');
      expect(parsed.segments).to.have.lengthOf(2);
      expect(parsed.segments[0]).to.deep.equal({ type: 'dot', key: 'user' });
      expect(parsed.segments[1]).to.have.property('type', 'bracket');
      expect(
        (parsed.segments[1] as { expr: { source: string; segments: unknown[] } }).expr
      ).to.deep.equal({ source: 'state', segments: [{ type: 'dot', key: 'category' }] });
    });

    it('should parse scope-key sources (e.g. for.as)', () => {
      expect(parseBindExpression('product.name')).to.deep.equal({
        source: 'product',
        segments: [{ type: 'dot', key: 'name' }],
      });
      expect(parseBindExpression('row.id')).to.deep.equal({
        source: 'row',
        segments: [{ type: 'dot', key: 'id' }],
      });
    });

    it('should throw on empty source', () => {
      expect(() => parseBindExpression('$')).to.throw(/Expected identifier/);
    });

    it('should throw on invalid syntax', () => {
      expect(() => parseBindExpression('props.')).to.throw(/Expected identifier/);
      expect(() => parseBindExpression('props.user.')).to.throw(/Expected identifier/);
      expect(() => parseBindExpression('props[state.x')).to.throw(/Expected "\]"/);
      expect(() => parseBindExpression('props user')).to.throw(/Unexpected character/);
    });
  });

  describe('resolveBindExpression', () => {
    it('should resolve source-only', () => {
      expect(resolveBindExpression(parseBindExpression('props'), ctx)).to.deep.equal(ctx.props);
      expect(resolveBindExpression(parseBindExpression('item'), ctx)).to.equal(ctx.item);
      expect(resolveBindExpression(parseBindExpression('state'), ctx)).to.deep.equal(ctx.state);
      expect(resolveBindExpression(parseBindExpression('event'), ctx)).to.deep.equal(ctx.event);
    });

    it('should resolve dot paths', () => {
      expect(resolveBindExpression(parseBindExpression('props.user.name'), ctx)).to.equal('Alice');
      expect(resolveBindExpression(parseBindExpression('item.label'), ctx)).to.equal('First');
      expect(resolveBindExpression(parseBindExpression('state.visible'), ctx)).to.equal(true);
    });

    it('should return undefined when path is null/undefined', () => {
      expect(resolveBindExpression(parseBindExpression('props.missing'), ctx)).to.equal(undefined);
      expect(resolveBindExpression(parseBindExpression('props.user.missing'), ctx)).to.equal(
        undefined
      );
    });

    it('should resolve bracket segment', () => {
      const ctxWithMap = {
        ...ctx,
        props: { ...ctx.props, cat: 'value-for-cat', other: 'other' } as Record<string, unknown>,
      };
      const parsed = parseBindExpression('props[state.category]');
      expect(resolveBindExpression(parsed, ctxWithMap)).to.equal('value-for-cat');
    });

    it('should resolve scope-key source (for.as)', () => {
      const ctxWithScope: ResolveContext = {
        props: {},
        state: {},
        scope: { product: { name: 'Widget', id: 'p1' } },
      };
      expect(resolveBindExpression(parseBindExpression('product.name'), ctxWithScope)).to.equal(
        'Widget'
      );
      expect(resolveBindExpression(parseBindExpression('product.id'), ctxWithScope)).to.equal('p1');
    });

    it('should resolve item from ctx.item when provided', () => {
      expect(resolveBindExpression(parseBindExpression('item.label'), ctx)).to.equal('First');
    });

    it('should resolve item from scope.item when ctx.item is missing', () => {
      const ctxItemInScope: ResolveContext = {
        props: {},
        state: {},
        scope: { item: { label: 'FromScope' } },
      };
      expect(resolveBindExpression(parseBindExpression('item.label'), ctxItemInScope)).to.equal(
        'FromScope'
      );
    });

    it('should return undefined for unknown scope key when scope is missing', () => {
      const ctxNoScope: ResolveContext = { props: {}, state: {} };
      expect(resolveBindExpression(parseBindExpression('product.name'), ctxNoScope)).to.equal(
        undefined
      );
    });
  });

  describe('isTemplateString', () => {
    it('should return true when string contains {{ }}', () => {
      expect(isTemplateString('{{props.user}}')).to.be.true;
      expect(isTemplateString('Hello {{state.name}}!')).to.be.true;
    });

    it('should return false when no template', () => {
      expect(isTemplateString('plain')).to.be.false;
      expect(isTemplateString('')).to.be.false;
    });
  });

  describe('resolveTemplateString', () => {
    it('should return string as-is when no {{ }}', () => {
      expect(resolveTemplateString('plain text', ctx)).to.equal('plain text');
    });

    it('should return raw resolved value when entire string is single {{ }}', () => {
      expect(resolveTemplateString('{{props.user.name}}', ctx)).to.equal('Alice');
      expect(resolveTemplateString('{{state.visible}}', ctx)).to.equal(true);
    });

    it('should interpolate mixed literal and placeholders', () => {
      expect(resolveTemplateString('Hello {{props.user.name}}!', ctx)).to.equal('Hello Alice!');
      expect(resolveTemplateString('{{item.label}} - {{item.id}}', ctx)).to.equal('First - item-1');
    });

    it('should replace undefined with empty string in mixed mode', () => {
      expect(resolveTemplateString('x{{props.missing}}y', ctx)).to.equal('xy');
    });
  });

  describe('evaluateShowNode', () => {
    it('should evaluate comparison eq/ne with literal left/right', () => {
      expect(evaluateShowNode({ left: 'a', op: 'eq', right: 'a' }, ctx)).to.be.true;
      expect(evaluateShowNode({ left: 'a', op: 'eq', right: 'b' }, ctx)).to.be.false;
      expect(evaluateShowNode({ left: 'a', op: 'ne', right: 'b' }, ctx)).to.be.true;
      expect(evaluateShowNode({ left: 'a', op: 'ne', right: 'a' }, ctx)).to.be.false;
    });

    it('should resolve template left/right before comparing', () => {
      expect(
        evaluateShowNode(
          { left: '{{state.visible}}', op: 'eq', right: 'true' },
          { ...ctx, state: { visible: true } }
        )
      ).to.be.false; // resolved left is boolean true, right is string "true"
      expect(
        evaluateShowNode(
          { left: '{{state.visible}}', op: 'eq', right: '{{state.visible}}' },
          { ...ctx, state: { visible: true } }
        )
      ).to.be.true;
    });

    it('should evaluate and (all must be true)', () => {
      expect(
        evaluateShowNode(
          {
            and: [
              { left: 'a', op: 'eq', right: 'a' },
              { left: 'b', op: 'eq', right: 'b' },
            ],
          },
          ctx
        )
      ).to.be.true;
      expect(
        evaluateShowNode(
          {
            and: [
              { left: 'a', op: 'eq', right: 'a' },
              { left: 'a', op: 'eq', right: 'b' },
            ],
          },
          ctx
        )
      ).to.be.false;
    });

    it('should evaluate or (at least one true)', () => {
      expect(
        evaluateShowNode(
          {
            or: [
              { left: 'a', op: 'eq', right: 'b' },
              { left: 'a', op: 'eq', right: 'a' },
            ],
          },
          ctx
        )
      ).to.be.true;
      expect(
        evaluateShowNode(
          {
            or: [
              { left: 'a', op: 'eq', right: 'b' },
              { left: 'x', op: 'eq', right: 'y' },
            ],
          },
          ctx
        )
      ).to.be.false;
    });
  });

  describe('resolveIfTemplate', () => {
    it('should resolve strings that look like template expressions', () => {
      expect(resolveIfTemplate('{{props.user.name}}', ctx)).to.equal('Alice');
    });

    it('should return non-string values unchanged', () => {
      expect(resolveIfTemplate(42, ctx)).to.equal(42);
      expect(resolveIfTemplate(true, ctx)).to.equal(true);
      expect(resolveIfTemplate(null, ctx)).to.equal(null);
    });

    it('should return plain strings without {{ }} unchanged', () => {
      expect(resolveIfTemplate('no-template-here', ctx)).to.equal('no-template-here');
    });

    it('should delegate mixed literal + {{ }} strings to resolveTemplateString', () => {
      expect(resolveIfTemplate('Hello {{props.user.name}}!', ctx)).to.equal('Hello Alice!');
    });
  });
});
