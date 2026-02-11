/**
 * Checks whether the provided coordinates fall within valid latitude and longitude ranges.
 * @param {Location} location The location to validate.
 * @returns {LocationValidity} Flags indicating whether each coordinate is valid.
 * @internal
 */
export function isValidLocation(location: Location): LocationValidity {
  return {
    latitude: !(location.latitude > 90 || location.latitude < -90),
    longitude: !(location.longitude > 180 || location.longitude < -180),
  };
}

/**
 * Represents a geographic location with latitude and longitude.
 * @internal
 */
export type Location = {
  latitude: number;
  longitude: number;
};

/**
 * Represents the validity of latitude and longitude coordinates.
 * @internal
 */
export type LocationValidity = {
  latitude: boolean;
  longitude: boolean;
};
