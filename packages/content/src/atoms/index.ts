/**
 * Component Layout document types, guards, and runtime resolution helpers exposed on the
 * `@sitecore-content-sdk/content/atoms` entry point. Parser-level APIs (`parseBindExpression`,
 * etc.) remain available from `./component-layout/resolver` within this package.
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
} from './component-layout/document';

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
} from './component-layout/document';

export {
  type ResolveContext,
  resolveTemplateString,
  evaluateShowNode,
  resolveIfTemplate,
} from './component-layout/resolver';
