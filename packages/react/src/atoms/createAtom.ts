/** Component-first atom/atom-child definition; schema.type differentiates. */
import { AtomType } from '@sitecore-content-sdk/content/editing';
import { z } from 'zod';
import type {
  AtomMetadata,
  AtomChild,
  DefaultChild,
  EditableComponentProps,
  CallbackPropKeys,
  CallbackArgZodTuple,
} from './types';

/**
 * Schema input for createAtom. Prop keys are restricted to the component's props excluding
 * children and ref; event keys are restricted to callback props of the component.
 * @public
 */
export type AtomSchemaInput<C> = {
  /** Unique identifier used as the element type in the DSL */
  name: string;
  /** Human-readable summary for the component palette */
  description: string;
  /** 'atom' (default) for top-level, 'atom-child' for scoped children */
  type?: AtomType;
  /** Optional version for schema evolution */
  version?: number;
  /** Zod schemas for editable props (keys must be component props excluding children/ref) */
  props: {
    [K in keyof EditableComponentProps<C>]?: z.ZodType<EditableComponentProps<C>[K]>;
  };
  /** DOM event handler prop names (e.g. onClick). Must be callback props. */
  htmlEvents?: CallbackPropKeys<EditableComponentProps<C>>[];
  /** Custom callback prop names to tuple of Zod types matching that callback's parameters. */
  customEvents?: {
    [K in CallbackPropKeys<EditableComponentProps<C>>]?: CallbackArgZodTuple<
      NonNullable<EditableComponentProps<C>[K]>
    >;
  };
  /** Allowed child types (atom-child metadata, 'text', or 'atom') */
  allowedChildren?: AtomChild[];
  /** Default children to insert when the atom is added */
  defaultChildren?: DefaultChild[];
};

/**
 * Create an atom or atom-child descriptor. The component is the first argument, the schema the
 * second; schema.type selects 'atom' (default) or 'atom-child'.
 * @param {C} component - The React component that renders this atom
 * @param {AtomSchemaInput<C>} schema - Name, description, type, props, events, and children rules
 * @returns AtomMetadata with type taken from schema.type (default 'atom')
 * @public
 */
export function createAtom<C>(component: C, schema: AtomSchemaInput<C>): AtomMetadata {
  const atomType: AtomType = schema.type ?? 'atom';
  const propsShape = schema.props as Record<string, z.ZodType>;
  const propsSchema = z.object(propsShape);

  const customEvents =
    schema.customEvents && Object.keys(schema.customEvents).length > 0
      ? (Object.fromEntries(
          Object.entries(schema.customEvents).filter(([, v]) => v !== undefined)
        ) as Record<string, z.ZodType[]>)
      : undefined;

  return {
    name: schema.name,
    version: schema.version,
    type: atomType,
    description: schema.description,
    props: propsSchema,
    component: component as (props: unknown) => React.ReactNode,
    htmlEvents: schema.htmlEvents,
    customEvents,
    allowedChildren: schema.allowedChildren,
    defaultChildren: schema.defaultChildren,
  };
}
