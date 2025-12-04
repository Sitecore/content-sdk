/**
 * Get a locale rewrite path for given pathname
 * @param {string} pathname the pathname
 * @param {string} locale the site data to include in the rewrite
 * @returns {string} the rewrite path
 * @public
 */
export function getLocaleRewrite(pathname: string, locale: string): string {
  if (pathname === '/') return `/${locale}`;
  
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;

  return `/${locale}${path}`;
}
