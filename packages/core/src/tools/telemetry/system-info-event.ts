import { execSync } from 'child_process';
import os from 'os';

interface SystemInformationData {
  nodeVersion: string;
  npmVersion: string;
  platform: NodeJS.Platform;
}

export const getSystemInformationData = (): SystemInformationData => {
  const nodeVersion = process.versions.node;
  const npmVersion = execSync('npm --version').toString().replace(/\r|\n/g, '');
  const platform = os.platform();

  return {
    nodeVersion,
    npmVersion,
    platform,
  };
};
