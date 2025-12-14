import { deleteCookie } from './delete-cookie';

describe('deleteCookie', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a cookie from the document.cookie object', () => {
    document.cookie = 'testCookie=testValue';
    deleteCookie('testCookie');

    expect(document.cookie).toEqual('');
  });
  it('should not delete a cookie from the document.cookie object', () => {
    document.cookie = 'testCookie=testValue';
    deleteCookie('nonExistCookie');

    expect(document.cookie).toEqual('testCookie=testValue');
  });
});
