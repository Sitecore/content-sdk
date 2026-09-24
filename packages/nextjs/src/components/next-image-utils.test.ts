import { expect } from 'chai';
import {
  canSafelyResolveNextImageProps,
  cloneNextImageConfig,
  isReadonlyArraySortError,
} from './next-image-utils';

const FROZEN_ARRAY_SORT_ERROR =
  "Cannot assign to read only property '0' of object '[object Array]'";

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

      expect(cloned.deviceSizes).to.not.equal(config.deviceSizes);
      expect(cloned.imageSizes).to.not.equal(config.imageSizes);
      expect(cloned.qualities).to.not.equal(config.qualities);
      expect(() => clonedDeviceSizes.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(() => clonedImageSizes.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(() => clonedQualities.sort((a: number, b: number) => a - b)).to.not.throw();
      expect(cloned.deviceSizes).to.deep.equal([640, 750, 1080]);
      expect(cloned.imageSizes).to.deep.equal([16, 32]);
      expect(cloned.qualities).to.deep.equal([50, 75]);
      expect(cloned.path).to.equal('/_next/image');
      expect(config.deviceSizes).to.deep.equal([1080, 640, 750]);
      expect(config.imageSizes).to.deep.equal([32, 16]);
      expect(config.qualities).to.deep.equal([75, 50]);
    });

    it('should leave missing optional arrays undefined', () => {
      const cloned = cloneNextImageConfig({
        deviceSizes: [640],
        imageSizes: undefined,
        qualities: undefined,
      });
      expect(cloned.deviceSizes).to.deep.equal([640]);
      expect(cloned.imageSizes).to.equal(undefined);
      expect(cloned.qualities).to.equal(undefined);
    });
  });

  describe('isReadonlyArraySortError', () => {
    it('should detect the frozen-array sort TypeError', () => {
      const error = new TypeError(FROZEN_ARRAY_SORT_ERROR);
      expect(isReadonlyArraySortError(error)).to.equal(true);
    });

    it('should detect a TypeError thrown by sorting a frozen array', () => {
      try {
        (Object.freeze([1080, 640, 750]) as number[]).sort((a, b) => a - b);
        expect.fail('expected sort on a frozen array to throw');
      } catch (error) {
        expect(isReadonlyArraySortError(error)).to.equal(true);
      }
    });

    it('should reject unrelated errors', () => {
      expect(isReadonlyArraySortError(new TypeError('src is missing'))).to.equal(false);
      expect(isReadonlyArraySortError(new Error(FROZEN_ARRAY_SORT_ERROR))).to.equal(false);
      expect(isReadonlyArraySortError(FROZEN_ARRAY_SORT_ERROR)).to.equal(false);
    });
  });

  describe('canSafelyResolveNextImageProps', () => {
    it('should return true when prop resolution succeeds', () => {
      expect(canSafelyResolveNextImageProps(() => undefined)).to.equal(true);
    });

    it('should return false only for frozen-array sort errors', () => {
      expect(
        canSafelyResolveNextImageProps(() => {
          throw new TypeError(FROZEN_ARRAY_SORT_ERROR);
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
