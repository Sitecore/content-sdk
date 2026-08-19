import { SearchService } from '../src/search-service';

export const DEFAULT_EDGE_URL = 'https://edge-platform.sitecorecloud.io';
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

export const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    console.error(`${name} is required (looked in scratch/.env or the shell environment)`);
    process.exit(1);
  }

  return value;
};

export const parseNonNegativeInteger = (
  raw: string | undefined,
  fallback: number,
  name: string
): number => {
  if (raw === undefined || raw === '') {
    return fallback;
  }

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 0) {
    console.error(`${name} must be a non-negative integer`);
    process.exit(1);
  }

  return parsed;
};

export const getEdgeUrl = (): string => process.env.EDGE_URL || DEFAULT_EDGE_URL;

export const getLocale = (): string | undefined => process.env.LOCALE || undefined;

export const createSearchService = (): SearchService =>
  new SearchService({
    contextId: requireEnv('SITECORE_CONTEXT_ID'),
    edgeUrl: getEdgeUrl(),
  });

export const exitWithError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
};
