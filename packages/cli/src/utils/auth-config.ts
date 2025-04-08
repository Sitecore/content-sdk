import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { decryptData, deleteKey, encryptData } from './crypto-helpers';

export interface AuthConfig {
  clientId: string;
  clientSecret?: string;
  access_token?: string;
  expires_at: string;
  expires_in: number;
  refresh_token?: string;
}

const userProfile = os.homedir();
const cliConfigDir = path.join(userProfile, '.sitecore', 'sitecore-tools');

export async function writeAuthConfig(authConfig: AuthConfig) {
  if (!fs.existsSync(cliConfigDir)) {
    fs.mkdirSync(cliConfigDir, { recursive: true });
  }

  const configFilePath = path.join(cliConfigDir, 'auth.config');

  const encryptedPayload = await encryptData(JSON.stringify(authConfig));

  // Write the JSON payload to the file (overwriting if it exists).
  fs.writeFileSync(configFilePath, JSON.stringify(encryptedPayload, null, 2), 'utf8');
  console.log(`Auth config written to ${configFilePath}`);
}

export async function readAuthConfig(): Promise<AuthConfig | null> {
  const configFilePath = path.join(cliConfigDir, 'auth.config');

  if (!fs.existsSync(configFilePath)) {
    return null;
  }

  try {
    const encryptedPayloadRaw = fs.readFileSync(configFilePath, 'utf8');
    const encryptedPayload = JSON.parse(encryptedPayloadRaw);

    const decryptedData = await decryptData(encryptedPayload as any);

    return JSON.parse(decryptedData) as AuthConfig;
  } catch (error) {
    console.error('Error reading or decrypting auth config:', (error as Error).message);
    return null;
  }
}

export async function deleteAuthConfig() {
  const configFilePath = path.join(cliConfigDir, 'auth.config');

  deleteKey();
  if (fs.existsSync(configFilePath)) {
    fs.unlinkSync(configFilePath);
    console.log(`Auth config deleted from ${configFilePath}`);
  } else {
    console.log('No auth config found to delete.');
  }
}

export function validateAuth(authConfig: AuthConfig) {
  const currentDate = new Date();
  const expiresAt = new Date(authConfig.expires_at);

  if (expiresAt < currentDate) {
    console.log('Auth token has expired. Please re-authenticate.');
    return false;
  }

  return true;
}
