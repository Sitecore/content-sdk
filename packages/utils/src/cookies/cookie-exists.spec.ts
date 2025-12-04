import { cookieExists } from './cookie-exists';

describe('cookieExists', () => {
  const cookieValue = 'cookieValue';

  it(`should accept a cookie string and a cookie name as parameters and return
    a cookie string if the cookie name is found in the cookie string`, () => {
    const cookieName = 'cookieName';
    const cookieString = `${cookieName}=${cookieValue}`;

    expect(cookieExists(cookieString, cookieName)).toBe(true);
  });

  it('should return false if document.cookie is an empty string', () => {
    expect(cookieExists('', 'testCookie')).toBe(false);
  });
  it('should return false document cookie do not have the cookieName ', () => {
    expect(cookieExists('d', 'testCookie')).toBe(false);
  });

  it('should return true if document cookie is tha same as the cookie name', () => {
    expect(cookieExists('d', 'd')).toBe(true);
  });

  it('should return true if document cookie string contains the cookie name', () => {
    expect(cookieExists('test=testValue; cookie=cookieValue', 'cookie')).toBe(true);
  });

  it('should return false if document cookie string contains the cookie name', () => {
    expect(cookieExists('test=testValue; cookie=cookieValue', 'abc')).toBe(false);
  });

  it('should return true if document cookie string contains a duplicate cookie name', () => {
    expect(cookieExists('cookie=testValue; cookie=cookieValue', 'cookie')).toBe(true);
  });
});
