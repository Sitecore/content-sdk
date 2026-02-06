/**
 * Validates whether a URL string uses the HTTP or HTTPS protocol.
 * @param {string} url The URL to validate.
 * @returns {boolean} True when the URL is valid and uses HTTP or HTTPS.
 * @internal
 */
export function isValidHttpURL(url: string): boolean {
  try {
    const givenURL = new URL(url);
    return ['http:', 'https:'].includes(givenURL.protocol);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return false;
  }
}
