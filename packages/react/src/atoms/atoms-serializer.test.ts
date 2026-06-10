/* eslint-disable jsdoc/require-jsdoc */
import { expect } from 'chai';
import { z } from 'zod';
import { defineAtomsCatalog } from './define-atoms-catalog';
import { serializeCatalog } from './atoms-serializer';

describe('serializeCatalog()', () => {
  it('returns components and actions arrays', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    const result = serializeCatalog(catalog);

    expect(result).to.have.property('components').that.is.an('array');
    expect(result).to.have.property('actions').that.is.an('array');
  });

  it('omits version when not set on the catalog', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    const result = serializeCatalog(catalog);

    expect(result).to.not.have.property('version');
  });

  it('includes catalog-level version when set', () => {
    const catalog = defineAtomsCatalog({
      version: '2.0.0',
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });
    const result = serializeCatalog(catalog);
    expect(result).to.have.property('version', '2.0.0');
  });

  it('serializes component with full schema', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Button: {
          version: '0.3.0',
          props: z.object({ label: z.string() }),
          description: 'A button',
          example: { label: 'Hello world' },
          allowedChildren: ['Button', 'Text'],
          allowedParents: ['Column', 'Row'],
          slots: ['header', 'body', 'footer'],
        },
      },
      actions: {},
    });

    const [comp] = serializeCatalog(catalog).components;

    expect(comp.name).to.equal('Button');
    expect(comp.description).to.equal('A button');
    expect(comp.propsSchema).to.deep.equal({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: { label: { type: 'string' } },
      required: ['label'],
      additionalProperties: false,
    });
    expect(comp.slots).to.deep.equal(['header', 'body', 'footer']);
    expect(comp.allowedChildren).to.deep.equal(['Button', 'Text']);
    expect(comp.allowedParents).to.deep.equal(['Column', 'Row']);
    expect(comp.example).to.deep.equal({ label: 'Hello world' });
    expect(comp.version).to.equal('0.3.0');
  });

  it('serializes multiple components in catalog key order', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Alpha: { props: z.object({}), description: 'Alpha' },
        Beta: { props: z.object({}), description: 'Beta' },
        Gamma: { props: z.object({}), description: 'Gamma' },
      },
      actions: {},
    });

    const names = serializeCatalog(catalog).components.map((c) => c.name);

    expect(names).to.deep.equal(['Alpha', 'Beta', 'Gamma']);
  });

  it('returns an empty actions array when catalog has no actions', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'Text' },
      },
      actions: {},
    });
    expect(serializeCatalog(catalog).actions).to.deep.equal([]);
  });

  it('serializes action name and description', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Button: { props: z.object({ label: z.string() }), description: 'A button' },
      },
      actions: {
        submit: { params: z.object({ formId: z.string() }), description: 'Submit the form' },
      },
    });
    const [action] = serializeCatalog(catalog).actions;
    expect(action.name).to.equal('submit');
    expect(action.description).to.equal('Submit the form');
  });

  it('converts action params to JSON Schema', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Button: { props: z.object({ label: z.string() }), description: 'A button' },
      },
      actions: {
        navigate: { params: z.object({ path: z.string() }), description: 'Navigate' },
      },
    });
    const [action] = serializeCatalog(catalog).actions;
    expect(action.paramsSchema).to.deep.equal({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      type: 'object',
      properties: { path: { type: 'string' } },
      required: ['path'],
      additionalProperties: false,
    });
  });

  it('converts action without params to JSON Schema', () => {
    const catalog = defineAtomsCatalog({
      components: {},
      actions: {
        navigate: { description: 'Navigate' },
      },
    });

    const [action] = serializeCatalog(catalog).actions;

    expect(action).to.not.have.property('paramsSchema');
  });

  it('serializes multiple actions in catalog key order', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Button: { props: z.object({ label: z.string() }), description: 'Button' },
      },
      actions: {
        open: { params: z.object({ id: z.string() }), description: 'Open' },
        close: { params: z.object({ id: z.string() }), description: 'Close' },
      },
    });
    const names = serializeCatalog(catalog).actions.map((a) => a.name);
    expect(names).to.deep.equal(['open', 'close']);
  });
});

