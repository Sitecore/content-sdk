import * as pluginsModule from '../initialization/plugin';
import { getClientId } from './get-client-id';
import { jest, expect } from '@jest/globals';

jest.mock('../initialization/plugin');

describe('getClientId', () => {
  const mockAdapter = {
    getClientId: jest.fn(),
  };

  const getAnalyticsPluginSpy = jest.spyOn(pluginsModule, 'getAnalyticsPlugin').mockReturnValue({
    adapter: mockAdapter,
  } as unknown as ReturnType<typeof pluginsModule.getAnalyticsPlugin>);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the client ID when adapter returns a value', () => {
    mockAdapter.getClientId.mockReturnValueOnce('cid_value');

    const clientId = getClientId();

    expect(clientId).toEqual('cid_value');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockAdapter.getClientId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when adapter returns null', () => {
    mockAdapter.getClientId.mockReturnValueOnce(null);
    const clientId = getClientId();

    expect(clientId).toEqual('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockAdapter.getClientId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when adapter returns undefined', () => {
    mockAdapter.getClientId.mockReturnValueOnce(undefined);
    const clientId = getClientId();

    expect(clientId).toBe('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockAdapter.getClientId).toHaveBeenCalledTimes(1);
  });
});
