/* eslint-disable no-unused-expressions, @typescript-eslint/no-unused-expressions */
import { expect } from 'chai';
import { getAllTemplates, getInitializer } from './registry';

describe('registry', () => {
  describe('getAllTemplates', () => {
    it('should list every known template', () => {
      const templates = getAllTemplates();

      expect(templates).to.include.members([
        'nextjs',
        'nextjs-app-router',
        'nextjs-app-router-cache-components',
        'angular',
      ]);
    });
  });

  describe('getInitializer', () => {
    it('should throw for an unknown template', async () => {
      let thrown: Error | undefined;
      try {
        await getInitializer('does-not-exist');
      } catch (error) {
        thrown = error as Error;
      }

      expect(thrown).to.be.instanceOf(Error);
      expect(thrown?.message).to.contain('does-not-exist');
    });
  });
});
