import { CORE_NAMESPACE } from './namespaces';

describe('namespaces module', () => {
  it(`should evaluate 'CORE_NAMESPACE' to 'sitecore-cloudsdk:core'`, async () => {
    expect(CORE_NAMESPACE).toBe('sitecore-cloudsdk:core');
  });
});
