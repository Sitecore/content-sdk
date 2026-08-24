import { expect } from 'chai';
import {
  buildExperimentalFeaturesResponse,
  CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG,
  isExperimentalEnvFlagEnabled,
  isExperimentalFeaturesGloballyEnabled,
  resolveExperimentalFeatureStatuses,
} from './utils';
import { ExperimentalFeatureData } from './types';

describe('experimental utils', () => {
  const feature: ExperimentalFeatureData = {
    idName: 'feature-one',
    displayName: 'Feature One',
    envVarName: 'CSDK_EXPERIMENTAL_FEATURE_ONE',
    description: 'First experimental feature',
  };

  afterEach(() => {
    delete process.env.CSDK_EXPERIMENTAL_FEATURE_ONE;
    delete process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG];
  });

  describe('isExperimentalEnvFlagEnabled', () => {
    it('should return false for undefined/empty values', () => {
      expect(isExperimentalEnvFlagEnabled(undefined)).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('   ')).to.equal(false);
    });

    it('should return true for true values', () => {
      expect(isExperimentalEnvFlagEnabled('true')).to.equal(true);
      expect(isExperimentalEnvFlagEnabled(' true ')).to.equal(true);
    });

    it('should return false for other values', () => {
      expect(isExperimentalEnvFlagEnabled('false')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('0')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('1')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('TRUE')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('yes')).to.equal(false);
    });
  });

  describe('isExperimentalFeaturesGloballyEnabled', () => {
    it('should return false when the global switch is not set', () => {
      expect(isExperimentalFeaturesGloballyEnabled()).to.equal(false);
    });

    it('should return true when the global switch is set to true', () => {
      process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG] = 'true';
      expect(isExperimentalFeaturesGloballyEnabled()).to.equal(true);
    });
  });

  describe('resolveExperimentalFeatureStatuses', () => {
    it('should fall back to individual feature env vars when global switch is off', () => {
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';

      expect(resolveExperimentalFeatureStatuses([feature])).to.deep.equal([
        {
          ...feature,
          enabled: true,
        },
      ]);
    });

    it('should enable features when the global switch is on', () => {
      process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG] = 'true';

      expect(resolveExperimentalFeatureStatuses([feature])).to.deep.equal([
        {
          ...feature,
          enabled: true,
        },
      ]);
    });
  });

  describe('buildExperimentalFeaturesResponse', () => {
    it('should wrap individual feature status in response object', () => {
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';

      expect(buildExperimentalFeaturesResponse([feature])).to.deep.equal({
        features: [
          {
            ...feature,
            enabled: true,
          },
        ],
      });
    });

    it('should honor the global switch in the response payload', () => {
      process.env[CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG] = 'true';
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';

      expect(buildExperimentalFeaturesResponse([feature])).to.deep.equal({
        features: [
          {
            ...feature,
            enabled: true,
          },
        ],
      });
    });
  });
});
