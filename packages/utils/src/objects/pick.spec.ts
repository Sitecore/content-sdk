import { pick } from './pick';

interface ExampleObject {
  [key: string | symbol]: any;
}

describe('pick', () => {
  const symbol = Symbol('test');

  const originalObject: ExampleObject = {
    id: 1,
    name: 'Rodney Mullen',
    password: 'verysecure',
    [symbol]: 'someValue',
  };

  it(`should pick properties 'id' and 'name' from 'originalObject'`, () => {
    const expectedResult = {
      id: 1,
      name: 'Rodney Mullen',
    };
    const actualResult = pick(originalObject, ['id', 'name']);
    expect(actualResult).toEqual(expectedResult);
  });

  it(`should pick property 'symbol' from 'originalObject'`, () => {
    const expectedResult = {
      [symbol]: 'someValue',
    };
    const actualResult = pick(originalObject, [symbol]);
    expect(actualResult).toEqual(expectedResult);
  });

  it(`should return an empty object when an empty array is passed as keys`, () => {
    const result = pick(originalObject, []);
    expect(result).toEqual({});
  });

  it(`should return an empty object when a key does not exist in the 'originalObject'`, () => {
    const result = pick(originalObject, ['nonExistingProp']);
    expect(result).toEqual({});
  });
});
