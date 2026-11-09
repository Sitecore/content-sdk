import fs from 'fs';
import path from 'path';
import { debug } from '@sitecore-content-sdk/core';
import { telemetryClient } from '@sitecore-content-sdk/core/node-tools';
import type { TelemetryData, TelemetryPrimitive } from '@sitecore-content-sdk/core/node-tools';
import packageJson from '../../package.json';
import { shouldSkipCliTelemetry } from './skip';

const RELEASE_VERSION = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const APP_NAME = /^[A-Za-z0-9][A-Za-z0-9._@/-]{0,127}$/;
const CAPABILITY_NAME = /^[A-Za-z][A-Za-z0-9]*$/;
const MAX_COMMAND_LENGTH = 128;
const MAX_CAPABILITIES_LENGTH = 512;

/**
 * Event recorded after `sitecore-tools project build` finishes.
 */
export const APP_BUILT_EVENT_NAME = 'app_built';

/**
 * Event recorded when a `sitecore-tools` command runs.
 */
export const CLI_COMMAND_EVENT_NAME = 'cli_command_run';

export const TELEMETRY_NOTICE =
  'Content SDK telemetry is on. Disable it for this run with --noTelemetry, or set SITECORE_TELEMETRY_DISABLED=1.';

/**
 * Sitecore config flags that describe which product features the app turned on.
 */
export type AppFeatureConfig = {
  multisite?: { enabled?: boolean };
  personalize?: { enabled?: boolean };
};

/**
 * Records `cli_command_run`. Failures are logged and do not fail the command.
 * @param {object} args Command details
 * @param {string} args.commandName Parsed command, for example `project build`
 * @param {boolean} [args.noTelemetry] Per-run opt-out
 * @param {string} [args.cwd] Working directory
 */
export async function trackCliCommandRun(args: {
  commandName: string;
  noTelemetry?: boolean;
  cwd?: string;
}): Promise<void> {
  const cwd = args.cwd ?? process.cwd();

  try {
    if (!shouldSendTelemetry(args.noTelemetry, cwd)) {
      return;
    }

    const commandName = args.commandName.trim();
    if (!commandName || commandName.length > MAX_COMMAND_LENGTH) {
      return;
    }

    const version = readOwnVersion();
    if (!version) {
      return;
    }

    console.log(TELEMETRY_NOTICE);
    await telemetryClient.dispatchTelemetryEvent({
      source: telemetryClient.TELEMETRY_SOURCE,
      name: CLI_COMMAND_EVENT_NAME,
      data: compactData({
        command_name: commandName,
        cli_version: version,
        app_name: readAppName(cwd),
        capabilities: readCapabilities(cwd),
      }),
      fingerprint: telemetryClient.createTelemetryFingerprint(packageJson.name, version),
    });
  } catch (error) {
    debug.telemetry('cli command telemetry failed: %O', error);
  }
}

/**
 * Records `app_built`. Failures are logged and do not fail the build.
 * @param {object} args Build result
 * @param {boolean} args.success Whether the build commands finished
 * @param {unknown} [args.error] Failure from the build commands
 * @param {AppFeatureConfig} [args.config] Sitecore config used by the build
 * @param {boolean} [args.noTelemetry] Per-run opt-out
 * @param {string} [args.cwd] Working directory
 */
export async function trackAppBuilt(args: {
  success: boolean;
  error?: unknown;
  config?: AppFeatureConfig;
  noTelemetry?: boolean;
  cwd?: string;
}): Promise<void> {
  const cwd = args.cwd ?? process.cwd();

  try {
    if (!shouldSendTelemetry(args.noTelemetry, cwd)) {
      return;
    }

    const version = readOwnVersion();
    if (!version) {
      return;
    }

    await telemetryClient.dispatchTelemetryEvent({
      source: telemetryClient.TELEMETRY_SOURCE,
      name: APP_BUILT_EVENT_NAME,
      data: compactData({
        success: args.success,
        cli_version: version,
        platform: resolvePlatform(),
        app_name: readAppName(cwd),
        error: args.success ? undefined : sanitizeError(args.error),
        features: enabledFeatures(args.config),
        capabilities: readCapabilities(cwd),
      }),
      fingerprint: telemetryClient.createTelemetryFingerprint(packageJson.name, version),
    });
  } catch (error) {
    debug.telemetry('app built telemetry failed: %O', error);
  }
}

/**
 * Telemetry stays off for an opt-out, a linked Content SDK checkout, or
 * `SITECORE_TELEMETRY_DISABLED`. The CLI entrypoint loads that variable from the
 * shell and from the app `.env*` files before a command runs. A shell value wins.
 * @param {boolean} [noTelemetry] Per-run opt-out
 * @param {string} cwd Working directory
 * @returns {boolean} Whether this run may send
 */
function shouldSendTelemetry(noTelemetry: boolean | undefined, cwd: string): boolean {
  return !shouldSkipCliTelemetry(noTelemetry, cwd) && telemetryClient.isTelemetryEnabled();
}

/**
 * Drops empty optional fields. Required fields are always present.
 * @param {TelemetryData} data Event attributes, including unset optional ones
 * @returns {TelemetryData} Attributes to send
 */
function compactData(data: Record<string, TelemetryPrimitive | undefined>): TelemetryData {
  const compacted: TelemetryData = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      compacted[key] = value;
    }
  }

  return compacted;
}

/**
 * @returns {string | undefined} This package's version, when it is a release version
 */
function readOwnVersion(): string | undefined {
  const version = packageJson.version;
  return typeof version === 'string' && RELEASE_VERSION.test(version) ? version : undefined;
}

/**
 * @param {string} cwd Working directory
 * @returns {string | undefined} App package name, when it is a short package name
 */
function readAppName(cwd: string): string | undefined {
  const name = readJson(path.join(cwd, 'package.json'))?.name;
  return typeof name === 'string' && APP_NAME.test(name) ? name : undefined;
}

/**
 * @returns {string} `vercel`, `netlify`, or `other`
 */
function resolvePlatform(): string {
  if (process.env.VERCEL === '1') {
    return 'vercel';
  }

  if (process.env.NETLIFY === 'true') {
    return 'netlify';
  }

  return 'other';
}

/**
 * @param {string} cwd Working directory
 * @returns {string | undefined} Enabled capabilities from `.sitecore/metadata.json`
 */
function readCapabilities(cwd: string): string | undefined {
  const capabilities = readJson(path.join(cwd, '.sitecore', 'metadata.json'))?.capabilities;
  if (!isRecord(capabilities)) {
    return undefined;
  }

  const names: string[] = [];
  collectCapabilities(capabilities, '', names);
  names.sort();

  while (names.length > 1 && names.join(',').length > MAX_CAPABILITIES_LENGTH) {
    names.pop();
  }

  const joined = names.join(',');
  return joined.length > 0 && joined.length <= MAX_CAPABILITIES_LENGTH ? joined : undefined;
}

/**
 * @param {Record<string, unknown>} value Capabilities object
 * @param {string} prefix Path of the parent capability
 * @param {string[]} names Enabled capability paths
 */
function collectCapabilities(
  value: Record<string, unknown>,
  prefix: string,
  names: string[]
): void {
  for (const [key, child] of Object.entries(value)) {
    if (key === 'metadata' || !CAPABILITY_NAME.test(key)) {
      continue;
    }

    const capability = prefix ? `${prefix}.${key}` : key;
    if (child === true) {
      names.push(capability);
      continue;
    }

    if (isRecord(child)) {
      names.push(capability);
      collectCapabilities(child, capability, names);
    }
  }
}

/**
 * @param {unknown} value Candidate object
 * @returns {value is Record<string, unknown>} Whether the value is a plain object
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {AppFeatureConfig} [config] Sitecore config used by the build
 * @returns {string | undefined} Comma-separated features that are explicitly enabled
 */
function enabledFeatures(config: AppFeatureConfig | undefined): string | undefined {
  const features = [
    config?.multisite?.enabled === true ? 'multisite' : undefined,
    config?.personalize?.enabled === true ? 'personalize' : undefined,
  ].filter((feature): feature is string => feature !== undefined);

  return features.length > 0 ? features.join(',') : undefined;
}

/**
 * @param {unknown} error Failure from the build
 * @returns {string | undefined} One line, capped so the event stays sendable
 */
function sanitizeError(error: unknown): string | undefined {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  const collapsed = message.replace(/\s+/g, ' ').trim();
  if (!collapsed) {
    return undefined;
  }

  return collapsed.length > 500 ? collapsed.slice(0, 500) : collapsed;
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
