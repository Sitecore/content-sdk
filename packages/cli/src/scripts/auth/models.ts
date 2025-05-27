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

export interface Settings {
  /**
   * Currently active tenant ID tracked by the CLI
   */
  activeTenant?: string;
}

export interface TenantAuth {
  /**
   * Client ID used during authentication
   */
  clientId: string;
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
}

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
}
