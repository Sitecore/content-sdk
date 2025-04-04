import URL from 'url-parse';

// finds the Sitecore media URL prefix
const mediaUrlPrefixRegex = /\/([-~]{1})\/media\//i;

/**
 * Get required query string params which should be merged with user params
 * @param {object} qs layout service parsed query string
 * @returns {object} requiredParams
 */
export const getRequiredParams = (qs: { [key: string]: string | undefined }) => {
  const { rev, db, la, vs, ts } = qs;

  return { rev, db, la, vs, ts };
};

/**
 * Replace `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
 * Can use `mediaUrlPrefix` in order to use a custom prefix.
 * @param {string} url The URL to replace the media URL prefix in
 * @param {RegExp} [mediaUrlPrefix] The regex to match the media URL prefix
 * @returns {string} The URL with the media URL prefix replaced
 */
export const replaceMediaUrlPrefix = (
  url: string,
  mediaUrlPrefix: RegExp = mediaUrlPrefixRegex
): string => {
  const parsed = URL(url, {}, true);

  const match = mediaUrlPrefix.exec(parsed.pathname);
  if (match && match.length > 1) {
    // regex will provide us with /-/ or /~/ type
    parsed.set('pathname', parsed.pathname.replace(mediaUrlPrefix, `/${match[1]}/jssmedia/`));
  }

  return parsed.toString();
};

/**
 * Prepares a Sitecore media URL with `params` for use by the JSS media handler.
 * This is done by replacing `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
 * Provided `params` are used as the querystring parameters for the media URL.
 * Can use `mediaUrlPrefix` in order to use a custom prefix.
 * If no `params` are sent, the original media URL is returned.
 * @param {string} url The URL to prepare
 * @param {object} [params] The querystring parameters to use
 * @param {RegExp} [mediaUrlPrefix] The regex to match the media URL prefix
 * @returns {string} The prepared URL
 */
export const updateImageUrl = (
  url: string,
  params?: { [key: string]: string | number | undefined } | null,
  mediaUrlPrefix: RegExp = mediaUrlPrefixRegex
) => {
  if (!params || Object.keys(params).length === 0) {
    // if params aren't supplied, no need to run it through JSS media handler
    return url;
  }
  // polyfill node `global` in browser to workaround https://github.com/unshiftio/url-parse/issues/150
  if (typeof window !== 'undefined' && !window.global) {
    window.global = {} as typeof globalThis;
  }

  const parsed = URL(replaceMediaUrlPrefix(url, mediaUrlPrefix), {}, true);

  const requiredParams = getRequiredParams(parsed.query);

  const query = { ...params };

  Object.entries(requiredParams).forEach(([key, param]) => {
    if (param) {
      query[key] = param;
    }
  });

  parsed.set('query', query);

  return parsed.toString();
};

/**
 * Receives an array of `srcSet` parameters that are iterated and used as parameters to generate
 * a corresponding set of updated Sitecore media URLs via @see updateImageUrl. The result is a comma-delimited
 * list of media URLs with respective dimension parameters.
 * @example
 * // returns '/ipsum.jpg?h=1000&w=1000 1000w, /ipsum.jpg?mh=250&mw=250 250w'
 * getSrcSet('/ipsum.jpg', [{ h: 1000, w: 1000 }, { mh: 250, mw: 250 } ])
 * More information about `srcSet`: {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img}
 * @param {string} url The URL to prepare
 * @param {Array} srcSet The array of parameters to use
 * @param {object} [imageParams] The querystring parameters to use
 * @param {RegExp} [mediaUrlPrefix] The regex to match the media URL prefix
 * @returns {string} The prepared URL
 */
export const getSrcSet = (
  url: string,
  srcSet: Array<{ [key: string]: string | number | undefined }>,
  imageParams?: { [key: string]: string | number | undefined },
  mediaUrlPrefix?: RegExp
) => {
  return srcSet
    .map((params) => {
      const newParams = { ...imageParams, ...params } as { [key: string]: string | undefined };
      const imageWidth = newParams.w || newParams.mw;
      if (!imageWidth) {
        return null;
      }
      return `${updateImageUrl(url, newParams, mediaUrlPrefix)} ${imageWidth}w`;
    })
    .filter((value) => value)
    .join(', ');
};
