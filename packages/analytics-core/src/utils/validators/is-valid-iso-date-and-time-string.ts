/**
 * Checks if the provided string matches the shortened date and time ISO 8601 format (`YYYY-MM-DDThh:mm`).
 * @param {string} date The date string to validate.
 * @returns {boolean} True when the value conforms to the shortened ISO format.
 * @internal
 */
export function isValidISODateAndTimeString(date: string): boolean {
  try {
    const dateString = date + 'Z';
    const convertedDate = new Date(dateString).toISOString().substring(0, 16);

    return convertedDate === date;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
}
