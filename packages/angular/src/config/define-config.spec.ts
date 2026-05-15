import { describe, it, expect, vi, afterEach } from 'vitest';
import * as contentConfig from '@sitecore-content-sdk/content/config';
import { defineConfig, normalizeLocales, parseLocalesEnv } from './define-config';

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
      expect.objectContaining({
        defaultSite: 'explicit',
        defaultLanguage: 'en',
        redirects: { locales: ['en'] },
      }),
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

  it('mirrors locales to redirects.locales and extends config with locales array', () => {
    const spy = vi.spyOn(contentConfig, 'defineConfig').mockImplementation((input) => {
      return { ...(input as object), merged: true } as unknown as contentConfig.SitecoreConfig;
    });

    const result = defineConfig({ locales: ['fr', 'en'], defaultLanguage: 'en' }, {});

    expect(spy).toHaveBeenCalled();
    const passedInput = spy.mock.calls[0][0] as { redirects?: { locales?: string[] } };
    expect(passedInput.redirects?.locales).toEqual(['fr', 'en']);
    expect((result as { locales: string[] }).locales).toEqual(['fr', 'en']);
  });

  it('parseLocalesEnv splits comma list', () => {
    expect(parseLocalesEnv(' en , fr ')).toEqual(['en', 'fr']);
  });

  it('normalizeLocales prepends default when missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(normalizeLocales(['fr'], 'en')).toEqual(['en', 'fr']);
    warn.mockRestore();
  });
});
