/**
 * Component Layout document types and type guards for the no-code component layout spec.
 * @packageDocumentation
 */

export {
  type Primitive,
  type ExpressionBinding,
  type EventBinding,
  type Binding,
  type SetStateAction,
  type CallAction,
  type Action,
  type ForLoop,
  type ShowComparison,
  type ShowAnd,
  type ShowOr,
  type ShowNode,
  type Element,
  type Node,
  type Document,
} from './document';

export {
  isElement,
  hasFor,
  hasShow,
  isExpressionBinding,
  isEventBinding,
  isSetStateAction,
  isCallAction,
  isPrimitive,
  isShowComparison,
  isShowAnd,
  isShowOr,
} from './document';

export {
  type BindSource,
  type BindSegment,
  type ParsedBind,
  type ResolveContext,
  parseBindExpression,
  resolveBindExpression,
  isTemplateString,
  resolveTemplateString,
  evaluateShowNode,
  resolveIfTemplate,
} from './resolver';
