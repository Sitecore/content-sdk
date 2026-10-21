import { isValidISODateAndTimeString } from './is-valid-iso-date-and-time-string';
import { jest, expect } from '@jest/globals';

describe('isValidISODateAndTimeString', () => {
  it('should return false if the date string is short', () => {
    const result = isValidISODateAndTimeString('2022');
    expect(result).toEqual(false);
  });
  it('should return false if the date string is empty', () => {
    const result = isValidISODateAndTimeString('');
    expect(result).toEqual(false);
  });

  it('should return false if the string length too long', () => {
    const result = isValidISODateAndTimeString('2022-01-01T00:00:00.000Z');
    expect(result).toEqual(false);
  });

  it('should return false if the date string is invalid', () => {
    const result = isValidISODateAndTimeString('TEST0DA0TET0X:0X');
    expect(result).toEqual(false);
  });

  it('should return false if a valid date and length but not format is provided', () => {
    const result = isValidISODateAndTimeString('Tue Oct 18 2022 ');
    expect(result).toEqual(false);
  });

  it('should return true if the date string is valid and in the correct format', () => {
    const result = isValidISODateAndTimeString('2022-01-01T00:00');
    expect(result).toEqual(true);
  });
  it('should include Z in the creation of the Date', () => {
    const dateSpy = jest.spyOn(globalThis, 'Date');
    isValidISODateAndTimeString('2022-01-01T00:00');

    expect(dateSpy).toHaveBeenCalledWith('2022-01-01T00:00Z');
  });
});
