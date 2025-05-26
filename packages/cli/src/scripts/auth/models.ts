export interface TenantArgs {
  clientId: string;
  clientSecret?: string;
  organizationId?: string;
  tenantId?: string;
  audience?: string;
  authAuthority?: string;
  baseUrl?: string;
}

export interface Settings {
  activeTenant?: string;
}

export interface TenantAuth {
  clientId: string;
  access_token: string;
  expires_in: number;
  expires_at: string;
  clientSecret?: string;
}

export interface TenantInfo {
  tenantId: string;
  tenantName: string;
  organizationId: string;
  clientId: string;
}
