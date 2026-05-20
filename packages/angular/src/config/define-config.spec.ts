import { describe, it, expect, vi, afterEach } from 'vitest';
import * as contentConfig from '@sitecore-content-sdk/content/config';
import { defineConfig } from './define-config';

describe('defineConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('merges clientEnv with process.env into content defineConfig', () => {
    vi.stubEnv('SITECORE_EDITING_SECRET', 'secret-from-process');
    const spy = vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({} as contentConfig.SitecoreConfig);

    defineConfig({ defaultSite: 'explicit' }, { CSDK_PUBLIC_FOO: 'from-client' });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      { defaultSite: 'explicit' },
      expect.objectContaining({
        CSDK_PUBLIC_FOO: 'from-client',
        SITECORE_EDITING_SECRET: 'secret-from-process',
      })
    );
  });

  it('lets process.env override duplicate keys from clientEnv', () => {
    vi.stubEnv('SITECORE_EDGE_CONTEXT_ID', 'from-process');
    const spy = vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({} as contentConfig.SitecoreConfig);

    defineConfig({}, { SITECORE_EDGE_CONTEXT_ID: 'from-client' });

    const secondArg = spy.mock.calls[0][1] as Record<string, string | undefined>;
    expect(secondArg.SITECORE_EDGE_CONTEXT_ID).toBe('from-process');
  });
});
