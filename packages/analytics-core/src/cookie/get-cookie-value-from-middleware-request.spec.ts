import { getCookieValueFromMiddlewareRequest } from './get-cookie-value-from-middleware-request';

const mockCookieName = 'bid_key';
const mockRequest = {
  cookies: { get: jest.fn(), set: jest.fn() },
  headers: {
    get: jest.fn()
  }
};

describe('getCookieValueFromMiddlewareRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return cookie value when found in Next.js v12 cookie format', () => {
    const expectedBrowserId = 'your-browser-id';
    mockRequest.cookies.get.mockReturnValue(expectedBrowserId);

    const result = getCookieValueFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBe(expectedBrowserId);
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });

  it('should return cookie value when found in Next.js v13 cookie format', () => {
    const expectedBrowserId = 'your-browser-id';
    const cookieObject = { value: expectedBrowserId };
    mockRequest.cookies.get.mockReturnValue(cookieObject);

    const result = getCookieValueFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBe(expectedBrowserId);
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });

  it('should return undefined when cookie value is not found', () => {
    mockRequest.cookies.get.mockReturnValue(undefined);

    const result = getCookieValueFromMiddlewareRequest(mockRequest, mockCookieName);

    expect(result).toBeUndefined();
    expect(mockRequest.cookies.get).toHaveBeenCalledWith(mockCookieName);
  });
});
