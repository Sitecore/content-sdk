import { expect } from 'chai';
import {
  canSafelyResolveNextImageProps,
  cloneNextImageConfig,
  isReadonlyArraySortError,
} from './next-image-utils';

describe('next-image-utils', () => {
  describe('cloneNextImageConfig', () => {
    it('should return mutable copies of frozen size and quality arrays', () => {
      const deviceSizes = Object.freeze([1080, 640, 750]);
      const imageSizes = Object.freeze([32, 16]);
      const qualities = Object.freeze([75, 50]);
      const config = Object.freeze({
        deviceSizes,
        imageSizes,
        qualities,
        path: '/_next/image',
      });

      const cloned = cloneNextImageConfig(config);
      const clonedDeviceSizes = cloned.deviceSizes as number[];
      const clonedImageSizes = cloned.imageSizes as number[];
      const clonedQualities = cloned.qualities as number[];

      expect(() => clonedDeviceSizes.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(() => clonedImageSizes.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(() => clonedQualities.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(cloned.deviceSizes).to.deep.equal([640, 750, 1080]);
      expect(cloned.path).to.equal('/_next/image');
      expect(config.deviceSizes).to.deep.equal([1080, 640, 750]);
    });

    it('should leave missing optional arrays undefined', () => {
      const cloned = cloneNextImageConfig({
        deviceSizes: [640],
        imageSizes: undefined,
        qualities: undefined,
      });
      expect(cloned.imageSizes).to.equal(undefined);
      expect(cloned.qualities).to.equal(undefined);
    });
  });

  describe('isReadonlyArraySortError', () => {
    it('should detect the frozen-array sort TypeError', () => {
      const error = new TypeError("Cannot assign to read only property '0' of object '[object Array]'");
      expect(isReadonlyArraySortError(error)).to.equal(true);
    });

    it('should reject unrelated errors', () => {
      expect(isReadonlyArraySortError(new TypeError('src is missing'))).to.equal(false);
      expect(isReadonlyArraySortError(new Error('read only property'))).to.equal(false);
      expect(isReadonlyArraySortError('read only property')).to.equal(false);
    });
  });

  describe('canSafelyResolveNextImageProps', () => {
    it('should return true when prop resolution succeeds', () => {
      expect(canSafelyResolveNextImageProps(() => undefined)).to.equal(true);
    });

    it('should return false only for frozen-array sort errors', () => {
      expect(
        canSafelyResolveNextImageProps(() => {
          throw new TypeError("Cannot assign to read only property '0' of object '[object Array]'");
        })
      ).to.equal(false);
    });

    it('should return true for other next/image validation errors', () => {
      expect(
        canSafelyResolveNextImageProps(() => {
          throw new Error('Image is missing required "width" property');
        })
      ).to.equal(true);
    });
  });
});
