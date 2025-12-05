/**
 * Returns the uppercase language code of the current web page's root HTML element, using the `lang` attribute.
 * If unavailable or invalid, undefined is returned.
 * @returns The language attribute or undefined.
 */
export function language() {
  return typeof window === 'undefined' || window.document.documentElement.lang.length <= 1
    ? undefined
    : new Intl.Locale(window.document.documentElement.lang).language.toLocaleUpperCase();
}

/**
 * Returns the name of the current page extracted from the URL's pathname.
 * If it's the home page, it returns `Home Page`.
 * @returns `Home Page` if root, otherwise the pathname segment.
 */
export function pageName() {
  if (typeof window === 'undefined') return '';

  return window.location.pathname === '/'
    ? 'Home Page'
    : (window.location.pathname.split('/').pop() as string);
}
