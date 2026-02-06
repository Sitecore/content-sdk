/**
 * Checks if the given string is a valid ISO date string.
 * @param {string} date - The date string to validate.
 * @returns True if the string is a valid ISO date string, otherwise false.
 * @internal
 */
export function isISODateString(date: string): boolean {
  try {
    const convertedDate = new Date(date).toISOString();

    return convertedDate === date;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return false;
  }
}
