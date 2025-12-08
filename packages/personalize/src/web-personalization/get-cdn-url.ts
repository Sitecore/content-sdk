/**
 * Retrieves the CDN URL for web personalization
 * @param {string} sitecoreEdgeContextId - The Sitecore Edge context ID
 * @param {string} sitecoreEdgeUrl - The Sitecore Edge URL
 * @returns {Promise<string | null>} The CDN URL or null if unavailable
 */
export async function getCdnUrl(
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl: string
): Promise<string | null> {
  const requestUrl = `${sitecoreEdgeUrl}/v1/personalize/cdn-url?sitecoreContextId=${sitecoreEdgeContextId}&client_key=`;

  try {
    const response = await fetch(requestUrl);
    if (!response.ok) return null;

    return await response.text();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return null;
  }
}
