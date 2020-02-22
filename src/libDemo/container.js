const { logger } = require('../lib/logger');
const { makeContainer } = require('../lib/makeContainer');

global.main = () => {
  const {
    container,
    debug,
  } = makeContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
  });

  logger.log(debug);
  return container;
};
