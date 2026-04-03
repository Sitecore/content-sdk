/**
 * Expression and binding resolution for Component Layout documents.
 * Parses bind expressions (props/item/state/event), resolves {{ }} template strings,
 * and evaluates show conditions.
 */

import type { ShowNode } from './document';
import { isShowComparison, isShowAnd, isShowOr } from './document';

/* Expression parser */

/**
 * Source name for bind expressions. Built-in: "props", "item", "state", "event".
 * Any other identifier is resolved from context.scope (e.g. for.as loop variable name).
 * @internal
 */
export type BindSource = 'props' | 'item' | 'state' | 'event' | (string & Record<never, never>);

/**
 * Segment in a parsed path: dot key or bracket sub-expression.
 * @internal
 */
export type BindSegment = { type: 'dot'; key: string } | { type: 'bracket'; expr: ParsedBind };

/**
 * Parsed bind expression: source plus path segments.
 * @internal
 */
export interface ParsedBind {
  source: BindSource;
  segments: BindSegment[];
}

/**
 * Parses an expression string into a structured representation.
 * Accepts optional leading "$" and dot/bracket path segments.
 * Source may be any identifier: built-ins (props, item, state, event) or a scope key (e.g. for.as).
 * @param {string} expr - Expression string (e.g. "props.user.name", "state.count", "item.id", "product.name")
 * @returns {ParsedBind} Parsed expression
 * @throws {Error} on invalid syntax or empty source
 * @internal
 */
export function parseBindExpression(expr: string): ParsedBind {
  let pos = 0;

  const skipOptionalDollar = (): void => {
    if (expr[pos] === '$') {
      pos++;
    }
  };

  const parseIdentifier = (): string => {
    const start = pos;
    while (pos < expr.length && /[a-zA-Z0-9_]/.test(expr[pos])) {
      pos++;
    }
    const identifier = expr.slice(start, pos);

    if (identifier.length === 0) {
      throw new Error(`Expected identifier in "${expr}" at pos ${pos}`);
    }
    if (!/^[a-zA-Z_]/.test(identifier)) {
      throw new Error(
        `Invalid identifier "${identifier}" in "${expr}". Must start with a letter or underscore.`
      );
    }

    return identifier;
  };

  const parseSegments = (): BindSegment[] => {
    const segments: BindSegment[] = [];

    while (pos < expr.length) {
      if (expr[pos] === '.') {
        pos++;
        const key = parseIdentifier();
        segments.push({ type: 'dot', key });
      } else if (expr[pos] === '[') {
        pos++; // skip [
        const bracketStart = pos;

        // Find the matching ]
        const closeBracket = expr.indexOf(']', pos);
        if (closeBracket === -1) {
          throw new Error(`Expected "]" in "${expr}"`);
        }

        // Extract the inner expression between [ and ]
        const innerExpr = expr.slice(bracketStart, closeBracket);
        const inner = parseBindExpression(innerExpr);

        pos = closeBracket + 1; // move past ]
        segments.push({ type: 'bracket', expr: inner });
      } else {
        break;
      }
    }

    return segments;
  };

  skipOptionalDollar();
  const source = parseIdentifier();
  const segments = parseSegments();

  if (pos !== expr.length) {
    throw new Error(`Unexpected character "${expr[pos]}" in "${expr}" at pos ${pos}`);
  }

  return { source, segments };
}

/* Resolve context and expression resolver */

/**
 * Runtime context for resolving expressions.
 * - props, state, event: built-in sources.
 * - item: loop variable (backward compat); also resolvable as scope.item when scope is set.
 * - scope: optional map for named loop variables (e.g. scope[for.as] = currentItem).
 * @internal
 */
export interface ResolveContext {
  /** Runtime props. */
  props: Record<string, unknown>;
  /** Current state. */
  state: Record<string, unknown>;
  /** Loop variable. When inside a for-loop, set to current element; also use scope.item when scope is used. */
  item?: unknown;
  /** Current event. */
  event?: unknown;
  /** Optional scope for named sources (e.g. for.as). Resolved after built-in props/state/event/item. */
  scope?: Record<string, unknown>;
}

/**
 * Resolves the source identifier to its runtime value.
 * Lookup order: props, state, event, then item (ctx.item ?? scope.item), then scope[source].
 * @param {BindSource} source - Source identifier
 * @param {ResolveContext} ctx - Runtime context
 * @returns {unknown} Resolved source value or undefined
 */
function resolveSource(source: BindSource, ctx: ResolveContext): unknown {
  switch (source) {
    case 'props':
      return ctx.props;
    case 'state':
      return ctx.state;
    case 'event':
      return ctx.event;
    case 'item':
      return ctx.item ?? ctx.scope?.item;
    default:
      return ctx.scope?.[source];
  }
}

/**
 * Safely accesses a property on an object-like value.
 * Returns undefined if current is null/undefined or not an object.
 * @param {unknown} current - Current value
 * @param {string | number} key - Property key
 * @returns {unknown} Property value or undefined
 */
function safePropertyAccess(current: unknown, key: string | number): unknown {
  if (current == null) {
    return undefined;
  }

  // Check if current is an object (including arrays)
  if (typeof current !== 'object') {
    return undefined;
  }

  return (current as Record<string, unknown>)[key];
}

/**
 * Resolves a parsed bind expression against the given context.
 * Lookup order: props, state, event, then item (ctx.item ?? scope.item), then scope[source].
 * @param {ParsedBind} parsed - Parsed expression from parseBindExpression
 * @param {ResolveContext} ctx - Runtime context (props, state, event, item, scope)
 * @returns {unknown} Resolved value or undefined if any segment is null/undefined
 * @internal
 */
export function resolveBindExpression(parsed: ParsedBind, ctx: ResolveContext): unknown {
  let current = resolveSource(parsed.source, ctx);

  for (const segment of parsed.segments) {
    if (current == null) {
      return undefined;
    }

    if (segment.type === 'dot') {
      current = safePropertyAccess(current, segment.key);
    } else {
      // Bracket accessor - resolve the expression to get the key
      const key = resolveBindExpression(segment.expr, ctx);
      if (key == null) {
        return undefined;
      }
      current = safePropertyAccess(current, key as string | number);
    }
  }

  return current;
}

/* Template string resolution ({{...}} syntax) */

// Match single {{expr}} so inner content cannot contain "}}"
const SINGLE_TEMPLATE_RE = /^\{\{((?:(?!\}\}).)*)\}\}$/;
const TEMPLATE_PATTERN = /\{\{((?:(?!\}\}).)*)\}\}/;
const TEMPLATE_GLOBAL = /\{\{((?:(?!\}\}).)*)\}\}/g;

/**
 * Returns true if the string contains {{...}} template expressions.
 * @param {string} s - String to check
 * @returns {boolean} True if the string contains {{...}} templates, false otherwise
 * @internal
 */
export function isTemplateString(s: string): boolean {
  return TEMPLATE_PATTERN.test(s);
}

/**
 * Resolves a template string containing {{expr}} placeholders.
 * - If the entire string is a single {{expr}}, returns the raw resolved value (preserving type).
 * - If mixed with literal text, interpolates and returns a string.
 * - If no {{}} patterns, returns the string as-is.
 * @param {string} template - String that may contain {{...}} placeholders
 * @param {ResolveContext} ctx - Runtime context for resolving expressions
 * @returns {unknown} Resolved value (any type for single {{}}, string otherwise)
 * @internal
 */
export function resolveTemplateString(template: string, ctx: ResolveContext): unknown {
  const singleMatch = template.match(SINGLE_TEMPLATE_RE);
  if (singleMatch) {
    const parsed = parseBindExpression(singleMatch[1].trim());
    return resolveBindExpression(parsed, ctx);
  }

  if (!TEMPLATE_PATTERN.test(template)) {
    return template;
  }

  return template.replace(TEMPLATE_GLOBAL, (_, expr) => {
    const parsed = parseBindExpression(expr.trim());
    const resolved = resolveBindExpression(parsed, ctx);
    return resolved !== null && resolved !== undefined ? String(resolved) : '';
  });
}

/* Show condition evaluation */

/**
 * Evaluates a ShowNode tree against the runtime context.
 * Left/right in comparisons may be template strings and are resolved before comparing.
 * @param {ShowNode} node - Show condition node (comparison or and/or tree)
 * @param {ResolveContext} ctx - Runtime context
 * @returns {boolean} True if the condition passes (element should be visible)
 * @internal
 */
export function evaluateShowNode(node: ShowNode, ctx: ResolveContext): boolean {
  if (isShowAnd(node)) {
    return node.and.every((child) => evaluateShowNode(child, ctx));
  }
  if (isShowOr(node)) {
    return node.or.some((child) => evaluateShowNode(child, ctx));
  }
  if (isShowComparison(node)) {
    const left = isTemplateString(node.left) ? resolveTemplateString(node.left, ctx) : node.left;
    const right = isTemplateString(node.right)
      ? resolveTemplateString(node.right, ctx)
      : node.right;
    switch (node.op) {
      case 'eq':
        return left === right;
      case 'ne':
        return left !== right;
      default:
        return true;
    }
  }
  return true;
}

/**
 * Resolves a template string value against the provided context.
 * Returns the original value when it is not a template string.
 * @param {unknown} value - Value that may be a template string
 * @param {ResolveContext} ctx - Resolve context
 * @returns {unknown} Resolved value or original value
 * @internal
 */
export const resolveIfTemplate = (value: unknown, ctx: ResolveContext): unknown => {
  if (typeof value === 'string' && isTemplateString(value)) {
    return resolveTemplateString(value, ctx);
  }

  return value;
};
