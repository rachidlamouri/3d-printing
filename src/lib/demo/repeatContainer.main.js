const { makeRepeatContainer } = require('../makeRepeatContainer');

module.exports.main = () => {
  const {
    container,
  } = makeRepeatContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
    count: undefined,
  });

  return container;
};
