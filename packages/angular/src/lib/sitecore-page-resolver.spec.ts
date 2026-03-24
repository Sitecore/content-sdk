/* eslint-disable jsdoc/require-jsdoc */
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { SitecoreConfig } from '@sitecore-content-sdk/content/config';
import type { Page, SitecoreClient } from '@sitecore-content-sdk/content/client';
import { SitecorePageResolver } from './sitecore-page-resolver';
import { SITECORE_CLIENT_TOKEN, SITECORE_CONFIG_TOKEN } from './tokens';

describe('SitecorePageResolver', () => {
  let resolver: SitecorePageResolver;
  let getPage: ReturnType<typeof vi.fn>;

  const mockConfig = {
    defaultSite: 'test-site',
    defaultLanguage: 'en',
  } as SitecoreConfig;

  function setupTestBed() {
    getPage = vi.fn().mockResolvedValue(null);
    const mockClient = { getPage } as unknown as SitecoreClient;

    TestBed.configureTestingModule({
      providers: [
        SitecorePageResolver,
        { provide: SITECORE_CONFIG_TOKEN, useValue: mockConfig },
        { provide: SITECORE_CLIENT_TOKEN, useValue: mockClient },
      ],
    });
    resolver = TestBed.inject(SitecorePageResolver);
  }

  beforeEach(() => {
    setupTestBed();
  });

  it('should expose injected config via sitecoreConfig', () => {
    expect(resolver.sitecoreConfig).toBe(mockConfig);
    expect(resolver.sitecoreConfig.defaultSite).toBe('test-site');
    expect(resolver.sitecoreConfig.defaultLanguage).toBe('en');
  });

  it('should call getPage with path and empty page options when options omitted', async () => {
    await resolver.resolvePage('/home');

    expect(getPage).toHaveBeenCalledTimes(1);
    expect(getPage).toHaveBeenCalledWith('/home', {});
  });

  it('should pass locale when options.locale is set', async () => {
    await resolver.resolvePage('/path', { locale: 'da-DK' });

    expect(getPage).toHaveBeenCalledWith('/path', { locale: 'da-DK' });
  });

  it('should pass site when options.site is set', async () => {
    await resolver.resolvePage('/path', { site: 'other-site' });

    expect(getPage).toHaveBeenCalledWith('/path', { site: 'other-site' });
  });

  it('should pass both locale and site when both set', async () => {
    await resolver.resolvePage('/x', { locale: 'fr', site: 'fr-site' });

    expect(getPage).toHaveBeenCalledWith('/x', { locale: 'fr', site: 'fr-site' });
  });

  it('should omit locale when options.locale is empty string', async () => {
    await resolver.resolvePage('/path', { locale: '' });

    expect(getPage).toHaveBeenCalledWith('/path', {});
  });

  it('should return the Page from getPage', async () => {
    const page = { locale: 'en', layout: {} } as unknown as Page;
    getPage.mockResolvedValueOnce(page);

    const result = await resolver.resolvePage('/p');

    expect(result).toBe(page);
  });
});
