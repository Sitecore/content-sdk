import { isValidISODateOnlyString } from './is-valid-iso-date-only-string';
import { expect } from '@jest/globals';

describe('isValidISODateOnlyString', () => {
  const validCases = ['2022-01-01', '1999-12-31', '2000-02-29'];

  const invalidCases = [
    '2022',
    '',
    '2022-01-01T00:00:00.000Z',
    'TEST0DA0TET0X:0X',
    'Tue Oct 18 2022 ',
    '2022-01-01T00:00',
  ];

  it.each(validCases)('should return true for valid date string %s', (date) => {
    expect(isValidISODateOnlyString(date)).toEqual(true);
  });

  it.each(invalidCases)('should return false for invalid date string %s', (date) => {
    expect(isValidISODateOnlyString(date)).toEqual(false);
  });
});
