import * as pluginsModule from '../initialization/plugin';
import { getClientId } from './get-client-id';
import { jest, expect } from '@jest/globals';

jest.mock('../initialization/plugin');

describe('getClientId', () => {
  const mockEnvironment = {
    getClientId: jest.fn(),
  };

  const getAnalyticsPluginSpy = jest.spyOn(pluginsModule, 'getAnalyticsPlugin').mockReturnValue({
    environment: mockEnvironment,
  } as unknown as ReturnType<typeof pluginsModule.getAnalyticsPlugin>);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the client ID when environment returns a value', () => {
    mockEnvironment.getClientId.mockReturnValueOnce('cid_value');

    const clientId = getClientId();

    expect(clientId).toEqual('cid_value');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getClientId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when environment returns null', () => {
    mockEnvironment.getClientId.mockReturnValueOnce(null);
    const clientId = getClientId();

    expect(clientId).toEqual('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getClientId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when environment returns undefined', () => {
    mockEnvironment.getClientId.mockReturnValueOnce(undefined);
    const clientId = getClientId();

    expect(clientId).toBe('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getClientId).toHaveBeenCalledTimes(1);
  });
});
