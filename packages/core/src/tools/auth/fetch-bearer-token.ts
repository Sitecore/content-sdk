import chalk from 'chalk';
import { DEFAULT_SITECORE_AUTH_AUDIENCE, DEFAULT_SITECORE_AUTH_ENDPOINT } from '../../constants';

export type FetchBearerTokenOptions = {
  clientId: string;
  clientSecret: string;
  audience?: string;
  endpoint?: string;
};

/**
 * Connects to M2M endpoint and fetches the bearer token
 * Uses client_id and client_secret from environment variables
 * @param {FetchBearerTokenOptions} options client id, secret, and other parameters for connection to m2m endpoint
 * @returns {string} bearer token string
 */
export const fetchBearerToken = async (options: FetchBearerTokenOptions) => {
  const { clientId, clientSecret } = options;

  const audience = options.audience || DEFAULT_SITECORE_AUTH_AUDIENCE;
  const endpoint = options.endpoint || DEFAULT_SITECORE_AUTH_ENDPOINT;

  try {
    const authenticateResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: audience,
        grant_type: 'client_credentials',
      }),
    });
    if (!authenticateResponse.ok) {
      throw new Error(`Authentication failed with status: ${authenticateResponse.status}`);
    }
    const jsonResponse = await authenticateResponse.json();
    return jsonResponse.access_token;
  } catch (error) {
    console.error(chalk.red('Error authenticating with Sitecore Auth endpoint:', error));
    return null;
  }
};
