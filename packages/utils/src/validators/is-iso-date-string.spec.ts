import { isISODateString } from './is-iso-date-string';

describe('isISODateString', () => {
  it('should return false if the date string is short', () => {
    const result = isISODateString('2022');
    expect(result).toEqual(false);
  });
  it('should return false if the date string is empty', () => {
    const result = isISODateString('');
    expect(result).toEqual(false);
  });

  it('should return false if the date string is invalid', () => {
    const result = isISODateString('TEST0DA0TET0X:0X');
    expect(result).toEqual(false);
  });

  it('should return false if a valid date and length is passed but not properly formatted', () => {
    const result = isISODateString('Tue Oct 18 2022 ');
    expect(result).toEqual(false);
  });

  it('should return true if the date string is valid and in the correct format', () => {
    const result = isISODateString('2022-01-01T00:00:00.000Z');
    expect(result).toEqual(true);
  });
});
