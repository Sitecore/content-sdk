/**
 * Expression and binding resolution for Component Layout documents.
 * Parses bind expressions (props/item/state/event), resolves {{ }} template strings,
 * and evaluates show conditions.
 * @packageDocumentation
 */

import type { ShowNode } from './document';
import {
  isShowComparison,
  isShowAnd,
  isShowOr,
} from './document';

/* Expression parser */

/**
 * Source name for bind expressions. Built-in: "props", "item", "state", "event".
 * Any other identifier is resolved from context.scope (e.g. for.as loop variable name).
 */
export type BindSource = 'props' | 'item' | 'state' | 'event' | (string & Record<never, never>);

/** Segment in a parsed path: dot key or bracket sub-expression. */
export type BindSegment =
  | { type: 'dot'; key: string }
  | { type: 'bracket'; expr: ParsedBind };

/** Parsed bind expression: source plus path segments. */
export interface ParsedBind {
  source: BindSource;
  segments: BindSegment[];
}

/**
 * Parses an expression string into a structured representation.
 * Accepts optional leading "$" and dot/bracket path segments.
 * Source may be any identifier: built-ins (props, item, state, event) or a scope key (e.g. for.as).
 *
 * @param expr - Expression string (e.g. "props.user.name", "state.count", "item.id", "product.name")
 * @returns Parsed expression
 * @throws Error on invalid syntax or empty source
 */
export function parseBindExpression(expr: string): ParsedBind {
  let pos = 0;

  function parse(): ParsedBind {
    if (expr[pos] === '$') {
      pos++;
    }

    const sourceStart = pos;
    while (pos < expr.length && /[a-zA-Z0-9_]/.test(expr[pos])) {
      pos++;
    }
    const source = expr.slice(sourceStart, pos);
    if (source.length === 0) {
      throw new Error(`Expected identifier in "${expr}" at pos ${pos}`);
    }
    if (!/^[a-zA-Z_]/.test(source)) {
      throw new Error(`Invalid source "${source}" in "${expr}". Identifier must start with a letter or underscore.`);
    }

    const segments: BindSegment[] = [];

    while (pos < expr.length) {
      if (expr[pos] === '.') {
        pos++;
        const keyStart = pos;
        while (pos < expr.length && /[a-zA-Z0-9_]/.test(expr[pos])) {
          pos++;
        }
        const key = expr.slice(keyStart, pos);
        if (!key) {
          throw new Error(`Expected identifier after "." in "${expr}" at pos ${pos}`);
        }
        segments.push({ type: 'dot', key });
      } else if (expr[pos] === '[') {
        pos++;
        const inner = parse();
        if (expr[pos] !== ']') {
          throw new Error(`Expected "]" in "${expr}" at pos ${pos}`);
        }
        pos++;
        segments.push({ type: 'bracket', expr: inner });
      } else {
        break;
      }
    }

    return { source, segments };
  }

  const result = parse();

  if (pos !== expr.length) {
    throw new Error(`Unexpected character "${expr[pos]}" in "${expr}" at pos ${pos}`);
  }

  return result;
}

/* Resolve context and expression resolver */

/**
 * Runtime context for resolving expressions.
 * - props, state, event: built-in sources.
 * - item: loop variable (backward compat); also resolvable as scope.item when scope is set.
 * - scope: optional map for named loop variables (e.g. scope[for.as] = currentItem).
 */
export interface ResolveContext {
  props: Record<string, unknown>;
  state: Record<string, unknown>;
  /** Loop variable. When inside a for-loop, set to current element; also use scope.item when scope is used. */
  item?: unknown;
  event?: unknown;
  /** Optional scope for named sources (e.g. for.as). Resolved after built-in props/state/event/item. */
  scope?: Record<string, unknown>;
}

/**
 * Resolves a parsed bind expression against the given context.
 * Lookup order: props, state, event, then item (ctx.item ?? scope.item), then scope[source].
 *
 * @param parsed - Parsed expression from parseBindExpression
 * @param ctx - Runtime context (props, state, event, item, scope)
 * @returns Resolved value or undefined if any segment is null/undefined
 */
export function resolveBindExpression(parsed: ParsedBind, ctx: ResolveContext): unknown {
  const { source } = parsed;
  let current: unknown;
  if (source === 'props') {
    current = ctx.props;
  } else if (source === 'state') {
    current = ctx.state;
  } else if (source === 'event') {
    current = ctx.event;
  } else if (source === 'item') {
    current = ctx.item ?? ctx.scope?.item;
  } else {
    current = ctx.scope?.[source];
  }

  for (const seg of parsed.segments) {
    if (current == null) {
      return undefined;
    }
    if (seg.type === 'dot') {
      current = (current as Record<string, unknown>)[seg.key];
    } else {
      const key = resolveBindExpression(seg.expr, ctx);
      if (key == null) {
        return undefined;
      }
      current = (current as Record<string, unknown>)[key as string];
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
 */
export function isTemplateString(s: string): boolean {
  return TEMPLATE_PATTERN.test(s);
}

/**
 * Resolves a template string containing {{expr}} placeholders.
 * - If the entire string is a single {{expr}}, returns the raw resolved value (preserving type).
 * - If mixed with literal text, interpolates and returns a string.
 * - If no {{}} patterns, returns the string as-is.
 *
 * @param template - String that may contain {{...}} placeholders
 * @param ctx - Runtime context for resolving expressions
 * @returns Resolved value (any type for single {{}}, string otherwise)
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
    return resolved != null ? String(resolved) : '';
  });
}

/* Show condition evaluation */

/**
 * Evaluates a ShowNode tree against the runtime context.
 * Left/right in comparisons may be template strings and are resolved before comparing.
 *
 * @param node - Show condition node (comparison or and/or tree)
 * @param ctx - Runtime context
 * @returns true if the condition passes (element should be visible)
 */
export function evaluateShowNode(node: ShowNode, ctx: ResolveContext): boolean {
  if (isShowAnd(node)) {
    return node.and.every((child) => evaluateShowNode(child, ctx));
  }
  if (isShowOr(node)) {
    return node.or.some((child) => evaluateShowNode(child, ctx));
  }
  if (isShowComparison(node)) {
    const left = isTemplateString(node.left)
      ? resolveTemplateString(node.left, ctx)
      : node.left;
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
