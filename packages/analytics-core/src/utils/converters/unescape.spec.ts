import { unescape } from './unescape';
import { describe } from '@jest/globals';

describe('unescape', () => {
  describe.each([
    ['&amp;', '&'],
    ['&gt;', '>'],
    ['&lt;', '<'],
    ['&#39;', "'"],
    ['&quot;', '"'],
    ['&amp;lt;', '&lt;'],
    ['abc', 'abc'],
    ['&#96;', '&#96;'],
    ['&#x2F;', '&#x2F;'],
    ['No HTML entities  here', 'No HTML entities  here'],
  ])('should call unescape with %s ', (param, expected) => {
    it(`and return ${expected}`, () => {
      expect(unescape(param)).toBe(expected);
    });
  });

  it('should return empty string when nothing is passed', () => {
    expect(unescape()).toBe('');
  });

  it('should return type of string', () => {
    const result = unescape();
    expect(typeof result).toBe('string');
  });

  it('should handle leading zeros in html entities', () => {
    expect(unescape('&#39;')).toBe("'");
    expect(unescape('&#039;')).toBe("'");
    expect(unescape('&#000039;')).toBe("'");
  });

  it('should handle strings with unescape', () => {
    expect(unescape("I &amp; my friends 'visited' the &lt; Zoo &gt; on &#39;Sunday&#39;")).toBe(
      "I & my friends 'visited' the < Zoo > on 'Sunday'"
    );
  });

  it('should handle strings with unescape', () => {
    expect(unescape("I &amp; my friends 'visited' the &lt; Zoo &gt; on &quot;Sunday&quot;")).toBe(
      'I & my friends \'visited\' the < Zoo > on "Sunday"'
    );
  });
});
