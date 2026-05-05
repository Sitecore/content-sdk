// finds the Sitecore media URL prefix
const mediaUrlPrefixRegex = /\/([-~]{1})\/media\//i;
const internalUrlBase = 'https://content-sdk.invalid';
const absoluteUrlRegex = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

type ParsedMediaUrlKind = 'absolute' | 'protocol-relative' | 'root-relative' | 'relative-path';

type ParsedMediaUrl = {
  kind: ParsedMediaUrlKind;
  url: URL;
};

/**
 * Parses a media URL while preserving whether the original input was absolute or relative.
 * @param {string} input The media URL to parse
 * @returns {ParsedMediaUrl} The parsed URL and original input kind
 */
const parseMediaUrl = (input: string): ParsedMediaUrl => {
  let kind: ParsedMediaUrlKind;

  if (absoluteUrlRegex.test(input)) {
    kind = 'absolute';
  } else if (input.startsWith('//')) {
    kind = 'protocol-relative';
  } else if (input.startsWith('/')) {
    kind = 'root-relative';
  } else {
    kind = 'relative-path';
  }

  return {
    kind,
    url: kind === 'absolute' ? new URL(input) : new URL(input, internalUrlBase),
  };
};

/**
 * Formats a parsed media URL back to the same absolute or relative form as the original input.
 * @param {ParsedMediaUrl} parsed The parsed media URL details
 * @returns {string} The formatted URL
 */
const formatMediaUrl = ({ kind, url }: ParsedMediaUrl): string => {
  switch (kind) {
    case 'absolute':
      return url.toString();
    case 'protocol-relative':
      return `//${url.host}${url.pathname}${url.search}${url.hash}`;
    case 'root-relative':
      return `${url.pathname}${url.search}${url.hash}`;
    default:
      return `${url.pathname.replace(/^\//, '')}${url.search}${url.hash}`;
  }
};

/**
 * Get required query string params which should be merged with user params
 * @param {object} qs layout service parsed query string
 * @returns {object} requiredParams
 * @public
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
 * @public
 */
export const replaceMediaUrlPrefix = (
  url: string,
  mediaUrlPrefix: RegExp = mediaUrlPrefixRegex
): string => {
  const parsed = parseMediaUrl(url);

  const match = mediaUrlPrefix.exec(parsed.url.pathname);
  if (match && match.length > 1) {
    // regex will provide us with /-/ or /~/ type
    parsed.url.pathname = parsed.url.pathname.replace(mediaUrlPrefix, `/${match[1]}/jssmedia/`);
  }

  return formatMediaUrl(parsed);
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
  const parsed = parseMediaUrl(replaceMediaUrlPrefix(url, mediaUrlPrefix));
  const requiredParams = getRequiredParams({
    rev: parsed.url.searchParams.get('rev') || undefined,
    db: parsed.url.searchParams.get('db') || undefined,
    la: parsed.url.searchParams.get('la') || undefined,
    vs: parsed.url.searchParams.get('vs') || undefined,
    ts: parsed.url.searchParams.get('ts') || undefined,
  });
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, param]) => {
    if (param !== undefined) {
      query.set(key, `${param}`);
    }
  });

  Object.entries(requiredParams).forEach(([key, param]) => {
    if (param) {
      query.set(key, param);
    }
  });

  parsed.url.search = query.toString();

  return formatMediaUrl(parsed);
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
