/**
 * @jest-environment node
 */

import { convertToBase64 } from './base-64-converter';
import { expect, it, describe, jest, beforeAll } from '@jest/globals';

describe('convertToBase64', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('toString method is called with base64 ', () => {
    // Create a mock function for the toString method
    const toStringMock = jest.fn().mockReturnValueOnce('eyJmb28iOiJiYXIifQ==');

    // Replace the original toString method with the mock
    const originalToString = Buffer.prototype.toString;
    Buffer.prototype.toString = toStringMock;

    const result = convertToBase64({ foo: 'bar' });
    // Assert that toString was called with 'base64'
    expect(result).toBe('eyJmb28iOiJiYXIifQ==');
    expect(toStringMock).toHaveBeenCalledWith('base64');
    expect(toStringMock).not.toHaveBeenCalledWith('');

    // Restore the original toString method to avoid affecting other tests
    Buffer.prototype.toString = originalToString;
  });

  it('Returns the object as stringify if Buffer and Window are not present ', () => {
    delete (global as any).Buffer;

    expect(global.Buffer).toBeUndefined();

    expect(convertToBase64({ foo: 'bar' })).toBe('{"foo":"bar"}');
  });
});
