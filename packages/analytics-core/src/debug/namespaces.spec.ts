import { CORE_NAMESPACE } from './namespaces';

describe('namespaces module', () => {
  it(`should evaluate 'CORE_NAMESPACE' to 'sitecore-content-sdk:analytics-core'`, async () => {
    expect(CORE_NAMESPACE).toBe('content-sdk:analytics-core');
  });
});
