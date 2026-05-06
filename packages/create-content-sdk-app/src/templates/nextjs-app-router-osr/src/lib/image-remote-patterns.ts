/**
 * Shared image allowlist for `next.config` and runtime helpers (e.g. FEAAS `next/image` wiring).
 * Keep this separate from `next.config.ts` so components never import the Next config file
 * (which would pull build-only code such as `next-intl/plugin` into the Sitecore import map).
 */
export const imageRemotePatterns = [
  {
    protocol: 'https' as const,
    hostname: 'edge*.**',
    port: '',
  },
  {
    protocol: 'https' as const,
    hostname: 'xmc-*.**',
    port: '',
  },
];
