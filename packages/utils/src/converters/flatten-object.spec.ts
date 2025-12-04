import { flattenObject } from './flatten-object';

describe('flattenObject', () => {
  it('should return a properly flattened object', () => {
    const object = {
      a: 'a',
      b: true,
      c: 11,
      e: {
        f: 'f',
        g: false,
        h: 22,
        i: ['a', 2, true, { a: 'a' }, [[1], [2]]],
        j: {
          k: 'k',
        },
        z: undefined,
      },
      m: undefined,
      n: '',
    };

    /* eslint-disable @typescript-eslint/naming-convention */
    const expected = {
      a: 'a',
      b: true,
      c: 11,
      e_f: 'f',
      e_g: false,
      e_h: 22,
      e_i: ['a', 2, true, { a: 'a' }, [[1], [2]]],
      e_j_k: 'k',
      n: '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const result = flattenObject({ object });

    expect(result).toEqual(expected);
  });

  it('should not add a property if property is undefined', () => {
    const object = { a: undefined };
    const result = flattenObject({ object });

    expect(result).not.toHaveProperty('a');
  });

  it('should return an empty object', () => {
    const object = {};

    const expected = {};

    const result = flattenObject({ object });

    expect(result).toEqual(expected);
  });

  it('should return a test object', () => {
    const object = {
      a: 'a',
      b: true,
      c: 11,
      params: {
        f: 'f',
        g: false,
        h: 22,
        i: ['a', 2, true, { a: 'a' }, [[1], [2]]],
        j: {
          k: 'k',
        },
      },
    };

    /* eslint-disable @typescript-eslint/naming-convention */
    const expected = {
      f: 'f',
      g: false,
      h: 22,
      i: ['a', 2, true, { a: 'a' }, [[1], [2]]],
      j_k: 'k',
    };

    const result = flattenObject({ object: object.params });

    expect(result).toEqual(expected);
  });
});
