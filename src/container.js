const { logger } = require('./logger');
const { makeContainer } = require('./makeContainer.js');

global.main = () => {
  const {
    container,
    ...meta
  } = makeContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
  });

  logger.log(meta);
  return container;
};
