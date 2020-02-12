const _ = require('lodash');

const sizeToMeta = (size) => {
  const [width, depth, height] = size;
  return {
    size,
    width,
    depth,
    height,
  };
};
const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

const assembleMeta = (parameters, ...assemblerFunctions) => (
  assemblerFunctions.reduce(
    (meta, assembleAdditionalMeta) => ({
      ...meta,
      ...assembleAdditionalMeta(meta),
    }),
    parameters,
  )
);

const runWithDefaults = (entityFunction, defaults, parameters) => entityFunction({ ...defaults, ...parameters });
const buildBuildWithDefaults = _.curry(runWithDefaults);

module.exports = {
  sizeToMeta,
  getNextMultiple,
  assembleMeta,
  buildBuildWithDefaults,
};
