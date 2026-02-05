/**
 * Retrieves the CDN URL for web personalization
 * @param {string} contextId - The Sitecore Edge context ID
 * @param {string} edgeUrl - The Sitecore Edge URL
 * @returns {Promise<string | null>} The CDN URL or null if unavailable
 * @internal
 */
export async function getCdnUrl(contextId: string, edgeUrl: string): Promise<string | null> {
  const requestUrl = `${edgeUrl}/v1/personalize/cdn-url?client_key=`;

  try {
    const response = await fetch(requestUrl, {
      headers: {
        'x-sitecore-contextid': contextId,
      },
    });
    if (!response.ok) return null;

    return await response.text();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
}
