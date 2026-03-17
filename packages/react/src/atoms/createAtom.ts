/** Component-first atom/atom-child definition; schema.type differentiates. */
import { z } from 'zod';
import type { ComponentType } from 'react';
import type {
  AtomMetadata,
  AtomChild,
  DefaultChild,
  EditableComponentProps,
  CallbackPropKeys,
} from './types';

/** Schema for createAtom (props exclude children/ref). @public */
export type AtomSchemaInput<C extends ComponentType<unknown>> = {
  name: string;
  description: string;
  type?: 'atom' | 'atom-child';
  version?: number;
  props: {
    [K in keyof EditableComponentProps<C>]?: z.ZodType<EditableComponentProps<C>[K]>;
  };
  htmlEvents?: CallbackPropKeys<EditableComponentProps<C>>[];
  customEvents?: {
    [K in CallbackPropKeys<EditableComponentProps<C>>]?: z.ZodType[];
  };
  allowedChildren?: AtomChild[];
  defaultChildren?: DefaultChild[];
};

/** Create an atom or atom-child; type defaults to 'atom'. @public */
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
