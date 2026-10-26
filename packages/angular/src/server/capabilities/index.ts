import type { CapabilityFilter, CSDKCapabilities } from '@sitecore-content-sdk/core';
import { hasDesignLibrary } from './DesignLibrary';

const hasEditingRenderMiddleware: CapabilityFilter = ({ fileContains }) =>
  fileContains(['src/server.ts'], /\bcreateEditingRenderMiddleware\b/);

const hasPersonalizeMiddleware: CapabilityFilter = ({ fileContains }) =>
  fileContains(['src/server.ts'], /\bcreatePersonalizeMiddleware\b/);

const hasCodeGenerationEnabled: CapabilityFilter = ({ sitecoreConfig }) =>
  sitecoreConfig?.disableCodeGeneration !== true;

const capabilities: CSDKCapabilities = {
  preview: { value: true, filter: hasEditingRenderMiddleware },
  editing: { value: true, filter: hasEditingRenderMiddleware },
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
