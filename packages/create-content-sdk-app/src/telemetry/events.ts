import path from 'path';
import {
  getSystemInformationData,
  TelemetryEventInitializer,
} from '@sitecore-content-sdk/core/node-tools';
import { openJsonFile } from '../common/utils/helpers';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const createContentSdkPackage = require('../../package.json') as {
  name: string;
  version: string;
};

type SdkInstalledEventData = {
  template: string;
  createContentSdkPackage: string;
  createContentSdkVersion: string;
  sitecoreContentSdkPackages?: Record<string, string>;
};

function collectSitecoreContentSdkVersions(
  scaffoldPackageJsonPath: string
): Record<string, string> | undefined {
  const pkg = openJsonFile(scaffoldPackageJsonPath);
  if (!pkg || typeof pkg !== 'object') {
    return undefined;
  }
  const result: Record<string, string> = {};
  for (const section of ['dependencies', 'devDependencies'] as const) {
    const deps = (pkg as Record<string, unknown>)[section];
    if (!deps || typeof deps !== 'object') {
      continue;
    }
    for (const [name, ver] of Object.entries(deps as Record<string, string>)) {
      if (name.startsWith('@sitecore-content-sdk/')) {
        result[name] = String(ver);
      }
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export const SdkInstalledEventInit =
  (template: string, destination: string): TelemetryEventInitializer<SdkInstalledEventData> =>
  () => {
    const systemInformationData = getSystemInformationData();
    const scaffoldPkg = path.join(path.resolve(destination), 'package.json');
    const sitecoreContentSdkPackages = collectSitecoreContentSdkVersions(scaffoldPkg);

    return {
      name: 'csdk-poc-sdk-installed',
      data: {
        template,
        createContentSdkPackage: createContentSdkPackage.name,
        createContentSdkVersion: createContentSdkPackage.version,
        ...(sitecoreContentSdkPackages && { sitecoreContentSdkPackages }),
        ...systemInformationData,
      },
    };
  };
