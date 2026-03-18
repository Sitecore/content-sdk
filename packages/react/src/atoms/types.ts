/** Atom schema types. @public */
import type { z } from 'zod';
import type { ComponentType } from 'react';

/** Metadata for an atom or atom-child; type differentiates. @public */
export type AtomMetadata = {
  name: string;
  version?: number;
  type: 'atom' | 'atom-child';
  description: string;
  props: z.ZodObject<z.ZodRawShape>;
  component: (props: unknown) => React.ReactNode;
  htmlEvents?: string[];
  customEvents?: Record<string, z.ZodType[]>;
  allowedChildren?: AtomChild[];
  defaultChildren?: DefaultChild[];
};

/** Allowed child: atom-child metadata, 'text', or 'atom'. @public */
export type AtomChild = AtomMetadata | 'text' | 'atom';

/** Default child: metadata or { atom, props? }. @public */
export type DefaultChild = AtomMetadata | { atom: AtomMetadata; props?: Record<string, unknown> };

/**
 * Extracts props from a component type without requiring ComponentType<unknown>, so function
 * components with specific props (e.g. (props: { x: string }) => JSX.Element) are accepted.
 */
type PropsOfComponent<C> = C extends (props: infer P) => unknown
  ? P
  : C extends ComponentType<any>
  ? C extends ComponentType<infer P>
    ? P
    : never
  : never;

/** Component props excluding children and ref. @public */
export type EditableComponentProps<C> = Omit<PropsOfComponent<C>, 'children' | 'ref'>;

/** Keys of T that are callback (function) props. @public */
export type CallbackPropKeys<T> = {
  [K in keyof T & string]: NonNullable<T[K]> extends (...args: any[]) => unknown ? K : never;
}[keyof T & string];

/**
 * Tuple of Zod types matching a function's parameter list. Used to type customEvents so each
 * callback's schemas match its parameters. Keys are strict; tuple length/element strictness
 * is partial (optional params y?: number infer as undefined and need z.number().optional()).
 * @public
 */
export type CallbackArgZodTuple<F> = F extends (...args: infer A) => unknown
  ? { [I in keyof A]: z.ZodType<A[I]> }
  : never;

/** Prop metadata (e.g. control hint for DS). @public */
export type PropMeta = { control?: string };

/** Event argument metadata (e.g. argName). @public */
export type ArgMeta = { argName: string };
