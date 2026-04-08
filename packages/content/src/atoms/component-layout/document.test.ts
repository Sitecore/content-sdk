import { expect } from 'chai';
import type {
  Action,
  Binding,
  Element,
  Node,
  ShowNode,
} from './document';
import {
  hasFor,
  hasShow,
  isCallAction,
  isElement,
  isEventBinding,
  isExpressionBinding,
  isPrimitive,
  isSetStateAction,
  isShowAnd,
  isShowComparison,
  isShowOr,
} from './document';

describe('component-layout document guards', () => {
  describe('isElement', () => {
    it('returns true for object nodes with a type field', () => {
      const el: Node = { type: 'Card', id: '1' };
      expect(isElement(el)).to.equal(true);
    });

    it('returns false for primitives', () => {
      expect(isElement('text')).to.equal(false);
      expect(isElement(null)).to.equal(false);
      expect(isElement(42)).to.equal(false);
    });
  });

  describe('hasFor', () => {
    it('returns true when for.each is a string', () => {
      const el: Element = {
        type: 'Row',
        for: { each: '{{props.items}}', as: 'item' },
      };
      expect(hasFor(el)).to.equal(true);
    });

    it('returns false when for is missing or invalid', () => {
      expect(hasFor({ type: 'Row' })).to.equal(false);
      expect(hasFor({ type: 'Row', for: {} as never })).to.equal(false);
    });
  });

  describe('hasShow', () => {
    it('returns true when show is set', () => {
      const show: ShowNode = { left: 'a', op: 'eq', right: 'b' };
      const el: Element = { type: 'Row', show };
      expect(hasShow(el)).to.equal(true);
    });

    it('returns false when show is null or undefined', () => {
      expect(hasShow({ type: 'Row' })).to.equal(false);
    });
  });

  describe('binding guards', () => {
    it('isExpressionBinding / isEventBinding', () => {
      const expr: Binding = { bindType: 'expression', value: '{{props.x}}' };
      const evt: Binding = {
        bindType: 'event',
        arguments: [],
        actions: [],
      };
      expect(isExpressionBinding(expr)).to.equal(true);
      expect(isEventBinding(expr)).to.equal(false);
      expect(isExpressionBinding(evt)).to.equal(false);
      expect(isEventBinding(evt)).to.equal(true);
    });
  });

  describe('action guards', () => {
    it('isSetStateAction / isCallAction', () => {
      const set: Action = { setState: { x: '1' } };
      const call: Action = { call: 'cb', args: [] };
      expect(isSetStateAction(set)).to.equal(true);
      expect(isCallAction(set)).to.equal(false);
      expect(isSetStateAction(call)).to.equal(false);
      expect(isCallAction(call)).to.equal(true);
    });
  });

  describe('isPrimitive', () => {
    it('accepts null, string, number, boolean only', () => {
      expect(isPrimitive(null)).to.equal(true);
      expect(isPrimitive('a')).to.equal(true);
      expect(isPrimitive(0)).to.equal(true);
      expect(isPrimitive(false)).to.equal(true);
      expect(isPrimitive({})).to.equal(false);
      expect(isPrimitive(undefined)).to.equal(false);
    });
  });

  describe('show node guards', () => {
    it('isShowComparison', () => {
      const n: ShowNode = { left: 'x', op: 'eq', right: 'y' };
      expect(isShowComparison(n)).to.equal(true);
      expect(isShowAnd(n)).to.equal(false);
      expect(isShowOr(n)).to.equal(false);
    });

    it('isShowAnd / isShowOr', () => {
      const and: ShowNode = { and: [{ left: 'a', op: 'eq', right: 'a' }] };
      const or: ShowNode = { or: [{ left: 'a', op: 'eq', right: 'b' }] };
      expect(isShowAnd(and)).to.equal(true);
      expect(isShowOr(or)).to.equal(true);
    });
  });
});
