import keytar from 'keytar';
import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';

// Assume you've stored your key securely in keytar under a service name
const SERVICE_NAME = 'sitecore-tools-cli';
const ACCOUNT_NAME = 'encryptionKey';

export async function getKey() {
  // Retrieve the encryption key from keytar
  const key = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
  if (!key) {
    // Generate a new key if it doesn’t exist
    const keyBuffer = crypto.randomBytes(32); // 256 bits for AES-256
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, keyBuffer.toString('base64'));
    return keyBuffer;
  }
  return Buffer.from(key, 'base64');
}

export async function encryptData(plaintext: string) {
  const key = await getKey();
  const iv = crypto.randomBytes(12); // GCM standard IV length
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag().toString('base64');

  // Store iv and authTag along with encrypted data (iv & authTag are not secret)
  return {
    iv: iv.toString('base64'),
    authTag,
    encryptedData: encrypted,
  };
}

export async function decryptData({
  authTag,
  encryptedData,
  iv,
}: {
  iv: string;
  authTag: string;
  encryptedData: string;
}) {
  const key = await getKey();
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function deleteKey() {
  await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
  console.log('Encryption key deleted from keytar.');
}
