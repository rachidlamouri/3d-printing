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
  const [x, y, z = 0] = position;
  return {
    position: [x, y, z],
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
      initialParameters: parameters,
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
