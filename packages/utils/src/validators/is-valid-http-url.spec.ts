import { isValidHttpURL } from './is-valid-http-url';
import { expect, it, describe } from '@jest/globals';

describe('isValidHttpURL', () => {
  const validHttpURLs = ['https://blog.openreplay.com/', 'http://test.com'];
  const invalidHttpURLs = ['mailto://test@test.com', 'http2://test.com', 'test.com'];

  it.each(validHttpURLs)(
    'should return true when valid url strings are passed as parameters',
    (url) => {
      expect(isValidHttpURL(url)).toEqual(true);
    }
  );

  it.each(invalidHttpURLs)(
    'should return false when invalid url strings are passed as parameters',
    (url) => {
      expect(isValidHttpURL(url)).toEqual(false);
    }
  );
});
