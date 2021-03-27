const { buildMakeContainerWithDefaults } = require('../../lib/makeContainer');
const { buildMakeRepeatContainerWithDefaults } = require('../../lib/makeRepeatContainer');
const { makeShims } = require('../lib/makeShims');
const plan = require('./plan');

const defaultWallThickness = 0.8;
const defaults = {
  sideLengthMultiple: 2,
  outerHeight: 20,
  bottomThickness: 0.6,
};

const makeContainerWithFlexibleDimensions = buildMakeContainerWithDefaults({
  ...defaults,
  wallThickness: defaultWallThickness,
});

const makeContainerWithFlexibleWalls = buildMakeContainerWithDefaults({
  ...defaults,
  minWallThickness: defaultWallThickness,
});

const makeContainerWithoutFlexing = buildMakeContainerWithDefaults({
  ...defaults,
  sideLengthMultiple: null,
  wallThickness: defaultWallThickness,
});

const makeRepeatContainer = buildMakeRepeatContainerWithDefaults({
  ...defaults,
  dividerThickness: defaultWallThickness,
});

module.exports.main = () => {
  const chapstickDiameter = 16.4;
  const supportBaseSize = 8;
  const metaMap = {
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
    earPlugBox: makeContainerWithFlexibleDimensions({
      innerWidth: 39,
      innerDepth: 18.5,
      outerHeight: 20,
      bottomClearance: 8,
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
    mints: makeRepeatContainer({
      innerWidth: 8,
      innerDepth: 32,
      count: 2,
      minBottomHoleSideLength: 3,
      bottomClearance: 6,
    }),
    sdCards: makeRepeatContainer({
      innerWidth: 2.7,
      innerDepth: 25,
      count: 4,
      minBottomHoleSideLength: 1,
      bottomClearance: 4,
    }),
    boundingBox: makeContainerWithoutFlexing({
      innerDepth: plan.boundingContainer.withTolerance.height,
      innerWidth: plan.boundingContainer.withTolerance.width,
      minBottomHoleSideLength: 0,
      bottomClearance: Infinity,
    }),
    shims: { entity: makeShims(plan.shimGroups) },
  };

  const {
    entity,
  } = metaMap.boundingBox;

  return entity;
};
