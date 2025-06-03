/* eslint-disable jsdoc/require-jsdoc */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TenantAuth, TenantInfo } from './models';
import { encryptData, decryptData } from './encryption';
import { CLAIMS } from './../../constants';

const rootDir = path.join(os.homedir(), '.sitecore', 'sitecore-tools');

/**
 * Decodes a JWT without verifying its signature.
 * @param {string} token - The access token string.
 * @returns Decoded payload object or null if invalid.
 */
export let decodeJwtPayload = _decodeJwtPayload;

/**
 * Write the authentication configuration for a tenant.
 * @param {string} tenantId - The tenant ID.
 * @param {TenantAuth} authInfo - The tenant's auth data.
 */
export let writeTenantAuthInfo = _writeTenantAuthInfo;

/**
 * Read the authentication configuration for a tenant.
 * @param {string} tenantId - The tenant ID.
 * @returns Parsed auth config or null if not found or failed to read.
 */
export let readTenantAuthInfo = _readTenantAuthInfo;

/**
 * Write the public metadata information for a tenant.
 * @param {TenantInfo} info - The tenant info object.
 */
export let writeTenantInfo = _writeTenantInfo;

/**
 * Read the public metadata information for a tenant.
 * @param {string} tenantId - The tenant ID.
 * @returns Parsed tenant info or null if not found or failed to read.
 */
export let readTenantInfo = _readTenantInfo;

/**
 * Deletes the stored auth.json file for the given tenant.
 * @param {string} tenantId - The tenant ID.
 */
export let deleteTenantAuthInfo = _deleteTenantAuthInfo;

/**
 * Scans the CLI root directory and returns all valid tenant infos.
 * @returns A list of TenantInfo objects found in {tenant-id}/info.json files.
 */
export let getAllTenantsInfo = _getAllTenantsInfo;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set decodeJwtPayload(mockImplementation) {
    decodeJwtPayload = mockImplementation;
  },
  get decodeJwtPayload() {
    return _decodeJwtPayload;
  },
  set writeTenantAuthInfo(mockImplementation) {
    writeTenantAuthInfo = mockImplementation;
  },
  get writeTenantAuthInfo() {
    return _writeTenantAuthInfo;
  },
  set readTenantAuthInfo(mockImplementation) {
    readTenantAuthInfo = mockImplementation;
  },
  get readTenantAuthInfo() {
    return _readTenantAuthInfo;
  },
  set writeTenantInfo(mockImplementation) {
    writeTenantInfo = mockImplementation;
  },
  get writeTenantInfo() {
    return _writeTenantInfo;
  },
  set readTenantInfo(mockImplementation) {
    readTenantInfo = mockImplementation;
  },
  get readTenantInfo() {
    return _readTenantInfo;
  },
  set deleteTenantAuthInfo(mockImplementation) {
    deleteTenantAuthInfo = mockImplementation;
  },
  get deleteTenantAuthInfo() {
    return _deleteTenantAuthInfo;
  },
  set getAllTenantsInfo(mockImplementation) {
    getAllTenantsInfo = mockImplementation;
  },
  get getAllTenantsInfo() {
    return _getAllTenantsInfo;
  },
};

/**
 * Get the full path to the tenant-specific folder.
 * @param {string} tenantId - The tenant ID.
 * @returns The absolute path to the tenant directory.
 */
export function getTenantPath(tenantId: string): string {
  return path.join(rootDir, tenantId);
}

async function _writeTenantAuthInfo(tenantId: string, authInfo: TenantAuth): Promise<void> {
  try {
    const dir = getTenantPath(tenantId);
    fs.mkdirSync(dir, { recursive: true });

    const encrypted = await encryptData(JSON.stringify(authInfo), tenantId);
    fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify(encrypted));
    // fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify(authInfo, null, 2));
  } catch (error) {
    console.error(
      `\n Failed to write auth.json for tenant '${tenantId}': ${(error as Error).message}`
    );
  }
}

async function _readTenantAuthInfo(tenantId: string): Promise<TenantAuth | null> {
  const filePath = path.join(getTenantPath(tenantId), 'auth.json');
  if (!fs.existsSync(filePath)) return null;

  try {
    const encryptedPayloadRaw = fs.readFileSync(filePath, 'utf8');
    const encryptedPayload = JSON.parse(encryptedPayloadRaw);
    const decryptedData = await decryptData(encryptedPayload, tenantId, true);
    if (decryptedData === null) {
      return null;
    }
    return JSON.parse(decryptedData) as TenantAuth;
    // const raw = fs.readFileSync(filePath, 'utf-8');
    // return JSON.parse(raw);
  } catch (error) {
    console.error(
      `\n Failed to read auth.json for tenant '${tenantId}': ${(error as Error).message}`
    );
    return null;
  }
}

async function _writeTenantInfo(info: TenantInfo): Promise<void> {
  try {
    const dir = getTenantPath(info.tenantId);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'info.json'), JSON.stringify(info, null, 2));
  } catch (error) {
    console.error(
      `\n Failed to write info.json for tenant '${info.tenantId}': ${(error as Error).message}`
    );
  }
}

async function _readTenantInfo(tenantId: string): Promise<TenantInfo | null> {
  const infoFilePath = path.join(getTenantPath(tenantId), 'info.json');

  if (!fs.existsSync(infoFilePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(infoFilePath, 'utf-8');
    return JSON.parse(content) as TenantInfo;
  } catch (error) {
    console.error(
      `\n Failed to read info.json for tenant '${tenantId}': ${(error as Error).message}`
    );
    return null;
  }
}

async function _deleteTenantAuthInfo(tenantId: string): Promise<void> {
  const filePath = path.join(getTenantPath(tenantId), 'auth.json');
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      `\n Failed to delete auth.json for tenant '${tenantId}': ${(error as Error).message}`
    );
  }
}

function _getAllTenantsInfo(): TenantInfo[] {
  if (!fs.existsSync(rootDir)) return [];

  const subDirs = fs
    .readdirSync(rootDir)
    .filter((entry) => fs.statSync(path.join(rootDir, entry)).isDirectory());

  const tenants: TenantInfo[] = [];

  for (const dir of subDirs) {
    const infoPath = path.join(rootDir, dir, 'info.json');

    if (fs.existsSync(infoPath)) {
      try {
        const content = fs.readFileSync(infoPath, 'utf-8');
        const data = JSON.parse(content);

        if (data.tenantId && data.tenantName && data.organizationId && data.clientId) {
          tenants.push({
            tenantId: data.tenantId,
            tenantName: data.tenantName,
            organizationId: data.organizationId,
            clientId: data.clientId,
            authority: data.authority,
            audience: data.audience,
            baseUrl: data.baseUrl,
          });
        }
      } catch (error) {
        console.error('\n Failed to read tenant info file', (error as Error).message);
      }
    }
  }

  return tenants;
}

function _decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const decoded = JSON.parse(payload);
    return {
      tokenTenantId: decoded?.[`${CLAIMS}/tenant_id`],
      tokenOrgId: decoded?.[`${CLAIMS}/org_id`],
      tokenTenantName: decoded?.[`${CLAIMS}/tenant_name`],
    };
  } catch (error) {
    console.error('\n Failed to decode access token:', (error as Error).message);
    return null;
  }
}
