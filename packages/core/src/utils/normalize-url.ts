export const normalizeUrl = (url: string) => (url.endsWith('/') ? url.slice(0, -1) : url);
