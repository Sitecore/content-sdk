import { expect } from 'chai';
import nock from 'nock';
import { constants } from '@sitecore-content-sdk/core';
import {
  ComponentSpec,
  getComponentSpecUrl,
  getComponentSpec,
} from './component-generation';

const { SITECORE_EDGE_URL_DEFAULT } = constants;

describe('component-generation', () => {
  const token = '456';

  describe('getComponentSpecUrl', () => {
    it('should return the correct url', () => {
      const url = getComponentSpecUrl({
        componentId: '123',
        targetPath: './components/promo-block/PromoBlock.variantA.ts',
        token,
      });

      expect(url).to.equal(
        `${SITECORE_EDGE_URL_DEFAULT}/authoring/api/v1/components/generated/123?token=456&targetPath=.%2Fcomponents%2Fpromo-block%2FPromoBlock.variantA.ts`
      );
    });

    it('should return the correct url when custom edge url is provided', () => {
      const url = getComponentSpecUrl({
        componentId: '123',
        targetPath: './components/promo-block/PromoBlock.variantA.ts',
        edgeUrl: 'http://my.server',
        token,
      });

      expect(url).to.equal(
        `http://my.server/authoring/api/v1/components/generated/123?token=456&targetPath=.%2Fcomponents%2Fpromo-block%2FPromoBlock.variantA.ts`
      );
    });
  });

  describe('getComponentSpec', () => {
    const mockComponentSpecApi = ({
      edgeUrl = SITECORE_EDGE_URL_DEFAULT,
      componentId,
      targetPath,
      token,
    }: {
      edgeUrl?: string;
      componentId: string;
      targetPath?: string;
      token: string;
    }) => {
      let path = `/authoring/api/v1/components/generated/${componentId}?token=${token}`;

      if (targetPath) {
        path += `&targetPath=${encodeURIComponent(targetPath)}`;
      }

      return nock(edgeUrl).get(path);
    };

    it('should return the correct spec', async () => {
      const componentId = '123';
      const targetPath = './components/promo-block/PromoBlock.variantA.ts';

      const spec: ComponentSpec = {
        title: 'Promo Block',
        meta: {
          'contentsdk-component-type': 'variant',
          'contentsdk-component-name': 'PromoBlock',
          'contentsdk-component-variant-name': 'variantA',
        },
      };

      mockComponentSpecApi({
        componentId,
        targetPath,
        token,
      }).reply(200, spec);

      const response = await getComponentSpec({
        componentId,
        targetPath,
        token,
      });

      expect(response).to.deep.equal(spec);
    });

    it('should return correct spec when target path is not provided', async () => {
      const componentId = '123';

      const spec: ComponentSpec = {
        title: 'Promo Block',
        meta: {
          'contentsdk-component-type': 'variant',
          'contentsdk-component-name': 'PromoBlock',
          'contentsdk-component-variant-name': 'variantA',
        },
      };

      mockComponentSpecApi({
        componentId,
        token,
      }).reply(200, spec);

      const response = await getComponentSpec({
        componentId,
        token,
      });

      expect(response).to.deep.equal(spec);
    });

    it('should throw an error when the component is not found', async () => {
      const componentId = '123';

      mockComponentSpecApi({
        componentId,
        token,
      }).reply(404);

      try {
        await getComponentSpec({ componentId, token });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal(
          "Component '123' was not found. Please verify the component ID is correct and exists."
        );
      }
    });

    it('should throw an error when response is not ok', async () => {
      const componentId = '123';

      mockComponentSpecApi({
        componentId,
        token,
      }).reply(500);

      try {
        await getComponentSpec({ componentId, token });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal('Failed to fetch component 123');
      }
    });

    it('should throw an error when response is unauthorized', async () => {
      const componentId = '123';

      mockComponentSpecApi({
        componentId,
        token,
      }).reply(401);

      try {
        await getComponentSpec({ componentId, token });
        expect.fail('Expected function to throw');
      } catch (error) {
        expect(error.message).to.equal(
          'The token is incorrect or expired or the component ID is incorrect.'
        );
      }
    });
  });
});
