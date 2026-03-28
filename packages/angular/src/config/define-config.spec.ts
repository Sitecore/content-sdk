import { describe, it, expect, vi, afterEach } from 'vitest';
import * as contentConfig from '@sitecore-content-sdk/content/config';
import { angularEnvToConfig } from './define-config';

describe('angularEnvToConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass input env into buildFallbackConfig', () => {
    const spy = vi.spyOn(contentConfig, 'buildFallbackConfig');
    const env = {
      NODE_ENV: 'production',
      SITECORE_EDGE_CONTEXT_ID: 'ctx-1',
      SITECORE_EDGE_PLATFORM_HOSTNAME: 'https://edge.example.com',
      SITECORE_DEFAULT_SITE: 'site-a',
    };

    angularEnvToConfig(env);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...env,
        SITECORE_EDGE_CLIENT_CONTEXT_ID: 'ctx-1',
      })
    );
  });

  it('should set fallback value for SITECORE_EDGE_CLIENT_CONTEXT_ID if not provided', () => {
    const env = {
      NODE_ENV: 'development',
      SITECORE_EDGE_CONTEXT_ID: 'server-context-only',
      SITECORE_EDGE_PLATFORM_HOSTNAME: 'https://edge.example.com',
    };

    const result = angularEnvToConfig(env);

    expect(result.api.edge.contextId).toBe('server-context-only');
    expect(result.api.edge.clientContextId).toBe('server-context-only');
  });

  it('should keep SITECORE_EDGE_CLIENT_CONTEXT_ID when explicitly provided', () => {
    const env = {
      NODE_ENV: 'production',
      SITECORE_EDGE_CONTEXT_ID: 'server-ctx',
      SITECORE_EDGE_CLIENT_CONTEXT_ID: 'client-ctx',
      SITECORE_EDGE_PLATFORM_HOSTNAME: 'https://edge.example.com',
    };

    const result = angularEnvToConfig(env);

    expect(result.api.edge.contextId).toBe('server-ctx');
    expect(result.api.edge.clientContextId).toBe('client-ctx');
  });
});
