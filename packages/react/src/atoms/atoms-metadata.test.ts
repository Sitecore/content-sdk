import { expect } from 'chai';
import { z } from 'zod';
import { ATOMS_CATALOG_METADATA_KEY, SerializedCatalog } from '@sitecore-content-sdk/content/atoms';
import { defineAtomsCatalog } from './define-atoms-catalog';
import { serializeCatalog } from './catalog-serializer';
import { getAtomsMetadata } from './atoms-metadata';

describe('getAtomsMetadata()', () => {
  it('returns the serialized catalog under the atoms catalog metadata key', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    expect(getAtomsMetadata(catalog)).to.deep.equal({
      [ATOMS_CATALOG_METADATA_KEY]: serializeCatalog(catalog),
    });
  });

  it('serializes props and params without a JSON Schema equivalent as any', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Event: {
          props: z.object({ title: z.string(), startsAt: z.date() }),
          description: 'An event',
        },
      },
      actions: {
        schedule: { params: z.object({ at: z.date() }), description: 'Schedule' },
      },
    });

    expect(() => serializeCatalog(catalog)).to.throw('Date cannot be represented in JSON Schema');

    const atomsCatalog = getAtomsMetadata(catalog)[ATOMS_CATALOG_METADATA_KEY] as SerializedCatalog;

    expect(atomsCatalog.components[0].propsSchema)
      .to.have.nested.property('properties.startsAt')
      .that.deep.equals({});
    expect(atomsCatalog.actions[0].paramsSchema)
      .to.have.nested.property('properties.at')
      .that.deep.equals({});
  });
});
