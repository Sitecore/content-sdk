/**
 * Validates whether the provided value matches a basic email pattern.
 * @param {string} email The email address to validate.
 * @returns {boolean} True when the email matches the allowed pattern.
 * @internal
 */
export function isValidEmail(email: string): boolean {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!email || email.length > 320) {
    return false;
  }

  return regx.test(email);
}
