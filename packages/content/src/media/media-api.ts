// finds the Sitecore media URL prefix
const mediaUrlPrefixRegex = /\/([-~]{1})\/media\//i;

/** Base URL used only to parse path-only / relative media URLs with WHATWG URL */
const RELATIVE_URL_BASE = 'http://__sitecore_content_sdk_media__/';

/**
 * Whether the URL input uses an absolute or special (protocol-relative) scheme.
 * @param {string} input Media URL string
 * @returns True when the input has a scheme or starts with `//`
 * @internal
 */
function hasAbsoluteOrSpecialScheme(input: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(input) || input.startsWith('//');
}

/**
 * Parse a media URL that may be absolute or path-only (relative).
 * @param {string} input Media URL string
 * @returns Parsed URL and whether the input was path-only (so serialization omits the dummy base)
 * @internal
 */
function parseMediaUrl(input: string): { url: URL; relative: boolean } {
  if (hasAbsoluteOrSpecialScheme(input)) {
    try {
      const url = input.startsWith('//') ? new URL(input, 'http://_') : new URL(input);
      return { url, relative: false };
    } catch {
      // fall through to relative parse attempt
    }
  }
  return { url: new URL(input, RELATIVE_URL_BASE), relative: true };
}

/**
 * Serialize a parsed media URL, omitting the dummy base for path-only inputs.
 * @param {URL} parsed Parsed media URL
 * @param {boolean} relative Whether the original input was path-only
 * @returns Serialized URL string
 * @internal
 */
function serializeMediaUrl(parsed: URL, relative: boolean): string {
  if (relative) {
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }
  return parsed.toString();
}

/**
 * Convert URL search params to a plain query record.
 * @param {URLSearchParams} sp URL search params
 * @returns Query string key/value map
 * @internal
 */
function searchParamsToQueryRecord(sp: URLSearchParams): { [key: string]: string | undefined } {
  const q: { [key: string]: string | undefined } = {};
  sp.forEach((value, key) => {
    q[key] = value;
  });
  return q;
}

/**
 * Get required query string params which should be merged with user params
 * @param {object} qs layout service parsed query string
 * @returns {object} requiredParams
 * @public
 */
export const getRequiredParams = (qs: { [key: string]: string | undefined }) => {
  const { rev, db, la, vs, ts, ttc, tt, hash } = qs;

  return { rev, db, la, vs, ts, ttc, tt, hash };
};

/**
 * Replace `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
 * Can use `mediaUrlPrefix` in order to use a custom prefix.
 * @param {string} url The URL to replace the media URL prefix in
 * @param {RegExp} [mediaUrlPrefix] The regex to match the media URL prefix
 * @returns {string} The URL with the media URL prefix replaced
 * @public
 */
export const replaceMediaUrlPrefix = (
  url: string,
  mediaUrlPrefix: RegExp = mediaUrlPrefixRegex
): string => {
  const { url: parsed, relative } = parseMediaUrl(url);

  const match = mediaUrlPrefix.exec(parsed.pathname);
  if (match && match.length > 1) {
    parsed.pathname = parsed.pathname.replace(mediaUrlPrefix, `/${match[1]}/jssmedia/`);
  }

  return serializeMediaUrl(parsed, relative);
};

/**
 * Prepares a Sitecore media URL with `params` for use by the Content SDK media handler.
 * This is done by replacing `/~/media` or `/-/media` with `/~/jssmedia` or `/-/jssmedia`, respectively.
 * Provided `params` are used as the querystring parameters for the media URL.
 * Can use `mediaUrlPrefix` in order to use a custom prefix.
 * If no `params` are sent, the original media URL is returned.
 * @param {string} url The URL to prepare
 * @param {object} [params] The querystring parameters to use
 * @param {RegExp} [mediaUrlPrefix] The regex to match the media URL prefix
 * @returns {string} The prepared URL
 * @public
 */
export const updateImageUrl = (
  url: string,
  params?: { [key: string]: string | number | undefined } | null,
  mediaUrlPrefix: RegExp = mediaUrlPrefixRegex
) => {
  if (!params || Object.keys(params).length === 0) {
    // if params aren't supplied, no need to run it through Content SDK media handler
    return url;
  }

  const { url: parsed, relative } = parseMediaUrl(replaceMediaUrlPrefix(url, mediaUrlPrefix));

  const requiredParams = getRequiredParams(searchParamsToQueryRecord(parsed.searchParams));

  const merged: Record<string, string> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      merged[key] = String(val);
    }
  }
  Object.entries(requiredParams).forEach(([key, param]) => {
    if (param !== undefined && param !== null && param !== '') {
      merged[key] = param;
    }
  });

  parsed.search = '';
  for (const [k, v] of Object.entries(merged)) {
    parsed.searchParams.set(k, v);
  }

  return serializeMediaUrl(parsed, relative);
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
 * @public
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
