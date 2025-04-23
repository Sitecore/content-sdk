import chalk from 'chalk';
import { DEFAULT_M2M_AUDIENCE, DEFAULT_M2M_ENDPOINT } from '../../constants';

export const fetchBearerToken = async ({
  clientId,
  clientSecret,
  audience,
  endpoint,
}: {
  clientId: string;
  clientSecret: string;
  audience?: string;
  endpoint?: string;
}) => {
  audience = audience || DEFAULT_M2M_AUDIENCE;
  endpoint = endpoint || DEFAULT_M2M_ENDPOINT;

  try {
    // TODO:adjust when M2M endpoint is live
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
    const jsonResponse = await authenticateResponse.json();
    return jsonResponse.access_token;
  } catch (error) {
    console.error(chalk.red('Error authenticating with M2M token endpoint:', error));
    return null;
  }
};
