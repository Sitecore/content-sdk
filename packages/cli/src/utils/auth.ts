// Replace these with your Auth0 application values
const AUTH0_DOMAIN = 'https://auth-staging-1.sitecore-staging.cloud'; // e.g., 'dev-xyz.auth0.com'
const AUDIENCE = 'https://api-staging.sitecore-staging.cloud'; // Optional, if you have an API
const TIMEOUT = 600; // 10 minutes in seconds

/**
 * Device Authorization Flow: Request device and user codes.
 */
export async function startDeviceAuthorization({
  clientId,
  audience = AUDIENCE,
  authAuthority = AUTH0_DOMAIN,
  organization_id,
  tenant_id,
}: {
  clientId: string;
  audience?: string;
  authAuthority?: string;
  organization_id: string;
  tenant_id: string;
}) {
  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'openid profile email offline_access', // adjust scopes as needed
    audience: audience,
    organization_id: organization_id,
    tenant_id: tenant_id,
  });

  try {
    const response = await fetch(`${authAuthority}/oauth/device/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error_description || data.error || 'Error starting device authorization'
      );
    }

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      expires_in,
      interval,
    } = data;

    console.log('\n== Device Authorization ==');
    if (verification_uri_complete) {
      console.log(`Please visit:\n  ${verification_uri_complete}`);
    } else {
      console.log(`Please visit:\n  ${verification_uri}`);
      console.log(`and enter the code: ${user_code}`);
    }

    return { device_code, expires_in, interval };
  } catch (error) {
    console.error('Error starting device authorization:', (error as any).message);
    process.exit(1);
  }
}

/**
 * Poll the token endpoint until the user authorizes or an error occurs.
 */
export async function pollForToken({
  clientId,
  deviceCode,

  interval = 10,
  authAuthority = AUTH0_DOMAIN,
}: {
  clientId: string;
  deviceCode: string;
  interval?: number;
  authAuthority?: string;
}) {
  // Create new URLSearchParams on each poll to avoid potential issues with reused objects
  const startTime = Date.now();

  while (Date.now() - startTime < TIMEOUT * 1000) {
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      device_code: deviceCode,
      client_id: clientId,
    });

    try {
      const response = await fetch(`${authAuthority}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const data = await response.json();

      if (response.ok) {
        // Token successfully retrieved
        return data;
      } else {
        if (data.error === 'authorization_pending') {
          console.log('Waiting for user authorization...');
        } else if (data.error === 'slow_down') {
          console.log('Polling too quickly; slowing down...');
          interval += 5;
        } else {
          console.error('Error polling token endpoint:', data);
          process.exit(1);
        }
      }
    } catch (error) {
      console.error('Error polling token endpoint:', error);
      process.exit(1);
    }
    // Wait for the specified interval (in seconds) before polling again.
    await new Promise((resolve) => setTimeout(resolve, interval * 1000));
  }

  console.error('Timeout waiting for user authorization.');
  process.exit(1);
}

/**
 * Client Credentials Flow: Get an access token using client credentials.
 */
export async function clientCredentialsFlow({
  clientId,
  clientSecret,
  organization_id,
  tenant_id,
  audience = AUDIENCE,
  authAuthority = AUTH0_DOMAIN,
}: {
  clientId: string;
  clientSecret: string;
  audience?: string;
  authAuthority?: string;
  organization_id: string;
  tenant_id: string;
}) {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    audience: audience,
    organization_id: organization_id,
    tenant_id: tenant_id,
  });

  try {
    const response = await fetch(`https://${authAuthority}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error_description || data.error || 'Error during client credentials flow'
      );
    }
    return data;
  } catch (error) {
    console.error('Error during client credentials flow:', error);
    process.exit(1);
  }
}
