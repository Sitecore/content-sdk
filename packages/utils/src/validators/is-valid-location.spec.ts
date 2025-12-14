import { isValidLocation } from './is-valid-location';
import { it } from '@jest/globals';

describe('location', () => {
  const invalidLons = [-190, 190];
  const validLons = [-60, 60, -60.15, 60.15, -180, 180];
  const invalidLats = [-100, 100];
  const validLats = [-60, 60, -60.15, 60.15, 90, -90];

  it.each(validLons)(`should return true for valid longitudes`, (lon) => {
    const expected = { latitude: true, longitude: true };

    const result = isValidLocation({ latitude: 60, longitude: lon });

    expect(result).toEqual(expected);
  });

  it.each(validLats)(`should return true for valid latitudes`, (lat) => {
    const expected = { latitude: true, longitude: true };

    const result = isValidLocation({ latitude: lat, longitude: 60 });

    expect(result).toEqual(expected);
  });

  it.each(invalidLats)(`should return false if invalid latitudes`, (lat) => {
    const expected = { latitude: false, longitude: true };

    const result = isValidLocation({ latitude: lat, longitude: 60 });

    expect(result).toEqual(expected);
  });

  it.each(invalidLons)(`should return false if invalid longitudes`, (lon) => {
    const expected = { latitude: true, longitude: false };

    const result = isValidLocation({ latitude: 60, longitude: lon });

    expect(result).toEqual(expected);
  });
});
