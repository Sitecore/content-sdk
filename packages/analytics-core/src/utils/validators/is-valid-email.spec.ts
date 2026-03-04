import { isValidEmail } from './is-valid-email';
import { it, expect } from '@jest/globals';

describe('isValidEmail', () => {
  const validEmails = [
    'مانيش@أشوكا.لهند',
    'δοκιμή@παράδειγμα.δοκιμή',
    '我買@屋企.香港',
    '甲斐@黒川.日本',
    'чебурашка@ящик-с-апельсинами.рф',
    'email@example.com',
    'a+email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    'email@[123.123.123.123]',
    '"email"@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com',
  ];
  const invalidEmails = [
    '',
    'email@@example.com',
    'email@examplecom',
    'email @example.com',
    ' email@example.com',
    'email@example.com ',
    'mysite.ourearth.com',
    '@you.me.net',
  ];
  it.each(validEmails)(
    'should return true when valid email strings are passed as parameters',
    (email) => {
      expect(isValidEmail(email)).toEqual(true);
    }
  );
  it.each(invalidEmails)(
    'should return false when invalid email strings are passed as parameters',
    (email) => {
      expect(isValidEmail(email)).toEqual(false);
    }
  );
});
