import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { debug } from '@sitecore-content-sdk/core';
import type { TelemetryEvent } from '@sitecore-content-sdk/core/node-tools';
import { BaseAppArgs } from '../common/base/args';
import * as monorepo from './monorepo';
import { telemetryClient } from './client';

const MAX_STRING_LENGTH = 512;
const MAX_DATA_KEYS = 32;

export const TELEMETRY_NOTICE =
  'Content SDK telemetry is on. Disable it for this run with --noTelemetry, or set SITECORE_TELEMETRY_DISABLED=1.';

/**
 * Records `app_scaffolded` after a successful scaffold.
 * Failures are logged and do not fail app creation.
 * @param {BaseAppArgs} args CLI arguments for this run
 */
export async function trackAppScaffolded(args: BaseAppArgs): Promise<void> {
  try {
    if (monorepo.shouldSkipScaffoldTelemetry(args)) {
      return;
    }

    if (!telemetryClient.isTelemetryEnabled()) {
      return;
    }

    if (!args.silent) {
      console.log(chalk.dim(TELEMETRY_NOTICE));
    }

    await telemetryClient.dispatchTelemetryEvent(buildAppScaffoldedEvent(args));
  } catch (error) {
    debug.telemetry('app scaffolded telemetry failed: %O', error);
  }
}

/**
 * Builds the scaffold event from the generated app and this package.
 * @param {BaseAppArgs} args CLI arguments for this run
 * @returns {TelemetryEvent} Event body posted by {@link trackAppScaffolded}
 */
export function buildAppScaffoldedEvent(args: BaseAppArgs): TelemetryEvent {
  const ownPackage = readJson(path.resolve(__dirname, '..', '..', 'package.json'));
  const ownVersion = readString(ownPackage?.version) || 'unknown';
  const appPackage = readJson(path.join(args.destination, 'package.json'));
  const appName = readString(appPackage?.name) || path.basename(path.resolve(args.destination));

  const data: Record<string, string> = {
    app_name: clip(appName),
    template: clip(args.template),
    create_package_version: clip(ownVersion),
  };

  const versions = collectSdkVersions(appPackage);
  for (const [key, value] of Object.entries(versions)) {
    if (Object.keys(data).length >= MAX_DATA_KEYS) {
      break;
    }
    data[key] = clip(value);
  }

  return {
    source: telemetryClient.TELEMETRY_SOURCE,
    name: telemetryClient.APP_SCAFFOLDED_EVENT_NAME,
    data,
    fingerprint: telemetryClient.createTelemetryFingerprint('create-content-sdk-app', ownVersion),
  };
}

/**
 * Reads `@sitecore-content-sdk/*` versions as flat `<name>_version` strings.
 * @param {Record<string, unknown> | undefined} pkg Generated app package.json
 * @returns {Record<string, string>} Version attributes
 */
function collectSdkVersions(
  pkg: Record<string, unknown> | undefined
): Record<string, string> {
  const versions: Record<string, string> = {};
  if (!pkg) {
    return versions;
  }

  for (const sectionName of ['dependencies', 'devDependencies'] as const) {
    const section = pkg[sectionName];
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      continue;
    }

    for (const [name, version] of Object.entries(section as Record<string, unknown>)) {
      if (!name.startsWith('@sitecore-content-sdk/') || typeof version !== 'string') {
        continue;
      }

      const shortName = name.slice('@sitecore-content-sdk/'.length);
      const key = `${toSnake(shortName)}_version`;
      if (key === '_version') {
        continue;
      }
      versions[key] = version;
    }
  }

  return versions;
}

/**
 * @param {string} value Package name segment
 * @returns {string} snake_case segment
 */
function toSnake(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * @param {string} filePath JSON file path
 * @returns {Record<string, unknown> | undefined} Parsed object, or undefined when the file cannot be read
 */
function readJson(filePath: string): Record<string, unknown> | undefined {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return undefined;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

/**
 * @param {unknown} value Candidate string
 * @returns {string | undefined} Trimmed string, when one is present
 */
function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

/**
 * @param {string} value Attribute value
 * @returns {string} Value trimmed to the receiver string limit
 */
function clip(value: string): string {
  return value.length > MAX_STRING_LENGTH ? value.slice(0, MAX_STRING_LENGTH) : value;
}
