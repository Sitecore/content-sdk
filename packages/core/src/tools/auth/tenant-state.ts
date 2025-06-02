/* eslint-disable jsdoc/require-jsdoc */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { TenantSettings } from './models';

const configDir: string = path.join(os.homedir(), '.sitecore', 'sitecore-tools');
const settingsFile: string = path.join(configDir, 'settings.json');

/**
 * Gets the ID of the currently active tenant from settings.json.
 * @returns The active tenant ID if present, otherwise null.
 */
export let getActiveTenant = _getActiveTenant;
/**
 * Clears the currently active tenant from settings.json by deleting the file.
 */
export let clearActiveTenant = _clearActiveTenant;

// mock setup for unit tests to make sinon happy and mock-able with esbuild/tsx
// https://sinonjs.org/how-to/typescript-swc/
// This, plus the `_` names make the exports writable for sinon
export const unitMocks = {
  set clearActiveTenant(mockImplementation) {
    clearActiveTenant = mockImplementation;
  },
  get clearActiveTenant() {
    return _clearActiveTenant;
  },
  set getActiveTenant(mockImplementation) {
    getActiveTenant = mockImplementation;
  },
  get getActiveTenant() {
    return _getActiveTenant;
  },
};

function _getActiveTenant(): string | null {
  if (!fs.existsSync(settingsFile)) {
    return null;
  }

  try {
    const content: string = fs.readFileSync(settingsFile, 'utf-8');
    const data: TenantSettings = JSON.parse(content);
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

    const data: TenantSettings = { activeTenant: tenantId };
    fs.writeFileSync(settingsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`\n Failed to set active tenant '${tenantId}': ${(error as Error).message}`);
  }
}

function _clearActiveTenant(): void {
  try {
    if (fs.existsSync(settingsFile)) {
      fs.unlinkSync(settingsFile);
    }
  } catch (error) {
    console.error(`\n Failed to clear active tenant: ${(error as Error).message}`);
  }
}
