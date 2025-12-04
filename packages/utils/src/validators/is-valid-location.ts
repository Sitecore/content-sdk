/**
 * Checks if the provided location object has valid latitude and longitude values
 * @param location - The location object
 * @returns - An object containing booleans per attribute
 */
export function isValidLocation(location: { latitude: number; longitude: number }) {
  return {
    latitude: !(location.latitude > 90 || location.latitude < -90),
    longitude: !(location.longitude > 180 || location.longitude < -180),
  };
}
