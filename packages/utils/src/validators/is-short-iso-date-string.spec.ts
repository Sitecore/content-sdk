import { isShortISODateString } from './is-short-iso-date-string';
import { expect, it, describe, jest } from '@jest/globals';

describe('isShortISODateString', () => {
  it('should return false if the date string is short', () => {
    const result = isShortISODateString('2022');
    expect(result).toEqual(false);
  });
  it('should return false if the date string is empty', () => {
    const result = isShortISODateString('');
    expect(result).toEqual(false);
  });

  it('should return false if the string length too long', () => {
    const result = isShortISODateString('2022-01-01T00:00:00.000Z');
    expect(result).toEqual(false);
  });

  it('should return false if the date string is invalid', () => {
    const result = isShortISODateString('TEST0DA0TET0X:0X');
    expect(result).toEqual(false);
  });

  it('should return false if a valid date and length but not format is provided', () => {
    const result = isShortISODateString('Tue Oct 18 2022 ');
    expect(result).toEqual(false);
  });

  it('should return true if the date string is valid and in the correct format', () => {
    const result = isShortISODateString('2022-01-01T00:00');
    expect(result).toEqual(true);
  });
  it('should include Z in the creation of the Date', () => {
    const dateSpy = jest.spyOn(globalThis, 'Date');
    isShortISODateString('2022-01-01T00:00');

    expect(dateSpy).toHaveBeenCalledWith('2022-01-01T00:00Z');
  });
});
