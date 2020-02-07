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

module.exports = {
  sizeToMeta,
  getNextMultiple,
  assembleMeta,
};
