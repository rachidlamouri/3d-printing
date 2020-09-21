const { makeContainer } = require('../makeContainer');

module.exports.main = () => {
  const {
    container,
  } = makeContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
  });

  return container;
};
