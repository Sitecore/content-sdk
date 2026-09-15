/* eslint-disable jsdoc/require-jsdoc */
import { expect } from 'chai';
import { z } from 'zod';
import { defineAtomsCatalog } from './define-atoms-catalog';

describe('defineAtomsCatalog()', () => {
  it('defaults stylingSolution to tailwind when not provided', () => {
    const catalog = defineAtomsCatalog({
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    expect(catalog.data.stylingSolution).to.equal('tailwind');
  });

  it('respects an explicit stylingSolution value', () => {
    const catalog = defineAtomsCatalog({
      stylingSolution: 'inline-css',
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {},
    });

    expect(catalog.data.stylingSolution).to.equal('inline-css');
  });

  it('does not affect components and actions passthrough', () => {
    const catalog = defineAtomsCatalog({
      version: '1.0.0',
      components: {
        Text: { props: z.object({ content: z.string() }), description: 'A text node' },
      },
      actions: {
        submit: { params: z.object({ formId: z.string() }), description: 'Submit the form' },
      },
    });

    expect(catalog.data.version).to.equal('1.0.0');
    expect(catalog.data.components).to.have.property('Text');
    expect(catalog.data.actions).to.have.property('submit');
  });
});

