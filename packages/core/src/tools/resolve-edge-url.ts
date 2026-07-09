import {
  SITECORE_EDGE_PLATFORM_URL_DEFAULT,
  SITECORE_EXPERIENCE_EDGE_URL_DEFAULT,
} from '../constants';
import { normalizeEnvValue } from './normalize-env-value';
import { normalizeUrl } from './normalize-url';

/**
 * Environment variable name for the custom Edge Platform hostname (framework-agnostic).
 * Used for service endpoints (GraphQL, APIs, forms). Server-side only.
 * @public
 */
export const SITECORE_EDGE_PLATFORM_HOSTNAME_ENV = 'SITECORE_EDGE_PLATFORM_HOSTNAME';

/**
 * Environment variable name for the custom Experience Edge hostname.
 * Used only when rewriting media URLs in layout/editing (rewrite-edge-host). Server-side only.
 * @public
 */
export const SITECORE_EXPERIENCE_EDGE_HOSTNAME_ENV = 'SITECORE_EXPERIENCE_EDGE_HOSTNAME';

/**
 * Resolves the Sitecore Edge URL based on configuration and environment.
 *
 * Priority order:
 * 1. Explicit `edgeUrl` parameter (if provided and not empty)
 * 2. `SITECORE_EDGE_PLATFORM_HOSTNAME` environment variable
 * 3. Default Edge Platform URL (`https://edge-platform.sitecorecloud.io`)
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
  const explicit = normalizeEnvValue(edgeUrl);
  if (explicit) {
    return normalizeUrl(explicit);
  }

  const runtimeEnv = typeof process !== 'undefined' ? process.env : {};

  // Check for custom hostname env var
  const hostnameEnvVar = normalizeEnvValue(runtimeEnv[SITECORE_EDGE_PLATFORM_HOSTNAME_ENV]);
  if (hostnameEnvVar) {
    return normalizeHostnameToUrl(hostnameEnvVar);
  }

  return SITECORE_EDGE_PLATFORM_URL_DEFAULT;
}

/**
 * Resolves the Experience Edge URL for media URL rewriting.
 * Use only when rewriting media URLs in layout/editing (e.g. rewriteEdgeHostInResponse).
 * Priority: SITECORE_EXPERIENCE_EDGE_HOSTNAME env, then default (edge.sitecorecloud.io).
 * Server-side only.
 * @returns {string} The Experience Edge base URL (no trailing slash)
 * @public
 */
export function resolveExperienceEdgeUrl(): string {
  if (process) {
    const hostnameEnvVar = normalizeEnvValue(process.env[SITECORE_EXPERIENCE_EDGE_HOSTNAME_ENV]);
    if (hostnameEnvVar) {
      return normalizeHostnameToUrl(hostnameEnvVar);
    }
  } else {
    console.warn(
      'Attempted to read SITECORE_EXPERIENCE_EDGE_HOSTNAME_ENV from process.env, but process is undefined'
    );
  }

  return SITECORE_EXPERIENCE_EDGE_URL_DEFAULT;
}

/**
 * Resolves the Edge URL for static files (e.g. stylesheets) by ignoring the custom hostname.
 * Use this when the custom host does not serve static file paths (e.g. /v1/files/...).
 * Returns the default Edge Platform URL.
 * @returns {string} The Edge Platform base URL for static files (no trailing slash)
 * @public
 */
export function resolveEdgeUrlForStaticFiles(): string {
  return SITECORE_EDGE_PLATFORM_URL_DEFAULT;
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
