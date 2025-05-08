import { expect } from 'chai';
import { defineConfig } from './define-config';

describe('defineConfig', () => {
  const defaultConfig = () => ({
    api: {
      edge: { contextId: 'contextId' },
    },
    defaultLanguage: 'en',
  });

  describe('disableStaticPaths', () => {
    describe('environment variable is not set', () => {
      it('should default to false', () => {
        const config = defineConfig(defaultConfig());
        expect(config.disableStaticPaths).to.equal(false);
      });

      it('should use the value from the config', () => {
        const config = defineConfig({
          disableStaticPaths: false,
          ...defaultConfig(),
        });
        expect(config.disableStaticPaths).to.equal(false);
      });
    });

    describe('environment variable is set', () => {
      afterEach(() => {
        delete process.env.DISABLE_SSG_FETCH;
      });

      it('should return true when DISABLE_SSG_FETCH is set to true', () => {
        process.env.DISABLE_SSG_FETCH = 'true';

        const config = defineConfig({
          disableStaticPaths: false,
          ...defaultConfig(),
        });

        expect(config.disableStaticPaths).to.equal(true);
      });

      it('should return false when DISABLE_SSG_FETCH is set to false', () => {
        process.env.DISABLE_SSG_FETCH = 'false';

        const config = defineConfig({
          disableStaticPaths: true,
          ...defaultConfig(),
        });

        expect(config.disableStaticPaths).to.equal(false);
      });

      it('should return false when DISABLE_SSG_FETCH is set to any other value', () => {
        process.env.DISABLE_SSG_FETCH = 'some-other-value';

        const config = defineConfig({
          disableStaticPaths: true,
          ...defaultConfig(),
        });

        expect(config.disableStaticPaths).to.equal(false);
      });
    });
  });
});
