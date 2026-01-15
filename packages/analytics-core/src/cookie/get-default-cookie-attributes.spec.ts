import { DAILY_SECONDS, DEFAULT_COOKIE_EXPIRY_DAYS } from '../consts';
import { getDefaultCookieAttributes } from './get-default-cookie-attributes';

describe('getDefaultCookieAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return an object with the correct values when max age is provided', () => {
    expect(getDefaultCookieAttributes(10)).toEqual({
      domain: undefined,
      maxAge: 10 * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });
  it('should return an object with the correct values when max age is undefined', () => {
    expect(getDefaultCookieAttributes()).toEqual({
      domain: undefined,
      maxAge: DEFAULT_COOKIE_EXPIRY_DAYS * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });

  it('should return an object with the correct values when domain has value', () => {
    expect(getDefaultCookieAttributes(undefined, 'test')).toEqual({
      domain: 'test',
      maxAge: DEFAULT_COOKIE_EXPIRY_DAYS * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });

  it('should return an object with the correct values when domain is undefined', () => {
    expect(getDefaultCookieAttributes(undefined, undefined)).toEqual({
      domain: undefined,
      maxAge: DEFAULT_COOKIE_EXPIRY_DAYS * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });

  it('should return an object with the correct values when max age and domain is provided', () => {
    expect(getDefaultCookieAttributes(10, 'test')).toEqual({
      domain: 'test',
      maxAge: 10 * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });

  it('should return an object with the correct values when max age is undefined and domain has value', () => {
    expect(getDefaultCookieAttributes(undefined, 'test')).toEqual({
      domain: 'test',
      maxAge: DEFAULT_COOKIE_EXPIRY_DAYS * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });
  it('should return an object with the correct values when max age and domain are undefined', () => {
    expect(getDefaultCookieAttributes(undefined, undefined)).toEqual({
      domain: undefined,
      maxAge: DEFAULT_COOKIE_EXPIRY_DAYS * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });

  it('should return an object with the default values when max age has value and domain is undefined', () => {
    expect(getDefaultCookieAttributes(10)).toEqual({
      domain: undefined,
      maxAge: 10 * DAILY_SECONDS,
      path: '/',
      sameSite: 'None',
      secure: true
    });
  });
});
