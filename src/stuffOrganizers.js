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
    wallet: makeContainerWithFlexibleDimensions({
      innerWidth: 90,
      innerDepth: 34,
      outerHeight: 40,
      bottomClearance: 8,
      baseClearance: 16,
      xClearance: 16,
      yClearance: 14,
    }),
    watch: makeContainerWithFlexibleDimensions({
      innerWidth: 70,
      innerDepth: 24,
      outerHeight: 40,
      bottomClearance: 8,
      baseClearance: 16,
      xClearance: 16,
      yClearance: 10,
    }),
  };

  const {
    container,
    debug,
  } = entities.watch;

  logger.log(debug);
  return container;
};
