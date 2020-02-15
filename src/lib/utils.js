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
const positionToMeta = (position) => {
  const [x, y, z] = position;
  return {
    position,
    x,
    y,
    z,
  };
};
const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

const assembleMeta = (parameters, ...assemblerFunctions) => (
  assemblerFunctions.reduce(
    (meta, assembleAdditionalMeta) => ({
      ...meta,
      ...assembleAdditionalMeta(meta),
      originalParameters: parameters,
    }),
    parameters,
  )
);

const runWithDefaults = (entityFunction, defaults, parameters) => entityFunction({ ...defaults, ...parameters });
const buildBuildWithDefaults = _.curry(runWithDefaults);

module.exports = {
  sizeToMeta,
  positionToMeta,
  getNextMultiple,
  assembleMeta,
  buildBuildWithDefaults,
};
