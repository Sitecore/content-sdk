import * as pluginsModule from '../initialization/plugin';
import { getBrowserId } from './get-browser-id';
import { jest, expect } from '@jest/globals';

jest.mock('../initialization/plugin');

describe('getBrowserId', () => {
  const mockEnvironment = {
    getBrowserId: jest.fn(),
  };

  const getAnalyticsPluginSpy = jest.spyOn(pluginsModule, 'getAnalyticsPlugin').mockReturnValue({
    environment: mockEnvironment,
  } as unknown as ReturnType<typeof pluginsModule.getAnalyticsPlugin>);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the browser ID when environment returns a value', () => {
    mockEnvironment.getBrowserId.mockReturnValueOnce('bid_value');

    const browserId = getBrowserId();

    expect(browserId).toEqual('bid_value');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when environment returns null', () => {
    mockEnvironment.getBrowserId.mockReturnValueOnce(null);

    const browserId = getBrowserId();

    expect(browserId).toEqual('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getBrowserId).toHaveBeenCalledTimes(1);
  });

  it('should return empty string when environment returns undefined', () => {
    mockEnvironment.getBrowserId.mockReturnValueOnce(undefined);

    const browserId = getBrowserId();

    expect(browserId).toBe('');
    expect(getAnalyticsPluginSpy).toHaveBeenCalledTimes(1);
    expect(mockEnvironment.getBrowserId).toHaveBeenCalledTimes(1);
  });
});
