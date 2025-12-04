/**
 *
 * @param url - the url string to be validated
 * @returns - a boolean value depending on whether the url value passed is valid
 */
export function isValidHttpURL(url: string) {
  try {
    const givenURL = new URL(url);
    return ['http:', 'https:'].includes(givenURL.protocol);
  } catch (err) {
    return false;
  }
}
