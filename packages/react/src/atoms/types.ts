/** Atom schema types. @public */
import type { AtomType } from '@sitecore-content-sdk/content/editing';
import type { z } from 'zod';
import type { ComponentType } from 'react';

/**
 * Metadata for callback
 * @public
 */
export type CallbackMetadata = {
  name: string;
  description: string;
  params?: CallbackParamsInput;
  callbackFn: (...args: any[]) => void;
};

/** Metadata for an atom or atom-child; type differentiates. @public */
export type AtomMetadata = {
  name: string;
  version?: number;
  type: AtomType;
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

/**
 *  Input shape for a single param entry in createCallback.
 *  @public
 */
export type CallbackParamInput = {
  /** Zod schema for the parameter type */
  type: z.ZodType;
  /** Human-readable description of the parameter */
  description: string;
};

/**
 * Record of param names to their schema and description. Keys become the param names.
 * @public
 */
export type CallbackParamsInput = Record<string, CallbackParamInput>;

/**
 * Keys from P whose Zod type includes undefined (i.e. optional).
 * @public
 */
type OptionalParamKeys<P extends CallbackParamsInput> = {
  [K in keyof P]: undefined extends z.infer<P[K]['type']> ? K : never;
}[keyof P];

/** Keys from P whose Zod type does NOT include undefined (i.e. required). @internal */
type RequiredParamKeys<P extends CallbackParamsInput> = Exclude<keyof P, OptionalParamKeys<P>>;

/**
 * Infers the impl function's argument object type from a CallbackParamsInput record.
 * Required params become required properties, optional Zod types become optional properties.
 * @public
 */
export type InferCallbackArgs<P extends CallbackParamsInput> = {
  [K in RequiredParamKeys<P>]: z.infer<P[K]['type']>;
} & {
  [K in OptionalParamKeys<P>]?: z.infer<P[K]['type']>;
};
