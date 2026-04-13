import {
  getSystemInformationData,
  TelemetryEventInitializer,
} from '@sitecore-content-sdk/core/node-tools';

export const SdkBuildEventInit = (): TelemetryEventInitializer<unknown> => () => {
  const systemInformationData = getSystemInformationData();
  return {
    name: 'sdk-build',
    data: {
      ...systemInformationData,
    },
  };
};
