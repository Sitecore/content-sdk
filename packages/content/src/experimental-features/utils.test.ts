import { expect } from 'chai';
import {
  buildExperimentalFeaturesResponse,
  CSDK_EXPERIMENTAL_FEATURES_ENABLED,
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
    delete process.env[CSDK_EXPERIMENTAL_FEATURES_ENABLED];
  });

  describe('isExperimentalEnvFlagEnabled', () => {
    it('should return false for undefined/empty values', () => {
      expect(isExperimentalEnvFlagEnabled(undefined)).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('   ')).to.equal(false);
    });

    it('should return true for true/1 values', () => {
      expect(isExperimentalEnvFlagEnabled('true')).to.equal(true);
      expect(isExperimentalEnvFlagEnabled('TRUE')).to.equal(true);
      expect(isExperimentalEnvFlagEnabled('1')).to.equal(true);
      expect(isExperimentalEnvFlagEnabled(' 1 ')).to.equal(true);
    });

    it('should return false for other values', () => {
      expect(isExperimentalEnvFlagEnabled('false')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('0')).to.equal(false);
      expect(isExperimentalEnvFlagEnabled('yes')).to.equal(false);
    });
  });

  describe('isExperimentalFeaturesGloballyEnabled', () => {
    it('should return false when the global switch is not set', () => {
      expect(isExperimentalFeaturesGloballyEnabled()).to.equal(false);
    });

    it('should return true for true/1 values', () => {
      process.env[CSDK_EXPERIMENTAL_FEATURES_ENABLED] = 'true';
      expect(isExperimentalFeaturesGloballyEnabled()).to.equal(true);

      process.env[CSDK_EXPERIMENTAL_FEATURES_ENABLED] = '1';
      expect(isExperimentalFeaturesGloballyEnabled()).to.equal(true);
    });
  });

  describe('resolveExperimentalFeatureStatuses', () => {
    it('should return disabled features when the global switch is off', () => {
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';

      expect(resolveExperimentalFeatureStatuses([feature])).to.deep.equal([
        {
          ...feature,
          enabled: false,
        },
      ]);
    });

    it('should map enabled status from env vars when the global switch is on', () => {
      process.env[CSDK_EXPERIMENTAL_FEATURES_ENABLED] = 'true';
      process.env.CSDK_EXPERIMENTAL_FEATURE_ONE = 'true';

      expect(resolveExperimentalFeatureStatuses([feature])).to.deep.equal([
        {
          ...feature,
          enabled: true,
        },
      ]);
    });
  });

  describe('buildExperimentalFeaturesResponse', () => {
    it('should wrap features in response object', () => {
      expect(buildExperimentalFeaturesResponse([feature])).to.deep.equal({
        features: [
          {
            ...feature,
            enabled: false,
          },
        ],
      });
    });

    it('should honor the global switch in the response payload', () => {
      process.env[CSDK_EXPERIMENTAL_FEATURES_ENABLED] = '1';
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
