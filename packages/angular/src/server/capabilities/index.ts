import type { CapabilityFilter, CSDKCapabilities } from '@sitecore-content-sdk/core';
import { hasDesignLibrary } from './DesignLibrary';

const hasPersonalizeMiddleware: CapabilityFilter = ({ fileContains }) =>
  fileContains(['src/server.ts'], /\bcreatePersonalizeMiddleware\b/);

const hasCodeGenerationEnabled: CapabilityFilter = ({ sitecoreConfig }) =>
  sitecoreConfig?.disableCodeGeneration !== true;

const capabilities: CSDKCapabilities = {
  preview: { value: { timeBasedPreview: { value: true } } },
  editing: { value: true },
  abTesting: { value: true, filter: hasPersonalizeMiddleware },
  designLibrary: {
    value: {
      variantGeneration: { value: true, filter: hasCodeGenerationEnabled },
      variantPreview: { value: true, filter: hasCodeGenerationEnabled },
    },
    filter: hasDesignLibrary,
  },
};

export default capabilities;
