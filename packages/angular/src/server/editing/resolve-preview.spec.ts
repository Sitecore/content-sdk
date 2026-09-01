import { describe, it, expect, vi } from 'vitest';
import {
  getPreviewAuthToken,
  resolvePreviewPage,
  resolvePreviewNavigation,
} from './resolve-preview';
import type { CsdkRequestData } from '../../loaders/models';

const editPreviewData = {
  mode: 'edit',
  site: 'my-site',
  itemId: 'item-1',
  language: 'en',
  variantId: 'default',
} as never;

const designLibraryPreviewData = {
  mode: 'library',
  site: 'my-site',
  itemId: 'item-1',
  componentUid: 'uid-1',
  language: 'en',
} as never;

const makeClient = (overrides: Record<string, unknown> = {}) =>
  ({
    getPreview: vi.fn().mockResolvedValue({ id: 'preview-page' }),
    getDesignLibraryData: vi.fn().mockResolvedValue({ id: 'design-library-page' }),
    getPage: vi.fn().mockResolvedValue({ id: 'nav-page' }),
    ...overrides,
  } as never);

describe('getPreviewAuthToken', () => {
  it('returns the Authorization header when present', () => {
    const data: CsdkRequestData = { headers: { authorization: 'Bearer abc' } };
    expect(getPreviewAuthToken(data)).toBe('Bearer abc');
  });

  it('falls back to the sc_preview_token cookie', () => {
    const data: CsdkRequestData = { cookies: { sc_preview_token: 'Bearer cookie' } };
    expect(getPreviewAuthToken(data)).toBe('Bearer cookie');
  });

  it('prefers the header over the cookie', () => {
    const data: CsdkRequestData = {
      headers: { authorization: 'Bearer header' },
      cookies: { sc_preview_token: 'Bearer cookie' },
    };
    expect(getPreviewAuthToken(data)).toBe('Bearer header');
  });

  it('url-decodes the cookie value', () => {
    const data: CsdkRequestData = { cookies: { sc_preview_token: 'Bearer%20abc.def' } };
    expect(getPreviewAuthToken(data)).toBe('Bearer abc.def');
  });

  it('returns undefined when neither is present', () => {
    expect(getPreviewAuthToken(undefined)).toBeUndefined();
    expect(getPreviewAuthToken({})).toBeUndefined();
  });
});

describe('resolvePreviewPage', () => {
  it('fetches preview layout with the token forwarded as Authorization', async () => {
    const client = makeClient();
    const data: CsdkRequestData = { headers: { authorization: 'Bearer abc' } };

    const page = await resolvePreviewPage(client, editPreviewData, data);

    expect(page).toEqual({ id: 'preview-page' });
    expect((client as never as { getPreview: ReturnType<typeof vi.fn> }).getPreview).toHaveBeenCalledWith(
      editPreviewData,
      { headers: { Authorization: 'Bearer abc' } }
    );
  });

  it('uses getDesignLibraryData for Design Library modes', async () => {
    const client = makeClient();
    const data: CsdkRequestData = { cookies: { sc_preview_token: 'Bearer cookie' } };

    const page = await resolvePreviewPage(client, designLibraryPreviewData, data);

    expect(page).toEqual({ id: 'design-library-page' });
    expect(
      (client as never as { getDesignLibraryData: ReturnType<typeof vi.fn> }).getDesignLibraryData
    ).toHaveBeenCalledWith(designLibraryPreviewData, { headers: { Authorization: 'Bearer cookie' } });
  });

  it('forwards an empty Authorization when no token is present', async () => {
    const client = makeClient();

    await resolvePreviewPage(client, editPreviewData, {});

    expect((client as never as { getPreview: ReturnType<typeof vi.fn> }).getPreview).toHaveBeenCalledWith(
      editPreviewData,
      { headers: { Authorization: '' } }
    );
  });

  it('throws when preview content is not found or access is denied', async () => {
    const client = makeClient({ getPreview: vi.fn().mockResolvedValue(null) });

    await expect(resolvePreviewPage(client, editPreviewData, {})).rejects.toThrow(
      'Preview content is not found or access is denied'
    );
  });
});

describe('resolvePreviewNavigation', () => {
  it('fetches via getPage with preview headers and the token from the cookie', async () => {
    const client = makeClient();
    const data: CsdkRequestData = { cookies: { sc_preview_token: 'Bearer%20abc' } };

    const page = await resolvePreviewNavigation(
      client,
      '/about',
      { site: 'my-site', locale: 'en' },
      data
    );

    expect(page).toEqual({ id: 'nav-page' });
    expect((client as never as { getPage: ReturnType<typeof vi.fn> }).getPage).toHaveBeenCalledWith(
      '/about',
      { site: 'my-site', locale: 'en' },
      { headers: { Authorization: 'Bearer abc', sc_previewMode: 'true', sc_site: 'my-site' } }
    );
  });

  it('throws when preview content is not found or access is denied', async () => {
    const client = makeClient({ getPage: vi.fn().mockResolvedValue(null) });

    await expect(
      resolvePreviewNavigation(client, '/about', { site: 'my-site', locale: 'en' }, {})
    ).rejects.toThrow('Preview content is not found or access is denied');
  });
});
