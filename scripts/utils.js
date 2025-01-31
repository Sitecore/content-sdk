/**
 * Generates unique app folder name based on sample app configuration
 * @param {Record<string, string>} args sample app arguments
 * @returns unique app name
 */
module.exports.getAppFolder = (args) =>
  `sample-${args.getAppFolder}${args.fetchWith ? `-${args.fetchWith}` : ''}${
    args.prerender ? `-${args.prerender}` : ''
  }`;
