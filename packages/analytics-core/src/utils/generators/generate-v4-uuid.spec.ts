import { generateV4UUID } from './generate-v4-uuid';

describe('generateV4UUID', () => {
  it('should generate random V4UUID', () => {
    const randomUUID = 'b10bb699-bfb3-419b-b63f-638c62ed1aa7';

    const randomUUIDSpy = jest.fn(() => randomUUID);
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      enumerable: false,
      value: { randomUUID: randomUUIDSpy },
      writable: true,
    });

    const result = generateV4UUID();

    expect(result).toBe(randomUUID);
    expect(randomUUIDSpy).toHaveBeenCalledTimes(1);
  });
});
