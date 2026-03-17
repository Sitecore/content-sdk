/** Atom schema types. @public */
import type { z } from 'zod';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';

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

/** Component props excluding children and ref. @public */
export type EditableComponentProps<C extends ComponentType<unknown>> = Omit<
  ComponentPropsWithoutRef<C>,
  'children'
>;

/** Keys of T that are callback (function) props. @public */
export type CallbackPropKeys<T> = {
  [K in keyof T & string]: NonNullable<T[K]> extends (...args: unknown[]) => unknown ? K : never;
}[keyof T & string];

/** Prop metadata (e.g. control hint for DS). @public */
export type PropMeta = { control?: string };

/** Event argument metadata (e.g. argName). @public */
export type ArgMeta = { argName: string };
