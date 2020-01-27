const { logger } = require('./logger');
const { makeContainer } = require('./makeContainer');

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
