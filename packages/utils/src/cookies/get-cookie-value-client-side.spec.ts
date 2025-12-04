import { getCookieValueClientSide } from './get-cookie-value-client-side';
import { expect, it, describe } from '@jest/globals';

describe('getCookieValue', () => {
  it('should return the cookie value for a given cookie name', () => {
    const cookieName = 'testCookie';
    document.cookie = `${cookieName}=testCookieValue;`;

    expect(getCookieValueClientSide(cookieName)).toEqual('testCookieValue');
  });

  it('should return an empty string if the cookie name is not found', () => {
    expect(getCookieValueClientSide('testCookieValue')).toEqual('');
  });
});
