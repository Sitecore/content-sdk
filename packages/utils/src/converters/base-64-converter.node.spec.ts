import { convertToBase64 } from './base-64-converter';

describe('convertToBase64', () => {
  it('toString method is called with base64 ', () => {
    // Create a mock function for the toString method
    const toStringMock = jest.fn().mockReturnValueOnce('eyJmb28iOiJiYXIifQ==');

    // Replace the original toString method with the mock
    const originalToString = Buffer.prototype.toString;
    Buffer.prototype.toString = toStringMock;

    const result = convertToBase64({ foo: 'bar' });
    // Assert that toString was called with 'base64'
    expect(result).toBe('eyJmb28iOiJiYXIifQ==');
    expect(toStringMock).toHaveBeenCalledWith('base64');
    expect(toStringMock).not.toHaveBeenCalledWith('');

    // Restore the original toString method to avoid affecting other tests
    Buffer.prototype.toString = originalToString;
  });
});
