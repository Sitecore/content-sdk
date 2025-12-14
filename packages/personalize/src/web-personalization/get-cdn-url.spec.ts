import { getCdnUrl } from './get-cdn-url';

describe('getCdnUrl', () => {
  const sitecoreEdgeContextId = '12345';
  const sitecoreEdgeUrl = 'https://example.com';

  const mockResponse = 'https://cdn.example.com';

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockResponse)
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct request URL', async () => {
    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/v1/personalize/cdn-url?sitecoreContextId=12345&client_key='
    );
    expect(result).toEqual(mockResponse);
  });

  it('should return null if the response is not 200', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve({ error: 'error' })
      })
    );

    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/v1/personalize/cdn-url?sitecoreContextId=12345&client_key='
    );
    expect(result).toEqual(null);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Network error');

    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    const result = await getCdnUrl(sitecoreEdgeContextId, sitecoreEdgeUrl);
    expect(result).toEqual(null);
  });
});
