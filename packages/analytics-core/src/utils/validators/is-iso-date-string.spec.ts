import { isISODateString, normalizeToISODateString } from './is-iso-date-string';
import { it, expect, describe } from '@jest/globals';

describe('isISODateString', () => {
  const validDates = ['1989-03-14', '2022-01-01', '2020-02-29', '1999-12-31'];

  const invalidDates = [
    '',
    '2022',
    '1989-3-14',
    '1989-03-14T00:00',
    '1989-03-14T00:00:00.000Z',
    '2022-02-30',
    'TEST-TEST-TEST',
    'Tue Oct 18 2022',
    '03-14-1989',
  ];

  it.each(validDates)(
    'should return true when a valid ISO date string is provided (%s)',
    (date) => {
      expect(isISODateString(date)).toEqual(true);
    }
  );

  it.each(invalidDates)(
    'should return false when an invalid ISO date string is provided (%s)',
    (date) => {
      expect(isISODateString(date)).toEqual(false);
    }
  );
});

describe('normalizeToISODateString', () => {
  it('should return date-only values unchanged', () => {
    expect(normalizeToISODateString('1989-03-14')).toEqual('1989-03-14');
  });

  it('should normalize shortened datetime values to YYYY-MM-DD', () => {
    expect(normalizeToISODateString('1989-03-14T00:00')).toEqual('1989-03-14');
  });
});
