import { normalizeHeaders } from './normalizeHeaders';
import { expect } from '@jest/globals';

describe('normalizeHeaders', () => {
  it('should return an empty object when input is empty', () => {
    expect(normalizeHeaders()).toEqual({});
    expect(normalizeHeaders({})).toEqual({});
  });

  it('should correctly extract headers from a Headers object', () => {
    const mockHeaders = new Headers();
    mockHeaders.append('X-Test-Header', 'TestValue');
    mockHeaders.append('X-Another-Header', 'AnotherValue');

    const headers = normalizeHeaders(mockHeaders);
    expect(headers).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'x-another-header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'x-test-header': 'TestValue',
    });
  });

  it('should correctly extract headers from a plain object', () => {
    const mockHeaders = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Another-Header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Test-Header': 'TestValue',
    };
    const headers = normalizeHeaders(mockHeaders);
    expect(headers).toEqual(mockHeaders);
  });

  it('should handle arrays of values for headers', () => {
    const mockHeaders = new Headers();
    mockHeaders.append('X-Test-Header', 'Value1');
    mockHeaders.append('X-Test-Header', 'Value2');

    const headers = normalizeHeaders(mockHeaders);
    expect(headers['x-test-header']).toEqual('Value1, Value2');
  });

  it('should handle objects without a forEach method', () => {
    const mockHeaders = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Another-Header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Test-Header': 'TestValue',
    };

    const headers = normalizeHeaders(mockHeaders);
    expect(headers).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Another-Header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Test-Header': 'TestValue',
    });
  });

  it('should ignore properties when forEach is not a function', () => {
    const mockHeaders = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Another-Header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Test-Header': 'TestValue',
      forEach: 'not a function',
    };

    const headers = normalizeHeaders(mockHeaders as any);
    expect(headers).toEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Another-Header': 'AnotherValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Test-Header': 'TestValue',
      forEach: 'not a function',
    });
  });
});
