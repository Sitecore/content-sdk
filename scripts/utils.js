const samplesByProduct = require('./samples.json');

/**
 * Generates unique app folder name based on sample app configuration
 * @param {Record<string, string>} args sample app arguments
 * @returns unique app name
 */
module.exports.getAppFolder = (args) =>
  `${sampleNamePrefix}${args.template}${args.prerender ? `-${args.prerender}` : ''}`;

const sampleNamePrefix = 'sample-';
module.exports.sampleNamePrefix = sampleNamePrefix;
/**
 * Samples to scaffold, from `samples.json` (product -> samples)
 * @param {string} [product] product name (e.g. nextjs); all products' samples when omitted
 * @returns {{ template: string, args: Record<string, unknown> }[]} sample definitions
 */
module.exports.getSamples = (product) => {
  if (!product) return Object.values(samplesByProduct).flat();
  const samples = samplesByProduct[product];
  if (!samples) {
    throw new Error(
      `Unknown product "${product}". samples.json defines: ${Object.keys(samplesByProduct).join(
        ', '
      )}.`
    );
  }
  return samples;
};
