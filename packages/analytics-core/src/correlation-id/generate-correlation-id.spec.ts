import * as utils from '../utils';
import { generateCorrelationId } from './generate-correlation-id';
import { jest, expect } from '@jest/globals';

describe('generateCorrelationId', () => {
  const randomUUID = 'b10bb699-bfb3-419b-b63f-638c62ed1aa7';
  const generateV4UUIDMock = jest.fn(() => randomUUID);
  const generateV4UUIDSpy = jest
    .spyOn(utils, 'generateV4UUID')
    .mockImplementation(generateV4UUIDMock);

  it('should generate a correlation id', async () => {
    const result = generateCorrelationId();

    const expectedResult = 'b10bb699bfb3419bb63f638c62ed1aa7';

    expect(result).toBe(expectedResult);
    expect(result).not.toContain('-');
    expect(generateV4UUIDSpy).toHaveBeenCalledTimes(1);
  });
});
