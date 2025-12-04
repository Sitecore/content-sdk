/**
 * Validates whether the provided value matches a basic email pattern.
 * @param {string} email Email candidate to test.
 * @returns {boolean} True when the email matches the allowed pattern.
 */
export function isValidEmail(email: string): boolean {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regx.test(email);
}
