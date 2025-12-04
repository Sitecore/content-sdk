/**
 *
 * @param email - the email string to be validated
 * @returns - a boolean value depending on whether the email value passed is valid
 */
export function isValidEmail(email: string): boolean {
  const regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regx.test(email);
}
