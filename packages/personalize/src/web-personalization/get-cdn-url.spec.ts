import { getCdnUrl } from './get-cdn-url';
import { jest, expect } from '@jest/globals';

describe('getCdnUrl', () => {
  const sitecoreEdgeContextId = '12345';
  const sitecoreEdgeUrl = 'https://example.com';

  const mockResponse = 'https://cdn.example.com';

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })
    ) as typeof fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct request URL', async () => {
    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);

    expect(fetch).toHaveBeenCalledWith('https://example.com/v1/personalize/cdn-url?client_key=', {
      headers: {
        'x-sitecore-contextid': sitecoreEdgeContextId,
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should return null if the response is not 200', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve({ error: 'error' }),
      })
    ) as typeof fetch;

    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);

    expect(fetch).toHaveBeenCalledWith('https://example.com/v1/personalize/cdn-url?client_key=', {
      headers: {
        'x-sitecore-contextid': sitecoreEdgeContextId,
      },
    });
    expect(result).toEqual(null);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Network error');

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(mockError)) as typeof fetch;

    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);
    expect(result).toEqual(null);
  });
});
