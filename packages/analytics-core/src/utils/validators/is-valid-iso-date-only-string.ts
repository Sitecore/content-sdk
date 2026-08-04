/**
 * Checks if the provided string matches the shortened date only ISO 8601 format (`YYYY-MM-DD`).
 * @param {string} date The date string to validate.
 * @returns {boolean} True when the value conforms to the shortened ISO format.
 * @internal
 */
export function isValidISODateOnlyString(date: string): boolean {
  try {
    const convertedDate = new Date(date).toISOString().substring(0, 10);

    return convertedDate === date;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
}
