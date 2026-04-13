import {
  getSystemInformationData,
  TelemetryEventInitializer,
} from '@sitecore-content-sdk/core/node-tools';

type SdkInstalledEventData = {
  template: string;
};

export const SdkInstalledEventInit =
  (template: string): TelemetryEventInitializer<SdkInstalledEventData> =>
  () => {
    const systemInformationData = getSystemInformationData();
    return {
      name: 'sdk-installed',
      data: {
        template: template,
        ...systemInformationData,
      },
    };
  };
