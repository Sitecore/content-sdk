import keytar from 'keytar';
import * as crypto from 'crypto';
import { deleteTenantAuthInfo } from './tenant-store';
import { clearActiveTenant } from './tenant-state';

const algorithm = 'aes-256-gcm';
const SERVICE_NAME = 'sitecore-tools-cli';

export interface EncryptedPayload {
  iv: string;
  authTag: string;
  encryptedData: string;
}

/**
 * Generates or retrieves a 32-byte AES key for a specific tenant.
 * @param {string} tenantId
 */
export async function getKey(tenantId: string): Promise<Buffer> {
  const account = `encryptionKey-${tenantId}`;
  const key = await keytar.getPassword(SERVICE_NAME, account);
  if (!key) {
    const keyBuffer = crypto.randomBytes(32);
    await keytar.setPassword(SERVICE_NAME, account, keyBuffer.toString('base64'));
    return keyBuffer;
  }
  return Buffer.from(key, 'base64');
}

/**
 * Encrypts plaintext using AES-256-GCM for a given tenant.
 * @param {string} plaintext
 * @param {string} tenantId
 */
export async function encryptData(plaintext: string, tenantId: string): Promise<EncryptedPayload> {
  const key = await getKey(tenantId);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');

  return {
    iv: iv.toString('base64'),
    authTag,
    encryptedData: encrypted,
  };
}

/**
 * Decrypts encrypted payload using AES-256-GCM for a specific tenant.
 * If key is corrupted or invalid, optionally clears both key and tenant data.
 * @param {EncryptedPayload} payload
 * @param {string} tenantId
 * @param {string} cleanupOnFailure
 */
export async function decryptData(
  payload: EncryptedPayload,
  tenantId: string,
  cleanupOnFailure = true
): Promise<string | null> {
  try {
    const key = await getKey(tenantId);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(payload.iv, 'base64'));
    decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));

    let decrypted = decipher.update(payload.encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error(`\nFailed to decrypt data for tenant '${tenantId}':`, err);

    if (cleanupOnFailure) {
      console.warn(`\nCleaning up key and auth data for corrupted tenant '${tenantId}'...`);

      await deleteTenantAuthInfo(tenantId);
      await deleteKey(`encryptionKey-${tenantId}`);
      clearActiveTenant();

      console.warn(`\nCleanup completed for tenant '${tenantId}'.`);

      return null;
    }

    throw err;
  }
}

/**
 * Deletes the encryption key for a tenant (useful for cleanup).
 * @param {string} tenantId
 */
export async function deleteKey(tenantId: string): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, `encryptionKey-${tenantId}`);
  console.log(`\nEncryption key deleted for tenant '${tenantId}'.`);
}
