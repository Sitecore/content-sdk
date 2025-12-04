/**
 * Checks if the provided string is a shortened version of ISO 8601 date format ‘YYYY-MM-DD’T’hh:mm’
 * @param date - The date string provided by the developer
 * @returns - A boolean if the string is valid otherwise false
 */
export function isShortISODateString(date: string) {
  try {
    const dateString = date + 'Z';
    const convertedDate = new Date(dateString).toISOString().substring(0, 16);

    return convertedDate === date;
  } catch (_) {
    return false;
  }
}
