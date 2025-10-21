import { expect } from 'chai';
import nock from 'nock';
import {
  ComponentVariantSpec,
  getComponentVariantSpecUrl,
  getComponentVariantSpec,
} from './component-variant';
import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';

describe('component-variant', () => {
  const token = '456';

  describe('getComponentVariantSpecUrl', () => {
    it('should return the correct url', () => {
      const url = getComponentVariantSpecUrl({
        variantId: '123',
        targetPath: './components/promo-block/PromoBlock.variantA.ts',
        token,
      });

      expect(url).to.equal(
        `${SITECORE_EDGE_URL_DEFAULT}/authoring/api/v1/components/generated/123?token=456&targetPath=.%2Fcomponents%2Fpromo-block%2FPromoBlock.variantA.ts`
      );
    });

    it('should return the correct url when custom edge url is provided', () => {
      const url = getComponentVariantSpecUrl({
        variantId: '123',
        targetPath: './components/promo-block/PromoBlock.variantA.ts',
        edgeUrl: 'http://my.server',
        token,
      });

      expect(url).to.equal(
        `http://my.server/authoring/api/v1/components/generated/123?token=456&targetPath=.%2Fcomponents%2Fpromo-block%2FPromoBlock.variantA.ts`
      );
    });
  });

  describe('getComponentVariantSpec', () => {
    const mockComponentVariantSpecApi = ({
      edgeUrl = SITECORE_EDGE_URL_DEFAULT,
      variantId,
      targetPath,
      token,
    }: {
      edgeUrl?: string;
      variantId: string;
      targetPath?: string;
      token: string;
    }) => {
      let path = `/authoring/api/v1/components/generated/${variantId}?token=${token}`;

      if (targetPath) {
        path += `&targetPath=${encodeURIComponent(targetPath)}`;
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
        token,
      }).reply(200, spec);

      const response = await getComponentVariantSpec({
        variantId,
        targetPath,
        token,
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
        token,
      }).reply(200, spec);

      const response = await getComponentVariantSpec({
        variantId,
        token,
      });

      expect(response).to.deep.equal(spec);
    });

    it('should throw an error when the component variant is not found', async () => {
      const variantId = '123';

      mockComponentVariantSpecApi({
        variantId,
        token,
      }).reply(404);

      try {
        await getComponentVariantSpec({ variantId, token });
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
        token,
      }).reply(500);

      try {
        await getComponentVariantSpec({ variantId, token });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal('Failed to fetch component variant 123');
      }
    });

    it('should throw an error when response is unauthorized', async () => {
      const variantId = '123';

      mockComponentVariantSpecApi({
        variantId,
        token,
      }).reply(401);

      try {
        await getComponentVariantSpec({ variantId, token });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal(
          'Unauthorized. Please verify the token is correct and not expired.'
        );
      }
    });
  });
});
