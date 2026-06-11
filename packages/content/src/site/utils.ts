/**
 * Site prefix for rewrite path
 * @public
 */
export const SITE_PREFIX = '_site_';

/**
 * Site key for cookie and query string parameter access
 * @public
 */
export const SITE_KEY = 'sc_site';

/**
 * Object model of site rewrite data
 * @public
 */
export type SiteRewriteData = {
  siteName: string;
};

/**
 * Hostname from a `Host` or `x-forwarded-host` value, without port.
 * - `[::1]:3000` → `::1`
 * - `127.0.0.1:3000` → `127.0.0.1`
 * - `example.com:443` → `example.com`
 * - `::1` → `::1` (does not treat `:1` as a port)
 * @param {string} host - Raw header value
 */
export function getHostnameFromHostHeader(host: string): string {
  const trimmed = host.trim();

  // Bracketed IPv6: "[...]:port" or "[...]"
  if (trimmed.startsWith('[')) {
    const end = trimmed.indexOf(']');
    if (end !== -1) {
      return trimmed.slice(1, end).toLowerCase();
    }
  }

  // Unbracketed IPv6 (e.g. ::1, 2001:db8::1) — never strip on last ":digits"
  if (trimmed.includes('::')) {
    return trimmed.toLowerCase();
  }

  // IPv4 or DNS name with ":port" (port = decimal digits only)
  const lastColon = trimmed.lastIndexOf(':');
  if (lastColon > 0) {
    const after = trimmed.slice(lastColon + 1);
    if (/^\d+$/.test(after)) {
      return trimmed.slice(0, lastColon).toLowerCase();
    }
  }

  return trimmed.toLowerCase();
}

/**
 * Get a site rewrite path for given pathname
 * @param {string} pathname the pathname
 * @param {SiteRewriteData} data the site data to include in the rewrite
 * @returns {string} the rewrite path
 * @public
 */
export function getSiteRewrite(pathname: string, data: SiteRewriteData): string {
  const path = pathname.startsWith('/') ? pathname : '/' + pathname;

  return `/${SITE_PREFIX}${data.siteName}${path}`;
}

/**
 * Get site data from the rewrite path
 * @param {string} pathname the pathname
 * @param {string} defaultSiteName the default site name
 * @returns {SiteRewriteData} the site data from the rewrite
 * @public
 */
export function getSiteRewriteData(pathname: string, defaultSiteName: string): SiteRewriteData {
  const data: SiteRewriteData = {
    siteName: defaultSiteName,
  };

  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  const result = path.match(`${SITE_PREFIX}(.*?)\\/`);

  if (result && result[1] !== '') {
    data.siteName = result[1];
  }

  return data;
}

/**
 * Normalize a site rewrite path (remove site data)
 * @param {string} pathname the pathname
 * @returns {string} the pathname with site data removed
 * @public
 */
export function normalizeSiteRewrite(pathname: string): string {
  const result = pathname.match(`${SITE_PREFIX}.*?(?:\\/|$)`);

  return result === null ? pathname : pathname.replace(result[0], '');
}
