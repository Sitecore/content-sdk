import { isShortISODateString } from './is-short-iso-date-string';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks if the provided string matches the ISO 8601 date format (`YYYY-MM-DD`).
 * @param {string} date The date string to validate.
 * @returns {boolean} True when the value conforms to the ISO date format.
 * @internal
 */
export function isISODateString(date: string): boolean {
  if (!ISO_DATE_PATTERN.test(date)) {
    return false;
  }

  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/**
 * Normalizes a date or shortened datetime string to ISO 8601 date format (`YYYY-MM-DD`).
 * @param {string} date The date or datetime string to normalize.
 * @returns {string} The normalized ISO date string.
 * @internal
 */
export function normalizeToISODateString(date: string): string {
  if (isISODateString(date)) {
    return date;
  }

  if (isShortISODateString(date)) {
    return date.substring(0, 10);
  }

  return date;
}
