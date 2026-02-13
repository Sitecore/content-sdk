import { SITECORE_EDGE_URL_DEFAULT } from '../constants';
import { normalizeUrl } from './normalize-url';

/**
 * Environment variable name for the custom Edge hostname.
 * Available on both server and client (e.g. NEXT_PUBLIC_* in Next.js).
 * @public
 */
export const SITECORE_EDGE_HOSTNAME_PUBLIC_ENV = 'NEXT_PUBLIC_SITECORE_EDGE_HOSTNAME';

/**
 * Environment variable name for the Edge URL override.
 * @public
 */
export const SITECORE_EDGE_URL_ENV = 'SITECORE_EDGE_URL';

/**
 * Environment variable name for the Edge URL override (client-side / browser).
 * @public
 */
export const SITECORE_EDGE_URL_PUBLIC_ENV = 'NEXT_PUBLIC_SITECORE_EDGE_URL';

/**
 * Resolves the Sitecore Edge URL based on environment variables and configuration.
 *
 * Priority order:
 * 1. Explicit `edgeUrl` parameter (if provided and not empty)
 * 2. `NEXT_PUBLIC_SITECORE_EDGE_HOSTNAME` environment variable
 * 3. `SITECORE_EDGE_URL` / `NEXT_PUBLIC_SITECORE_EDGE_URL` environment variable
 * 4. Default Edge Platform URL (`https://edge-platform.sitecorecloud.io`)
 *
 * The hostname env var can be provided as:
 * - Full URL: `https://my-custom-edge.example.com`
 * - Hostname only: `my-custom-edge.example.com` (will be prefixed with `https://`)
 * @param {string} [edgeUrl] - Optional explicit Edge URL to use (takes precedence if provided)
 * @returns {string} The resolved Edge Platform base URL (normalized, no trailing slash)
 * @public
 * @example
 * resolveEdgeUrl() // => 'https://my-tenant.edge.example.com'
 * @example
 * resolveEdgeUrl('https://custom.edge.com') // => 'https://custom.edge.com'
 * @example
 * resolveEdgeUrl() // => 'https://edge-platform.sitecorecloud.io'
 */
export function resolveEdgeUrl(edgeUrl?: string): string {
  // Use explicit edgeUrl if provided and not empty
  const explicit = normalizeMaybeEnvValue(edgeUrl);
  if (explicit) {
    return normalizeUrl(explicit);
  }

  // Check for custom hostname env var (available on both server and client)
  const hostnameEnvVarRaw = process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV];
  const hostnameEnvVar = normalizeMaybeEnvValue(hostnameEnvVarRaw);
  if (hostnameEnvVar) {
    return normalizeHostnameToUrl(hostnameEnvVar);
  }

  // Check for Edge URL env var
  const isBrowser = typeof window !== 'undefined';
  const urlEnvVarRaw = isBrowser
    ? process.env[SITECORE_EDGE_URL_PUBLIC_ENV]
    : process.env[SITECORE_EDGE_URL_ENV] || process.env[SITECORE_EDGE_URL_PUBLIC_ENV];

  const urlEnvVar = normalizeMaybeEnvValue(urlEnvVarRaw);
  if (urlEnvVar) {
    return normalizeUrl(urlEnvVar);
  }

  // Fall back to default
  return SITECORE_EDGE_URL_DEFAULT;
}

/**
 * Resolves the Edge URL for static files (e.g. stylesheets) by ignoring the custom hostname.
 * Use this when the custom host does not serve static file paths (e.g. /v1/files/...).
 * Priority: SITECORE_EDGE_URL / NEXT_PUBLIC_SITECORE_EDGE_URL env, then default.
 * @returns {string} The Edge Platform base URL for static files (no trailing slash)
 * @public
 */
export function resolveEdgeUrlForStaticFiles(): string {
  const isBrowser = typeof window !== 'undefined';
  const urlEnvVarRaw = isBrowser
    ? process.env[SITECORE_EDGE_URL_PUBLIC_ENV]
    : process.env[SITECORE_EDGE_URL_ENV] || process.env[SITECORE_EDGE_URL_PUBLIC_ENV];
  const urlEnvVar = normalizeMaybeEnvValue(urlEnvVarRaw);
  if (urlEnvVar) {
    return normalizeUrl(urlEnvVar);
  }
  return SITECORE_EDGE_URL_DEFAULT;
}

/**
 * Normalizes a hostname or URL to a full HTTPS URL without trailing slash.
 * @param {string} hostnameOrUrl - A hostname (e.g., 'my.domain.com') or full URL (e.g., 'https://my.domain.com')
 * @returns {string} A normalized HTTPS URL
 * @internal
 */
function normalizeHostnameToUrl(hostnameOrUrl: string): string {
  const trimmed = hostnameOrUrl.trim();

  // If it already has a protocol, normalize and return
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return normalizeUrl(trimmed);
  }

  // Otherwise, treat as hostname and add https://
  return normalizeUrl(`https://${trimmed}`);
}

/**
 * Normalizes values that may come from environment variables.
 * In Node, setting `process.env.FOO = undefined` results in the string 'undefined',
 * which should be treated as if the variable is not set.
 * @param {string | undefined} value - Possibly undefined env-like value
 * @returns {string | undefined} A usable string value, or undefined if not meaningful
 * @internal
 */
function normalizeMaybeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const lowered = trimmed.toLowerCase();
  if (lowered === 'undefined' || lowered === 'null') return undefined;

  return trimmed;
}

/**
 * Checks if a custom Edge hostname is configured via environment variables.
 * @returns {boolean} True if a custom hostname is configured
 * @public
 */
export function hasCustomEdgeHostname(): boolean {
  return !!normalizeMaybeEnvValue(process.env[SITECORE_EDGE_HOSTNAME_PUBLIC_ENV]);
}

/**
 * Gets the custom Edge hostname if configured, otherwise returns undefined.
 * @returns {string | undefined} The custom Edge URL if configured, undefined otherwise
 * @public
 */
export function getCustomEdgeUrl(): string | undefined {
  if (!hasCustomEdgeHostname()) {
    return undefined;
  }

  return resolveEdgeUrl();
}
