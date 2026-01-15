import * as utils from '@sitecore-content-sdk/utils';
import { generateCorrelationId } from './generate-correlation-id';

jest.mock('@sitecore-content-sdk/utils', () => {
  const originalModule = jest.requireActual('@sitecore-content-sdk/utils');

  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...originalModule,
    generateV4UUID: () => 'b10bb699-bfb3-419b-b63f-638c62ed1aa7',
  };
});

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
