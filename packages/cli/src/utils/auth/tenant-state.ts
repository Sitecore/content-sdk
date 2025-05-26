import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Settings } from '../../scripts/auth/models';

const configDir: string = path.join(os.homedir(), '.sitecore', 'sitecore-tools');
const settingsFile: string = path.join(configDir, 'settings.json');

/**
 * Gets the ID of the currently active tenant from settings.json.
 * @returns The active tenant ID if present, otherwise null.
 */
export function getActiveTenant(): string | null {
  if (!fs.existsSync(settingsFile)) {
    return null;
  }

  try {
    const content: string = fs.readFileSync(settingsFile, 'utf-8');
    const data: Settings = JSON.parse(content);
    return data.activeTenant ?? null;
  } catch (error) {
    console.error(`\n Failed to read active tenant: ${(error as Error).message}`);
    return null;
  }
}

/**
 * Sets the currently active tenant by writing to settings.json.
 * @param {string} tenantId - The tenant ID to set as active.
 */
export function setActiveTenant(tenantId: string): void {
  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const data: Settings = { activeTenant: tenantId };
    fs.writeFileSync(settingsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`\n Failed to set active tenant '${tenantId}': ${(error as Error).message}`);
  }
}

/**
 * Clears the currently active tenant from settings.json by deleting the file.
 */
export function clearActiveTenant(): void {
  try {
    if (fs.existsSync(settingsFile)) {
      fs.unlinkSync(settingsFile);
    }
  } catch (error) {
    console.error(`\n Failed to clear active tenant: ${(error as Error).message}`);
  }
}
