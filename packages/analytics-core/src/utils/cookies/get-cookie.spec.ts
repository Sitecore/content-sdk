import { getCookie } from './get-cookie';
import { expect } from '@jest/globals';

describe('getCookie', () => {
  const cookieName = 'cookieName';
  const cookieValue = 'cookieValue';
  const cookieString = `${cookieName}=${cookieValue}; cookieName2=cookieValue2`;
  const cookieObject = {
    name: cookieName,
    value: cookieValue,
  };

  it(`should accept a cookie string and a cookie name as parameters and 
      return a cookie object if the cookie name is found in the cookie string`, () => {
    expect(getCookie(cookieString, cookieName)).toEqual(cookieObject);
  });
  it('should return a cookie object if the cookie name is found in the cookie string', () => {
    expect(getCookie(cookieString, cookieName)).toEqual(cookieObject);
  });
  it('should return undefined if the cookie name is not found inside the cookie string', () => {
    const testCookieString = 'cookieName2=cookieValue2';

    expect(getCookie(testCookieString, cookieName)).toEqual(undefined);
  });
  it('should return undefined if the parameter value for cookie string is also undefined', () => {
    expect(getCookie(undefined, cookieName)).toEqual(undefined);
  });
  it('should return undefined if the parameter value for cookie string contains no "="', () => {
    const testCookieString = 'cookieName;cookieValue';

    expect(getCookie(testCookieString, cookieName)).toEqual(undefined);
  });
  it('should return undefined if the parameter value for cookie string starts with "="', () => {
    const testCookieString = '=cookieNamecookieValue';

    expect(getCookie(testCookieString, cookieName)).toEqual(undefined);
    expect(getCookie(testCookieString, '')).toEqual(undefined);
  });
});
