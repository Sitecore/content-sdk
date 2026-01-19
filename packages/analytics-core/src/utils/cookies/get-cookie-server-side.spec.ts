import * as Cookies from './get-cookie';
import { getCookieServerSide } from './get-cookie-server-side';

describe('getCookieServerSide', () => {
  let cookiesHeader = '';
  const getCookieSpy = jest.spyOn(Cookies, 'getCookie');

  beforeEach(() => {
    cookiesHeader = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Returns the specific cookie when cookie is set with specific name & value', () => {
    cookiesHeader = `testCookie=testCookieValue`;
    const cookieName = `testCookie`;

    getCookieSpy.mockReturnValueOnce({ name: cookieName, value: 'testCookieValue' });
    const cookie = getCookieServerSide(cookiesHeader, cookieName);

    expect(cookie?.name).toBe(cookieName);
    expect(cookie?.value).toBe('testCookieValue');
  });

  it('Returns undefined if no cookie found', () => {
    cookiesHeader = `testCookie=testCookieValue`;
    const cookieName = `testCookie2`;

    getCookieSpy.mockReturnValueOnce(undefined);

    const cookie = getCookieServerSide(cookiesHeader, cookieName);
    expect(cookie).toBeUndefined();
  });
});
