/**
 * createAtom — define an atom or atom-child with component-first signature.
 * The schema's `type` property differentiates atom vs atom-child.
 */
import { z } from 'zod';
import type { ComponentType } from 'react';
import type {
  AtomMetadata,
  AtomChild,
  DefaultChild,
  EditableComponentProps,
  CallbackPropKeys,
} from './types';

/**
 * Schema input for createAtom.
 * Props keys are restricted to the component's props excluding `children` and `ref`.
 * Event keys are restricted to callback props of the component.
 * @public
 */
export type AtomSchemaInput<C extends ComponentType<unknown>> = {
  /** Unique identifier used as the element type in the DSL */
  name: string;
  /** Human-readable summary shown in the DS component palette */
  description: string;
  /** `'atom'` (default) for top-level, `'atom-child'` for scoped children */
  type?: 'atom' | 'atom-child';
  /** Optional version for schema evolution */
  version?: number;
  /** Zod shape for editable props (keys must be in component props excluding children and ref) */
  props: {
    [K in keyof EditableComponentProps<C>]?: z.ZodType<EditableComponentProps<C>[K]>;
  };
  /** DOM event handler prop names (e.g. onClick). Must be callback props of the component. */
  htmlEvents?: CallbackPropKeys<EditableComponentProps<C>>[];
  /** Custom callback prop names to Zod argument type arrays. Keys must be callback props. */
  customEvents?: {
    [K in CallbackPropKeys<EditableComponentProps<C>>]?: z.ZodType[];
  };
  /** Which children this atom can contain */
  allowedChildren?: AtomChild[];
  /** Children to insert automatically when the atom is added */
  defaultChildren?: DefaultChild[];
};

/**
 * Creates an atom or atom-child descriptor.
 * First parameter is the component; second is the schema. The schema's `type`
 * differentiates atom (default) from atom-child.
 * @param {C} component - The React component that renders this atom
 * @param {AtomSchemaInput<C>} schema - Name, description, type, props, events, and children rules
 * @returns {AtomMetadata} type is taken from schema.type, default 'atom'
 * @example
 * const ButtonAtom = createAtom(Button, {
 *   name: 'Button',
 *   description: 'A button component',
 *   props: {
 *     variant: z.enum(['default', 'secondary']).optional().default('default'),
 *     size: z.enum(['default', 'sm', 'lg']).optional().default('default'),
 *   },
 *   htmlEvents: ['onClick', 'onMouseEnter'],
 *   allowedChildren: ['text'],
 * });
 * @example
 * const CardTitleAtom = createAtom(CardTitle, {
 *   name: 'CardTitle',
 *   description: 'Card title',
 *   type: 'atom-child',
 *   props: {},
 *   allowedChildren: ['text'],
 * });
 * @public
 */
export function createAtom<C extends ComponentType<unknown>>(
  component: C,
  schema: AtomSchemaInput<C>
): AtomMetadata {
  const atomType = schema.type ?? 'atom';
  const propsShape = schema.props as Record<string, z.ZodType>;
  const propsSchema = z.object(propsShape);

  const customEvents =
    schema.customEvents &&
    Object.keys(schema.customEvents).length > 0
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
