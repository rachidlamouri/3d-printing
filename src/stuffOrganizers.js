const { logger } = require('./logger');
const { buildMakeContainerWithDefaults } = require('./makeContainer');

const defaults = {
  sideLengthMultiple: 2,
  outerHeight: 20,
  bottomThickness: 0.6,
};

const makeContainerWithFlexibleDimensions = buildMakeContainerWithDefaults({
  ...defaults,
  wallThickness: 0.8,
});

const makeContainerWithFlexibleWalls = buildMakeContainerWithDefaults({
  ...defaults,
  minWallThickness: 0.8,
});

global.main = () => {
  const chapstickDiameter = 16.4;
  const supportBaseSize = 8;
  const entities = {
    chapstick: makeContainerWithFlexibleDimensions({
      innerWidth: chapstickDiameter,
      innerDepth: chapstickDiameter,
      bottomClearance: 3,
    }),
    headphones: makeContainerWithFlexibleDimensions({
      innerWidth: 42,
      innerDepth: 27,
      bottomClearance: 5,
    }),
    supportBase: makeContainerWithFlexibleWalls({
      innerWidth: supportBaseSize,
      innerDepth: supportBaseSize,
    }),
  };

  const {
    container,
    debug,
  } = entities.chapstick;

  logger.log(debug);
  return container;
};
