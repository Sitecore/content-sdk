import { convertToBase64 } from './base-64-converter';
import { expect, it, describe, jest } from '@jest/globals';

jest.mock('buffer');

describe('convertToBase64', () => {
  Object.defineProperty(global, 'Buffer', {
    get: jest.fn().mockReturnValueOnce(undefined),
    // writable: true,
  });

  it('converts a string to base64', () => {
    const result = convertToBase64('foo');
    expect(result).toBe('Zm9v');
    expect(result).not.toBe('foo');
  });

  it('converts an object to base64', () => {
    const result = convertToBase64({ foo: 'bar' });
    expect(result).toBe('eyJmb28iOiJiYXIifQ==');
  });

  it('converts a string to base64', () => {
    expect(global.Buffer).toBeUndefined();
    expect(convertToBase64('foo')).toBe('Zm9v');
  });

  it('converts an object to base64 when Buffer is not present', () => {
    expect(global.Buffer).toBeUndefined();
    expect(convertToBase64({ foo: 'bar' })).toBe('eyJmb28iOiJiYXIifQ==');
  });
});
