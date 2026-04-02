import { expect } from 'chai';
import { z } from 'zod';
import { serializeCallbacks } from './callback-registry-utils';
import { createCallback } from './createCallback';

describe('serializeCallbacks', () => {
  it('should serialize a callback without params', () => {
    const callback = createCallback('onSave', {
      description: 'onSave callback',
      params: {},
      callbackFn: () => {},
    });

    const result = serializeCallbacks([callback]);

    expect(result).to.deep.equal({
      onSave: {
        description: 'onSave callback',
      },
    });
  });

  it('should serialize a callback with params to JSON schema tuple', () => {
    const callback = createCallback('onSubmit', {
      description: 'onSubmit callback',
      params: {
        label: { type: z.string(), description: 'The label' },
        count: { type: z.number(), description: 'The count' },
      },
      callbackFn: ({ label, count }) => {
        console.log(label, count);
      },
    });

    const result = serializeCallbacks([callback]);

    expect(result).to.deep.equal({
      onSubmit: {
        description: 'onSubmit callback',
        params: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            label: { type: 'string', description: 'The label' },
            count: { type: 'number', description: 'The count' },
          },
          required: ['label', 'count'],
          additionalProperties: false,
        },
      },
    });
  });

  it('should serialize multiple callbacks', () => {
    const callbackA = createCallback('onSave', {
      description: 'Save handler',
      params: {},
      callbackFn: () => {},
    });
    const callbackB = createCallback('onCancel', {
      description: 'Cancel handler',
      params: {},
      callbackFn: () => {},
    });

    const result = serializeCallbacks([callbackA, callbackB]);

    expect(result).to.deep.equal({
      onSave: {
        description: 'Save handler',
      },
      onCancel: {
        description: 'Cancel handler',
      },
    });
  });

  it('should return an empty object for an empty array', () => {
    const result = serializeCallbacks([]);

    expect(result).to.deep.equal({});
  });

  it('should serialize params with argument names and descriptions', () => {
    const callback = createCallback('onUpdate', {
      description: 'onUpdate callback',
      params: {
        name: { type: z.string(), description: 'Name to update' },
        isActive: { type: z.boolean(), description: 'Whether active' },
      },
      callbackFn: ({ name, isActive }) => {
        console.log(name, isActive);
      },
    });

    const result = serializeCallbacks([callback]);

    expect(result).to.deep.equal({
      onUpdate: {
        description: 'onUpdate callback',
        params: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Name to update' },
            isActive: { type: 'boolean', description: 'Whether active' },
          },
          required: ['name', 'isActive'],
          additionalProperties: false,
        },
      },
    });
  });

  it('should serialize callbacks with mixed params and no-params', () => {
    const callbackA = createCallback('onSave', {
      description: 'onSave callback',
      params: {
        title: { type: z.string(), description: 'The title' },
      },
      callbackFn: ({ title }) => {
        console.log(title);
      },
    });
    const callbackB = createCallback('onCancel', {
      description: 'onCancel callback',
      params: {},
      callbackFn: () => {},
    });

    const result = serializeCallbacks([callbackA, callbackB]);

    expect(result).to.deep.equal({
      onSave: {
        description: 'onSave callback',
        params: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            title: { type: 'string', description: 'The title' },
          },
          required: ['title'],
          additionalProperties: false,
        },
      },
      onCancel: {
        description: 'onCancel callback',
      },
    });
  });

  it('should serialize an array of callbacks with varying params', () => {
    const callbackA = createCallback('onSubmit', {
      description: 'Submit handler',
      params: {
        label: { type: z.string(), description: 'The label' },
        count: { type: z.number(), description: 'The count' },
        note: { type: z.string().optional(), description: 'Optional note' },
      },
      callbackFn: ({ label, count, note }) => {
        console.log(label, count, note);
      },
    });
    const callbackB = createCallback('onReset', {
      description: 'Reset handler',
      params: {
        force: { type: z.boolean(), description: 'Force reset' },
      },
      callbackFn: ({ force }) => {
        console.log(force);
      },
    });
    const callbackC = createCallback('onCancel', {
      description: 'Cancel handler',
      params: {},
      callbackFn: () => {},
    });

    const result = serializeCallbacks([callbackA, callbackB, callbackC]);

    expect(result).to.deep.equal({
      onSubmit: {
        description: 'Submit handler',
        params: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            label: { type: 'string', description: 'The label' },
            count: { type: 'number', description: 'The count' },
            note: { description: 'Optional note', type: 'string' },
          },
          required: ['label', 'count'],
          additionalProperties: false,
        },
      },
      onReset: {
        description: 'Reset handler',
        params: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            force: { type: 'boolean', description: 'Force reset' },
          },
          required: ['force'],
          additionalProperties: false,
        },
      },
      onCancel: {
        description: 'Cancel handler',
      },
    });
  });
});
