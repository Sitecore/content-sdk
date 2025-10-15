import { SITECORE_EDGE_URL_DEFAULT } from '../../constants';
import debug from './../../debug';

/**
 * The parameters for fetching the component variant spec.
 */
type GetComponentVariantSpecParams = {
  /**
   * The Edge URL.
   * @default
   */
  edgeUrl?: string;
  /**
   * The component variant target path.
   * @example './components/promo-block/PromoBlock.variantA.ts'
   */
  targetPath?: string;
  /**
   * The component variant id.
   */
  variantId: string;
};

/**
 * The component variant spec.
 */
export interface ComponentVariantSpec {
  title: string;
  meta: {
    'contentsdk-component-type': string;
    'contentsdk-component-name': string;
    'contentsdk-component-variant-name': string;
  };
}

/**
 * Fetches the component variant spec.
 * @param {GetComponentVariantSpecParams} params - The parameters for fetching the component variant spec.
 * @returns {Promise<ComponentVariantSpec>} The component variant spec.
 */
export const getComponentVariantSpec = async ({
  variantId,
  edgeUrl = SITECORE_EDGE_URL_DEFAULT,
  targetPath,
}: GetComponentVariantSpecParams) => {
  let url = `${edgeUrl}/components/generated/${variantId}`;

  if (targetPath) {
    url += `?targetPath=${targetPath}`;
  }

  debug.common('Fetching component variant spec for %s: %s', variantId, url);

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error(
        `Component variant '${variantId}' was not found. Please verify the variant ID is correct and exists.`
      );
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch component variant ${variantId}`);
    }

    const spec: ComponentVariantSpec = await response.json();
    debug.common('Component variant spec fetched successfully for %s: %o', variantId, spec);

    return spec;
  } catch (error) {
    debug.common('Failed to fetch component variant spec: %s', String(error));
    throw error;
  }
};

type GetComponentRegistryUrlParams = {
  /**
   * The component variant id.
   */
  variantId: string;
  /**
   * The context id.
   */
  contextId: string;
  /**
   * The component variant target path.
   */
  targetPath: string;
};

/**
 * Gets the component registry url.
 * @param {GetComponentRegistryUrlParams} params - The parameters for getting the component registry url.
 * @returns {string} The component registry url.
 */
export const getComponentRegistryUrl = ({
  variantId,
  contextId,
  targetPath,
}: GetComponentRegistryUrlParams) =>
  `https://genui.com/evilCorp/${variantId}?contextID=${contextId}&targetPath=${targetPath}`;
