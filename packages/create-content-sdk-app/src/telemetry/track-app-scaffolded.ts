import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { debug } from '@sitecore-content-sdk/core';
import { telemetryClient, type TelemetryEvent } from '@sitecore-content-sdk/core/node-tools';
import { BaseAppArgs } from '../common/base/args';
import * as monorepo from './monorepo';

const MAX_DATA_KEYS = 32;
const APP_NAME = /^[A-Za-z0-9][A-Za-z0-9._@/-]{0,127}$/;
const TEMPLATE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PACKAGE_VERSION = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

/**
 * Event recorded after this command finishes scaffolding.
 */
export const APP_SCAFFOLDED_EVENT_NAME = 'app_scaffolded';

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

    const event = buildAppScaffoldedEvent(args);
    if (!event) {
      debug.telemetry('app scaffolded telemetry skipped (invalid event fields)');
      return;
    }

    if (!args.silent) {
      console.log(chalk.dim(TELEMETRY_NOTICE));
    }

    await telemetryClient.dispatchTelemetryEvent(event);
  } catch (error) {
    debug.telemetry('app scaffolded telemetry failed: %O', error);
  }
}

/**
 * Builds the scaffold event from the generated app and this package.
 * Returns undefined when a required field is not a plausible value.
 * @param {BaseAppArgs} args CLI arguments for this run
 * @returns {TelemetryEvent | undefined} Event body posted by {@link trackAppScaffolded}
 */
export function buildAppScaffoldedEvent(args: BaseAppArgs): TelemetryEvent | undefined {
  const ownPackage = readJson(path.resolve(__dirname, '..', '..', 'package.json'));
  const ownVersion = readString(ownPackage?.version);
  const appPackage = readJson(path.join(args.destination, 'package.json'));
  const appName = readString(appPackage?.name) || path.basename(path.resolve(args.destination));

  if (!ownVersion || !PACKAGE_VERSION.test(ownVersion)) {
    return undefined;
  }
  if (!APP_NAME.test(appName) || !TEMPLATE_NAME.test(args.template)) {
    return undefined;
  }

  const data: Record<string, string> = {
    app_name: appName,
    template: args.template,
    create_package_version: ownVersion,
  };

  const versions = telemetryClient.collectSdkPackageVersions(appPackage);
  for (const [key, value] of Object.entries(versions)) {
    if (Object.keys(data).length >= MAX_DATA_KEYS) {
      break;
    }
    data[key] = value;
  }

  return {
    source: telemetryClient.TELEMETRY_SOURCE,
    name: APP_SCAFFOLDED_EVENT_NAME,
    data,
    fingerprint: telemetryClient.createTelemetryFingerprint('create-content-sdk-app', ownVersion),
  };
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
