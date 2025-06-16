/**
 * CLI arguments used for authentication and tenant identification.
 */
export interface TenantArgs {
  /**
   * OAuth2 client ID used to identify the application
   */
  clientId: string;
  /**
   * Client secret used for client credentials flow
   */
  clientSecret?: string;
  /**
   * Organization ID associated with the tenant
   */
  organizationId?: string;
  /**
   * Tenant ID used for scoping the login
   */
  tenantId?: string;
  /**
   * OAuth2 audience (e.g., API base URL the token is intended for)
   */
  audience?: string;
  /**
   * Auth authority/issuer URL (e.g., Sitecore identity endpoint)
   */
  authority?: string;
  /**
   * Base URL for the target Sitecore Content Management API
   */
  baseUrl?: string;
}

export interface TenantSettings {
  /**
   * Currently active tenant ID tracked by the CLI
   */
  activeTenant?: string;
}

/**
 * Auth configuration stored per tenant for accessing Sitecore APIs.
 */
export interface TenantAuthInfo {
  /**
   * Access token issued by the identity provider
   */
  access_token: string;
  /**
   * Token expiration duration in seconds
   */
  expires_in: number;
  /**
   * Exact ISO timestamp when the token expires
   */
  expires_at: string;
  /**
   * Secret used for client credentials flow and re-authenticate
   */
  clientSecret?: string;
  /*
   * Refresh token used to obtain new access tokens
   */
  refresh_token?: string;
}

/**
 * Public metadata for a known tenant.
 */
export interface TenantInfo {
  /**
   * Unique ID of the tenant
   */
  tenantId: string;
  /**
   *  Human-readable name of the tenant
   */
  tenantName: string;
  /**
   * Organization ID the tenant belongs to
   */
  organizationId: string;
  /**
   * Client ID associated with this tenant's authentication
   */
  clientId: string;
  /**
   * OAuth2 audience (e.g., API base URL the token is intended for)
   */
  audience: string;
  /**
   * Auth authority/issuer URL (e.g., Sitecore identity endpoint)
   */
  authority: string;
  /**
   * Base URL for the target Sitecore Content Management API
   */
  baseUrl: string;
}

export type EncryptedPayload = {
  /*
   * Initialization vector used for AES encryption
   */
  iv: string;
  /**
   * Authentication tag for integrity verification
   */
  authTag: string;
  /**
   * Base64-encoded encrypted data
   */
  encryptedData: string;
};

/**
 * Input parameters for exchanging a refresh token for a new access token.
 */
export interface RefreshTokenRequest {
  /**
   * OAuth 2.0 client identifier.
   */
  clientId: string;
  /**
   * Refresh token previously issued by the authorization server.
   */
  refreshToken: string;
  /**
   * Tenant identifier to bind the request to a specific tenant context.
   */
  tenantId: string;
  /**
   * Organization identifier for multi-tenant authorization scope.
   */
  organizationId: string;
  /**
   * Optional OAuth 2.0 authority endpoint (token issuer URL).
   * Defaults to the Sitecore standard authority if not provided.
   */
  authority?: string;
}

/**
 * Input parameters for initiating the OAuth 2.0 Device Authorization flow.
 */
export interface DeviceAuthRequest {
  /**
   * OAuth 2.0 client identifier.
   */
  clientId: string;
  /**
   * The intended recipient of the token (usually your protected resource or API).
   */
  audience: string;
  /**
   * OAuth 2.0 authority URL (token issuer).
   */
  authority: string;
  /**
   * Base URL for your API, used to build custom claims or context if needed.
   */
  baseUrl: string;
}

/**
 * Response structure returned after initiating the device authorization flow.
 */
export interface DeviceAuthResponse {
  /**
   * Code the device will use to poll the token endpoint.
   */
  deviceCode: string;
  /**
   * Code shown to the user for manual input during verification.
   */
  userCode: string;
  /**
   * URI where the user should go to complete authentication.
   */
  verificationUri: string;
  /**
   * Optional URI that includes the user code, allowing for a streamlined login experience.
   */
  verificationUriComplete?: string;
  /**
   * Time (in seconds) until the device code expires.
   */
  expiresIn: number;
  /**
   * Recommended polling interval (in seconds) for token requests.
   */
  interval: number;
}

/**
 * Input parameters for polling the OAuth 2.0 device token endpoint.
 */
export interface DeviceTokenPollRequest {
  /**
   * OAuth 2.0 client identifier.
   */
  clientId: string;
  /**
   * Device code previously obtained from the device authorization flow.
   */
  deviceCode: string;
  /**
   * Optional polling interval in seconds. If not provided, a default is used.
   */
  interval?: number;
  /**
   * Optional OAuth 2.0 authority endpoint for token polling.
   */
  authority?: string;
}
