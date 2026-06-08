/* eslint-disable jsdoc/require-jsdoc */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Page, SitecoreClient } from '@sitecore-content-sdk/content/client';
import type { EditingPreviewData } from '@sitecore-content-sdk/content/editing';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';
import { resolveSitecorePage } from './sitecore-page-resolver';
import { AngularSitecoreConfig } from '../config/define-config';

describe('resolveSitecorePage', () => {
  let getPage: ReturnType<typeof vi.fn>;
  let getPreview: ReturnType<typeof vi.fn>;
  let mockClient: SitecoreClient;

  const mockConfig = {
    defaultSite: 'test-site',
    defaultLanguage: 'en',
  } as AngularSitecoreConfig;

  beforeEach(() => {
    getPage = vi.fn().mockResolvedValue(null);
    getPreview = vi.fn().mockResolvedValue(null);
    mockClient = { getPage, getPreview } as unknown as SitecoreClient;
  });

  it('should call getPage with path and empty page options when options omitted', async () => {
    await resolveSitecorePage('/home', mockConfig, mockClient);

    expect(getPage).toHaveBeenCalledTimes(1);
    expect(getPage).toHaveBeenCalledWith('/home', {});
  });

  it('should pass locale when options.locale is set', async () => {
    await resolveSitecorePage('/path', mockConfig, mockClient, { locale: 'da-DK' });

    expect(getPage).toHaveBeenCalledWith('/path', { locale: 'da-DK' });
  });

  it('should pass site when options.site is set', async () => {
    await resolveSitecorePage('/path', mockConfig, mockClient, { site: 'other-site' });

    expect(getPage).toHaveBeenCalledWith('/path', { site: 'other-site' });
  });

  it('should pass both locale and site when both set', async () => {
    await resolveSitecorePage('/x', mockConfig, mockClient, { locale: 'fr', site: 'fr-site' });

    expect(getPage).toHaveBeenCalledWith('/x', { locale: 'fr', site: 'fr-site' });
  });

  it('should omit locale when options.locale is empty string', async () => {
    await resolveSitecorePage('/path', mockConfig, mockClient, { locale: '' });

    expect(getPage).toHaveBeenCalledWith('/path', {});
  });

  it('should return the Page from getPage', async () => {
    const page = { locale: 'en', layout: {} } as Page;
    getPage.mockResolvedValueOnce(page);

    const result = await resolveSitecorePage('/p', mockConfig, mockClient);

    expect(result).toBe(page);
  });

  it('should call client.getPreview when previewData is provided and skip getPage', async () => {
    const previewData: EditingPreviewData = {
      site: 'demo',
      itemId: 'i',
      language: 'en',
      mode: LayoutServicePageState.Edit,
      variantIds: ['_default'],
    };
    const page = { locale: 'en', layout: {} } as Page;
    getPreview.mockResolvedValueOnce(page);

    const result = await resolveSitecorePage('/p', mockConfig, mockClient, { previewData });

    expect(getPreview).toHaveBeenCalledWith(previewData);
    expect(getPage).not.toHaveBeenCalled();
    expect(result).toBe(page);
  });
});
