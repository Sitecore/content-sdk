import type { HttpResponse, MiddlewareNextResponse } from '../interfaces';
import { isHttpResponse } from './is-http-response';
import { expect, it, describe, jest } from '@jest/globals';

describe('isHttpResponse', () => {
  it('should return true if response has Http Response properties', () => {
    const res: HttpResponse = {
      setHeader: jest.fn(),
    };
    const result = isHttpResponse(res);

    expect(result).toBe(true);
  });

  it('should return false if response lacks Http Response properties', () => {
    const nonHttpResponse: MiddlewareNextResponse = {
      cookies: {
        set: jest.fn(),
      },
    };
    const result = isHttpResponse(nonHttpResponse);

    expect(result).toBe(false);
  });
});
