import type { Settings } from '@sitecore-content-sdk/__core__/server';
import {
  isHttpRequest,
  isHttpResponse,
  isNextJsMiddlewareRequest,
  isNextJsMiddlewareResponse,
  type Request,
  type Response,
} from '@sitecore-content-sdk/utils';
import { handleHttpCookie } from './handleHttpCookie';
import { handleNextJsMiddlewareCookie } from './handleNextJsMiddlewareCookie';
import type { PersonalizeSettings } from './interfaces';

/**
 * Creates the personalize cookie for server environments
 * @param {Request} request - The request object
 * @param {Response} response - The response object
 * @param {PersonalizeSettings} settings - Personalize package settings
 * @param {Settings} cloudSDKSettings - Cloud SDK settings
 * @returns {Promise<void>} Promise that resolves when cookie is created
 */
export async function createPersonalizeCookie(
  request: Request,
  response: Response,
  settings: PersonalizeSettings,
  cloudSDKSettings: Settings
): Promise<void> {
  if (isNextJsMiddlewareRequest(request) && isNextJsMiddlewareResponse(response))
    await handleNextJsMiddlewareCookie(request, response, settings, cloudSDKSettings);
  else if (isHttpRequest(request) && isHttpResponse(response))
    await handleHttpCookie(request, response, settings, cloudSDKSettings);
}
