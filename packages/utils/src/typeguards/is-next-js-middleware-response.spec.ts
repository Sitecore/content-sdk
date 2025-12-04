import type { HttpResponse, MiddlewareNextResponse } from '../interfaces';
import { isNextJsMiddlewareResponse } from './is-next-js-middleware-response';
import { expect, it, describe, jest } from '@jest/globals';

describe('isNextJsMiddlewareResponse', () => {
  it('should return false if response does not have Next Js Middleware Response properties', () => {
    const res: HttpResponse = {
      setHeader: jest.fn(),
    };
    const result = isNextJsMiddlewareResponse(res);

    expect(result).toBe(false);
  });

  it('should return true if response has Next Js Middleware Response properties', () => {
    const response: MiddlewareNextResponse = {
      cookies: {
        set: jest.fn(),
      },
    };
    const result = isNextJsMiddlewareResponse(response);

    expect(result).toBe(true);
  });
});
