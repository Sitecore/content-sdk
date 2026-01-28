import * as customDebug from './debug';
import * as utils from '../utils';
import debug from 'debug';
import { jest, expect } from '@jest/globals';

jest.mock('debug', () => ({
  enabled: jest.fn(),
}));

describe('processDebugResponse', () => {
  const mockHeaders = new Headers({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'X-Custom-Header': 'value',
  });

  const mockResponse = {
    headers: mockHeaders,
    redirected: false,
    status: 200,
    statusText: 'OK',
    url: 'http://example.com',
  } as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty object when debug is not enabled', () => {
    (debug.enabled as jest.Mock).mockImplementation((namespace) => namespace === 'test:namespace');

    const result = customDebug.processDebugResponse('testNamespace', mockResponse);
    expect(result).toEqual({});
    expect(debug.enabled).toHaveBeenCalledWith('testNamespace');
  });

  it('should return debug information when debug is enabled', () => {
    (debug.enabled as jest.Mock).mockReturnValueOnce(true);
    const normalizeHeadersSpy = jest.spyOn(utils, 'normalizeHeaders');
    const result = customDebug.processDebugResponse('testNamespace', mockResponse);
    expect(result).toEqual({
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'content-type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'x-custom-header': 'value',
      },
      redirected: false,
      status: 200,
      statusText: 'OK',
      url: 'http://example.com',
    });
    expect(debug.enabled).toHaveBeenCalledWith('testNamespace');
    expect(normalizeHeadersSpy).toHaveBeenCalledWith(mockHeaders);
  });
});
