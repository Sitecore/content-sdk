import { omit } from './omit';

interface ExampleObject {
  [key: string | symbol]: any;
}

describe('omit', () => {
  const symbol = Symbol('test');

  const originalObject: ExampleObject = {
    id: 1,
    name: 'Rodney Mullen',
    password: 'verysecure',
    [symbol]: 'someValue',
  };

  Object.defineProperty(originalObject, 'nonEnumerableProperty', {
    enumerable: false,
    value: 10,
  });

  it(`should omit properties 'id' and 'name' from 'originalObject'`, () => {
    const expectedResult = {
      password: 'verysecure',
      [symbol]: 'someValue',
    };
    const actualResult = omit(originalObject, ['id', 'name']);
    expect(actualResult).toEqual(expectedResult);
  });

  it(`should omit property 'symbol' from 'originalObject'`, () => {
    const expectedResult = {
      id: 1,
      name: 'Rodney Mullen',
      password: 'verysecure',
    };
    const actualResult = omit(originalObject, [symbol]);
    expect(actualResult).toEqual(expectedResult);
  });

  it(`should return the 'originalObject' when an empty array is passed as keys`, () => {
    const result = omit(originalObject, []);
    expect(result).toEqual(originalObject);
  });

  it(`should return the 'originalObject' when a key passed is not enumerable`, () => {
    const result = omit(originalObject, ['nonEnumerableProperty']);
    expect(result).toEqual(originalObject);
  });

  it(`should return the 'originalObject' when a key does not exist in the 'originalObject'`, () => {
    const result = omit(originalObject, ['nonExistingProp']);
    expect(result).toEqual(originalObject);
  });

  it(`should ignore the prototype chain properties`, () => {
    const result = omit(originalObject, ['toString']);
    expect(result).toEqual(originalObject);
  });
});
