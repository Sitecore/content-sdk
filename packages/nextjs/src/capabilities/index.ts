import type { CapabilityFilter, CSDKCapabilities } from '@sitecore-content-sdk/core';
import { detectRouterType, ROUTER_TYPE } from '../tools/templating/utils';
import { hasDesignLibrary } from './DesignLibrary';
import { hasPersonalizeProxy } from './PersonalizeProxy';

const BYOC_BUNDLE = 'src/byoc/index.tsx';
const FEAAS_RENDER_ROUTE = 'src/pages/api/editing/feaas/render.ts';

const hasByocBundle: CapabilityFilter = ({ fileExists }) => fileExists(BYOC_BUNDLE);

// App Router apps render FEaaS through built-in wrappers and have no FEaaS render route.
const hasFeaasRendering: CapabilityFilter = ({ appRoot, fileExists }) =>
  detectRouterType(appRoot) === ROUTER_TYPE.APP || fileExists(FEAAS_RENDER_ROUTE);

const hasCodeGenerationEnabled: CapabilityFilter = ({ sitecoreConfig }) =>
  sitecoreConfig?.disableCodeGeneration !== true;

const capabilities: CSDKCapabilities = {
  preview: { value: { timeBasedPreview: { value: true } } },
  editing: { value: true },
  abTesting: { value: true, filter: hasPersonalizeProxy },
  byocRender: { value: true, filter: hasByocBundle },
  feaasRender: { value: true, filter: hasFeaasRendering },
  designLibrary: {
    value: {
      variantGeneration: { value: true, filter: hasCodeGenerationEnabled },
      variantPreview: { value: true, filter: hasCodeGenerationEnabled },
    },
    filter: hasDesignLibrary,
  },
};

export default capabilities;

