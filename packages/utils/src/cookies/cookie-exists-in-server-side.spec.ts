import * as Cookies from './get-cookie-server-side';
import { cookieExistsInServerSide } from './cookie-exists-in-server-side';

describe('cookieExistsInServerSide', () => {
  let cookiesHeader = '';
  const getCookieServerSideSpy = jest.spyOn(Cookies, 'getCookieServerSide');

  beforeEach(() => {
    cookiesHeader = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Returns true if cookie exists in the cookie header', () => {
    cookiesHeader = `testCookie=testCookieValue`;
    const cookieName = `testCookie`;
    const cookieValue = `test`;

    getCookieServerSideSpy.mockReturnValueOnce({ name: cookieName, value: cookieValue });

    const result = cookieExistsInServerSide(cookiesHeader, cookieName);

    expect(result).toBeTruthy();
  });

  it('Returns false if there is no cookie in the header', () => {
    cookiesHeader = `testCookie=testCookieValue`;
    const cookieName = `testCookie2`;

    getCookieServerSideSpy.mockReturnValueOnce(undefined);

    const result = cookieExistsInServerSide(cookiesHeader, cookieName);

    expect(result).toBeFalsy();
  });
});
