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
  /**
   * The authentication token.
   */
  token: string;
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
 * Gets the component variant spec url.
 * @param {GetComponentVariantSpecParams} params - The parameters for getting the component variant spec url.
 * @returns {string} The component variant spec url.
 */
export const getComponentVariantSpecUrl = ({
  variantId,
  edgeUrl = SITECORE_EDGE_URL_DEFAULT,
  targetPath,
  token,
}: GetComponentVariantSpecParams) => {
  let url = `${edgeUrl}/authoring/api/v1/components/generated/${variantId}?token=${token}`;

  if (targetPath) {
    url += `&targetPath=${encodeURIComponent(targetPath)}`;
  }

  return url;
};

/**
 * Fetches the component variant spec.
 * @param {GetComponentVariantSpecParams} params - The parameters for fetching the component variant spec.
 * @returns {Promise<ComponentVariantSpec>} The component variant spec.
 */
export const getComponentVariantSpec = async ({
  variantId,
  edgeUrl = SITECORE_EDGE_URL_DEFAULT,
  targetPath,
  token,
}: GetComponentVariantSpecParams) => {
  const url = getComponentVariantSpecUrl({ variantId, edgeUrl, targetPath, token });

  debug.common('Fetching component variant spec for %s: %s', variantId, url);

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error(
        `Component variant '${variantId}' was not found. Please verify the variant ID is correct and exists.`
      );
    }

    if (response.status === 401) {
      throw new Error('Unauthorized. Please verify the token is correct and not expired.');
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
