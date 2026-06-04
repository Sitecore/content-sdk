import {
  defineAtomsCatalog,
  defineAtomsRegistry,
  imageFieldSchema,
} from '@sitecore-content-sdk/nextjs';
import { z } from 'zod';
import Card from './Card';
import CardTitle from './CardTitle';

export const catalog = defineAtomsCatalog({
  version: '1.0.1',
  components: {
    Card: {
      version: '1.0.2',
      props: z.object({
        title: z.string(),
        description: z.string().nullable(),
        subtitle: z.string().optional(),
      }),
      description: 'A simple card component!!!',
      slots: ['default'],
      allowedChildren: ['CardTitle'],
    },
    CardTitle: {
      version: '1.0.2',
      props: z.object({
        title: z.string(),
      }),
      description: 'A simple card title component',
      slots: ['default'],
      allowedParents: ['Card'],
    },
  },
  actions: {
    log: {
      params: z.object({ message: z.string() }),
      description: 'Log a message to the console',
    },
  },
});

export const registry = defineAtomsRegistry(catalog, {
  components: {
    Card: ({ props, children }) => {
      return <Card description={props.description}>{children}</Card>;
    },
    CardTitle: ({ props }) => {
      return <CardTitle title={props.title} />;
    },
  },
  actions: {
    log: async (params) => {
      console.log('Log action:', params?.message);
    },
  },
});
