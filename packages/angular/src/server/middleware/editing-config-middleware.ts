import {
  EDITING_ALLOWED_ORIGINS,
  QUERY_PARAM_EDITING_SECRET,
} from '@sitecore-content-sdk/content/editing';
import { EditMode } from '@sitecore-content-sdk/content/layout';
import { getEnforcedCorsHeaders } from '@sitecore-content-sdk/core/tools';
import type { Metadata } from '@sitecore-content-sdk/core/node-tools';
import { ExpressMiddleware, ExpressNextFunction, ExpressRequest, ExpressResponse } from '../models';
import type { ComponentMap } from '../../components/types';
import { readProcessEnv } from '../utils';
import debug from '../../debug';

const DEFAULT_ENDPOINT = '/api/editing/config';
const EMPTY_METADATA: Metadata = { packages: {} };

/**
 * Factory that dynamically imports application metadata (typically
 * `.sitecore/metadata.json` emitted by `sitecore-tools`).
 * @public
 */
export type MetadataImportFn = () => Promise<{ default: Metadata } | Metadata>;

/**
 * Options for {@link createEditingConfigMiddleware}.
 * @public
 */
export interface CreateEditingConfigMiddlewareOptions {
  /**
   * Component map registered with the Angular app
   * (the same map provided to `SITECORE_COMPONENT_MAP`).
   */
  components: ComponentMap;
  /**
   * Inline metadata. When set, {@link metadataImport} is ignored.
   * When neither `metadata` nor `metadataImport` is provided, the middleware
   * responds with `{ packages: {} }`.
   */
  metadata?: Metadata;
  /**
   * Optional dynamic import for metadata (e.g. from `.sitecore/metadata.json`).
   * Use {@link createSitecoreMetadataImport} to build the conventional path
   * relative to `server.ts`. Import failures fall back to empty packages.
   */
  metadataImport?: MetadataImportFn;
  /**
   * Editing secret to validate. Defaults to the `SITECORE_EDITING_SECRET`
   * environment variable.
   */
  editingSecret?: string;
  /** Endpoint path; default `/api/editing/config`. */
  endpoint?: string;
}

/**
 * Builds a dynamic import factory for `.sitecore/metadata.json` relative to the
 * server entry module (`import.meta.url`).
 * @param {string} serverModuleUrl - Pass `import.meta.url` from `server.ts`.
 * @param {string} [relativePath] - Path relative to the server module.
 * @returns {MetadataImportFn} Import factory for {@link createEditingConfigMiddleware}.
 * @public
 */
export function createSitecoreMetadataImport(
  serverModuleUrl: string,
  relativePath = '../.sitecore/metadata.json'
): MetadataImportFn {
  const metadataUrl = new URL(relativePath, serverModuleUrl).href;
  return () => import(/* @vite-ignore */ metadataUrl);
}

/**
 * Resolves the configured editing secret with fallback to env.
 * @param {string | undefined} option - Explicit secret from middleware options.
 * @returns {string | undefined} Resolved secret value.
 * @internal
 */
export function resolveConfiguredEditingSecret(option: string | undefined): string | undefined {
  const raw = option !== undefined ? option : readProcessEnv('SITECORE_EDITING_SECRET');
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

/**
 * Normalizes a dynamic import result into {@link Metadata}.
 * @param {unknown} module - Imported module value.
 * @returns {Metadata} Parsed metadata or empty packages.
 * @internal
 */
export function normalizeImportedMetadata(module: unknown): Metadata {
  if (!module || typeof module !== 'object') {
    return EMPTY_METADATA;
  }
  const record = module as { default?: Metadata; packages?: Metadata['packages'] };
  const data = record.default ?? record;
  return {
    packages: { ...(data.packages ?? {}) },
  };
}

/**
 * Express middleware that serves the editing config endpoint
 * (default path: `/api/editing/config`). Returns the registered component names,
 * package versions, and the configured edit mode.
 * @param {CreateEditingConfigMiddlewareOptions} options - Middleware options.
 * @returns {ExpressMiddleware} The middleware function.
 * @public
 */
export function createEditingConfigMiddleware(
  options: CreateEditingConfigMiddlewareOptions
): ExpressMiddleware {
  const {
    components,
    metadata: inlineMetadata,
    metadataImport,
    endpoint = DEFAULT_ENDPOINT,
  } = options;

  let cachedMetadata: Metadata | undefined = inlineMetadata;
  let metadataLoadPromise: Promise<Metadata> | undefined;

  const resolveMetadata = (): Promise<Metadata> => {
    if (cachedMetadata) {
      return Promise.resolve(cachedMetadata);
    }
    if (!metadataLoadPromise) {
      metadataLoadPromise = (async () => {
        if (!metadataImport) {
          cachedMetadata = EMPTY_METADATA;
          return cachedMetadata;
        }
        try {
          const loaded = await metadataImport();
          cachedMetadata = normalizeImportedMetadata(loaded);
          debug.editing('metadata import succeeded: %o', {
            packages: Object.keys(cachedMetadata.packages).length,
          });
        } catch (err) {
          debug.editing('metadata import failed, using empty packages: %o', err);
          cachedMetadata = EMPTY_METADATA;
        }
        return cachedMetadata;
      })();
    }
    return metadataLoadPromise;
  };

  return async (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) => {
    if (req.path !== endpoint) {
      next();
      return;
    }

    debug.editing('editing config middleware start: %o', {
      method: req.method,
      query: req.query,
      headers: req.headers,
    });

    const corsHeaders = getEnforcedCorsHeaders({
      requestMethod: req.method,
      headers: (req.headers ?? {}) as Record<string, string | string[] | undefined>,
      allowedOrigins: EDITING_ALLOWED_ORIGINS,
    });

    if (!corsHeaders) {
      debug.editing(
        'invalid origin host - set allowed origins in JSS_ALLOWED_ORIGINS environment variable'
      );
      res.status(401).json({ message: 'Invalid origin' });
      return;
    }

    if (typeof res.setHeader === 'function') {
      Object.keys(corsHeaders).forEach((key) => {
        res.setHeader!(key, corsHeaders[key]);
      });
    }

    const query = (req.query ?? {}) as Record<string, string | string[] | undefined>;
    const secretParam = query[QUERY_PARAM_EDITING_SECRET];
    const secret = Array.isArray(secretParam) ? secretParam[0] : secretParam;
    const configuredSecret = resolveConfiguredEditingSecret(options.editingSecret);

    if (!configuredSecret || secret !== configuredSecret) {
      debug.editing('invalid editing secret - sent "%s" expected "%s"', secret, configuredSecret);
      res.status(401).json({ message: 'Missing or invalid editing secret' });
      return;
    }

    if (req.method === 'OPTIONS') {
      debug.editing('preflight request');
      res.status(204);
      if (typeof res.send === 'function') {
        res.send(null);
      } else {
        res.json(null);
      }
      return;
    }

    const metadata = await resolveMetadata();

    debug.editing('editing config response: %o', {
      components: components.size,
      packages: Object.keys(metadata.packages).length,
    });

    res.status(200).json({
      components: Array.from(components.keys()),
      packages: { ...metadata.packages },
      editMode: EditMode.Metadata,
    });
  };
}
