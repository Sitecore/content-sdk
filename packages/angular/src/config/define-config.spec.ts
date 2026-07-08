import { describe, it, expect, vi, afterEach } from 'vitest';
import * as contentConfig from '@sitecore-content-sdk/content/config';
import { defineConfig } from './define-config';

describe('defineConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should merge clientEnv with process.env into content defineConfig', () => {
    vi.stubEnv('SITECORE_EDITING_SECRET', 'secret-from-process');
    const spy = vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

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

  it('should let process.env override duplicate keys from clientEnv', () => {
    vi.stubEnv('SITECORE_EDGE_CONTEXT_ID', 'from-process');
    const spy = vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    defineConfig({}, { SITECORE_EDGE_CONTEXT_ID: 'from-client' });

    const secondArg = spy.mock.calls[0][1] as Record<string, string | undefined>;
    expect(secondArg.SITECORE_EDGE_CONTEXT_ID).toBe('from-process');
  });

  it('should default angular.locales to [defaultLanguage] when not configured', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({});

    expect(result.angular.locales).toEqual(['en']);
  });

  it('should prepend defaultLanguage to angular.locales when missing', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({ angular: { locales: ['de', 'fr'] } });

    expect(result.angular.locales).toEqual(['en', 'de', 'fr']);
  });

  it('should not duplicate defaultLanguage when already present in angular.locales', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({ angular: { locales: ['de', 'en', 'fr'] } });

    expect(result.angular.locales).toEqual(['de', 'en', 'fr']);
  });

  it('should apply angular locales to redirect locales settings', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({ angular: { locales: ['en', 'de'] } });

    expect((result.redirects as unknown as { locales: string[] }).locales).toEqual(['en', 'de']);
  });

  it('should override redirect locale settings with angular settings', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'en',
      redirects: { enabled: true, locales: ['stale'] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({ angular: { locales: ['en', 'de'] } });

    expect((result.redirects as unknown as { locales: string[] }).locales).toEqual(['en', 'de']);
  });

  it('should honor a custom defaultLanguage when prepending to angular.locales', () => {
    vi.spyOn(contentConfig, 'defineConfig').mockReturnValue({
      defaultLanguage: 'de',
      redirects: { enabled: true, locales: [] },
    } as unknown as contentConfig.SitecoreConfig);

    const result = defineConfig({ angular: { locales: ['fr'] } });

    expect(result.angular.locales).toEqual(['de', 'fr']);
  });
});
