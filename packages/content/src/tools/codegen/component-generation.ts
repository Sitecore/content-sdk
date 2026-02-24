import { constants, debug } from '@sitecore-content-sdk/core';

const { SITECORE_EDGE_URL_DEFAULT, ERROR_MESSAGES } = constants;

/**
 * The parameters for fetching the component spec.
 */
type GetComponentSpecParams = {
  /**
   * The Edge URL.
   * @default
   */
  edgeUrl?: string;
  /**
   * The component target path.
   * @example './components/promo-block/PromoBlock.ts'
   */
  targetPath?: string;
  /**
   * The component id.
   */
  componentId: string;
  /**
   * The authentication token.
   */
  token: string;
};

/**
 * The component spec.
 */
export interface ComponentSpec {
  title: string;
  meta: {
    'contentsdk-component-type': string;
    'contentsdk-component-name': string;
    'contentsdk-component-variant-name': string;
  };
}

/**
 * Gets the component spec url.
 * @param {GetComponentSpecParams} params - The parameters for getting the component spec url.
 * @returns {string} The component spec url.
 * @internal
 */
export const getComponentSpecUrl = ({
  componentId,
  edgeUrl = SITECORE_EDGE_URL_DEFAULT,
  targetPath,
  token,
}: GetComponentSpecParams) => {
  let url = `${edgeUrl}/authoring/api/v1/components/generated/${componentId}?token=${token}`;

  if (targetPath) {
    url += `&targetPath=${encodeURIComponent(targetPath)}`;
  }

  return url;
};

/**
 * Fetches the component spec.
 * @param {GetComponentSpecParams} params - The parameters for fetching the component spec.
 * @returns {Promise<ComponentSpec>} The component spec.
 * @internal
 */
export const getComponentSpec = async ({
  componentId,
  edgeUrl = SITECORE_EDGE_URL_DEFAULT,
  targetPath,
  token,
}: GetComponentSpecParams) => {
  const url = getComponentSpecUrl({ componentId, edgeUrl, targetPath, token });

  debug.common('Fetching component spec for %s: %s', componentId, url);

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error(
        `Component '${componentId}' was not found. Please verify the component ID is correct and exists.`
      );
    }

    if (response.status === 401) {
      throw new Error('The token is incorrect or expired or the component ID is incorrect.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch component ${componentId}. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
    }

    const spec: ComponentSpec = await response.json();
    debug.common('Component spec fetched successfully for %s: %o', componentId, spec);

    return spec;
  } catch (error) {
    debug.common(`Failed to fetch component spec: ${String(error)}. ${ERROR_MESSAGES.CONTACT_SUPPORT}`);
    throw error;
  }
};
