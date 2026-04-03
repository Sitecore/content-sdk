import { expect } from 'chai';
import { z } from 'zod';
import { createCallback } from './createCallback';

describe('createCallback', () => {
  it('should create a callback with name and description', () => {
    const result = createCallback('onSave', {
      description: 'Save handler',
      params: {},
      callbackFn: () => {},
    });

    expect(result.name).to.equal('onSave');
    expect(result.description).to.equal('Save handler');
  });

  it('should set params to empty object when no params provided', () => {
    const result = createCallback('onSave', {
      description: 'Save handler',
      params: {},
      callbackFn: () => {},
    });

    expect(result.params).to.deep.equal({});
  });

  it('should pass through params as provided', () => {
    const labelType = z.string();
    const countType = z.number();

    const result = createCallback('onSubmit', {
      description: 'Submit handler',
      params: {
        label: { type: labelType, description: 'The label' },
        count: { type: countType, description: 'The count' },
      },
      callbackFn: ({ label, count }) => {
        console.log(label, count);
      },
    });

    expect(result.params).to.have.property('label');
    expect(result.params).to.have.property('count');
    expect(result.params!.label.description).to.equal('The label');
    expect(result.params!.count.description).to.equal('The count');
  });

  it('should preserve the callbackFn reference', () => {
    const fn = () => {};

    const result = createCallback('onCancel', {
      description: 'Cancel handler',
      params: {},
      callbackFn: fn,
    });

    expect(result.callbackFn).to.equal(fn);
  });

  it('should handle optional params', () => {
    const result = createCallback('onUpdate', {
      description: 'Update handler',
      params: {
        name: { type: z.string(), description: 'The name' },
        note: { type: z.string().optional(), description: 'Optional note' },
      },
      callbackFn: ({ name, note }) => {
        console.log(name, note);
      },
    });

    expect(result.params).to.have.property('name');
    expect(result.params).to.have.property('note');
  });
});

