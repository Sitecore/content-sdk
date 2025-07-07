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
