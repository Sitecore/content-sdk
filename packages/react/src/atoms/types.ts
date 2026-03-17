/**
 * Atom schema types for Design Studio (DS) atom definition.
 * Used to describe component props, events, and child-composition rules
 * so DS can offer WYSIWYG editing without component implementation details.
 * @public
 */
import type { z } from 'zod';
import type { ComponentPropsWithoutRef, ComponentType } from 'react';

/**
 * Metadata for a single atom (top-level or child).
 * Same shape for both; the `type` field differentiates.
 * @public
 */
export type AtomMetadata = {
  /** Unique identifier used as the element type in the DSL */
  name: string;
  /** Optional version for schema evolution */
  version?: number;
  /** `'atom'` for top-level atoms, `'atom-child'` for scoped children */
  type: 'atom' | 'atom-child';
  /** Human-readable summary shown in the DS component palette */
  description: string;
  /** Zod object schema describing editable properties */
  props: z.ZodObject<z.ZodRawShape>;
  /** The React component that renders this atom */
  component: (props: unknown) => React.ReactNode;
  /** DOM event handler prop names (e.g. onClick, onChange) */
  htmlEvents?: string[];
  /** Custom callback prop names to their Zod argument type arrays */
  customEvents?: Record<string, z.ZodType[]>;
  /** Which children this atom can contain */
  allowedChildren?: AtomChild[];
  /** Children to insert automatically when the atom is added */
  defaultChildren?: DefaultChild[];
};

/**
 * Allowed child: a specific atom-child metadata, plain text, or any top-level atom.
 * @public
 */
export type AtomChild = AtomMetadata | 'text' | 'atom';

/**
 * Default child: reference by metadata or by name with optional prop overrides.
 * During serialization, references are resolved to string names.
 * @public
 */
export type DefaultChild = AtomMetadata | { atom: AtomMetadata; props?: Record<string, unknown> };

/**
 * Props of a React component without `children` and `ref`.
 * Used to type the schema's `props` so only editable props are declared.
 * @public
 */
export type EditableComponentProps<C extends ComponentType<unknown>> = Omit<
  ComponentPropsWithoutRef<C>,
  'children'
>;

/**
 * Keys of T that are function types (callback props).
 * Used to constrain htmlEvents and customEvents to valid callback prop names.
 * @public
 */
export type CallbackPropKeys<T> = {
  [K in keyof T & string]: NonNullable<T[K]> extends (...args: unknown[]) => unknown ? K : never;
}[keyof T & string];

/**
 * Metadata attached to a prop schema (e.g. editor control hint).
 * Not enforceable by TypeScript alone; used at runtime for DS UI.
 * @public
 */
export type PropMeta = {
  /** Editor control override, e.g. "text", "color" */
  control?: string;
};

/**
 * Metadata attached to a custom event argument (e.g. display name).
 * Not enforceable by TypeScript alone; used at runtime for DS event binding UI.
 * @public
 */
export type ArgMeta = {
  /** Human-readable argument name */
  argName: string;
};
