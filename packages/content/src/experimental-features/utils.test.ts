import { expect } from 'chai';
import {
  buildExperimentalFeaturesResponse,
  isExperimentalEnvFlagEnabled,
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

  describe('resolveExperimentalFeatureStatuses', () => {
    it('should map enabled status from env vars', () => {
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
  });
});
