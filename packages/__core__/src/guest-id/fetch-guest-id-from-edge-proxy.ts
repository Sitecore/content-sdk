import { API_VERSION, ErrorMessages, LIBRARY_VERSION } from '../consts';

/**
 * A function that gets the guest ref from EP.
 * @param browserId - The browser id of the client
 * @param sitecoreEdgeContextId - The sitecoreEdgeContextId
 * @returns - A promise that resolves with the guest ref
 * @throws - Will throw an error if the clientKey/browser id is invalid
 */
export async function fetchGuestIdFromEdgeProxy(
  browserId: string,
  sitecoreEdgeContextId: string,
  sitecoreEdgeUrl: string
): Promise<string> {
  // eslint-disable-next-line max-len
  const url = `${sitecoreEdgeUrl}/v1/events/${API_VERSION}/browser/${browserId}/show.json?sitecoreContextId=${sitecoreEdgeContextId}&client_key=&api_token=`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const response = await fetch(url, { headers: { 'X-Library-Version': LIBRARY_VERSION } });
  const data = await response.json();

  if (!response.ok) {
    const { error_msg: errorMsg, moreInfo } = data as GetGuestRefResponseError;

    throw new Error(`${errorMsg}, for more info: ${moreInfo}`);
  }

  if (!data.customer.ref) throw new Error(ErrorMessages.IE_0011);

  return (data as GetGuestRefResponse).customer.ref;
}

interface GetGuestRefCommon {
  status: string;
  version: string;
  clientKey: string;
}

export interface GetGuestRefResponse extends GetGuestRefCommon {
  ref: string;
  customer: { ref: string };
}

export interface GetGuestRefResponseError extends GetGuestRefCommon {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg: string;
  moreInfo: string;
}
