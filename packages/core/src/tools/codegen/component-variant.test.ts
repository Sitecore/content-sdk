import { expect } from 'chai';
import nock from 'nock';
import {
  ComponentVariantSpec,
  getComponentRegistryUrl,
  getComponentVariantSpec,
} from './component-variant';
import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';

describe('component-variant', () => {
  describe('getComponentRegistryUrl', () => {
    it('should return the correct url', () => {
      const url = getComponentRegistryUrl({
        variantId: '123',
        contextId: '456',
        targetPath: './components/promo-block/PromoBlock.variantA.ts',
      });

      expect(url).to.equal(
        'https://genui.com/evilCorp/123?contextID=456&targetPath=./components/promo-block/PromoBlock.variantA.ts'
      );
    });
  });

  describe('getComponentVariantSpec', () => {
    const mockComponentVariantSpecApi = ({
      edgeUrl = SITECORE_EDGE_URL_DEFAULT,
      variantId,
      targetPath,
    }: {
      edgeUrl?: string;
      variantId: string;
      targetPath?: string;
    }) => {
      let path = `/components/generated/${variantId}`;

      if (targetPath) {
        path += `?targetPath=${targetPath}`;
      }

      return nock(edgeUrl).get(path);
    };

    it('should return the correct spec', async () => {
      const variantId = '123';
      const targetPath = './components/promo-block/PromoBlock.variantA.ts';

      const spec: ComponentVariantSpec = {
        title: 'Promo Block',
        meta: {
          'contentsdk-component-type': 'variant',
          'contentsdk-component-name': 'PromoBlock',
          'contentsdk-component-variant-name': 'variantA',
        },
      };

      mockComponentVariantSpecApi({
        variantId,
        targetPath,
      }).reply(200, spec);

      const response = await getComponentVariantSpec({
        variantId,
        targetPath,
      });

      expect(response).to.deep.equal(spec);
    });

    it('should return correct spec when target path is not provided', async () => {
      const variantId = '123';

      const spec: ComponentVariantSpec = {
        title: 'Promo Block',
        meta: {
          'contentsdk-component-type': 'variant',
          'contentsdk-component-name': 'PromoBlock',
          'contentsdk-component-variant-name': 'variantA',
        },
      };

      mockComponentVariantSpecApi({
        variantId,
      }).reply(200, spec);

      const response = await getComponentVariantSpec({
        variantId,
      });

      expect(response).to.deep.equal(spec);
    });

    it('should throw an error when the component variant is not found', async () => {
      const variantId = '123';

      mockComponentVariantSpecApi({
        variantId,
      }).reply(404);

      try {
        await getComponentVariantSpec({ variantId });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal(
          "Component variant '123' was not found. Please verify the variant ID is correct and exists."
        );
      }
    });

    it('should throw an error when response is not ok', async () => {
      const variantId = '123';

      mockComponentVariantSpecApi({
        variantId,
      }).reply(500);

      try {
        await getComponentVariantSpec({ variantId });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal('Failed to fetch component variant 123');
      }
    });
  });
});
