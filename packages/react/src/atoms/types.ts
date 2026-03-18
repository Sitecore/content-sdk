import React from 'react';
import { z } from 'zod';

export enum AtomType {
  ATOM = 'atom',
  ATOM_CHILD = 'atom-child',
}

export type AtomMetadata = {
  name: string;
  version?: number;
  type: AtomType;
  description: string;
  props: z.ZodObject;
  component: (props: any) => React.ReactNode;
  htmlEvents?: string[];
  customEvents?: Record<string, z.ZodType[]>;
  allowedChildren?: AtomChild[];
  defaultChildren?: DefaultChild[];
};

export type AtomChild = AtomMetadata | 'text' | 'atom';

export type DefaultChild = AtomMetadata | { atom: AtomMetadata; props?: Record<string, unknown> };
