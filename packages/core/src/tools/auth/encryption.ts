/* eslint-disable jsdoc/require-jsdoc */
const keytar = require('keytar');
import * as crypto from 'crypto';
import { deleteTenantAuthInfo } from './tenant-store';
import { clearActiveTenant } from './tenant-state';
import { EncryptedPayload } from './models';

const algorithm = 'aes-256-gcm';
const SERVICE_NAME = 'sitecore-tools-cli';

/**
 * Encrypts plaintext using AES-256-GCM for a given tenant.
 * @param {string} plaintext
 * @param {string} tenantId
 */
export let encryptData = _encryptData;
/**
 * Decrypts encrypted payload using AES-256-GCM for a specific tenant.
 * If key is corrupted or invalid, optionally clears both key and tenant data.
 * @param {EncryptedPayload} payload
 * @param {string} tenantId
 * @param {string} cleanupOnFailure
 */
export let decryptData = _decryptData;

/**
 * Deletes the encryption key for a tenant (useful for cleanup).
 * @param {string} tenantId
 */
export let deleteKey = _deleteKey;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set encryptData(mockImplementation) {
    encryptData = mockImplementation;
  },

  get encryptData() {
    return _encryptData;
  },

  set decryptData(mockImplementation) {
    decryptData = mockImplementation;
  },

  get decryptData() {
    return _decryptData;
  },

  set deleteKey(mockImplementation) {
    deleteKey = mockImplementation;
  },

  get deleteKey() {
    return _deleteKey;
  },
};

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

async function _encryptData(plaintext: string, tenantId: string): Promise<EncryptedPayload> {
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

async function _decryptData(
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

async function _deleteKey(tenantId: string): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, `encryptionKey-${tenantId}`);
}
