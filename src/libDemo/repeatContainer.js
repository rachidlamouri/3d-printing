const { logger } = require('../lib/logger');
const { makeRepeatContainer } = require('../lib/makeRepeatContainer');

global.main = () => {
  const {
    container,
    debug,
  } = makeRepeatContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
    count: undefined,
  });

  logger.log(debug);
  return container;
};
