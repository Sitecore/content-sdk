/**
 * Deletes a cookie from the document (client-side only).
 * @param {string} cookieName The cookie to be deleted.
 */
export function deleteCookie(cookieName: string): void {
  document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
